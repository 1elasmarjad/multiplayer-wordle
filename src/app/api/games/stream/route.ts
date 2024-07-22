import { upstashKafka } from "~/kafka";

export const runtime = "edge";

export async function GET() {
  const key = "game1";

  const readable = new ReadableStream({
    async start(controller) {
      controller.enqueue("data: Connected\n\n");

      const c = upstashKafka.consumer();

      while (true) {
        const messages = await c.consume({
          consumerGroupId: "group1",
          instanceId: "instance1",
          topics: ["game-updates"],
          timeout: 10000,
        });

        console.log("Messages", messages);

        messages.forEach((message) => {
          // if (message.key !== key) return;

          console.log(`Enqueueing ${JSON.stringify(message.value)}`);

          controller.enqueue(`data: ${JSON.stringify(message.value)}\n\n`);
        });
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}
