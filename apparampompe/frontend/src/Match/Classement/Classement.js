import React, {useEffect, useState} from "react";
import "./Classement.css";
import axios from "axios";

function Classement() {

    const [classement, setClassement] = useState([]);

    useEffect(() => {
        axios.get("/api/user/user_stats/classement")
            .then(response => {
                setClassement(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div className="Classement">
            <table>
                <thead>
                    <tr>
                    <th>Username</th>
                    <th>Pompes</th>
                    </tr>
                </thead>
                <tbody>
                    {classement.length > 0 ? (
                    classement.map((player, index) => (
                        <tr key={index}>
                            <td>{player.username}</td>
                            <td>{player.pompe}</td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan="2">No player data available</td>
                    </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Classement;