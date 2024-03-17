"use client";
import { useState } from "react";

import { tidy, distinct, mutate } from "@tidyjs/tidy";
import { GameCard } from "./GameCard";
import { DateSelect } from "./DateSelect";
export default function GameListByDate({ gamelist }) {
  gamelist = tidy(
    gamelist,
    mutate({
      displayDate: (d) =>
        new Date(d["date"]).toLocaleString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }),
      gameTime: (d) => Number(d["time"].split(":")[0]) - 12, //Convert to pm game
    })
  );

  gamelist.sort((a, b) => a.gameTime - b.gameTime);
  const dates = tidy(gamelist, distinct("date")).map(
    (row) => new Date(row.date)
  );
  const [selectedDate, setSelectedDate] = useState(dates[0]);

  const selectedGames = gamelist.filter(
    (game) => new Date(game.date).getTime() == selectedDate.getTime()
  );
  return (
    <div className="space-y-4">
      <div className="flex justify-center ">
        <DateSelect
          dates={dates}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>
      <div className="flex flex-col space-y-4">
        {selectedDate &&
          selectedGames.map((game) => {
            return <GameCard game={game} />;
          })}
      </div>
    </div>
  );
}
