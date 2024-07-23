import { upstashKafka } from "~/kafka";

export const runtime = "edge";

export async function GET() {
  const readable = new ReadableStream({
    async start(controller) {
      controller.enqueue(`data: connected\n\n`);

      const c = upstashKafka.consumer();

      const messages = await c.consume({
        consumerGroupId: "group1",
        instanceId: "instance1",
        topics: ["game-updates"],
        timeout: 100000,
      });

      console.log("Completed consume", messages);

      messages.forEach((message) => {
        controller.enqueue(`data: ${message.value}\n\n`);
      });
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}
