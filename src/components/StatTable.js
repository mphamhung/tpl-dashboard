"use client";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import React from "react";

import SortBy from "sort-by";
export default function StatTable({ rows, columns }) {
  const [hydrated, setHydrated] = React.useState(false);
  const [sortKey, setSortKey] = React.useState("");
  const [reverse, setReverse] = React.useState(false);

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return null;
  }
  rows.sort(SortBy(sortKey));
  if (reverse) {
    rows.reverse();
  }
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="customized table">
        <TableHead>
          <TableRow>
            {columns.map((key, idx) => {
              if (key == "name") {
                return (
                  <TableCell
                    style={{ position: "sticky", left: 0, background: "white" }}
                    key={String(key) + String(idx)}
                    onClick={(_) => {
                      setSortKey(key);
                      setReverse(sortKey == key ? !reverse : reverse);
                    }}
                  >
                    {key}
                  </TableCell>
                );
              } else {
                return (
                  <TableCell
                    key={String(key) + String(idx)}
                    align="left"
                    style={{ padding: "5px" }}
                    onClick={(_) => {
                      setSortKey(key);
                      setReverse(sortKey == key ? !reverse : reverse);
                    }}
                  >
                    {key}
                  </TableCell>
                );
              }
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows &&
            rows.map((row, idx) => (
              <TableRow
                className="hover:bg-gray-200"
                key={
                  row["gameId"] + row["teamId"] + row["playerId"] + String(idx)
                }
              >
                {columns.map((key, idx) => {
                  if (key == "name") {
                    return (
                      <TableCell
                        style={{
                          position: "sticky",
                          left: 0,
                          background: "white",
                        }}
                        key={String(key) + String(idx)}
                        align="left"
                      >
                        <a href={"/player/" + row["playerId"]}>{row[key]}</a>
                      </TableCell>
                    );
                  } else if (key == "gameId") {
                    return (
                      <TableCell key={String(key) + String(idx)} align="left">
                        <a href={"/game/" + row["gameId"]}>{row[key]}</a>
                      </TableCell>
                    );
                  } else if (key == "date") {
                    return (
                      <TableCell key={String(key) + String(idx)} align="left">
                        {new Date(row[key]).toLocaleDateString("en-US", {
                          month: "numeric",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                    );
                  } else {
                    return (
                      <TableCell key={String(key) + String(idx)} align="left">
                        {row[key]}
                      </TableCell>
                    );
                  }
                })}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
