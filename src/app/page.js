import GamesList from '@/components/GamesList'

const defaultLeagueId = "778"
export default function Home() {
  return (
    <>
    <div >
    <main className="flex flex-row flex-grow">
          <GamesList leagueId={defaultLeagueId}/>
    </main>
    </div>
    </>
  )
}