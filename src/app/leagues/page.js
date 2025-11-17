import { loadGameInfo } from "@/lib/api";
import Link from "next/link";
import { tidy, distinct } from "@tidyjs/tidy";

export default async function Page() {
  const rows = await loadGameInfo();
  const leagueIds = tidy(rows, distinct("leagueId"))
    .map((d) => Number(d.leagueId))
    .sort((a, b) => b - a);
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
