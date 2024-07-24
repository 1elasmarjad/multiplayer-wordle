import { type GameStatus } from "~/actions/games";
import PlayerList from "./playerlist";
import { Loader2 } from "lucide-react";

export default function Lobby({
  data,
  userId,
}: {
  data: GameStatus;
  userId: string;
}) {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-xl">Waiting for the host to continue...</h1>
        <Loader2 className="animate-spin" />
      </div>

      <PlayerList
        players={data.players}
        leader={data.leader}
        isLeader={Boolean(userId === data.leader)}
        className="my-12"
      />
    </main>
  );
}
