"use client";

import { Delete } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";
import { type LetterGuess, type GuessStatus } from "~/actions/games";

const keyboardKeys = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["enter", "z", "x", "c", "v", "b", "n", "m", "backspace"],
];

export default function Keyboard({
  correctKeys,
  misplacedKeys,
  dneKeys,
  guess,
  setGuess,
  attemptGuess,
}: {
  correctKeys: string[];
  misplacedKeys: string[];
  dneKeys: string[];
  guess: LetterGuess[];
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
              status={"empty"}
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
    return <button onClick={onClick}>ENTER</button>;
  }

  if (char === "backspace") {
    return (
      <button onClick={onClick}>
        <Delete />
      </button>
    );
  }

  return <button onClick={onClick}>{char.toUpperCase()}</button>;
}
