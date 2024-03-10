import Link from "next/link";
import { getGames } from "../lib/api-fetching";
import { GetGameLeagueId } from "../lib/preprocess";
import Score from "./Score";
import { Suspense } from "react";
import { tidy, mutate } from "@tidyjs/tidy";
import { ScoreCard } from "@/components/ScoreCard";

const GameCardRow = ({ game, name, teamId }) => (
  <div className="grid grid-cols-6 row-span-1 col-span-4 rounded-lg bg-slate-900 p-2">
    <div className="col-span-4 leading-6 line-clamp-1">{name}</div>
    <div className="col-start-5 col-span-1">
      <Suspense fallback={"*"}>
        <Score game={game} teamId={teamId}></Score>
      </Suspense>
    </div>
    <Link
      href={`/game/${game.id}/${teamId}`}
      className="col-start-6 col-span-1 bg-slate-800 hover:bg-slate-700 rounded-r-lg flex justify-center"
    >
      {"->"}
    </Link>
  </div>
);

const GameCard = ({ game }) => (
  <div className="grid grid-rows-4 grid-cols-4 h-auto rounded-lg gap-1 bg-slate-700 p-1">
    <div className="grid grid-cols-4 row-span-1 col-span-4">
      <div>
        {new Date(game.date).toLocaleDateString("en-US", {
          month: "numeric",
          day: "numeric",
          year: "numeric",
        })}
      </div>
      <div>{game.gameTime}pm</div>
      <div>{game.location}</div>
    </div>
    <GameCardRow game={game} name={game.homeTeam} teamId={game.homeTeamId} />
    <GameCardRow game={game} name={game.awayTeam} teamId={game.awayTeamId} />
    <div></div>
    <Link
      href={`/game/${game.id}`}
      className="flex row-span-1 row-start-4 col-start-3 border-2 border-slate-600 col-span-2 rounded-lg p-1 justify-center leading-6 bg-slate-800 hover:bg-slate-700"
    >
      <div>View Game</div>
    </Link>
  </div>
);
export default async function GamesList({ leagueId }) {
  var games = await getGames(leagueId);
  var games_by_date = {};
  var games_by_id = {};

  games = tidy(
    games,
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

  games.sort(
    (a, b) => new Date(a.date) - new Date(b.date) || a.gameTime - b.gameTime
  );

  for (const game of games) {
    if (!(game.date in games_by_date)) {
      games_by_date[game.date] = [];
    }
    games_by_date[game.date].push(game.id);
  }

  for (const game of games) {
    games_by_id[game.id] = game;
  }

  return (
    <div>
      {Object.keys(games_by_date)
        .reverse()
        .map((date) => (
          <div key={date} className="grid space-y-4">
            <h1 className="justify-self-center">{date}</h1>
            {games_by_date[date].map((gameId) => {
              const game = games_by_id[gameId];
              return <GameCard game={game} />;
            })}
          </div>
        ))}
    </div>
  );
}
