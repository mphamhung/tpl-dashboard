import { getGameEvents } from "@/lib/api-fetching";
const { parentPort } = require("worker_threads");

const getScore = async (events) => {
  return events.filter((event) => event.eventType === "Goal").length;
};

const queryScores = async (game) => {
  try {
    console.log("Querying scores for game:", game);

    const [homeTeamEvents, awayTeamEvents] = await Promise.all([
      getGameEvents(game.id, game.homeTeamId),
      getGameEvents(game.id, game.awayTeamId),
    ]);

    const [homeScore, awayScore] = await Promise.all([
      getScore(homeTeamEvents),
      getScore(awayTeamEvents),
    ]);

    console.log("Scores:", { homeScore, awayScore });

    postMessage({ homeScore, awayScore });
  } catch (error) {
    console.error("Error querying scores:", error);
    postMessage({ error: error.message });
  }
};

const result = queryScores(game);

parentPort.postMessage(result);
