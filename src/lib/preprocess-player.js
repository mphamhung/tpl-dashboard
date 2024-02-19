
import {getAllGameEvents} from '@/lib/api-fetching'
import {getGameTable} from '@/lib/preprocess'
import connection from '@/lib/db/db'

export default async function getPlayerGameEvents(playerId, use_cache) {
    let results = await connection.query(`select * from GAME_ROWS where playerId = ${playerId};`)
    .then(async ([results, fields]) => {
        if (!use_cache) {
            let game_tables = await getAllGameEvents()
            let rows = await Promise.all(results.map( async ({gameId, teamId}) => {
                        return getGameTable(gameId, teamId)
                      }))
            console.log()
            // then(
            //     events => {
            //         return Promise.all(results.map( async ({gameId, teamId}) => {
            //             return getGameTable(gameId, teamId)
            //           }))
            //     }
            // ).then(events => events)
             
            return rows.flat(1).filter(row => row.playerId == playerId)
            // return game_tables.filter(row => row.playerId == playerId)
          } else{
            return results
          }
        
            // console.log(rows)
        })
    
    return results
    }