import Link from 'next/link'

async function getGames() {
    const res = await fetch('https://tplapp.onrender.com/games/764')
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
   
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
   
    return res.json()
  }
   

const GameCard = ({id, teamId, teamName}) => (
    <Link href={{pathname:`/game/${id}/${teamId}`}} className="w-1/2 h-[50px] bg-gray-700 rounded">
        {teamName}   
    </Link>
  );

export default async function Games() {
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
        <div>
            {Object.keys(games_by_date).map(date => <div> <h1>{date}</h1>{games_by_date[date].map(gameId => {
                const game = games_by_id[gameId]
                return (
                    <section className="flex my-4 px-4 gap-3">
                    <GameCard id={game.id} teamId={game.awayTeamId} teamName={game.awayTeam}/> vs <GameCard id={game.id} teamId={game.homeTeamId} teamName={game.homeTeam}/>
                     </section>
                ) 
            })}
            </div>
            )}
         </div>    
    );
  };
  