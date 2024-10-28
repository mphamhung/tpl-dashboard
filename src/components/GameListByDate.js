import { tidy, distinct, mutate } from "@tidyjs/tidy";
import { GameCard } from "./GameCard";
import { getScore } from "@/lib/api";

export async function GameListByDate({ gamelist }) {
  gamelist = tidy(
    gamelist,
    mutate({
      displayDate: (d) =>
        new Date(d["date"]).toLocaleString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }),
      gameTime: (d) => Number(d["time"].split(":")[0]) - 12, //Convert to pm game
    })
  );

  gamelist.sort((a, b) => a.gameTime - b.gameTime);

  async function createGameCard(game) {
    let homeScore = await getScore(game.id, game.homeTeamId);
    let awayScore = await getScore(game.id, game.awayTeamId);
    return <GameCard game={game} homeScore={homeScore} awayScore={awayScore} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4">
        {gamelist.map(async (game) => {
          return createGameCard(game);
        })}
      </div>
    </div>
  );
}
