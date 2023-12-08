import { tidy, mutate, groupBy,summarize, sum, filter, last} from '@tidyjs/tidy'

function gameEventSequenceToRows(game_events_sequence) {
    var stats_summary = {}
    for (const event of game_events_sequence) {
        if (!(event.gameId in stats_summary)){
            stats_summary[event.gameId] = {}
        }
        if (!(event.player.id in stats_summary[event.gameId])){
            stats_summary[event.gameId][event.player.id]= {
                "Name": event.player.playerName,
                "gameId": event.gameId,
                "playerId": event.player.id,
                "teamId":event.teamId,
                'Goal':0,
                'Assist':0,
                '2nd Assist':0,
                'D':0,
                'TA':0,
                'Drop':0,
                '':0,
            }
        }
        stats_summary[event.gameId][event.player.id][event.eventType] += 1
    }

    var data = []
    Object.keys(stats_summary).map(gameId => {
        Object.keys(stats_summary[gameId]).map(playerId => {
            data.push(stats_summary[gameId][playerId])
        })
    })
    return data
}

export default function preprocess(game_events_sequence, filter_func) {
    var rows = gameEventSequenceToRows(game_events_sequence)
    console.log(rows)
    rows = tidy(
        rows, 
        mutate({ "GC": d => d["Goal"] + d["Assist"] + d["2nd Assist"],
        "% pass": d => (1- (d["TA"] / ( d["TA"] +d[""] +d["Assist"] + d["2nd Assist"] ) )).toFixed(2) }),
      )
    
    const totals = tidy(
        rows,
        groupBy(['gameId', 'teamId'], [
          summarize({ total_gc: sum('GC'), total_touches: sum("")})
        ],  groupBy.object({ single: true }))
      )

    rows = tidy(
        rows,
        mutate({"% GC": d=> (d["GC"]/totals[d["gameId"]][d['teamId']]['total_gc']).toFixed(2),
        "% T": d=> (d[""]/totals[d["gameId"]][d['teamId']]['total_touches']).toFixed(2)
    })
    )
    rows = tidy(
        rows, filter(filter_func)
    )


    var graph = {}

    // var last_sequence_num = 0
    // var last_playerId = null

    // for (const event of game_events_sequence) {
    //     if (event.sequence < last_sequence_num) {
    //         last_playerId = null
    //         continue
    //     }
    //     if (last_playerId !== null) {
    //         if (!(last_playerId in graph)) {
    //             graph[last_playerId] = {}
    //         }
    //         if (!(event.player.id in graph[last_playerId])) {
    //             graph[last_playerId][event.player.id] = 0
    //         }
    //         graph[last_playerId][event.player.id] += 1
    //     }
    //     last_playerId = event.player.id
    // }

    return [rows, graph]
}
