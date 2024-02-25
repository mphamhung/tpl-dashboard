const serverUrl = process.env.serverUrl

export async function getGames(leagueId) {
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
    const res = await fetch(serverUrl+'gameEvents/'+gameId+"/"+teamId, )

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

  return flattened_games
}

// export async function getGamesMetadata() {
//   const res = await fetch(serverUrl+'games')
//   if (!res.ok) {
//     // This will activate the closest `error.js` Error Boundary
//     throw new Error('Failed to fetch data')
//   }

//   const fetched_data = await res.json()
//   return fetched_data
// }
