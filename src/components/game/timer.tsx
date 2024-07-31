"use client";

import { useEffect, useState } from "react";

export default function Timer({ roundEnds }: { roundEnds: number }) {
  const [timeRemaining, setTimeRemaining] = useState(remainingMS(roundEnds));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(remainingMS(roundEnds));
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [roundEnds]);

  // Helper function to format milliseconds into minutes:seconds
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes < 0 || seconds < 0) {
      return "0:00";
    }

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return <>{formatTime(timeRemaining)}</>;
}

function remainingMS(gameEnd: number) {
  const now = Date.now();

  return gameEnd - now;
}
