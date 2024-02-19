import { tidy, sum } from '@tidyjs/tidy'
import Link from 'next/link'

import {getGameTable} from '@/lib/preprocess'

export default async function ScoreCard({game}) {
    const homeTeamEvents = await getGameTable(game.id, game.homeTeamId)
    const awayTeamEvents = await getGameTable(game.id, game.awayTeamId)

    const homeScore = tidy(
        homeTeamEvents,
        sum("goals"),
    )
    const awayScore = tidy(
        awayTeamEvents,
        sum("goals")
    )

    return (        
        <Link href={{pathname:`/game/${game.id}`}}>
        <div align='center' justify='center' className='whitespace-nowrap'>
        {homeScore} : {awayScore}
        </div>          
        </Link>
     )
    }