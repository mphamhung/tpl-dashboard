import { tidy, sum } from '@tidyjs/tidy'
import {getGameEvents} from '@/lib/api-fetching'
import Link from 'next/link'

import preprocess from '@/lib/preprocess'

const EndOfP = ["Goal" , "TA", "Drop"]
export default async function PlayByPlay({game}) {
    const homeTeamEvents = await getGameEvents(game.id, game.homeTeamId)
    const awayTeamEvents = await getGameEvents(game.id, game.awayTeamId)
    // // const [homeTeamEvents, awayTeamEvents] = await getGameEventsByGameId(gameId);

    var homePosessions = []
    var j = 0
    for (var i = 0; i < homeTeamEvents.length; i++) {
        if (EndOfP.includes(homeTeamEvents[i].eventType) ) {
            // console.log(homeTeamEvents[i])
            homePosessions.push(homeTeamEvents.slice(j,i+1))
            j = i+1
        }
    }

    return (        
        <>
        hello
        </>
     )
    }