import React, { useState, useEffect } from 'react';
import './Match.css';
import TableNormalGame from '../TableNormalGame/TableNormalGame';
import TableArenaMode from '../TableArenaMode/TableArenaMode';
import axios from 'axios';

function Match() {
  const [matchData, setMatchData] = useState({});
  const [isLoading, setIsLoading] = useState(true); // New state for tracking loading status

  const userName = "Kaao";
  const tagGame = "euv";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const accountResponse = await axios.get(`/api/riot/account/${userName}/${tagGame}`);
        const matchesResponse = await axios.get(`/api/riot/matches/${accountResponse.data.puuid}`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setMatchData(matchesResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const gameMode = matchData.info?.gameMode;

  if (isLoading) {
    return (
      <div className='loading'>
        <img src={require("../assets/loading.gif")} alt="GIF de chargement"></img>
      </div>
    );
  } else {
    return (
      <div className='containerTable'>
        {gameMode !== "CHERRY" ? (
          <TableNormalGame matchData={matchData} gameName={userName} />
        ) : (
          <TableArenaMode matchData={matchData}/>
        )}
      </div>
    );
  }
}

export default Match;