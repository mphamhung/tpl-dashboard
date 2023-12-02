'use client'

import {getGames} from '@/lib/api-fetching'
import { Suspense } from 'react';
import ScoreCard from '@/components/ScoreCard';

export default async function Page({params}) {
    const games = await getGames()

    const game = games.find(game => game['id'] === params.gameId)

    return (
      <Suspense>
        <ScoreCard game={game}/>
      </Suspense>
    )
}