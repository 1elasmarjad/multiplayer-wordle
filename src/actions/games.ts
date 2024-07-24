"use server";

export interface GameStatus {
  gameId: string;
  players: {
    id: string;
    username: string;
  }[];
  maxPlayers: number;
  leader: string;
  inLobby: boolean;
}

export async function getGame(gameId: string): Promise<GameStatus | undefined> {
  return {
    gameId: gameId,
    players: [],
    maxPlayers: 4,
    leader: "",
    inLobby: true,
  };
}
