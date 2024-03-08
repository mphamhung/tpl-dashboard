import Link from "next/link";

export default async function LeagueBadges({
  leagueIds,
  prefix,
  params = null,
}) {
  return (
    <div className="flex justify-around">
      {leagueIds.map((leagueId) => {
        return (
          <Link
            key={leagueId}
            href={{ pathname: `/${prefix}/${leagueId}` }}
            className={
              params
                ? params.leagueId == leagueId
                  ? "basis-1/2 h-12 bg-gray-700 rounded grid hover:bg-gray-500 border-2 border-w"
                  : "basis-1/2 h-12 bg-gray-700 rounded grid hover:bg-gray-500"
                : "basis-1/2 h-12 bg-gray-700 rounded grid hover:bg-gray-500"
            }
            justify="center"
          >
            {" "}
            {leagueId}
          </Link>
        );
      })}
    </div>
  );
}
