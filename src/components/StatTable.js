'use client'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import React
 from 'react';

export default function StatTable({rows , columns}) {
    const [hydrated, setHydrated] = React.useState(false);
    const [sortKey, setSortKey] = React.useState("")
    const [reverse, setReverse] = React.useState(false)

    React.useEffect(() => {
        setHydrated(true);
    }, []);

    if (!hydrated) {
        // Returns null on first render, so the client and server match
        return null;
    }
    rows.sort(function(a, b){return a[sortKey]- b[sortKey]})
    if (reverse) {
      rows.reverse()
    }
    console.log(sortKey)
    return (
        <TableContainer component={Paper}>
        <Table size="small" aria-label="customized table">
          <TableHead>
            <TableRow>
                {columns.map(key=> {
                    if (key == "Name") {
                        return <TableCell key={key} onClick={ _ => {setSortKey(key);setReverse(!reverse);}}>{key}</TableCell>
                    }
                    else if (key == ""){
                       return <TableCell key={key} align='left' style={{padding: "5px"}} onClick={ _ => {setSortKey(key);setReverse(!reverse);}}>Passes</TableCell>
                    }
                    else{
                        return <TableCell key={key} align='left' style={{padding: "5px"}} onClick={ _ => {setSortKey(key);setReverse(!reverse);}}>{key}</TableCell>
                    }
                })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows && rows.map((row) => (
              <TableRow className="hover:bg-gray-200" key={row["Name"]} >
                {columns.map(key => {
                    if (key == "Name") {
                      return <TableCell key={key}  align="left" ><a href={"/player/"+row["id"]}>
                        {row[key]}
                        </a></TableCell>
                    }
                    else {
                      return <TableCell key={key}  align="left" >{row[key]}</TableCell>
                    }
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      )
}
