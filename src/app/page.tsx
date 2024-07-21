"use client";

import { useEffect } from "react";

export default function HomePage() {
  // const sse = new EventSource("localhost:3000/games/stream");

  // sse.onmessage = (event) => {
  //   console.log(event.data);
  // };

  useEffect(() => {
    const eventSource = new EventSource("/games/stream", {
      withCredentials: true,
    });

    eventSource.onerror = (event) => {
      eventSource.close(); // close the connection (TODO should only occur when it properly closes)
    };

    eventSource.onopen = () => {
      console.log("OPEN");
    };

    eventSource.onmessage = (event) => {
      console.log(`MSG: ${event.data}`);
    };
  }, []);

  return <main></main>;
}
