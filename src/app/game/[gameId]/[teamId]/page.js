import {GameTable} from '@/lib/preprocess'
import StatTable from '@/components/StatTable'
import {StackedBar, ScatterPlot} from '@/components/Contributions'
import { Suspense } from 'react';

export default async function Page({params}) {
  // const events = await getGameEvents(params.gameId, params.teamId)
  const rows = await GameTable(params.gameId, params.teamId)
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
      <StackedBar rows={rows} keys={['% GC','% T']} sort_key='% total'/>
      <ScatterPlot rows={rows} x_key={'% GC'} y_key={'% T'}/>
      <StackedBar rows={rows} keys={['throwaways','other_passes']} sort_key='other_passes'/>
      <StackedBar rows={rows} keys={['blocks']} sort_key='blocks'/>
      
    </Suspense>
  )
}