"use client";

import { Delete } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";
import {
  type LetterGuess,
  type GuessStatus,
  type GameStatus,
} from "~/actions/games";
import { getTileColor } from "./board";

const keyboardKeys = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["enter", "z", "x", "c", "v", "b", "n", "m", "backspace"],
];

export default function Keyboard({
  game,
  setGuess,
  attemptGuess,
  userId,
}: {
  userId: string;
  game: GameStatus;
  setGuess: Dispatch<SetStateAction<LetterGuess[]>>;
  attemptGuess: () => void;
}) {
  function handleKeyClick(char: string) {
    setGuess((prev) => {
      if (char === "backspace") {
        return prev.slice(0, -1);
      }

      if (char === "enter") {
        return prev;
      }

      if (prev.length >= 5) {
        return prev;
      }

      // add the character to the guess
      return [...prev, { letter: char, status: "empty" }];
    });

    if (char === "enter") {
      attemptGuess();
    }
  }

  return (
    <section className="flex flex-col items-center justify-center gap-2">
      {keyboardKeys.map((row, i) => (
        <div key={i} className="flex gap-2">
          {row.map((char, j) => (
            <Key
              key={char}
              char={char}
              status={getMostRecentStatus(game.guesses[userId] ?? [], char)}
              onClick={() => handleKeyClick(char)}
            />
          ))}
        </div>
      ))}
    </section>
  );
}

export function Key({
  char,
  status,
  onClick,
}: {
  char: string;
  status: GuessStatus;
  onClick?: () => void;
}) {
  if (char === "enter") {
    return <button onClick={onClick} className="outline outline-1 outline-gray-500 w-20 flex items-center justify-center rounded-sm">ENTER</button>;
  }

  if (char === "backspace") {
    return (
      <button onClick={onClick} className="outline outline-1 outline-gray-500 w-20 flex items-center justify-center rounded-sm">
        <Delete />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${getTileColor(status, {
        emptyColor: "bg-gray-100",
      })} h-10 w-10 rounded-sm text-lg outline outline-1 outline-gray-500`}
    >
      {char.toUpperCase()}
    </button>
  );
}

export function getMostRecentStatus(
  data: LetterGuess[][],
  letter: string,
): GuessStatus {
  // get the most recent status of the letter
  for (let i = data.length - 1; i >= 0; i--) {
    const row = data[i]!;
    const guess = row.find((g) => g.letter === letter);

    if (guess) {
      return guess.status;
    }
  }

  return "empty";
}
