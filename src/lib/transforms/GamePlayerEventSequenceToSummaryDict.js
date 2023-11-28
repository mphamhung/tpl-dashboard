export default function gamePlayerEventSequenceToSummaryDict(game_events_sequence) {
    var stats_summary = {}

    for (const event of game_events_sequence) {
        if (!(event.gameId in stats_summary)){
            stats_summary[event.gameId] = {}
        }
        if (!(event.player.id in stats_summary[event.gameId])){
            stats_summary[event.gameId][event.player.id]= {
                "Name": event.player.playerName,
                "Game Id": event.gameId,
                'Goal':0,
                'Assist':0,
                '2nd Assist':0,
                'D':0,
                'TA':0,
                'Drop':0,
                '':0,
                'gc':0,
            }
        }
        stats_summary[event.gameId][event.player.id][event.eventType] += 1
        stats_summary[event.gameId][event.player.id]['gc'] += (["Goal", "Assist", "2nd Assist" ].includes(event.eventType))
    }
    var GC_sum = {}
    var touches_sum = {}
    Object.keys(stats_summary).map(gameId =>{
        GC_sum[gameId] = 0
        touches_sum[gameId] = 0
        Object.keys(stats_summary[gameId]).map(playerId => {
            GC_sum[gameId]+=stats_summary[gameId][playerId]['gc']
            touches_sum[gameId]+=stats_summary[gameId][playerId]['']
        })
        Object.keys(stats_summary[gameId]).map(playerId => {
            stats_summary[gameId][playerId]["% GC"] = (stats_summary[gameId][playerId]['gc']/GC_sum[gameId])*100
            stats_summary[gameId][playerId]["% T"] = (stats_summary[gameId][playerId]['']/touches_sum[gameId]) * 100
        })
    })

    return stats_summary
}