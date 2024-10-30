/* eslint-disable require-jsdoc */
"use server";
const serverUrl = "https://tplapp.onrender.com/";
import { tidy, mutate, groupBy, summarize, sum } from "@tidyjs/tidy";

const today = new Date();
// const use_cache = today.getDay() !== 3; // true on days other than Wednesday
const use_cache = true; // true on days other than Wednesday

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
    throw new Error(
      "Failed to fetch data for game: " + gameId + " teamId: " + teamId
    );
  }

  const fetchedData = await res.json();
  return fetchedData;
}

export async function getScore(gameId, teamId) {
  const teamEvents = await getGameEvents(gameId, teamId);
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

export async function getRowsFromEvents(events) {
  const stats_summary = {};
  for (const event of events) {
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

  let [rows, graph] = preprocess(data);

  let games = await getGames();
  const gameIds = rows.map((row) => row.gameId);
  games = games.filter((game) => gameIds.includes(game.id));
  const mapping = new Map(
    games.map((game) => {
      return [String(game.id), game];
    })
  );
  rows = tidy(
    rows,
    mutate({
      team: (d) =>
        d["teamId"] == mapping.get(d["gameId"]).awayTeamId
          ? mapping.get(d["gameId"]).awayTeam
          : mapping.get(d["gameId"]).homeTeam,
      date: (d) => new Date(mapping.get(d["gameId"]).date),
      game_time: (d) =>
        Number(mapping.get(d["gameId"]).time.split("-")[0].split(":")[0]) -
        12 +
        "pm",
    })
  );
  rows.reverse();
  return [rows, graph];
}

export async function getGameRows(gameId, teamId) {
  const teamEvents = await getGameEvents(gameId, teamId);
  return getRowsFromEvents(teamEvents);
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

export async function getPlayerEvents(playerId, leagueId) {
  const events = await getAllGameEvents(leagueId);
  return events.filter((event) => String(event.player.id) === String(playerId));
}

export async function PlayerLeagues(playerId) {
  const all_teams = await fetch(serverUrl + "teams", {
    cache: use_cache ? "default" : "no-store", // Use cache if not Wednesday
  }).then((response) => response.json());

  const leagueIds = all_teams
    .filter((team) => team.players.some((player) => player.id === playerId))
    .map((team) => team.leagueId);

  return leagueIds;
}
