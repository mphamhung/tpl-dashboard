"use client";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState, Fragment, useEffect } from "react";
import SortBy from "sort-by";
import Link from "next/link";

function Abbr(string) {
  if (string == "name") {
    return string;
  }

  if (string == "throwaways") {
    return "ta";
  }
  if (string == "drops") {
    return "dr";
  }
  if (string == "other_passes") {
    return "t";
  }
  console.log(string.replace("_", " ").replace("second", "2"));
  return ""
    .concat(
      string
        .replace("_", " ")
        .replace("second", "2")
        .split(" ")
        .map((substring) => substring[0])
    )
    .replace(",", "");
}

function Row(props) {
  const {
    row,
    primary_columns,
    secondary_columns,
    defaultOpen,
    setSortKey,
    idx,
  } = props;
  const [open, setOpen] = useState(false);

  const secondary_columns_processed = secondary_columns.filter(
    (key) => !["name", "player page"].includes(key)
  );
  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);

  return (
    <Fragment>
      <TableRow
        onClick={() => setOpen(!open)}
        className={`${idx % 2 ? "bg-slate-200" : ""}`}
      >
        <TableCell>
          <IconButton className="w-2 p-0">
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {primary_columns.map((key, idx) => {
          if (idx == 0) {
            return (
              <TableCell align="left" className="p-0 text-xs">
                {row[key]}
              </TableCell>
            );
          }
          return (
            <TableCell align="left" className="text-xs">
              {row[key]}
            </TableCell>
          );
        })}
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
            paddingLeft: 2,
            paddingRight: 2,
          }}
          colSpan={primary_columns.length + 2}
          className={`border-0 w-full text-xs ${idx % 2 ? "bg-slate-100" : ""}`}
        >
          <Collapse
            className="overflow-auto"
            in={open}
            timeout="auto"
            unmountOnExit
          >
            <div className="grid grid-cols-2 grid-flow-row gap-y-2 gap-x-3 p-2 border-2">
              {secondary_columns_processed.map((key) => (
                <div className="row-span-1 grid grid-cols-4 gap-2">
                  <div
                    className="truncate col-span-3"
                    onClick={(e) => {
                      setSortKey(key);
                    }}
                  >
                    {key.replace("_", " ")}
                  </div>
                  <div className="truncate">{row[key]}</div>
                </div>
              ))}
              {secondary_columns.includes("player page") ? (
                <div className="flex justify-around col-span-2 underline text-blue-600 hover:text-blue-800 visited:text-purple-600">
                  <Link href={`/player/${row["player page"]}`}>
                    {" "}
                    View Player Profile
                  </Link>
                </div>
              ) : (
                <></>
              )}
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}
export function CollapsableStatTable({
  rows,
  primary_columns,
  secondary_columns,
}) {
  const [sortKey, setSortKey] = useState("");
  const [reverse, setReverse] = useState(false);
  const [defaultOpen, setDefaultOpen] = useState(false);

  rows.sort((a, b) => a[sortKey] - b[sortKey]);
  if (reverse) {
    rows.reverse();
  }

  return (
    <TableContainer component={Paper}>
      <div className="flex flex-row-reverse px-10 py-1 text-xs ">
        <div onClick={() => setDefaultOpen(!defaultOpen)}>
          {" "}
          {defaultOpen ? "Collapse All" : "Expand All"}
        </div>
      </div>
      <Table aria-label="collapsible table" size="small">
        <TableHead>
          <TableRow>
            <TableCell className="w-2 p-0 m-0"></TableCell>
            {primary_columns.map((key) => (
              <TableCell
                onClick={() => {
                  setSortKey(key);
                  setReverse(sortKey == key ? !reverse : reverse);
                }}
                className="text-s"
              >
                {Abbr(key)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <Row
              key={row.name}
              row={row}
              primary_columns={primary_columns}
              secondary_columns={secondary_columns}
              defaultOpen={defaultOpen}
              setSortKey={setSortKey}
              idx={idx}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
