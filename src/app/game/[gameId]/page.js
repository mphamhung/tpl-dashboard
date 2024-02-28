import {getGamesMetadata} from '@/lib/api-fetching'
import { Suspense } from 'react';
import ScoreCard from '@/components/ScoreCard';
import Forecast from '@/components/Forecast'

export default async function Page({params}) {
    const game_metadata = await getGamesMetadata()
    const [game, _] = game_metadata.filter(game => Number(game.id) === Number(params.gameId))

    return (
      <Suspense>
        <ScoreCard game={game}/>
        <Forecast game={game}/>
      </Suspense>
    )
}