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

  const allKeyStatus = getKeyStatus(game.guesses[userId] ?? []);

  return (
    <section className="flex flex-col items-center justify-center gap-2">
      {keyboardKeys.map((row, i) => (
        <div key={i} className="flex gap-2">
          {row.map((char, j) => (
            <Key
              key={char}
              char={char}
              status={allKeyStatus.get(char) ?? "empty"}
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
    return (
      <button
        onClick={onClick}
        className="flex w-20 items-center justify-center rounded-sm outline outline-1 outline-gray-500"
      >
        ENTER
      </button>
    );
  }

  if (char === "backspace") {
    return (
      <button
        onClick={onClick}
        className="flex w-20 items-center justify-center rounded-sm outline outline-1 outline-gray-500"
      >
        <Delete />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${getTileColor(
        status,
      )} h-6 w-6 sm:h-10 sm:w-10 rounded-sm text-lg outline outline-1 outline-gray-500`}
    >
      {char.toUpperCase()}
    </button>
  );
}

function statusValue(status: GuessStatus): number {
  switch (status) {
    case "correct":
      return 0;
    case "misplaced":
      return 1;
    case "empty":
      return 2;
    default:
      return 3;
  }
}

function getKeyStatus(data: LetterGuess[][]): Map<string, GuessStatus> {
  const keyValue = new Map<string, number>();

  data.forEach((row) => {
    row.forEach((col) => {
      const letter = col.letter; // letter at this column
      const status = col.status; // status at this column
      const value = statusValue(status); // value of status

      const currentSet = keyValue.get(letter);

      if (currentSet === undefined || value < currentSet) {
        keyValue.set(letter, value);
      }
    });
  });

  const result = new Map<string, GuessStatus>();

  keyValue.forEach((value, key) => {
    switch (value) {
      case 0:
        result.set(key, "correct");
        break;
      case 1:
        result.set(key, "misplaced");
        break;
      case 2:
        result.set(key, "empty");
        break;
      default:
        result.set(key, "dne");
    }
  });

  return result;
}
