import { getUserId } from "~/actions/users";
import GameClient from "~/components/game/gameclient";

export default async function GamePage({
  params,
}: {
  params: {
    gameId: string;
  };
}) {
  const userId = await getUserId({ createIfNotExists: true });

  return <GameClient gameId={params.gameId} userId={userId!} />;
}
