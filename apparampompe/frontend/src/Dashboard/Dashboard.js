import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import TableNormalGame from '../TableNormalGame/TableNormalGame';
import TableArenaMode from '../TableArenaMode/TableArenaMode';
import axios from 'axios';

function Dashboard() {

  const [matchData, setMatchData] = useState({});

  const gameName = "Kaao";
  const tag = "EUV";

  useEffect(() => {
    axios.get(`/api/riot/account/${gameName}/${tag}`)
      .then(response => {
        axios.get(`/api/riot/matches/${response.data.puuid}`)
          .then(response => {
            setMatchData(response.data);  // Mise à jour de l'état avec les données des matchs
          })
          .catch(console.error);
      })
      .catch(console.error);
  }, []);

  const gameMode = matchData.info?.gameMode

  return (
    <div className='containerTable'>
      {gameMode !== "CHERRY" ? (
        <TableNormalGame matchData={matchData} gameName={gameName} />
      ) : (
        <TableArenaMode matchData={matchData}/>
      )}
    </div>
  )
}
export default Dashboard;
