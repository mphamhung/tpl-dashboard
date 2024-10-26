import { getLeagueIds } from "@/lib/api";
import Link from "next/link";
export default async function Page() {
  var leagueIds = await getLeagueIds();
  console.log(leagueIds);
  return (
    <>
      <div className="space-y-4">
        <main className="flex flex-col space-y-4">
          {leagueIds.map((leagueId) => {
            return (
              <Link
                key={leagueId}
                href={{ pathname: `/${leagueId}` }}
                className="grid grid-rows-4 grid-cols-4 h-auto rounded-lg gap-1 bg-slate-700 p-1"
                justify="center"
              >
                {" "}
                {leagueId}
              </Link>
            );
          })}
        </main>
      </div>
    </>
  );
}
