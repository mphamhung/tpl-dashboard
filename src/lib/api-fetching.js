const leagueId = process.env.leagueId
const serverUrl = process.env.serverUrl

const mysql = require('mysql2')

// Create the connection to the database
const connection = mysql.createConnection(process.env.DATABASE_URL)



export async function getGames() {
    const res = await fetch(serverUrl+ 'games/' + leagueId, {cache:'no-store'}) 
    // Revalidate every day
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
}


export async function getGameEvents(gameId, teamId) {
      // simple query
    connection.query('show tables', function (err, results, fields) {
      console.log(results) // results contains rows returned by server
      console.log(fields) // fields contains extra metadata about results, if available
    })

    // Example with placeholders
    connection.query('select 1 from dual where ? = ?', [1, 1], function (err, results) {
      console.log(results)
    })


    const res = await fetch(serverUrl+'gameEvents/'+gameId+"/"+teamId, )
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
   
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }

    const fetched_data = await res.json()

    var events = []
    Object.keys(fetched_data).map(idx => events.push(fetched_data[idx]))
    events.sort(function(a, b){return a.sequence - b.sequence})

    return events
  }

export async function getGameEventsByGameId(gameId) {
  const games = await getGames()

  const g = games.find(game => game['id'] === gameId)

  const homeTeamEvents = await getGameEvents(g.id, g.homeTeamId)
  const awayTeamEvents = await getGameEvents(g.id, g.awayTeamId)

  return [homeTeamEvents, awayTeamEvents]
}
  

export async function getAllGameEvents() {
  const games = await getGames()

  var flattened_games = []
  for (const game of games) {
    flattened_games.push({gameId: game.id, teamId: game.awayTeamId})
    flattened_games.push({gameId: game.id, teamId: game.homeTeamId})
  }

  var events = await Promise.all(flattened_games.map( async ({gameId, teamId}) => {
    return getGameEvents(gameId, teamId)
  }))

  return events.flat(1)
}


export async function getPlayerGameEvents(playerId) {
  const allEvents = await getAllGameEvents()

  var games_played = new Set()
  allEvents.map(event=>{
    if (event.player.id == playerId) {
      games_played.add(event.gameId)}
    }
    )
  const playerEvents = allEvents.filter(event => games_played.has(event.gameId))
  return playerEvents
}