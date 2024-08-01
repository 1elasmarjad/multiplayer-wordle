"use client";

import { Loader2 } from "lucide-react";
import { type LetterGuess, type GameStatus } from "~/actions/games";
import { fillWithEmptyRow, getTileColor } from "./board";
import { maxRows } from "~/utils";

export default function Leaderboard({ game }: { game: GameStatus | null }) {
  if (!game) {
    return <Loader2 className="animate-spin" />;
  }

  return (
    <section className="flex flex-col">
      {game.players.map((player) => (
        <PlayerData
          key={player.id}
          name={player.username}
          guesses={game.guesses[player.id] ?? []}
        />
      ))}
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
    <div className="w-fit">
      <h3 className="text-center font-bold">{name}</h3>
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
      className={`${getTileColor(data.status)} flex h-6 w-4 select-none items-center justify-center rounded-sm border-2 border-solid border-gray-400 text-4xl font-bold capitalize`}
    ></div>
  );
}
