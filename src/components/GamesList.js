'use client'
import Link from 'next/link'
import {getGames} from '../lib/api-fetching'
import ScoreCard from './ScoreCard';
import { useState, useEffect } from 'react';

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

export default function GamesList() {
    const [gamesByDate, setGamesByDate] = useState()
    const [gamesByID, setGamesByID] = useState()

    useEffect(() => {
        getGames().then(games => {
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
            setGamesByDate(games_by_date)
            setGamesByID(games_by_id)
            })
        
      }, []);

    if (!gamesByDate){
        return <></>
    }

    return (
        <div className='grow justify-between space-y-4'>
            {Object.keys(gamesByDate).reverse().map(date => <div key={date}> <h1 className='grid justify-items-center'>{date}</h1>{gamesByDate[date].map(gameId => {
                const game = gamesByID[gameId]
                return (
                    <section key={gameId} className='flex flex-row m-2 space-x-4'>
                        <GameCard  id={game.id} teamId={game.homeTeamId} teamName={game.homeTeam}/> 
                        <ScoreCard game={game}/>
                        <GameCard  id={game.id} teamId={game.awayTeamId} teamName={game.awayTeam}/>
                     </section>
                ) 
            })}
            </div>
            )}
         </div>    
    );
  };
  