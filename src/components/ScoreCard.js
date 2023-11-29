import { tidy, sum } from '@tidyjs/tidy'
import {getGameEvents} from '@/lib/api-fetching'
import Link from 'next/link'

import preprocess from '@/lib/preprocess'

export default async function ScoreCard({game}) {
    const homeTeamEvents = await getGameEvents(game.id, game.homeTeamId)
    const awayTeamEvents = await getGameEvents(game.id, game.awayTeamId)
    // // const [homeTeamEvents, awayTeamEvents] = await getGameEventsByGameId(gameId);

    const [rowsH, graphH] = preprocess(homeTeamEvents, (d) => true)
    const [rowsA, graphA] = preprocess(awayTeamEvents, (d) => true)

    const homeScore = tidy(
        rowsH,
        sum("Goal"),
    )
    const awayScore = tidy(
        rowsA,
        sum("Goal")
    )

    return (        
        <Link href={{pathname:`/game/${game.id}`}}>
        <div align='center' justify='center' className='whitespace-nowrap'>
        {homeScore} : {awayScore}
        </div>          
        </Link>
     )
    }