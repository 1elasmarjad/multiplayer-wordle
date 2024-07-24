"use server";

type userId = string;

type GameData = Record<userId, ("correct" | "partial" | "unknown")[]>;

export async function makeGuess({ gameId }: { gameId: string }) {
  console.log("Attempted guess");
}

export async function getGameUpdates(): Promise<GameData> {
  return {};
}

