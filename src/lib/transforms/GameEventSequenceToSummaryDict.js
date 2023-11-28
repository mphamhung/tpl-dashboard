export default function gameEventSequenceToSummaryDict(game_events_sequence) {
    var stats_summary = {}

    for (const event of game_events_sequence) {
        if (!(event.player.id in stats_summary)){
            stats_summary[event.player.id] = {
                "Name": event.player.playerName,
                'Goal':0,
                'Assist':0,
                '2nd Assist':0,
                'D':0,
                'TA':0,
                'Drop':0,
                '':0,
                'gc':0,
                'id': event.player.id,
            }
        }
        stats_summary[event.player.id][event.eventType] += 1
        stats_summary[event.player.id]['gc'] += (["Goal", "Assist", "2nd Assist" ].includes(event.eventType))
    }
    var GC_sum = 0
    var touches_sum = 0
    Object.keys(stats_summary).map(playerId => {
        GC_sum+=stats_summary[playerId]['gc']
        touches_sum+=stats_summary[playerId]['']
    })
    Object.keys(stats_summary).map(playerId => {
        stats_summary[playerId]["% GC"] = (stats_summary[playerId]['gc']/GC_sum)*100
        stats_summary[playerId]["% T"] = (stats_summary[playerId]['']/touches_sum) * 100
    })
    return stats_summary
}
