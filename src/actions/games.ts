"use server";

export interface WordGuess {
  wordGuess: string;
  guessStatus: "correct" | "misplaced" | "incorrect";
}

export interface GameStatus {
  gameId: string;

  players: {
    id: string;
    username: string;
  }[];
  leader: string;
  maxPlayers: number;

  guesses: Record<string, WordGuess[]>;
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
  return {
    gameId: gameId,
    players: [
      {
        id: "1",
        username: "Moon",
      },
      {
        id: "2",
        username: "Sun",
      },
    ],
    leader: "1",
    maxPlayers: 2,
    guesses: {},
    winner: null,
    round: 0,
    inLobby: true,
  };
}
