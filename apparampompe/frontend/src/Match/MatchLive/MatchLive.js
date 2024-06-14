import React, { useState } from "react";
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

    const playerOptions = joueurs.map(joueur => ({ value: joueur.username, label: joueur.username }));
    console.log(selectedPlayers)

    return (
        <>
            <div className="MatchButton">
                {!isMatchCreated ? (
                    <>
                        <button onClick={handleCreateMatch}> Crée un match </button>
                        {createMatch && (
                            <div className="formMatch formCreateMatch">
                                <label>Joueurs:</label>
                                <Select
                                    isMulti
                                    options={playerOptions}
                                    onInputChange={handleInputChange}
                                    onChange={handleChange}
                                    placeholder="Rechercher un joueur"
                                />
                                <button onClick={handleCreateMatchSubmit}>Create a match</button>
                            </div>
                        )}
                        {joinMatch && (
                            <form className="formMatch formJoinMatch">
                                <label>Code du match:</label>
                                <input type="text" name="name" />
                                <input type="submit" value="Rejoindre" />
                            </form>
                        )}
                        <button onClick={handleJoinMatch}> Rejoindre un match </button>
                    </>
                ) : (
                    <div>
                        <p>Match créé !</p>
                        <p>Code du match: {matchCode}</p>
                    </div>
                )}
            </div>
        </>
    );
}

export default MatchLive;
