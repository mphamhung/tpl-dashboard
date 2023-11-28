import Link from 'next/link'
import {getGames} from '../lib/api-fetching'


const GameCard = ({id, teamId, teamName}) => (
    <Link key={id+teamId} href={{pathname:`/game/${id}/${teamId}`}} 
    className='basis-1/2 h-12 bg-gray-700 rounded grid hover:bg-gray-500'
    justify="center"
    >
        <div className='m-1 text-sm overflow-hidden'>
            {teamName}   

        </div>
    </Link>
  );

export default async function GamesList() {
    const games = await getGames()
    var games_by_date = {}
    var games_by_id = {}

    for (const game of games) {
        if (!(game.date in games_by_date)) {
            games_by_date[game.date] = []
        }
        games_by_date[game.date].push(game.id)

    }



    for (const game of games) {
        games_by_id[game.id]= game
    }
    
    return (
        <div className='grow justify-between space-y-4'>
            {Object.keys(games_by_date).reverse().map(date => <div key={date}> <h1 className='grid justify-items-center'>{date}</h1>{games_by_date[date].map(gameId => {
                const game = games_by_id[gameId]
                return (
                    <section key={gameId} className='flex flex-row m-2 space-x-4'>
                        <GameCard  id={game.id} teamId={game.awayTeamId} teamName={game.awayTeam}/> 
                        <GameCard  id={game.id} teamId={game.homeTeamId} teamName={game.homeTeam}/>
                     </section>
                ) 
            })}
            </div>
            )}
         </div>    
    );
  };
  