"use client";
import { useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import Link from "next/link";

export function Search({ player_list }) {
  const [value, setValue] = useState("");
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const filtered_players = player_list.filter(
      (p) => p.playerName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
    setPlayers(filtered_players);

    console.log(players);
  }, [value]);
  return (
    <div className="relative rounded-lg px-2">
      <input
        type="text"
        className="border-1 bg-slate-800 rounded-lg"
        placeholder="Type name..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {players.map((player) => (
        <div>
          <Link href={`/player/${player.id}`}>{player.playerName}</Link>
        </div>
      ))}
    </div>
  );
}
