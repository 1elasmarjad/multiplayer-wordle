"use server";

import { ObjectId } from "mongodb";
import { gamesCollection } from "~/lib/mongodb";
import { getUserId } from "./users";

export type GuessStatus = "correct" | "misplaced" | "dne" | "empty";

export interface WordGuess {
  word: string;
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

  guesses: Record<string, WordGuess[][]>;
  winner: string | null;
  round: number;

  maxRounds?: number;

  inLobby: boolean;
}

export async function getGame(gameId: string): Promise<
  | GameStatus
  | {
      error: string;
    }
> {
  const resp = await gamesCollection.findOne({
    _id: new ObjectId(gameId),
  });

  if (!resp) {
    return {
      error: "Game not found",
    };
  }

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
  };
}

export async function startGame(
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
      error: "Only the leader can start the game",
    };
  }

  await gamesCollection.updateOne(
    {
      _id: new ObjectId(gameId),
    },
    {
      $set: {
        inLobby: false,
      },
    },
  );
}
