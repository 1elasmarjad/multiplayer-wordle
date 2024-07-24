"use server";

import { getGame } from "./games";

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
      gameId,
    };
  }

  const game = await getGame(gameId);

  if (!game) {
    return {
      error: "Game not found",
    };
  }

  if (!game.inLobby) {
    throw new Error("Game has already started");
  }

  if (game.players.length >= game.maxPlayers) {
    throw new Error("Game is full");
  }

  // Add player to game
  // TODO
  return {
    gameId: "TODO",
  };
}

/**
 * Creates a game and makes the executing user the leader
 */
async function createLobby(username: string): Promise<{
  gameId: string;
}> {
  return {
    gameId: "exampleGameId",
  };
}
