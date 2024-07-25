"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { joinLobby } from "~/actions/lobby";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { getGame } from "~/actions/games";

export default function HomePage() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const gameId: string | undefined = searchParams.get("game") ?? undefined;

  const [username, setUsername] = useState<string>("");

  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      const response = await joinLobby({
        username,
        gameId,
      });

      if ("error" in response) {
        throw new Error(response.error);
      }

      return response;
    },
    onSuccess: (data) => {
      router.push(`/${data.gameId}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { data: game } = useQuery({
    queryKey: ["game", gameId],
    queryFn: async () => {
      if (gameId === undefined) return null;

      const game = await getGame(gameId);

      if ("error" in game) {
        return null;
      }

      const uname = game.players.find(
        (player) => player.id === game.leader,
      )?.username;

      setUsername(uname ?? "");

      return {
        ...game,
        username: uname,
      };
    },
    enabled: gameId !== undefined,
  });

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center">
      <h1 className="text-center text-3xl font-semibold md:text-6xl">
        Multiplayer Wordle
      </h1>
      <h2 className="mt-4">Developed by Jad El Asmar</h2>

      <Card className="my-32">
        <CardHeader>
          <CardTitle>{gameId ? "Join Game" : "Create Game"}</CardTitle>
          <CardDescription>
            {gameId
              ? "Enter your username to join the game"
              : "Enter your username to create a private session"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="my-1.5 flex w-full flex-col gap-4">
            <div className="w-full">
              <Label htmlFor="username">Username</Label>
              <Input
                type="text"
                id="username"
                placeholder={game?.username ?? "Enter your username"}
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={game?.username !== undefined || isPending}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            disabled={isPending}
            onClick={() => mutate()}
            className="w-full"
          >
            {isPending && (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </>
            )}

            {gameId ? "Join Game" : "Create Game"}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
