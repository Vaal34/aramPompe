import React, { useState, useEffect } from 'react';
import './Home.css';
import { useLocation } from 'react-router-dom';
import { fetchRiotAccount, fetchLastMatch } from '../api.js';

function Home() {
  const location = useLocation();
  const [matchData, setMatchData] = useState([]);

  useEffect(() => {
    const gameName = location.state.gameName;
    const apiKey = "RGAPI-422cac4f-1228-4dad-81d4-fbde9bcc0c44";
    const tagGame = location.state.tag;

    fetchRiotAccount(gameName, tagGame, apiKey)
      .then(data => {
        fetchLastMatch(data.puuid, apiKey)
          .then(data => {
            const matchData = data;
            setMatchData(matchData);
          })
          .catch(console.error);
      })
      .catch(console.error);
  }, [location.state]);

  const infoPlayers = matchData.info?.participants || [];
  const playerNames = infoPlayers.map(player => player.riotIdGameName);
  const numberKillsByPlayer = infoPlayers.map(playerKill => playerKill.kills);

  return (
    <div>
      <h1>{location.state.gameName}</h1>
      <table>
        <tbody>
          {playerNames.map((player, index) => (
            <tr key={index}>
              <td>{player}</td>
              <td>{numberKillsByPlayer[index]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Home;
