import { UsersRound } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

export default function PlayerList({
  players,
  leader,
  className,
}: {
  players: { id: string; username: string }[];
  leader: string;
  className?: string;
}) {
  return (
    <>
      <ScrollArea className={`h-72 w-48 rounded-md border ${className}`}>
        <div className="p-4">
          <h4 className="mb-4 flex items-center gap-2 text-sm font-medium leading-none">
            <UsersRound size={16} />
            Players
          </h4>
          {players.map((player) => (
            <div key={player.id}>
              <div className="text-sm">
                {player.username}

                {player.id === leader && (
                  <span className="text-xs text-gray-500"> (Leader)</span>
                )}
              </div>
              <Separator className="my-2" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  );
}
