import { Play, UsersRound } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

export default function PlayerList({
  players,
  leader,
  isLeader,
  className,
}: {
  players: { id: string; username: string }[];
  leader: string;
  isLeader: boolean;
  className?: string;
}) {
  return (
    <>
      <ScrollArea className={`h-72 w-48 rounded-md border ${className}`}>
        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium leading-none flex items-center gap-2">
            <UsersRound size={16}/>
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

      {isLeader && (
        <>
          <Button className="gap-2">
            Start Game <Play className="w-4 fill-background" />
          </Button>
        </>
      )}
    </>
  );
}
