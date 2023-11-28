const leagueId = process.env.leagueId
const serverUrl = process.env.serverUrl

export async function getGames() {
    const res = await fetch(serverUrl+ 'games/' + leagueId)
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
   
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
   
    return res.json()
}


export async function getGameEvents(gameId, teamId) {
    const res = await fetch(serverUrl+'gameEvents/'+gameId+"/"+teamId)
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

export async function getScore(gameId) {
  const res = await fetch(serverUrl+'gameEvents/'+gameId+"/"+teamId)
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
 
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
  

export async function getGameEventsForPlayer(gameId, teamId) {
  return null
}