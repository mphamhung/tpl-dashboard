import GamesList from "@/components/GamesList";
import { Suspense } from "react";
/**
 * Page to display a list of games
 * @param {Object} params the paramter from routing
 * @return {*}
 */
export default async function Home({ params }) {
  return (
    <div>
      <main className="flex flex-row flex-grow">
        <Suspense fallback={<p>Loading...</p>}>
          <GamesList leagueId={params.leagueId} />
        </Suspense>
      </main>
    </div>
  );
}
