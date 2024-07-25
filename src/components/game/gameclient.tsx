"use client";

import { getGame, type WordGuess } from "~/actions/games";
import Lobby from "./lobby";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import Board from "./board";
import Keyboard from "./keyboard";

export default function GameClient({
  gameId,
  userId,
}: {
  gameId: string;
  userId: string;
}) {
  const [refetchEnabled, setRefetchEnabled] = useState<boolean>(true);
  const [guess, setGuess] = useState<WordGuess[]>([]);

  const { data: game, isLoading: gameLoading } = useQuery({
    queryKey: ["game", gameId],
    queryFn: async () => {
      try {
        const response = await getGame(gameId);

        if ("error" in response) {
          toast.error(response.error);
          return null;
        }

        return response;
      } catch (error) {
        setRefetchEnabled(false);
        return null;
      }
    },
    refetchInterval: 1000,
    enabled: refetchEnabled,
  });

  if (gameLoading) {
    return (
      <main className="flex h-screen w-full flex-col items-center justify-center">
        <Loader2 className="animate-spin" />
      </main>
    );
  }

  if (!game) {
    return (
      <main className="flex h-screen w-full flex-col items-center justify-center">
        <div>404 - Game not found</div>
      </main>
    );
  }

  if (game.players.every((player) => player.id !== userId)) {
    return (
      <main className="flex h-screen w-full flex-col items-center justify-center">
        <div>401 - Cannot Access Game</div>
      </main>
    );
  }

  if (game.inLobby) {
    return <Lobby data={game} userId={userId} />;
  }

  const myGuesses = [
    [
      {
        word: "a",
        status: "misplaced",
      },
      {
        word: "p",
        status: "correct",
      },
      {
        word: "p",
        status: "misplaced",
      },
      {
        word: "l",
        status: "dne",
      },
      {
        word: "e",
        status: "dne",
      },
    ],
  ] satisfies WordGuess[][];

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center">
      <Board boardData={myGuesses} newGuess={guess} />
      <Keyboard
        correctKeys={[]}
        misplacedKeys={[]}
        dneKeys={[]}
        guess={guess}
        setGuess={setGuess}
        attemptGuess={() => console.log("attempting guess")}
      />
    </main>
  );
}
