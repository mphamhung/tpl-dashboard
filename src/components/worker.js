import { GameCard } from "./GameCard";

export async function GameListByDate({ gamelist }) {
  const worker = new Worker(new URL("./worker.js", import.meta.url));

  worker.postMessage(gamelist);

  const sortedGamelist = await new Promise((resolve) => {
    worker.onmessage = function (e) {
      resolve(e.data);
    };
  });

  const gameCards = await Promise.all(
    sortedGamelist.map(async (game) => {
      return <GameCard game={game} />;
    })
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4">{gameCards}</div>
    </div>
  );
}
