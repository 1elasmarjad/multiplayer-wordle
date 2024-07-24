"use server";

import { gamesCollection } from "~/lib/mongodb";
import { type GameStatus, getGame } from "./games";
import { getUserId } from "./users";
import { ObjectId } from "mongodb";

/**
 * Attempts to join/create a game
 */
export async function joinLobby({
  username,
  gameId,
}: {
  username: string;
  gameId?: string;
}): Promise<
  | {
      gameId: string;
    }
  | { error: string }
> {
  if (username.length < 3) {
    return {
      error: "Username must be at least 3 characters",
    };
  }

  if (username.length > 15) {
    return {
      error: "Username must be less than 15 characters",
    };
  }

  if (username.includes(" ")) {
    return {
      error: "Username cannot contain spaces",
    };
  }

  if (!gameId) {
    const { gameId } = await createLobby(username);
    return {
      gameId, //rejoin
    };
  }

  const game = await getGame(gameId);

  if ("error" in game) {
    return {
      error: game.error,
    };
  }

  if (!game.inLobby) {
    throw new Error("Game has already started");
  }

  if (game.players.length >= game.maxPlayers) {
    throw new Error("Game is full");
  }

  const userId = await getUserId({ createIfNotExists: true });

  // player already in game?
  if (game.players.some((player) => player.id === userId)) {
    return {
      gameId,
    };
  }

  // Add player to game
  await gamesCollection.updateOne(
    {
      _id: new ObjectId(gameId),
    },
    {
      $push: {
        players: {
          id: userId!,
          username,
        },
      },
    },
  );

  return {
    gameId,
  };
}

/**
 * Creates a game and makes the executing user the leader
 */
async function createLobby(username: string): Promise<{
  gameId: string;
}> {
  const requesterId = await getUserId({ createIfNotExists: true });

  const mongoResp = await gamesCollection.insertOne({
    players: [
      {
        id: requesterId!,
        username,
      },
    ],
    leader: requesterId!,
    maxPlayers: 2, // TODO: allow more players in the future
    guesses: {},
    winner: null,
    round: 0, // not started yet
    inLobby: true,
  } satisfies Omit<GameStatus, "gameId">);

  return {
    gameId: mongoResp.insertedId.toHexString(),
  };
}
