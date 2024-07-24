"use client";

import { useMutation } from "@tanstack/react-query";
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

export default function HomePage() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const gameId: string | undefined = searchParams.get("game") ?? undefined;

  const [username, setUsername] = useState<string>("");

  const { data, isError, isSuccess, isPending, mutate } = useMutation({
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
      toast.success("Successfully joined game");
      router.push(`/${data.gameId}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center">

      <h1 className="text-3xl md:text-6xl font-semibold text-center">
        Multiplayer Wordle
      </h1>

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
                placeholder="Your in-game name"
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
