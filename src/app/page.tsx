"use client";

import { useEffect } from "react";
import { type GameUpdate } from "./api/games/guess/route";

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
      if (event.data === "connected") return;

      const asJson = JSON.parse(event.data as string) as GameUpdate;

      console.log(`MSG 0: ${asJson.data}`);
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
