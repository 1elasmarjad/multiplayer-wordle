"use client";

import { Loader2 } from "lucide-react";
import { type LetterGuess, type GameStatus } from "~/actions/games";
import { fillWithEmptyRow, getTileColor } from "./board";
import { maxRows } from "~/utils";

export default function Leaderboard({
  game,
  userId,
}: {
  game: GameStatus | null;
  userId: string;
}) {
  if (!game) {
    return <Loader2 className="animate-spin" />;
  }

  return (
    <section className="flex h-full items-center pb-32 mx-6">
      <div className="hidden flex-col gap-6 md:flex">
        <h2 className="text-center font-bold">Leaderboard</h2>
        {game.players
          .filter((player) => player.id !== userId)
          .map((player) => (
            <PlayerData
              key={player.id}
              name={player.username}
              guesses={game.guesses[player.id] ?? []}
            />
          ))}
      </div>
    </section>
  );
}

function PlayerData({
  name,
  guesses,
}: {
  name: string;
  guesses: LetterGuess[][];
}) {
  return (
    <div className="relative w-fit rounded border px-6 py-4">
      <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 transform bg-white px-2 font-bold text-gray-700">
        {name}
      </span>
      <div className="flex w-fit flex-col gap-1">
        {fillWithEmptyRow(guesses, maxRows).map((row, i) => (
          <div key={i} className="flex w-fit gap-1">
            {Array.from({ length: 5 }).map((_, j) => (
              <SmallTile
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
      </div>
    </div>
  );
}

function SmallTile({ data }: { data: LetterGuess }) {
  return (
    <div
      className={`${getTileColor(data.status)} flex h-2.5 w-2.5 select-none items-center justify-center border-2 border-solid border-gray-400 text-4xl font-bold capitalize`}
    ></div>
  );
}
