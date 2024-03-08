import Link from "next/link";

export default async function TeamBadges({ teamIds, prefix, params = null }) {
  return (
    <div className="grid grid-cols-5">
      <Link href={{ pathname: `/${prefix}` }}> {"<-"} </Link>
      {teamIds.map(({ teamId, teamName }) => {
        return (
          <Link
            key={teamId}
            href={{ pathname: `/${prefix}/${teamId}` }}
            className={
              params
                ? params.teamId == teamId
                  ? "col-span-2  bg-gray-700 rounded grid hover:bg-gray-500 border-2 border-w"
                  : "col-span-2  bg-gray-700 rounded grid hover:bg-gray-500"
                : " col-span-2 bg-gray-700 rounded grid hover:bg-gray-500"
            }
            justify="center"
          >
            {" "}
            {teamName}
          </Link>
        );
      })}
    </div>
  );
}
