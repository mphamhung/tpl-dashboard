import { getGamesMetadata, getTeamInfo } from "@/lib/api-fetching";
import { AllGameEvents } from "@/lib/preprocess";
import PlayByPlay from "@/components/PlayByPlay";

import {
  tidy,
  sum,
  groupBy,
  summarize,
  first,
  nDistinct,
  mutate,
  min,
} from "@tidyjs/tidy";
const alterRows = async (eventRows) => {
  return tidy(
    eventRows,
    groupBy(
      ["playerId"],
      [
        summarize({
          name: first("name"),
          goals: sum("goals"),
          assists: sum("assists"),
          second_assists: sum("second_assists"),
          blocks: sum("blocks"),
          throwaways: sum("throwaways"),
          drops: sum("drops"),
          other_passes: sum("other_passes"),
          games_played: nDistinct("gameId"),
        }),
      ]
    ),
    mutate({
      GC: (d) => d["goals"] + d["assists"] + d["second_assists"],
      "% pass": (d) =>
        (
          1 -
          d["throwaways"] /
            (d["throwaways"] +
              d["other_passes"] +
              d["assists"] +
              d["second_assists"])
        ).toFixed(2),
      "g pg": (d) => (d["goals"] / d["games_played"]).toFixed(2),
      "a pg": (d) => (d["assists"] / d["games_played"]).toFixed(2),
      "2a pg": (d) => (d["second_assists"] / d["games_played"]).toFixed(2),
      "b pg": (d) => (d["blocks"] / d["games_played"]).toFixed(2),
      "ta pg": (d) => (d["throwaways"] / d["games_played"]).toFixed(2),
      "dr pg": (d) => (d["drops"] / d["games_played"]).toFixed(2),
      "touches pg": (d) => (d["other_passes"] / d["games_played"]).toFixed(2),
    })
  );
};

const get_totals = async (player_rows) => {
  return tidy(
    player_rows,
    summarize({
      "g pg": sum("g pg"),
      "a pg": sum("a pg"),
      "2a pg": sum("2a pg"),
      "b pg": sum("b pg"),
      "ta pg": sum("ta pg"),
      "dr pg": sum("dr pg"),
      "touches pg": sum("touches pg"),
    }),
    mutate({
      "expected score": (d) => (d["g pg"] + d["a pg"]) / 2,
    })
  );
};
export default async function Page({ params }) {
  const [game_metadata, rows] = await Promise.all([
    getGamesMetadata(),
    AllGameEvents(),
  ]);
  const today = new Date();

  const upcoming_games = game_metadata.filter(
    (game) => new Date(game.date) >= today
  );

  const team_datas = await Promise.all(
    upcoming_games.map(async (game) => {
      return {
        home: await getTeamInfo(game.homeTeamId),
        away: await getTeamInfo(game.awayTeamId),
        homeTeam: game.homeTeam,
        awayTeam: game.awayTeam,
        gameId: game.id,
      };
    })
  );

  const rosters = team_datas.map((game) => {
    return {
      gameId: game.gameId,
      home: game.home.players.map((player) => Number(player.id)),
      away: game.away.players.map((player) => Number(player.id)),
      homeTeam: game.homeTeam,
      awayTeam: game.awayTeam,
    };
  });

  const filterPlayerEvents = async (playerIds) => {
    return rows.filter((row) => playerIds.includes(row.playerId));
  };

  const team_rows = await Promise.all(
    rosters.map(async (game) => {
      return {
        home: await filterPlayerEvents(game.home),
        away: await filterPlayerEvents(game.away),
        homeTeam: game.homeTeam,
        awayTeam: game.awayTeam,

        gameId: game.gameId,
      };
    })
  );
  const altered_rows = await Promise.all(
    team_rows.map(async (game) => {
      return {
        home: await alterRows(game.home),
        away: await alterRows(game.away),
        homeTeam: game.homeTeam,
        awayTeam: game.awayTeam,

        gameId: game.gameId,
      };
    })
  );
  const game_totals = await Promise.all(
    altered_rows.map(async (game) => {
      return {
        home: await get_totals(game.home),
        away: await get_totals(game.away),
        homeTeam: game.homeTeam,
        awayTeam: game.awayTeam,
        gameId: game.gameId,
      };
    })
  );

  return (
    <div className="flex flex-col space-y-8">
      {game_totals.map((game, index) => (
        <div key={index} className="grid grid-cols-2">
          <div>{game.homeTeam}</div>
          <div>{game.awayTeam}</div>
          <div className="flex flex-col">
            {Object.entries(game.home[0]).map(([k, v]) => (
              <div className="flex flex-row justify-around " key={k}>
                <div>{String(k)}</div>
                <div>{String(v.toFixed(2))}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            {Object.entries(game.away[0]).map(([k, v]) => (
              <div className="flex flex-row justify-around " key={k}>
                <div>{String(k)}</div>
                <div>{String(v.toFixed(2))}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
