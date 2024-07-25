"use client";

import { type GuessStatus, type WordGuess } from "~/actions/games";

const emptyRow: WordGuess[] = [
  { word: "", status: "empty" },
  { word: "", status: "empty" },
  { word: "", status: "empty" },
  { word: "", status: "empty" },
  { word: "", status: "empty" },
];

const maxRows = 5;

export default function Board({ boardData }: { boardData: WordGuess[][] }) {
  // fill in empty rows with emptyRow
  while (boardData.length < maxRows) {
    boardData.push(emptyRow);
  }

  console.log(boardData);

  return (
    <section className="flex flex-col gap-2">
      {boardData.map((row, i) => (
        <div key={i} className="flex gap-2">
          {row.map((data, j) => (
            <Tile key={j} data={data} />
          ))}
        </div>
      ))}
    </section>
  );
}

function Tile({ data }: { data: WordGuess }) {
  return (
    <div
      className={`${getTileColor(data.status)} flex h-24 w-24 select-none items-center justify-center rounded-md border-2 border-solid border-gray-400 text-3xl font-semibold capitalize`}
    >
      {data.word}
    </div>
  );
}

function getTileColor(status: GuessStatus): string {
  switch (status) {
    case "correct":
      return "bg-green-500";
    case "misplaced":
      return "bg-yellow-500";
    case "dne":
      return "bg-gray-200";
    default:
      return "bg-transparent";
  }
}
