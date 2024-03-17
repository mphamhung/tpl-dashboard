"use client";
import { useState } from "react";

export function DateSelect({ dates, selectedDate, setSelectedDate }) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setShowMore(!showMore)}>
        <div>Viewing Games for:</div>
        <div>{selectedDate && selectedDate.toDateString()}</div>
      </button>
      {showMore && (
        <div className="absolute bg-black flex flex-col h-80 overflow-auto">
          {dates.map((date) => {
            return (
              <button
                onClick={(e) => {
                  setSelectedDate(date);
                  setShowMore(false);
                }}
                className="p-2 hover:border-2 text-left"
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
