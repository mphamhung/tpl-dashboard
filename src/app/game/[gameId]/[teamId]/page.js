'use client'
import {getGameEvents} from '@/lib/api-fetching'
import { useState, useEffect } from 'react'
import gameEventSequenceToSummaryDict from "@/lib/transforms"

import StatTable from '@/components/StatTable'
import {BarContributions, ScatterContributions} from '@/components/Contributions'

export default function Page({params}) {
    const [rows, setRows] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            const events = await getGameEvents(params.gameId, params.teamId);
            const statSummaryDict = gameEventSequenceToSummaryDict(events)
            const rows = Object.keys(statSummaryDict).map(playerId => statSummaryDict[playerId])
            setRows(rows);
          };
        fetchData();
      }, [params]);

    return (
        rows&&
      <>
        <StatTable rows={rows} />
        <BarContributions rows={rows} />
        <ScatterContributions rows={rows} />
      </>
    )
}