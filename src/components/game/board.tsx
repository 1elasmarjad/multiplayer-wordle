"use client";

import { useEffect, useState } from "react";
import { type GuessStatus, type LetterGuess } from "~/actions/games";

const emptyRow: LetterGuess[] = [
  { letter: "", status: "empty" },
  { letter: "", status: "empty" },
  { letter: "", status: "empty" },
  { letter: "", status: "empty" },
  { letter: "", status: "empty" },
];

const maxRows = 5;

export default function Board({
  boardData,
  newGuess,
}: {
  boardData: LetterGuess[][];
  newGuess: LetterGuess[];
}) {
  const [newBoardData, setNewBoardData] = useState<LetterGuess[][]>([
    ...boardData,
  ]);

  useEffect(() => {
    const d = [...boardData];

    // push newGuess to the board
    d.push(newGuess);

    // fill in empty rows with emptyRow
    while (d.length < maxRows) {
      d.push(emptyRow);
    }

    setNewBoardData(d);
  }, [boardData, newGuess]);

  return (
    <section className="flex flex-col gap-2">
      {newBoardData.map((row, i) => (
        <div key={i} className="flex gap-2">
          {Array.from({ length: 5 }).map((_, j) => (
            <Tile
              key={j}
              data={
                row[j] ?? {
                  letter: "",
                  status: "empty",
                }
              }
            />
          ))}
        </div>
      ))}
    </section>
  );
}

function Tile({ data }: { data: LetterGuess }) {
  return (
    <div
      className={`${getTileColor(data.status)} flex h-24 w-24 select-none items-center justify-center rounded-md border-2 border-solid border-gray-400 text-3xl font-extrabold capitalize`}
    >
      {data.letter}
    </div>
  );
}

export function getTileColor(
  status: GuessStatus,
  opts?: {
    emptyColor?: string;
  },
): string {
  switch (status) {
    case "correct":
      return "bg-green-500";
    case "misplaced":
      return "bg-yellow-500";
    case "dne":
      return "bg-gray-200";
    default:
      return opts?.emptyColor ?? "bg-transparent";
  }
}
