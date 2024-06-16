import React, { useState, useEffect } from "react";
import ClassementMatch from "./ClassementMatch/ClassementMatch";
import Select from 'react-select';
import useWebSocket from 'react-use-websocket';
import axios from 'axios';
import "./MatchLive.css";
const { nanoid } = require('nanoid');

function MatchLive({ onSelectedPlayersChange, onMatchCreated, takeMatchCode }) {
    const [createMatch, setCreateMatch] = useState(false);
    const [joinMatch, setJoinMatch] = useState(false);
    const [joueurs, setJoueurs] = useState([]);
    // eslint-disable-next-line
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [isMatchCreated, setIsMatchCreated] = useState(false);
    const [matchCode, setMatchCode] = useState('');
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [enteredMatchCode, setEnteredMatchCode] = useState('');

    const handleChange = (selectedOptions) => {
        setSelectedPlayers(selectedOptions.map(option => ({ joueur: option.value, gameName: option.gameName })));
        onSelectedPlayersChange(selectedOptions.map(option => ({ joueur: option.value, gameName: option.gameName })));
    };

    const handleCreateMatch = () => {
        setCreateMatch(!createMatch);
        setJoinMatch(false);
    };

    const handleJoinMatch = () => {
        setJoinMatch(!joinMatch);
        setCreateMatch(false);
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
        takeMatchCode(newMatchCode);
        selectedPlayers.forEach(player => {
            const { joueur, gameName } = player;
            axios.post('/api/match/create', {
                joueur: joueur,
                match_id: newMatchCode,
                gameName: gameName
            })
            .then(response => {
                setIsMatchCreated(true);
                onMatchCreated(true);
            })
            .catch(error => {
                console.error('Error creating match:', error);
            });
        });
    };

    const handleJoinMatchSubmit = (event) => {
        event.preventDefault();
        axios.get(`/api/match/${enteredMatchCode}`)
            .then(response => {
                setLeaderboardData(response.data);
                setMatchCode(enteredMatchCode);
                takeMatchCode(enteredMatchCode);
                setIsMatchCreated(true);
                onMatchCreated(true);
                onSelectedPlayersChange(response.data.map(player => ({ joueur: player.joueur, gameName: player.gameName })));
            })
            .catch(error => {
                console.error('Error joining match:', error);
                alert('Invalid match code.');
            });
    };

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

    // WebSocket connection
    // eslint-disable-next-line
    const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost:8080', {
        onOpen: () => console.log('Connected to WebSocket'),
        onMessage: (message) => {
            const data = JSON.parse(message.data);
            if (data.matchId === matchCode) {
                setLeaderboardData(data.leaderboardData);
            }
        },
        onClose: () => console.log('Disconnected from WebSocket'),
        shouldReconnect: (closeEvent) => true,
    });

    const playerOptions = joueurs.map(joueur => ({ value: joueur.username, label: `${joueur.username} (${joueur.gameName})`, gameName: joueur.gameName }));

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
