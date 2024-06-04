import React, { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import './targetList.css';

const TargetList = () => {
    const [newTarget, setNewTarget] = useState('');
    const [targetError, setTargetError] = useState('');
    const [currentTarget, setCurrentTarget] = useState(null);
    const [targets, setTargets] = useState([]);

    const handleAddTarget = async () => {
        if (newTarget) {
            try {
                const [gameName, tagGame] = newTarget.split('#');
                const response = await axios.get(`/api/riot/account/${gameName}/${tagGame}`);
                const targetData = response.data;
                setTargets([...targets, `${targetData.gameName}#${targetData.tagLine}`]);
                setNewTarget('');
                setTargetError('');
            } catch (error) {
                console.error('Error checking target:', error);
                setTargetError('User does not exist');
            }
        }
    };

    const handleDeleteTarget = (target) => {
        setTargets(targets.filter(t => t !== target));
    };

    const handleTargetChange = (selectedOption) => {
        setCurrentTarget(selectedOption);
    };

    const targetOptions = targets.map(target => ({ value: target, label: target }));

    return (
        <div className='innerDiv' id="targetListSection">
            <h1>Target List</h1>
            <input
                type="text"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                placeholder="Add a target (format: gameName#tagGame)"
            />
            <button onClick={handleAddTarget}>Add Target</button>
            {targetError && <p style={{ color: 'red' }}>{targetError}</p>}
            {targets.length > 0 ? (
                <>
                    <ul>
                        {targets.map((target, index) => (
                            <li key={index}>
                                {target}
                                <button onClick={() => handleDeleteTarget(target)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                    <Select
                        options={targetOptions}
                        onChange={handleTargetChange}
                        placeholder="Select current target..."
                    />
                    {currentTarget && (
                        <p>Currently targeting: {currentTarget.label}</p>
                    )}
                </>
            ) : (
                <p>No targets? Add one!</p>
            )}
        </div>
    );
};

export default TargetList;