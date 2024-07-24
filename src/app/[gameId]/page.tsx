import { getGame } from "~/actions/games";

export default async function GamePage({
  params,
}: {
  params: {
    gameId: string;
  };
}) {
  const game = await getGame(params.gameId);

  if (!game) {
    return <div>Game not found</div>;
  }

  return <></>;
}
