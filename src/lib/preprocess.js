import { tidy, mutate, groupBy,summarize, sum, filter, last} from '@tidyjs/tidy'
import {getGameEvents, getGamesMetadata} from '@/lib/api-fetching'
import { connection } from '@/lib/db/db'

const EVENT_MAPPING = {
"Name":"name",
"gameId": "gameId",
"playerId":"playerId",
"teamId":"teamId",
'Goal':'goals',
'Assist':'assists',
'2nd Assist':'second_assists',
'D':'blocks',
'TA':'throwaways',
'Drop':'drops',
'': "other_passes"
}

function gameEventSequenceToRows(game_events_sequence) {
    var stats_summary = {}
    for (const event of game_events_sequence) {
        if (!(event.gameId in stats_summary)){
            stats_summary[event.gameId] = {}
        }
        if (!(event.player.id in stats_summary[event.gameId])){
            stats_summary[event.gameId][event.player.id]= {
                "name": event.player.playerName,
                "gameId": event.gameId,
                "playerId": event.player.id,
                "teamId":event.teamId,
                "goals":0,
                "assists":0,
                "second_assists":0,
                "blocks":0,
                "throwaways":0,
                "drops":0,
                "other_passes":0,
            }
        }
        stats_summary[event.gameId][event.player.id][EVENT_MAPPING[event.eventType]] += 1
    }

    var data = []
    Object.keys(stats_summary).map(gameId => {
        Object.keys(stats_summary[gameId]).map(playerId => {
            data.push(stats_summary[gameId][playerId])
        })
    })
    return data
}

function preprocess(game_rows, filter_func) {
    let rows = tidy(
        game_rows, 
        mutate({ "GC": d => d["goals"] + d["assists"] + d["second_assists"],
        "% pass": d => (1- (d["throwaways"] / ( d["throwaways"] +d["other_passes"] +d["assists"] + d["second_assists"] ) )).toFixed(2),
        "total_touches": d => d["GC"] + d["other_passes"]
            }
      ))
    
    const totals = tidy(
        rows,
        groupBy(['gameId', 'teamId'], [
          summarize({ total_gc: sum('GC'), total_touches: sum("other_passes")})
        ],  
        groupBy.object({ single: true }))
      )

    rows = tidy(
        rows,
        mutate({"% GC": d=> (d["GC"]/totals[d["gameId"]][d['teamId']]['total_gc']).toFixed(2),
        "% T": d=> (d["other_passes"]/totals[d["gameId"]][d['teamId']]['total_touches']).toFixed(2),
    })
    )
    rows = tidy(
        rows, 
        mutate( {
            "% total": d=> (d["% GC"] * d["% T"])
        })
    )
   
    rows = tidy(
        rows, filter(filter_func)
    )


    var graph = {}

    return [rows, graph]
}

export async function GamesMetadata() {
    const game_metadata = await getGamesMetadata()
    let values = game_metadata.map(row => [row.id, row.leagueId, new Date(row.date), row.time, row.awayTeamId, row.homeTeamId, row.awayTeam, row.homeTeam ])
    let sql = "INSERT IGNORE INTO GAME_METADATA (gameId, leagueId, date, time, awayTeamId, homeTeamId, awayTeam, homeTeam) VALUES ?"
    connection.query(sql, [values], (err, result) => {
        if (err) throw err;
        console.log("inserted ", result.affectedRows, " new rows")
    })
}
export async function GetLeagueIds() {
    let sql = "SELECT DISTINCT leagueId FROM GAME_METADATA;"
    let results = await connection.promise().query(sql).then(([results, fields]) => {
            return results
    })
    return results
}

export async function GetGameLeagueId(gameIds) {
    let sql = `SELECT * FROM GAME_METADATA WHERE gameId IN (${gameIds});`
    let results = await connection.promise().query(sql).then(([results, fields]) => {
            return results
    })
    
    return results
}


export async function GameTable(gameId, teamId,  use_cache=true) {
    let results = await connection.promise().query(`select * from GAME_ROWS where gameId = ${gameId} and teamId = ${teamId};`)
    .then(([results, fields]) => {
        if (results.length == 0 || !use_cache) {
          console.log(`Game table gameId = ${gameId} and teamId = ${teamId} not found - processing`)
          return getGameEvents(gameId, teamId).then(events => {
            let rows = gameEventSequenceToRows(events)
            let values = rows.map(row => Object.values(row));
            if (values.length > 0) {
                let sql = "INSERT IGNORE INTO GAME_ROWS (name, gameId, playerId, teamId, goals, assists, second_assists, blocks, throwaways, drops, other_passes) VALUES ?"
                connection.query(sql, [values], (err, result) => {
                    if (err) throw err;
                    console.log("inserted ", result.affectedRows, " new rows")
                })
            }
            return rows
            
        })
        } else {
            return results
        }  

      })
    
    let [rows, graph] = preprocess(results, (d) => true)

    return rows
}


export async function PlayerGameEvents(playerId, use_cache) {
    let results = await connection.promise().query(`select * from GAME_ROWS where playerId = ${playerId};`)
    .then(async ([results, fields]) => {
        if (!use_cache) {
            let rows = await Promise.all(results.map( async ({gameId, teamId}) => {
                        return GameTable(gameId, teamId)
                      }))             
            return rows.flat(1).filter(row => row.playerId == playerId)
          } else{
            return results
          }
        
        })
    
    return results
    }

export async function AllGameEvents() {
    let results = await connection.promise().query(`select * from GAME_ROWS;`)
    .then(([results, fields]) => {
        return results
        })
    
    return results
    }