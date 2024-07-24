"use client";

import { getGame } from "~/actions/games";
import Lobby from "./lobby";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function GameClient({
  gameId,
  userId,
}: {
  gameId: string;
  userId: string;
}) {
  const { data: game, error: gameError } = useQuery({
    queryKey: ["game", gameId],
    queryFn: async () => {
      const response = await getGame(gameId);

      if ("error" in response) {
        throw new Error(response.error);
      }

      return response;
    },
    refetchInterval: 1000,
  });

  if (gameError) {
    toast.error(gameError.message);
  }

  if (!game) {
    return <div>Game not found</div>;
  }

  if (game.inLobby) {
    return <Lobby data={game} userId={userId} />;
  }

  return <></>;
}
