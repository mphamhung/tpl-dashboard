import GamesList from "@/components/GamesList";
import { Suspense } from "react";

export default async function Home({ params }) {
  return (
    <>
      <div>
        <main className="flex flex-row flex-grow">
          <Suspense fallback={<p>Loading...</p>}>
            <GamesList leagueId={params.leagueId} />
          </Suspense>
        </main>
      </div>
    </>
  );
}
