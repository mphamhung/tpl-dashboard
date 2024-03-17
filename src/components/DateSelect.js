"use client";
import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
export function DateSelect({ dates, selectedDate, setSelectedDate }) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="relative bg-slate-800 rounded-lg px-2">
      <button onClick={() => setShowMore(!showMore)} className="flex flex-row">
        <div className="text-left">
          <div>Viewing Games for:</div>
          <div className="flex flex-row">
            <div>{selectedDate && selectedDate.toDateString()}</div>
            <div>
              {showMore ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </div>
          </div>
        </div>
      </button>
      {showMore && (
        <div className="absolute bg-black flex flex-col h-80 overflow-auto gap-1 mx-1">
          {dates.map((date) => {
            return (
              <button
                onClick={(e) => {
                  setSelectedDate(date);
                  setShowMore(false);
                }}
                className="p-2 bg-slate-800 text-left"
              >
                {date.toDateString()}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
