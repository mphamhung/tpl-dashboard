"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
export default function TeamBadges({ teamIds, prefix, params = null }) {
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    let currTeamId = window.location.pathname.split("/").pop();
    teamIds.forEach((element) => {
      if (Number(currTeamId) == Number(element.teamId)) {
        setSelectedId(currTeamId);
      }
    });
  }, [window.location.pathname]);
  return (
    <div className="grid grid-cols-5 gap-1">
      <Link
        href={{
          pathname: selectedId ? `/${prefix}` : "/",
        }}
        className="row-span-2 text-center p-2"
        onClick={(e) => setSelectedId(null)}
      >
        {" "}
        {"<-"}{" "}
      </Link>
      {teamIds.map(({ teamId, teamName }) => {
        return (
          <Link
            key={teamId}
            href={{ pathname: `/${prefix}/${teamId}` }}
            className={
              teamId == selectedId
                ? "col-span-2  bg-gray-700 border-2 rounded grid hover:bg-gray-500 h-12 line-clamp-2 px-2"
                : "col-span-2  bg-gray-700 rounded grid hover:bg-gray-500 h-12 line-clamp-2 px-2"
            }
            onClick={(e) => setSelectedId(teamId)}
            justify="center"
            scroll={false}
          >
            {" "}
            {teamName}
          </Link>
        );
      })}
    </div>
  );
}
