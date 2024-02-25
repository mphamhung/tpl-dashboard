import GamesList from '@/components/GamesList'
import {GetLeagueIds} from '@/lib/preprocess'
import Link from 'next/link'
export default async function Page() {
    var leagueIds = await GetLeagueIds()
    leagueIds = leagueIds.filter((row) => Number(row.leagueId) > 700) // filter newer leagues
  return (
    <>
    <div >
    <main className="flex flex-row flex-grow">
        {leagueIds.map(o => {
                return <Link key={o.leagueId} href={{pathname:`/${o.leagueId}`}} 
                className='basis-1/2 h-12 bg-gray-700 rounded grid hover:bg-gray-500'
                justify="center"
                > {o.leagueId} 
                </Link>
        })
        }
    </main>
    </div>
    </>
  )
}