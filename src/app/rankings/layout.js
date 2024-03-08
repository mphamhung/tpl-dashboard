import { GetLeagueIds } from "@/lib/preprocess";
import LeagueBadges from "@/components/LeagueBadges";
export default async function RankingsLayout({
  children, // will be a page or nested layout
}) {
  var leagueIds = await GetLeagueIds();
  leagueIds = leagueIds
    .map((row) => Number(row.leagueId))
    .filter((leagueId) => leagueId > 700); // filter newer leagues

  return (
    <>
      <LeagueBadges leagueIds={leagueIds} prefix={"rankings"} />
      <section>
        {/* Include shared UI here e.g. a header or sidebar */}
        {children}
      </section>
    </>
  );
}
