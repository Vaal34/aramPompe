import React, { useState, useEffect } from 'react';
import './Match.css';
import TableNormalGame from '../TableNormalGame/TableNormalGame';
import axios from 'axios';
import Classement from './Classement/Classement';
import MatchLive from './MatchLive/MatchLive';
import PompeComponent from './PompeComponent/PompeComponent';
import pompesCalculator from './calculPompes';

function Match() {
  const [matchData, setMatchData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const targetprofile = document.cookie.match('(^|;)\\s*targetprofile\\s*=\\s*([^;]+)')?.pop() || '';
  const userName = targetprofile.split('#')[0];
  const tagGame = targetprofile.split('#')[1];
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [onMatchCreated, setOnMatchCreated] = useState(false);
  const [matchCode, setMatchCode] = useState('');

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
  }, [userName, tagGame]);

  console.log(selectedPlayers, "selectedPlayers")
  if (isLoading) {
    return (
      <div className='loading'>
        <img src={require("../assets/loading.gif")} alt="GIF de chargement"></img>
      </div>
    );
    }

    const handleSelectedPlayersChange = (newSelectedPlayers) => {
        setSelectedPlayers(newSelectedPlayers);
    };

    const handleOnMatchCreated = (matchCreated) => {
        setOnMatchCreated(matchCreated);
    }

    const handleMatchCode = (newMatchCode) => {
        setMatchCode(newMatchCode);
    }

    const gameMode = matchData.info?.gameMode;

    return (
      <div className='Match'>
        <div className='section section1'>
          <div>
            {onMatchCreated && gameMode !== "CHERRY" ? (
              <TableNormalGame matchData={matchData} players={selectedPlayers} />
              ) : null}
          </div>
        </div>

        <div className='section section2'>
          {onMatchCreated && (
            <PompeComponent pompesToDo={pompesCalculator(matchData, selectedPlayers)} targetProfile={targetprofile} matchCode={matchCode} />
          )}
        </div>
        <div className='section section3'>
          <MatchLive onSelectedPlayersChange={handleSelectedPlayersChange} onMatchCreated={handleOnMatchCreated} takeMatchCode={handleMatchCode} />
        </div>
        <div className='section section4'>
          <Classement />
        </div>
      </div>
  );
}

export default Match;