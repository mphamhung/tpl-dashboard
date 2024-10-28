/* eslint-disable require-jsdoc */
"use server";
const serverUrl = "https://tplapp.onrender.com/";
import {
  tidy,
  mutate,
  groupBy,
  summarize,
  sum,
  filter,
  last,
} from "@tidyjs/tidy";

const today = new Date();
const use_cache = today.getDay() !== 3; // true on days other than Wednesday
// const use_cache = true; // true on days other than Wednesday

export async function getGames(leagueId = null) {
  const res = await fetch(
    serverUrl + "games" + `${leagueId ? "/" + String(leagueId) : ""}`,
    {
      cache: use_cache ? "default" : "no-store", // Use cache if not Wednesday
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export async function getGameEvents(gameId, teamId) {
  const res = await fetch(serverUrl + "gameEvents/" + gameId + "/" + teamId, {
    cache: use_cache ? "default" : "no-store", // Use cache if not Wednesday
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const fetchedData = await res.json();
  return fetchedData;
}

export async function getScore(gameId, teamId) {
  const teamEvents = await getGameEvents(gameId, teamId);
  console.log(teamEvents.filter((event) => event.eventType == "Goal").length);
  return teamEvents.filter((event) => event.eventType == "Goal").length;
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
  const teamEvents = await getGameEvents(gameId, teamId);
  const stats_summary = {};
  for (const event of teamEvents) {
    if (!(event.gameId in stats_summary)) {
      stats_summary[event.gameId] = {};
    }
    if (!(event.player.id in stats_summary[event.gameId])) {
      stats_summary[event.gameId][event.player.id] = {
        name: event.player.playerName,
        gameId: event.gameId,
        playerId: event.player.id,
        teamId: event.teamId,
        goals: 0,
        assists: 0,
        second_assists: 0,
        blocks: 0,
        throwaways: 0,
        drops: 0,
        other_passes: 0,
      };
    }
    stats_summary[event.gameId][event.player.id][
      EVENT_MAPPING[event.eventType]
    ] += 1;
  }

  const data = [];
  Object.keys(stats_summary).map((gameId) => {
    Object.keys(stats_summary[gameId]).map((playerId) => {
      data.push(stats_summary[gameId][playerId]);
    });
  });
  return preprocess(data);
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

  games = games.filter((g) => g.leagueId === leagueId);

  const events = await Promise.all(
    games.map((game) =>
      Promise.all([
        getGameEvents(game.id, game.homeTeamId),
        getGameEvents(game.id, game.awayTeamId),
      ])
    )
  );

  return events;
}

export async function PlayerGameEvents(playerId, leagueId) {
  const events = await getAllGameEvents(leagueId);
  console.log(events);
}
