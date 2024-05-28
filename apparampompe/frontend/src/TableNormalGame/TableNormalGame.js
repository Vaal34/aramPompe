import React from 'react';
import './TableNormalGame.css';

function TableNormalGame({ matchData, gameName}) {

  const infoPlayers = matchData.info?.participants || [];
  const teamCurrentPlayer = infoPlayers.find(player => player.riotIdGameName === gameName).teamId;
  const teamPlayers = infoPlayers.filter(player => player.teamId === teamCurrentPlayer);

    return (
        <table>
            <thead>
                <tr>
                    <th>Joueurs</th>
                    <th>KDA</th>
                </tr>
            </thead>
            <tbody>
                {teamPlayers ? (
                    teamPlayers
                    .map((player) => (
                        <tr>
                            <td>{player.riotIdGameName}</td>
                            <td>{player.kills}/{player.deaths}/{player.assists} ({(player.challenges.killParticipation * 100).toFixed(0)}%)</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3">No player data available</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

export default TableNormalGame;
