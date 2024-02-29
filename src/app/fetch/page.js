import GamesList from "@/components/GamesList";
import { GamesMetadata } from "@/lib/preprocess";

const defaultLeagueId = "778";
export default async function Home() {
  let a = await GamesMetadata();
  return (
    <>
      <div>
        <main className="flex flex-row flex-grow">
          <GamesList leagueId={defaultLeagueId} />
        </main>
      </div>
    </>
  );
}
