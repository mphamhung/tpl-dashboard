import {
  tidy,
  mutate,
  groupBy,
  summarize,
  sum,
  filter,
  last,
} from "@tidyjs/tidy";
import { getGameEvents, getGamesMetadata } from "@/lib/api-fetching";
import { connection } from "@/lib/db/db";

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

function gameEventSequenceToRows(game_events_sequence) {
  const stats_summary = {};
  for (const event of game_events_sequence) {
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
  return data;
}

function preprocess(game_rows, filter_func) {
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

  rows = tidy(rows, filter(filter_func));

  const graph = {};

  return [rows, graph];
}

export async function GamesMetadata() {
  const game_metadata = await getGamesMetadata();
  const values = game_metadata.map((row) => [
    row.id,
    row.leagueId,
    new Date(row.date),
    row.time,
    row.awayTeamId,
    row.homeTeamId,
    row.awayTeam,
    row.homeTeam,
  ]);
  const sql =
    "INSERT IGNORE INTO GAME_METADATA (gameId, leagueId, date, time, awayTeamId, homeTeamId, awayTeam, homeTeam) VALUES ?";
  connection.query(sql, [values], (err, result) => {
    if (err) throw err;
    console.log("inserted ", result.affectedRows, " new rows");
  });
}
export async function GetLeagueIds() {
  const sql = "SELECT DISTINCT leagueId FROM GAME_METADATA;";
  const results = await connection
    .promise()
    .query(sql)
    .then(([results, fields]) => {
      return results;
    });
  return results;
}

export async function GetGameLeagueId(gameIds) {
  const sql = `SELECT * FROM GAME_METADATA WHERE gameId IN (${gameIds});`;
  const results = await connection
    .promise()
    .query(sql)
    .then(([results, fields]) => {
      return results;
    });

  return results;
}

export async function GameTable(gameId, teamId, date = null) {
  const today = new Date();
  const game_date = new Date(date);
  const game_is_today =
    (today.getDate() === game_date.getDate() ||
      today.getDate() === game_date.getDate() + 1) &&
    today.getMonth() === game_date.getMonth();
  const results = await connection
    .promise()
    .query(
      `select * from GAME_ROWS where gameId = ${gameId} and teamId = ${teamId};`
    )
    .then(([results, fields]) => {
      if (game_is_today) {
        console.log(`Game is today - processing`);
      }
      if (results.length == 0) {
        console.log(
          `Game table gameId = ${gameId} and teamId = ${teamId} not found - processing`
        );
      }
      if (game_is_today || results.length == 0) {
        return getGameEvents(gameId, teamId).then((events) => {
          const rows = gameEventSequenceToRows(events);
          const values = rows.map((row) => Object.values(row));
          if (values.length > 0) {
            // let sql = "INSERT IGNORE INTO GAME_ROWS (name, gameId, playerId, teamId, goals, assists, second_assists, blocks, throwaways, drops, other_passes) VALUES ?"
            const sql = `INSERT INTO GAME_ROWS (name, gameId, playerId, teamId, goals, assists, second_assists, blocks, throwaways, drops, other_passes)
                            VALUES ?
                            ON DUPLICATE KEY UPDATE 
                            name = VALUES(name), 
                            gameId = VALUES(gameId), 
                            playerId = VALUES(playerId), 
                            teamId = VALUES(teamId), 
                            goals = VALUES(goals), 
                            assists = VALUES(assists), 
                            second_assists = VALUES(second_assists), 
                            blocks = VALUES(blocks), 
                            throwaways = VALUES(throwaways), 
                            drops = VALUES(drops), 
                            other_passes = VALUES(other_passes);`;
            connection.query(sql, [values], (err, result) => {
              if (err) throw err;
              console.log("inserted ", result.affectedRows, " new rows");
            });
          }
          return rows;
        });
      } else {
        return results;
      }
    });

  const [rows, graph] = preprocess(results, (d) => true);

  return rows;
}

export async function PlayerGameEvents(playerId, use_cache) {
  const results = await connection
    .promise()
    .query(`select * from GAME_ROWS where playerId = ${playerId};`)
    .then(async ([results, fields]) => {
      if (!use_cache) {
        const rows = await Promise.all(
          results.map(async ({ gameId, teamId }) => {
            return GameTable(gameId, teamId);
          })
        );
        return rows.flat(1).filter((row) => row.playerId == playerId);
      } else {
        return results;
      }
    });

  return results;
}

export async function AllGameEvents() {
  const results = await connection
    .promise()
    .query(`select * from GAME_ROWS;`)
    .then(([results, fields]) => {
      return results;
    });

  return results;
}
