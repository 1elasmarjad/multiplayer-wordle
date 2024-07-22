"use client";

import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    const eventSource = new EventSource("api/games/stream", {
      withCredentials: true,
    });

    eventSource.onerror = (event) => {
      console.log(`ERROR`);
    };

    eventSource.onopen = () => {
      console.log("OPEN");
    };

    eventSource.onmessage = (event) => {
      console.log(`MSG: ${event.data}`);
    };
  }, []);

  return (
    <main>
      <button
        onClick={async () => {
          return fetch("/api/games/guess", {
            method: "POST",
          });
        }}
      >
        test
      </button>
    </main>
  );
}
