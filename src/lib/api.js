/* eslint-disable require-jsdoc */
"use server";
const serverUrl = "https://tplapp.onrender.com/";

export async function getGames(leagueId = null) {
  const res = await fetch(
    serverUrl + "games" + `${leagueId ? "/" + String(leagueId) : ""}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export async function getGameEvents(gameId, teamId) {
  const res = await fetch(serverUrl + "gameEvents/" + gameId + "/" + teamId, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const fetchedData = await res.json();
  return fetchedData;
}

export async function getScore(gameId, teamId) {
  const teamEvents = await getGameEvents(gameId, teamId);
  return teamEvents.filter((event) => event.eventType == "Goal").length;
}
