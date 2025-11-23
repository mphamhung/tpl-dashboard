/* eslint-disable require-jsdoc */
// "use server";
const serverUrl = "https://tplapp.onrender.com/";
const summary_stats_raw =
  "https://raw.githubusercontent.com/mphamhung/automations/refs/heads/main/data/tpl_stats_summary.json";
const game_info_raw =
  "https://raw.githubusercontent.com/mphamhung/automations/refs/heads/main/data/tpl_game_info.json";

import {
  tidy,
  mutate,
  groupBy,
  summarize,
  sum,
  filter,
  select,
  leftJoin,
} from "@tidyjs/tidy";

export async function loadSummaryStats() {
  const res = await fetch(summary_stats_raw, { cache: "no-cache" });
  const text = await res.text();
  let result = tidy(JSON.parse(text));

  const maxLeagueId = result
    .map((d) => Number(d.leagueId))
    .reduce((a, b) => Math.max(a, b));
  console.log(maxLeagueId);
  result = tidy(
    result,
    mutate({
      leagueWeight: (d) => 1 / (1 + 0.05 * (maxLeagueId - Number(d.leagueId))),
    })
  );
  return result;
}
export async function loadGameInfo() {
  const res = await fetch(game_info_raw, { cache: "no-cache" });
  const text = await res.text();
  const result = tidy(JSON.parse(text));
  return result;
}

export async function getGames(leagueId = null) {
  const data = await loadSummaryStats();
  const game_data = await loadGameInfo();
  const game_times = tidy(
    game_data,
    mutate({
      gameId: (d) => d["id"],
    }),
    select([
      "leagueId",
      "gameId",
      "time",
      "location",
      "homeTeam",
      "awayTeam",
      "homeTeamId",
      "awayTeamId",
      "date",
    ])
  );
  const keys = ["gameId", "teamId"];
  return tidy(
    data,
    filter((d) => d.leagueId === leagueId),
    groupBy(keys, [summarize({ score: sum("goals") })]),
    groupBy("gameId", [
      summarize({
        scores: (items) => items.map((d) => d.score),
        team_ids: (items) => items.map((d) => d.teamId),
      }),
    ]),
    leftJoin(game_times, { by: ["gameId", "id"] }),
    mutate({
      homeTeamScore: (d) => d["scores"][d["team_ids"].indexOf(d["homeTeamId"])],
      awayTeamScore: (d) => d["scores"][d["team_ids"].indexOf(d["awayTeamId"])],
    })
  );
}

export async function getGameEvents(gameId, teamId) {
  const res = await fetch(serverUrl + "gameEvents/" + gameId + "/" + teamId, {
    cache: use_cache ? "default" : "no-store", // Use cache if not Wednesday
  });

  if (!res.ok) {
    throw new Error(
      "Failed to fetch data for game: " + gameId + " teamId: " + teamId
    );
  }

  const fetchedData = await res.json();
  return fetchedData;
}

const EVENT_MAPPING = {
  Name: "name",
  gameId: "gameId",
  playerId: "playerId",
  teamId: "teamId",
  Goal: "goals",
  Assist: "assists",
  "2nd Assist": "second_assists",
  D: "blocks",
  TA: "throwaways",
  Drop: "drops",
  "": "other_passes",
};

function preprocess(game_rows) {
  let rows = tidy(
    game_rows,
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
      total_touches: (d) => d["GC"] + d["other_passes"],
    })
  );

  const totals = tidy(
    rows,
    groupBy(
      ["gameId", "teamId"],
      [
        summarize({
          goal_contributions: sum("GC"),
          total_touches: sum("other_passes"),
        }),
      ],
      groupBy.object({ single: true })
    )
  );

  rows = tidy(
    rows,
    mutate({
      "% Goal Contributions": (d) =>
        Number(
          (d["GC"] * 100) /
            totals[d["gameId"]][d["teamId"]]["goal_contributions"]
        ).toFixed(2),
      "% Touches": (d) =>
        Number(
          (d["other_passes"] * 100) /
            totals[d["gameId"]][d["teamId"]]["total_touches"]
        ).toFixed(2),
      participation: (d) => d["GC"] + d["other_passes"],
    })
  );

  const graph = {};

  return [rows, graph];
}

export async function getGameRows(gameId, teamId) {
  const game_data = await loadSummaryStats();
  const game_rows = tidy(
    game_data,
    filter((d) => d.gameId === gameId && d.teamId === teamId)
  );
  // console.log(game_rows);
  return preprocess(game_rows);
}

export async function getPlayerRows(playerId) {
  const game_data = await loadSummaryStats();
  const game_info = await loadGameInfo();

  const game_rows = tidy(
    game_data,
    filter((d) => d.playerId === playerId),
    leftJoin(
      tidy(
        game_info,
        mutate({
          gameId: (d) => d["id"],
        })
      ),
      { by: "gameId" }
    )
  );
  return game_rows;
}

export async function getLeagueIds() {
  const res = await fetch(serverUrl + "teams", {
    cache: use_cache ? "default" : "no-store", // Use cache if not Wednesday
  });
  const teams = await res.json();
  const leagueIds = [...new Set(teams.map((team) => team.leagueId))];
  leagueIds.sort((a, b) => b - a);

  return leagueIds;
}

export async function getAllGameEvents(leagueId) {
  let games = await fetch(serverUrl + "games", {
    cache: use_cache ? "default" : "no-store", // Use cache if not Wednesday
  }).then((response) => response.json());

  if (leagueId !== undefined) {
    games = games.filter((game) => game.leagueId === leagueId);
  }
  const events = await Promise.all(
    games.map((game) =>
      Promise.all([
        getGameEvents(game.id, game.homeTeamId),
        getGameEvents(game.id, game.awayTeamId),
      ])
    )
  );
  return events.flat().flat();
}

export async function getPlayer(playerId) {
  const player = await fetch(serverUrl + "player/" + String(playerId)).then(
    (response) => response.json()
  );
  return player;
}
