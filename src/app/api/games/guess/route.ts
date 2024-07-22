import { upstashKafka } from "~/kafka";


export async function POST() {
  console.log("Attempted guess");

  const p = upstashKafka.producer();


  console.log("Producing");

  const res = await p.produce("game-updates", "TODO", {
    key: "game1",
  });

  console.log("Produced", res);

  return new Response("TODO", {
    status: 200,
  });
}
