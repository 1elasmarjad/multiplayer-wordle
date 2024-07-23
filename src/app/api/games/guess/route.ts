import { upstashKafka } from "~/kafka";

export interface GameUpdate {
  data: number;
  test: string;
}

export async function POST() {
  console.log("Attempted guess");

  const p = upstashKafka.producer();

  console.log("Producing");

  const res = await p.produce(
    "game-updates",
    JSON.stringify({ data: 1, test: "this is a test" } satisfies GameUpdate),
    {
      key: "game_test",
      partition: 0,
      timestamp: Date.now(),
    },
  );

  console.log("Produced", res);

  return new Response("TODO", {
    status: 200,
  });
}
