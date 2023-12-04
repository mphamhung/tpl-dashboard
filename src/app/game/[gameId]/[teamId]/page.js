'use client'

import {getGameEvents} from '@/lib/api-fetching'
import preprocess from '@/lib/preprocess'
import StatTable from '@/components/StatTable'
import {BarContributions, ScatterContributions} from '@/components/Contributions'
import { Suspense } from 'react';

import { useState, useEffect } from 'react';

export default function Page({params}) {
  const [events, setEvents] = useState([])
  const [rows, _] = preprocess(events, (d) => true)
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

  useEffect(() => {
    getGameEvents(params.gameId, params.teamId).then(events => {
      setEvents(events)
    })
    
  }, [params.gameId, params.teamId]);
  return (
    <Suspense>
      <StatTable rows={rows} columns={columns} />
      <BarContributions rows={rows} />
      <ScatterContributions rows={rows} />
    </Suspense>
  )
}