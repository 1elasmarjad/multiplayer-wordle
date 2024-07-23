"use server";

import { env } from "./env";
import { upstashKafka } from "./kafka";

export interface GameUpdate {
  data: number;
  test: string;
}

export async function makeGuess({ gameId }: { gameId: string }) {
  console.log("Attempted guess");

  const topic = "game-updates";
  const message = JSON.stringify({
    data: 1,
    test: "this is a test",
  } satisfies GameUpdate);

  const p = upstashKafka.producer();

  console.log("Producing");

  const res = await p.produce(topic, message, {
    key: "game_test",
    timestamp: Date.now(),
  });

  console.log("Produced", res);
}

export async function getGameUpdates() {
    
}
