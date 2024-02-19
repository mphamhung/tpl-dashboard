import {getGameTable} from '@/lib/preprocess'
import StatTable from '@/components/StatTable'
import {BarContributions, ScatterContributions} from '@/components/Contributions'
import { Suspense } from 'react';

export default async function Page({params}) {
  // const events = await getGameEvents(params.gameId, params.teamId)
  const rows = await getGameTable(params.gameId, params.teamId)
  // console.log(rows)
  // const [rows, _] = preprocess(events, (d) => true)
  const columns = [
    "name",
    "goals",
    "assists",
    "second_assists",
    "blocks",
    "throwaways",
    "drops",
    "other_passes",
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