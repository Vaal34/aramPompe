import React, {useEffect, useState, useCallback}  from 'react';
import './TableNormalGame.css';
import axios from 'axios';

function TableNormalGame({ onMatchData, players, userName, tagGame}) {

  const [matchData, setMatchData] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const accountResponse = await axios.get(`/api/riot/account/${userName}/${tagGame}`);
      const matchesResponse = await axios.get(`/api/riot/matches/${accountResponse.data.puuid}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onMatchData(matchesResponse.data);
      setMatchData(matchesResponse.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName, tagGame]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <div className='loading'>
        <img src={require("../../assets/loading.gif")} alt="GIF de chargement"></img>
      </div>
    );
  }

  const infoPlayers = matchData.info?.participants || [];
  const gameNames = players.map(player => player.gameName.split('#')[0])
  const teamCurrentPlayer = infoPlayers.filter(player => gameNames.includes(player.riotIdGameName));

  return (
    <div className="GamesContainer">
      <table className="tableGame">
        <thead>
          <tr>
            <th>Joueurs</th>
            <th>KDA</th>
          </tr>
        </thead>
        <tbody>
          {teamCurrentPlayer.length > 0 ? (
            teamCurrentPlayer.map((player, index) => (
              <tr key={index}>
                <td>{player.riotIdGameName}</td>
                <td>{player.kills}/{player.deaths}/{player.assists} ({(player.challenges.killParticipation * 100).toFixed(0)}%)</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No player data available</td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={() => fetchData()}>Reload</button>
    </div>
  );
}

export default TableNormalGame;
