import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PompeComponent = ({ pompesToDo, targetProfile, matchCode}) => {
    const targetPompes = pompesToDo[0]; // pompesToDo[0] is the total number of pompes to do
    const playerLost = pompesToDo[1]; // pompesToDo[1] is the player who lost
    const [pompes, setPompes] = useState(0);

    useEffect(() => {
        let interval;
        if (pompes < targetPompes) {
            const delay = 200 * (1 - pompes / targetPompes);
            interval = setTimeout(() => {
                setPompes(prevPompes => prevPompes + 1);
            }, delay);
        }

        return () => clearTimeout(interval);
    }, [pompes, targetPompes]);

    const addPompe = async () => {
        axios.post(`/api/match/addPompe/${targetProfile}`, {
            gameName: playerLost,
            match_id: matchCode,
            newPompes: targetPompes
        })
        .then(response => {
            //
        })
        .catch(error => {
            console.error('Error adding pompes:', error);
        });
    };

    return (
        <>
            <h1>{playerLost} doit faire</h1>
            <h2>{pompes} pompes</h2>
            <i>une fois que vous terminer vos pompes ajoutez les</i>
            {playerLost === targetProfile && <button onClick={addPompe}>Add pompes</button>}
        </>
    );
};

export default PompeComponent;