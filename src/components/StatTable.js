import {getGameEvents} from '../lib/api-fetching'
import { useState, useEffect } from 'react'
import gameEventSequenceToSummaryDict from "../lib/transforms"

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const columns = [
    "Name",
    "Goal",
    'Assist',
    '2nd Assist',
    'D',
    'TA',
    'Drop',
    "",
]
export default function StatTable({rows}) {
    rows.sort(function(a, b){return a[""]- b[""] }).reverse()

    return (
        <TableContainer component={Paper}>
        <Table size="small" aria-label="customized table">
          <TableHead>
            <TableRow>
                {columns.map(key=> {
                    if (key == "Name") {
                        return <TableCell key={key}>{key}</TableCell>
                    }
                    else if (key == ""){
                       return <TableCell key={key} align='left' style={{padding: "5px"}} >Passes</TableCell>
                    }
                    else{
                        return <TableCell key={key} align='left' style={{padding: "5px"}} >{key}</TableCell>
                    }
                })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows && rows.map((row) => (
              <TableRow className="hover:bg-gray-200" key={row["Name"]}>
                {columns.map(key => {
                    return <TableCell key={key}  align="left" >{row[key]}</TableCell>
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      )
}
