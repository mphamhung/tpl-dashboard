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

function Row(props) {
  const { row, primary_columns, secondary_columns, defaultOpen } = props;
  const [open, setOpen] = useState(false);

  const secondary_columns_processed = secondary_columns.filter(
    (key) => key != "name"
  );
  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);
  return (
    <Fragment>
      <TableRow onClick={() => setOpen(!open)}>
        <TableCell>
          <IconButton className="w-4 ">
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {primary_columns.map((key) => (
          <TableCell align="left" className="">
            {row[key]}
          </TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse
            className="overflow-auto"
            in={open}
            timeout="auto"
            unmountOnExit
          >
            <div className="grid grid-cols-2 grid-flow-row bg-slate-50 gap-y-2 gap-x-3">
              {secondary_columns_processed.map((key) => (
                <div className="row-span-1 grid grid-cols-4 gap-2">
                  <div className="truncate col-span-3">
                    {key.replace("_", " ")}
                  </div>
                  <div className="truncate">{row[key]}</div>
                </div>
              ))}
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
      <div className="flex justify-around">
        <div>table v2</div>
        <div onClick={() => setDefaultOpen(!defaultOpen)}>
          {" "}
          {defaultOpen ? "Collapse All" : "Expand All"}
        </div>
      </div>
      <Table aria-label="collapsible table" size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {primary_columns.map((key) => (
              <TableCell
                onClick={() => {
                  setSortKey(key);
                  setReverse(sortKey == key ? !reverse : reverse);
                }}
              >
                {key}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row
              key={row.name}
              row={row}
              primary_columns={primary_columns}
              secondary_columns={secondary_columns}
              defaultOpen={defaultOpen}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
