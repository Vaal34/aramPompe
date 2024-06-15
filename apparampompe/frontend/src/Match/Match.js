import React, { useState, useEffect } from 'react';
import './Match.css';
import TableNormalGame from '../TableNormalGame/TableNormalGame';
import TableArenaMode from '../TableArenaMode/TableArenaMode';
import axios from 'axios';
import Classement from './Classement/Classement';
import MatchLive from './MatchLive/MatchLive';
import PompeComponent from './PompeComponent/PompeComponent';

function Match() {
  const [matchData, setMatchData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const targetprofile = document.cookie.match('(^|;)\\s*targetprofile\\s*=\\s*([^;]+)')?.pop() || '';
  const userName = targetprofile.split('#')[0];
  const tagGame = targetprofile.split('#')[1];

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
          <PompeComponent />
        </div>
        <div className='section section3'>
          <MatchLive />
        </div>
        <div className='section section4'>
          <Classement />
        </div>
      </div>
  );
}

export default Match;