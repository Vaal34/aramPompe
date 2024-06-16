import React  from 'react';
import './TableNormalGame.css';

function TableNormalGame({ matchData, players }) {

  const infoPlayers = matchData.info?.participants || [];
  const gameNames = players.map(player => player.gameName.split('#')[0])
  const teamCurrentPlayer = infoPlayers.filter(player => gameNames.includes(player.riotIdGameName));

  return (
    <table>
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
  );
}

export default TableNormalGame;
