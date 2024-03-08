import Link from "next/link";
import { ScoreCard } from "./ScoreCard";

export default async function TeamBadges({ teamIds, prefix, params = null }) {
  return (
    <div className="grid grid-cols-5 gap-1">
      <Link
        href={{
          pathname: `/${prefix}`,
        }}
        className="row-span-2 "
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
              "col-span-2  bg-gray-700 rounded grid hover:bg-gray-500 h-12 line-clamp-2"
            }
            justify="center"
          >
            {" "}
            {teamName}
          </Link>
        );
      })}
      <div className="col-span-4">
        <ScoreCard
          gameId={params.gameId}
          homeTeamId={teamIds[0].teamId}
          awayTeamId={teamIds[1].teamId}
        />
      </div>
    </div>
  );
}
