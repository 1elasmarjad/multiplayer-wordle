"use client";

import {
  type GameStatus,
  getGame,
  makeGuess,
  type LetterGuess,
  startRound,
} from "~/actions/games";
import Lobby from "./lobby";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2, Play } from "lucide-react";
import { useState } from "react";
import Board from "./board";
import Keyboard from "./keyboard";
import Leaderboard from "./leaderboard";
import { Button } from "../ui/button";
import Timer from "./timer";

export default function GameClient({
  gameId,
  userId,
}: {
  gameId: string;
  userId: string;
}) {
  const [refetchEnabled, setRefetchEnabled] = useState<boolean>(true);
  const [game, setGame] = useState<
    | (GameStatus & {
        roundEnded: boolean;
      })
    | null
  >(null);
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

  const { isPending: newRoundLoading, mutate: beginNextRound } = useMutation({
    mutationFn: async ({ gameId }: { gameId: string }) => {
      const resp = await startRound(gameId);

      if (resp && "error" in resp) {
        throw new Error(resp.error);
      }

      return resp;
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
    <main className="mt-12 flex h-screen w-full justify-between">
      <div className="w-full grow" />

      <div className="flex w-full max-w-2xl flex-col items-center gap-6">
        {game.roundEnds && !game.roundEnded && (
          <div className="mb-6 rounded-md bg-gray-200 px-6 py-2 text-xl font-semibold">
            <Timer roundEnds={game.roundEnds} />
          </div>
        )}

        <Board boardData={game.guesses[userId] ?? []} newGuess={guess} />

        {game.winner ? (
          <>
            <div className="rounded-full bg-secondary px-8 py-3 text-center text-secondary-foreground">
              🎉{" "}
              {game.winner === userId
                ? "You"
                : game.players.find((player) => player.id === game.winner)
                    ?.username}{" "}
              won! 🎉
              <br />
              The word was <strong>{game.word?.toUpperCase()}</strong>
            </div>
          </>
        ) : (
          <>
            {game.roundEnded ? (
              <div className="text-center">
                Out of Time! The word was <strong>{game.word}</strong> <br />
                No winner.
              </div>
            ) : (
              <Keyboard
                game={game}
                userId={userId}
                setGuess={setGuess}
                attemptGuess={() => {
                  if (guessLoading) return;
                  guessMutate();
                }}
              />
            )}
          </>
        )}

        {game.roundEnded && game.leader === userId && (
          <Button
            className="mt-6 gap-2"
            onClick={() =>
              beginNextRound({
                gameId,
              })
            }
            disabled={newRoundLoading}
          >
            {newRoundLoading ? (
              <>
                Start Next Round <Loader2 className="w-4 animate-spin" />
              </>
            ) : (
              <>
                Start Next Round <Play className="w-4 fill-background" />
              </>
            )}
          </Button>
        )}
      </div>
      <div className="w-full grow flex-col items-center">
        <Leaderboard game={game} />
      </div>
    </main>
  );
}
