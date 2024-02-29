import Link from "next/link";
import { getGames } from "../lib/api-fetching";
import { GetGameLeagueId } from "../lib/preprocess";
import Score from "./Score";
import { Suspense } from "react";

const GameCard = ({ game, team }) => (
  <div className="w-full px-4 grid grid-cols-6 bg-gray rounded">
    <div className="col-start-1 col-span-4 mx-10" justify="center" align="left">
      {team == "home" ? game.homeTeam : game.awayTeam}
    </div>
    <div className="col-start-5 col-span-1">
      <Score
        game={game}
        teamId={team == "home" ? game.homeTeamId : game.awayTeamId}
      ></Score>
    </div>
    <Link
      key={game.id + game.homeTeamId}
      href={{
        pathname: `/game/${game.id}/${team == "home" ? game.homeTeamId : game.awayTeamId}`,
      }}
      className="col-start-6 col-span-1 basis-1/2 h-12 bg-gray-700 rounded grid hover:bg-gray-500 px-15"
      justify="right"
      align="center"
    >
      {"->"}
    </Link>
  </div>
);

export default async function GamesList({ leagueId }) {
  const games = await getGames(leagueId);
  var games_by_date = {};
  var games_by_id = {};

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
    <div className="grow justify-between space-y-4">
      {Object.keys(games_by_date)
        .reverse()
        .map((date) => (
          <div key={date}>
            <h1 className="grid justify-items-center">{date}</h1>
            {games_by_date[date].map((gameId) => {
              const game = games_by_id[gameId];
              return (
                <>
                  {game.time}, {game.location}
                  <div
                    key={gameId}
                    className="grid grid-rows-2 w-full m-2 bg-gray-900 rounded"
                  >
                    <GameCard
                      className="row-start-1 row-span-1"
                      game={game}
                      team="home"
                    />
                    <GameCard
                      className="row-start-2 row-span-1"
                      game={game}
                      team="away"
                    />
                    <div className="w-full px-4 grid grid-cols-6 bg-gray rounded">
                      <Link
                        href={{ pathname: `/game/${game.id}` }}
                        justify="center"
                        align="center"
                        className="col-start-6"
                      >
                        View Game
                      </Link>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        ))}
    </div>
  );
}
