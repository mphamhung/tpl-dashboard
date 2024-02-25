import GamesList from  '@/components/GamesList'
export default async function Home({params}) {
  return (
    <>
    <div >
    <main className="flex flex-row flex-grow">
          <GamesList leagueId={params.leagueId}/>
    </main>
    </div>
    </>
  )
}