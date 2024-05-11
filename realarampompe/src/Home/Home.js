import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Home.css';
import TableNormalGame from '../TableNormalGame/TableNormalGame';
import TableArenaMode from '../TableArenaMode/TableArenaMode';
import { fetchRiotAccount, fetchLastMatch } from '../api'

function Home() {

  const location = useLocation();
  const [matchData, setMatchData] = useState([]);

  useEffect(() => {
    const gameName = location.state.gameName;
    const apiKey = "RGAPI-3b2e6303-647f-4e93-b5de-1dfd7c3c1a4e";
    const tagGame = location.state.tag;

    fetchRiotAccount(gameName, tagGame, apiKey)
      .then(data => {
        fetchLastMatch(data.puuid, apiKey)
          .then(data => {
            setMatchData(data);
            console.log(data);
          })
          .catch(console.error);
      })
      .catch(console.error);
  }, [location.state]);

  const gameMode = matchData.info?.gameMode

  return (
    <div className='containerTable'>
      {gameMode !== "CHERRY" ? (
        <TableNormalGame matchData={matchData} />
      ) : (
        <TableArenaMode matchData={matchData}/>
      )}
    </div>
  )
}
export default Home;
