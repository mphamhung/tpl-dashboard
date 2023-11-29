'use clients'
import {getGameEvents} from '@/lib/api-fetching'
import preprocess from '@/lib/preprocess'
import StatTable from '@/components/StatTable'
import {BarContributions, ScatterContributions} from '@/components/Contributions'
import { Suspense } from 'react';


export default async function Page({params}) {
    const events = await getGameEvents(params.gameId, params.teamId);
    const rows = preprocess(events, (d) => true)
    const columns = [
      "Name",
      "Goal",
      'Assist',
      '2nd Assist',
      'D',
      'TA',
      'Drop',
      "",
      "% pass",
    ]

    return (
      <Suspense>
        <StatTable rows={rows} columns={columns} />
        <BarContributions rows={rows} />
        <ScatterContributions rows={rows} />
      </Suspense>
    )
}