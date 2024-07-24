"use server";

import { ObjectId } from "mongodb";
import { gamesCollection } from "~/lib/mongodb";

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
