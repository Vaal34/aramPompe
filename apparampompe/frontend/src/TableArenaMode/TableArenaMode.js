import React from 'react';
import './TableArenaMode.css';

function TableArenaMode({ matchData }) {

    const infoPlayers = matchData.info?.participants || [];
    const Teams = {};

    for (let i = 0; i < infoPlayers.length; i++) {
        const subteamPlacement = infoPlayers[i].subteamPlacement;
        if (!Teams.hasOwnProperty(subteamPlacement)) {
            // si la key n'existe pas l'initialise avec un tableau vide
            Teams[subteamPlacement] = [];
        }
        Teams[subteamPlacement].push(infoPlayers[i]);
    }

    return (
        <>
            {Object.keys(Teams).map((team, index) => (
                    <table key={index} className={`Team${team} ${Teams[team][0].win === true ? 'win' : 'loose'}`}>
                        <thead>
                            <tr>
                                <th>Joueurs</th>
                                <th>KDA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Teams[team].length > 0 ? (
                                Teams[team].map((player, playerIndex) => (
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
            ))}
        </>
    );
}

export default TableArenaMode;
