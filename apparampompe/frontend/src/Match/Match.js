import React, { useState } from 'react';
import './Match.css';
import TableNormalGame from './TableNormalGame/TableNormalGame';
import MatchLive from './MatchLive/MatchLive';
import PompeComponent from './PompeComponent/PompeComponent';
import pompesCalculator from './calculPompes';

function Match() {
  const [onMatchData, setOnMatchData] = useState({});
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [onMatchCreated, setOnMatchCreated] = useState(false);
  const [matchCode, setMatchCode] = useState('');
  const targetprofile = document.cookie.match('(^|;)\\s*targetprofile\\s*=\\s*([^;]+)')?.pop() || '';
  const userName = targetprofile.split('#')[0];
  const tagGame = targetprofile.split('#')[1];

  if (!targetprofile) {
    alert('Enter a target profile in profile page');
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

  const handleMatchData = (data) => {
      setOnMatchData(data);
  }

  const gameMode = onMatchData.info?.gameMode;
  console.log(onMatchData, 1111)

  return (
    <div className='Match'>
      <div className='section section1'>
          {onMatchCreated && gameMode !== "CHERRY" ? (
            <TableNormalGame
              onMatchData={handleMatchData}
              players={selectedPlayers}
              userName={userName}
              tagGame={tagGame}
            />
          ) : null}
      </div>

      <div className='section section2'>
        {onMatchCreated && (
          <PompeComponent
            pompesToDo={pompesCalculator(onMatchData, selectedPlayers)}
            targetProfile={targetprofile}
            matchCode={matchCode}
          />
        )}
      </div>
      <div className='section section3'>
        <MatchLive
          onSelectedPlayersChange={handleSelectedPlayersChange}
          onMatchCreated={handleOnMatchCreated}
          takeMatchCode={handleMatchCode}
        />
      </div>
    </div>
  );
}

export default Match;
