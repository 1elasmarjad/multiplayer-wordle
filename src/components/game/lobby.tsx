"use client";

import { startGame, type GameStatus } from "~/actions/games";
import PlayerList from "./playerlist";
import { Loader2, Play } from "lucide-react";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import GameLink from "./gamelink";

export default function Lobby({
  data,
  userId,
}: {
  data: GameStatus;
  userId: string;
}) {
  const { isPending: gameLoading, mutate: begin } = useMutation({
    mutationFn: async () => {
      const resp = await startGame(data.gameId);

      if (resp && "error" in resp) {
        throw new Error(resp.error);
      }

      return resp;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        {data.leader !== userId && (
          <div className="flex flex-col items-center">
            <h1 className="text-center text-xl">
              Waiting for the host to continue...
            </h1>
            <Loader2 className="animate-spin" />
          </div>
        )}

        {data.leader === userId && (
          <div>
            <h1 className="text-center text-xl">
              Start the game when everyone is ready!
            </h1>
          </div>
        )}
      </div>

      <PlayerList
        players={data.players}
        leader={data.leader}
        className="my-12"
      />

      <GameLink gameId={data.gameId} />

      {data.leader === userId && (
        <>
          <Button
            className="gap-2 mt-6"
            disabled={gameLoading}
            onClick={() => begin()}
          >
            Start Game{" "}
            {gameLoading ? (
              <Loader2 className="w-4 animate-spin" />
            ) : (
              <Play className="w-4 fill-background" />
            )}
          </Button>
        </>
      )}
    </main>
  );
}
