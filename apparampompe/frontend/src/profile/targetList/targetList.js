import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './targetList.css';
import Select from 'react-select';
import { components } from 'react-select';

const TargetList = ({ user }) => {
    const [newTarget, setNewTarget] = useState('');
    const [targetError, setTargetError] = useState('');
    const [currentTarget, setCurrentTarget] = useState('');
    const [targets, setTargets] = useState([]);


    const handleAddTarget = async () => {
        if (newTarget) {
            try {
                const [gameName, tagGame] = newTarget.split('#');
                const response = await axios.get(`/api/riot/account/${gameName}/${tagGame}`);
                const targetData = response.data;
                const targetName = `${targetData.gameName}#${targetData.tagLine}`;
                if (!targets.includes(targetName)) {
                    setTargets([...targets, targetName]);
                } else {
                    setTargetError('Target already exists');
                    return false;
                }
                setNewTarget('');
                setTargetError('');
                axios.post('/api/user/targets/addtarget', {
                    user_id: user.id,
                    target: targetName
                });
            } catch (error) {
                console.error('Error checking target:', error);
                setTargetError('User does not exist');
            }
        }
    };

    const handleDeleteTarget = (targetName) => {
        setTargets(targets.filter(t => t !== targetName));
        axios.post('/api/user/targets/deletetarget', {
            data: {
                user_id: user.id,
                target: targetName
            }
        });
    };

    const handleCurrentTarget = (selectedTarget) => {
        setCurrentTarget(selectedTarget);
        axios.post('/api/user/targets/currenttarget', {
            user_id: user.id,
            target: selectedTarget.value
            })
        .catch(error => {
            console.error('Error updating current target:', error);
        });
    };

    useEffect(() => {
        const fetchTarget = async () => {
            try {
                const response = await axios.get(`/api/user/user_info/${user.id}`);
                setTargets(response.data.targets_profile);
            } catch (error) {
                console.error('Failed to fetch targets:', error);
            }
        };
        fetchTarget();
    }, [user.id]);

    useEffect(() => {
        const fetchCurrentTarget = async () => {
            try {
                const response = await axios.get(`/api/user/targets/currenttarget/${user.id}`);
                setCurrentTarget(response.data.currentTarget);
            } catch (error) {
                console.error('Failed to fetch current target:', error);
            }
        };
        fetchCurrentTarget();
    }, [user.id]);

    const Option = props => {
        return (
          <div className='dropDownTargetList'>
            <components.Option {...props}>
              <span>{props.data.label}</span>
            </components.Option>
            <button onClick={() => handleDeleteTarget(props.data.value)}>X</button>
          </div>
        );
    };

    return (
        <div className='innerDiv' id="targetListSection">
            <h1>Target List</h1>
            <div className='formTargetList'>
                <input
                    type="text"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    placeholder="Add a target (format: gameName#tagGame)"
                />
                <button className='sendTarget' onClick={handleAddTarget}>Add Target</button>
            </div>
            {targetError && <p style={{ color: 'red' }}>{targetError}</p>}
            {targets.length > 0 ? (
                <Select
                    menuPlacement='auto'
                    className='select'
                    options={targets.map(target => ({ value: target, label: target }))}
                    components={{ Option }}
                    onChange={handleCurrentTarget}
                    value={targets.map(target => ({ value: target, label: target })).find(option => option.value === currentTarget)}
                    />
            ) : (
                <p>No targets</p>
            )}
        </div>
    );
};

export default TargetList;