"use client";

import {
  type GameStatus,
  getGame,
  makeGuess,
  type LetterGuess,
} from "~/actions/games";
import Lobby from "./lobby";
import { useMutation, useQuery } from "@tanstack/react-query";
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
  const [game, setGame] = useState<GameStatus | null>(null);
  const [guess, setGuess] = useState<LetterGuess[]>([]);

  const { isLoading: gameLoading } = useQuery({
    queryKey: ["game", gameId],
    queryFn: async () => {
      try {
        const response = await getGame(gameId);

        if ("error" in response) {
          toast.error(response.error);
          return null;
        }

        setGame(response);

        return response;
      } catch (error) {
        setRefetchEnabled(false);
        return null;
      }
    },
    refetchInterval: 1000,
    enabled: refetchEnabled,
  });

  const { isPending: guessLoading, mutate: guessMutate } = useMutation({
    mutationFn: async () => {
      console.log(`gameId: ${gameId}, guess: `, guess);

      const response = await makeGuess(gameId, guess);

      if ("error" in response) {
        toast.error(response.error as string);
        throw Error(response.error as string);
      }

      return response;
    },
    onSuccess: (data) => {
      setGuess([]);
      setGame((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          guesses: data,
        };
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
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

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center gap-6">
      <Board boardData={game.guesses[userId] ?? []} newGuess={guess} />
      <Keyboard
        game={game}
        userId={userId}
        setGuess={setGuess}
        attemptGuess={() => {
          if (guessLoading) return;
          guessMutate();
        }}
      />
    </main>
  );
}
