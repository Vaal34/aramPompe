import React, { useState, useEffect } from 'react';
import './Match.css';
import TableNormalGame from '../TableNormalGame/TableNormalGame';
import TableArenaMode from '../TableArenaMode/TableArenaMode';
import axios from 'axios';

function Match() {
  const [matchData, setMatchData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [pompes, setPompes] = useState(0);

  let targetPompes = 45;
  let interval = null;

  useEffect(() => {
    if (pompes < targetPompes) {
      const delay = 200 * (1 - pompes / targetPompes);
      interval = setTimeout(() => {
        setPompes(pompes + 1);
      }, delay);
    }

    return () => clearTimeout(interval);
  }, [pompes]);

  const userName = "Kaao";
  const tagGame = "EUV";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const accountResponse = await axios.get(`/api/riot/account/${userName}/${tagGame}`);
        const matchesResponse = await axios.get(`/api/riot/matches/${accountResponse.data.puuid}`);
        await new Promise(resolve => setTimeout(resolve, 1500));
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
  }


  return (
      <div className='Match'>
        <div className='section section1'>
          <div>
            {gameMode !== "CHERRY" ? (
              <TableNormalGame matchData={matchData} gameName={userName} />
              ) : (
                <TableArenaMode matchData={matchData}/>
                )}
          </div>
        </div>

        <div className='section section2'>
          <h1>Pompes</h1>
          <p>Nombre de pompes réalisées par les joueurs</p>
          <p>{pompes}</p>
        </div>
        <div className='section section3'></div>
        <div className='section section4'></div>
      </div>
  );
}

export default Match;