import React, { useState, useEffect } from "react";
import ClassementMatch from "./ClassementMatch/ClassementMatch";
import Select from 'react-select';
import axios from 'axios';
import "./MatchLive.css";
const { nanoid } = require('nanoid');

function MatchLive() {
    const [createMatch, setCreateMatch] = useState(false);
    const [joinMatch, setJoinMatch] = useState(false);
    const [joueurs, setJoueurs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [isMatchCreated, setIsMatchCreated] = useState(false);
    const [matchCode, setMatchCode] = useState('');
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [enteredMatchCode, setEnteredMatchCode] = useState('');

    const handleChange = (selectedOptions) => {
        setSelectedPlayers(selectedOptions.map(option => option.value));
    };

    const handleCreateMatch = () => {
        if (createMatch) {
            setCreateMatch(false);
        } else {
            setJoinMatch(false);
            setCreateMatch(true);
        }
    };

    const handleJoinMatch = () => {
        if (joinMatch) {
            setJoinMatch(false);
        } else {
            setCreateMatch(false);
            setJoinMatch(true);
        }
    };

    const handleInputChange = (newValue) => {
        setSearchQuery(newValue);
        if (newValue.length > 0) {
            axios.get(`/api/user_stats/all/search?query=${newValue}`)
                .then(response => {
                    setJoueurs(response.data);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    };

    const handleCreateMatchSubmit = (event) => {
        event.preventDefault();
        const newMatchCode = nanoid(6);
        setMatchCode(newMatchCode);
        selectedPlayers.map(player => axios.post('/api/match/create', {
            joueur: player,
            match_id: newMatchCode
        })
        .then(response => {
            setIsMatchCreated(true);
        })
        .catch(error => {
            console.error('Error creating match:', error);
        }))
    }

    const handleJoinMatchSubmit = (event) => {
        event.preventDefault();
        axios.get(`/api/match/${enteredMatchCode}`)
            .then(response => {
                setLeaderboardData(response.data);
                setMatchCode(enteredMatchCode);
                setIsMatchCreated(true);
            })
            .catch(error => {
                console.error('Error joining match:', error);
                alert('Invalid match code.');
            });
    }

    useEffect(() => {
        if (matchCode) {
            axios.get(`/api/match/${matchCode}`)
                .then(response => {
                    setLeaderboardData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [matchCode]);

    const playerOptions = joueurs.map(joueur => ({ value: joueur.username, label: joueur.username }));
    console.log(selectedPlayers)

    return (
        <>
            <div className="JoinOrCreate">
                {!isMatchCreated ? (
                    <>
                        <button className="createMatchButton" onClick={handleCreateMatch}> Create a match </button>
                        {createMatch && (
                            <div className="formMatch formCreateMatch">
                                <label>JOUEURS :</label>
                                <Select
                                    isMulti
                                    options={playerOptions}
                                    onInputChange={handleInputChange}
                                    onChange={handleChange}
                                    placeholder="Search for players..."
                                />
                                <i>Please also enter your account.</i>
                                <button className="sendMatch" onClick={handleCreateMatchSubmit}>Create</button>
                            </div>
                        )}
                        {joinMatch && (
                            <form className="formMatch formJoinMatch" onSubmit={handleJoinMatchSubmit}>
                                <label>Code du match:</label>
                                <input
                                    type="text"
                                    value={enteredMatchCode}
                                    onChange={(e) => setEnteredMatchCode(e.target.value)}
                                />
                                <input type="submit" value="Rejoindre" />
                            </form>
                        )}
                        <button className="joinMatchButton" onClick={handleJoinMatch}> Rejoindre un match </button>
                    </>
                ) : (
                    <div className="DashboardMatch">
                        <ClassementMatch matchCode={matchCode} leaderboardData={leaderboardData} />
                        <p>Code du match: <b>{matchCode}</b></p>
                    </div>
                )}
            </div>
        </>
    );
}

export default MatchLive;
