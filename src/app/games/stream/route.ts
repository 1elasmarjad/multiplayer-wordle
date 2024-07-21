// export default function GET(request: Request): Response {
//   const readable = new ReadableStream({
//     async start(controller) {
//       controller.enqueue(JSON.stringify({ message: "Hello, world!" }));
//     },
//   });

//   return new Response(readable, {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// }

export const config = {
  runtime: "edge",
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function GET() {
  console.log("HERE");

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      controller.enqueue(`data: ${JSON.stringify({ 1: "test" })}\n\n`);
      await delay(500);
      controller.enqueue(`data: ${JSON.stringify({ 2: "test" })}\n\n`);
      await delay(500);
      controller.enqueue(`data: ${JSON.stringify({ 3: "test" })}\n\n`);
      await delay(500);
      controller.enqueue(`data: ${JSON.stringify({ 4: "test" })}\n\n`);
      await delay(500);
      controller.enqueue(`data: ${JSON.stringify({ 5: "test" })}\n\n`);
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/event-stream" },
  });
}
