"use server";

import { ObjectId } from "mongodb";
import { gamesCollection } from "~/lib/mongodb";
import { getUserId } from "./users";

export type GuessStatus = "correct" | "misplaced" | "dne" | "empty";

export interface LetterGuess {
  letter: string;
  status: GuessStatus;
}

export interface GameStatus {
  gameId: string;

  players: {
    id: string;
    username: string;
  }[];
  leader: string;
  maxPlayers: number;

  guesses: Record<string, LetterGuess[][]>;
  winner: string | null;
  round: number;
  roundEnds?: number;
  word?: string;

  maxRounds?: number;

  inLobby: boolean;
}

export async function getGame(gameId: string): Promise<
  | (GameStatus & {
      roundEnded: boolean;
    })
  | {
      error: string;
    }
> {
  const userId = await getUserId({ createIfNotExists: true });

  if (!userId) {
    return {
      error: "User not found",
    };
  }

  const resp = await gamesCollection.findOne({
    _id: new ObjectId(gameId),
  });

  if (!resp) {
    return {
      error: "Game not found",
    };
  }

  // hide letter guesses if its not the users guesses
  resp.guesses = Object.fromEntries(
    Object.entries(resp.guesses).map(([key, value]) => {
      if (key === userId) {
        return [key, value];
      }

      return [
        key,
        value.map((row) => row.map((col) => ({ ...col, letter: "?" }))),
      ];
    }),
  );

  const noTime = resp.roundEnds ? Date.now() > resp.roundEnds : false;
  const roundEnded = noTime || !!resp.winner;

  return {
    gameId: resp._id.toHexString(),
    players: resp.players,
    leader: resp.leader,
    maxPlayers: resp.maxPlayers,
    guesses: resp.guesses,
    winner: resp.winner,
    round: resp.round,
    inLobby: resp.inLobby,
    maxRounds: resp.maxRounds,
    word: roundEnded ? resp.word : undefined,
    roundEnds: resp.roundEnds,
    roundEnded: noTime || !!resp.winner,
  };
}

export async function startRound(
  gameId: string,
): Promise<void | { error: string }> {
  const userId = await getUserId({ createIfNotExists: true });

  const game = await getGame(gameId);

  if ("error" in game) {
    return {
      error: game.error,
    };
  }

  if (game.leader !== userId) {
    return {
      error: "Only the leader can start the round",
    };
  }

  await gamesCollection.updateOne(
    {
      _id: new ObjectId(gameId),
    },
    {
      $set: {
        inLobby: false,
        roundEnds: Date.now() + 1000 * 60 * 5, // 2 minutes
        guesses: {},
        winner: undefined,
      },

      $inc: {
        round: 1,
      },
    },
  );
}

export async function makeGuess(
  gameId: string,
  guess: LetterGuess[],
): Promise<Record<string, LetterGuess[][]> | { error: string }> {
  if (guess.length !== 5) {
    return {
      error: "Invalid guess",
    };
  }

  const userId = (await getUserId({ createIfNotExists: true }))!;

  const resp = await gamesCollection.findOne(
    {
      _id: new ObjectId(gameId),
    },
    {
      projection: {
        guesses: 1,
        players: 1,
        word: 1,
        roundEnds: 1,
      },
    },
  );

  if (!resp) {
    return {
      error: "Game not found",
    };
  }

  // not in game?
  const player = resp?.players.find((player) => player.id === userId);

  if (!player) {
    return {
      error: "You are not in the game",
    };
  }

  const allGuesses = resp?.guesses ?? {};
  const userGuesses = allGuesses[userId] ?? [];

  if (userGuesses.length >= 6) {
    return {
      error: "You have already made the max amount of guesses",
    };
  }

  // round ended?
  if (resp.roundEnds && Date.now() > resp.roundEnds) {
    return {
      error: "The round has ended",
    };
  }

  const updatedGuess = validatedGuess(guess, resp.word);

  allGuesses[userId] = [...userGuesses, updatedGuess];

  const winner = updatedGuess.every((letter) => letter.status === "correct");

  const userIdGuess = `guesses.${userId}`;

  await gamesCollection.updateOne(
    {
      _id: new ObjectId(gameId),
    },
    {
      $set: {
        [userIdGuess]: allGuesses[userId],
        winner: winner ? userId : undefined,
      },
    },
  );

  return allGuesses;
}

// changes the status of the guess
function validatedGuess(guess: LetterGuess[], word: string): LetterGuess[] {
  // 1. each guessed letter is inside the word?
  guess.forEach((letter) => {
    if (word.includes(letter.letter)) {
      letter.status = "misplaced";
    } else {
      letter.status = "dne";
    }
  });

  guess.forEach((letter, index) => {
    if (word[index] === letter.letter) {
      letter.status = "correct";
    }
  });

  return guess;
}
