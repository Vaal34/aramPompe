import React from 'react';
import './TableNormalGame.css';

function TableNormalGame({ matchData }) {

  const infoPlayers = matchData.info?.participants || [];

    return (
        <>
            {matchData.info?.teams.map((team, index) => {
                /*
                    Crée un tableau au playersInTeam qui contient uniquement les joueurs
                    de infoPlayers qui appartiennent à la même équipe que team.teamId
                */
                const playersInTeam = infoPlayers.filter(player => player.teamId === team.teamId);
                return (
                    <table key={index} className={`Team${team.teamId} ${team.win === true ? 'win' : 'loose'}`}>
                        <thead>
                            <tr>
                                <th>Joueurs</th>
                                <th>KDA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {playersInTeam ? (
                                playersInTeam.map((player, playerIndex) => (
                                    <tr key={playerIndex}>
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
            })}
        </>
    );
}

export default TableNormalGame;
