import Link from "next/link";
import { getGames } from "../lib/api-fetching";
import { GetGameLeagueId } from "../lib/preprocess";
import Score from "./Score";
import { Suspense } from "react";
import { tidy, mutate } from "@tidyjs/tidy";

const GameCardRow = ({ game, team }) => (
  <div className="w-full h-12 px-4 grid grid-cols-12 bg-gray-900 rounded items-center">
    <div
      className="flex flex-grow col-start-1 col-span-10 mx-10 truncate overflow-hidden"
      justify="center"
      align="left"
    >
      {team == "home" ? game.homeTeam : game.awayTeam}
    </div>
    <div className="col-start-11 col-span-1 h-full self-auto">
      <Suspense>
        <Score
          game={game}
          teamId={team == "home" ? game.homeTeamId : game.awayTeamId}
        ></Score>
      </Suspense>
    </div>
    <Link
      key={game.id + game.homeTeamId}
      href={{
        pathname: `/game/${game.id}/${team == "home" ? game.homeTeamId : game.awayTeamId}`,
      }}
      className="col-start-12 col-span-1 h-full w-full bg-gray-700 rounded grid hover:bg-gray-500 px-15 align-text-center"
      justify="right"
    >
      {"->"}
    </Link>
  </div>
);

const GameCard = ({ game }) => (
  <div>
    <div className="flex flex-row w-full justify-items-center items-center rounded-lg">
      <div className="basis-1 text-center">
        <p>{game.gameTime} pm</p>
        <p>{game.location}</p>
        <div className="h-full w-full ">
          <Link
            href={{ pathname: `/game/${game.id}` }}
            className="bg-gray-700 rounded grid hover:bg-gray-500 text-center w-20 justify-self-end"
          >
            View Game
          </Link>
        </div>
      </div>
      <div key={game.id} className="grow w-full space-y-1 ">
        <GameCardRow className="" game={game} team="home" />
        <GameCardRow className="" game={game} team="away" />
      </div>
    </div>
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
