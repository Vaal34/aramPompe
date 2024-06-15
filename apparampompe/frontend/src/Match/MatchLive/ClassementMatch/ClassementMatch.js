import React from "react";
import "./ClassementMatch.css";

function ClassementMatch( {matchCode, leaderboardData} ) {

    const sortedLeaderboardData = [...leaderboardData].sort((a, b) => b.pompe - a.pompe);

    return (
        <div className="classement-match">
            <h2>Leaderboard</h2>
            <i>The higher you are, the worse you are</i>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Player</th>
                        <th>Pompes</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedLeaderboardData.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.joueur}</td>
                            <td>{item.pompe}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ClassementMatch;
