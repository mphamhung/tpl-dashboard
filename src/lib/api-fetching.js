/* eslint-disable require-jsdoc */
"use server";
const serverUrl = process.env.serverUrl;

export async function getGames(leagueId) {
  const res = await fetch(serverUrl + "games/" + leagueId, {});
  // Revalidate every day
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export async function getGameEvents(gameId, teamId) {
  const res = await fetch(
    serverUrl + "gameEvents/" + gameId + "/" + teamId,
    {}
  );

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  const fetched_data = await res.json();

  const events = [];
  Object.keys(fetched_data).map((idx) => events.push(fetched_data[idx]));
  events.sort(function (a, b) {
    return a.sequence - b.sequence;
  });

  return events;
}

export async function getGameEventsByGameId(gameId) {
  const games = await getGames();

  const g = games.find((game) => game["id"] === gameId);

  const [homeTeamEvents, awayTeamEvents] = await Promise.all([
    getGameEvents(g.id, g.homeTeamId),
    getGameEvents(g.id, g.awayTeamId),
  ]);

  return [homeTeamEvents, awayTeamEvents];
}

export async function getAllGameEvents() {
  const games = await getGames();

  const flattened_games = [];
  for (const game of games) {
    flattened_games.push({ gameId: game.id, teamId: game.awayTeamId });
    flattened_games.push({ gameId: game.id, teamId: game.homeTeamId });
  }

  return flattened_games;
}

export async function getGamesMetadata() {
  const res = await fetch(serverUrl + "games", { cache: "no-store" });
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  const fetched_data = await res.json();
  return fetched_data;
}

export async function getTeamInfo(teamId) {
  const res = await fetch(serverUrl + "teams");
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  const fetched_data = await res.json();
  const [teamInfo, _] = fetched_data.filter((team) => team.id === teamId);
  return teamInfo;
}
