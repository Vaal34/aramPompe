import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './profile.css';
import EditProfile from './editProfile/editProfile';
import UserProfile from './userProfile/userProfile';
import Select from 'react-select';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editUser, setEditUser] = useState(false);
    const [friends, setFriends] = useState([]);
    const [newFriend, setNewFriend] = useState('');
    const [friendError, setFriendError] = useState('');
    const [targets, setTargets] = useState([]);
    const [newTarget, setNewTarget] = useState('');
    const [targetError, setTargetError] = useState('');
    const [currentTarget, setCurrentTarget] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('/api/users/current', { withCredentials: true });
                setUser(response.data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching user information');
                setLoading(false);
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, []);

    const handleImageClick = () => {
        setEditUser(!editUser);
    };

    const handleAddFriend = async () => {
        if (newFriend) {
            try {
                const [gameName, tagGame] = newFriend.split('#');
                const response = await axios.get(`/api/riot/account/${gameName}/${tagGame}`);
                const friendData = response.data;
                setFriends([...friends, `${friendData.gameName}#${friendData.tagLine}`]);
                setNewFriend('');
                setFriendError('');
            } catch (error) {
                console.error('Error checking friend:', error);
                setFriendError('User does not exist');
            }
        }
    };

    const handleDeleteFriend = (friend) => {
        setFriends(friends.filter(f => f !== friend));
    };

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

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const targetOptions = targets.map(target => ({ value: target, label: target }));

    return (
        <>
        <div className="partLeftProfile">
            <img
                className='flecheRetour'
                src={require('../assets/flecheRetour.png')}
                onClick={() => navigate('/dashboard')}
                alt='fleche retour'
            ></img>
            <div className='cardProfile'>
            <img src={require("../assets/logoAramPompe.png")} alt="Logo AramPompe" />
            <h1>{user.username}</h1>
                {editUser ? <UserProfile user={user}/> : <EditProfile user={user}/>}
            </div>
            <img
                className='buttonEditProfile'
                src={editUser ? require('../assets/edit.png') : require('../assets/profil.png')}
                alt='edit profile'
                onClick={handleImageClick}/>
        </div>
        <div className="partRightProfile">
            <div className='leftBloc'>
                <div>
                    <div className='innerDiv' id="friendListSection">
                        <h1>Friend List</h1>
                        <input
                            type="text"
                            value={newFriend}
                            onChange={(e) => setNewFriend(e.target.value)}
                            placeholder="Add a friend (format: gameName#tagGame)"
                        />
                        <button onClick={handleAddFriend}>Add Friend</button>
                        {friendError && <p style={{ color: 'red' }}>{friendError}</p>}
                        {friends.length > 0 ? (
                            <ul>
                                {friends.map((friend, index) => (
                                    <li key={index}>
                                        {friend}
                                        <button onClick={() => handleDeleteFriend(friend)}>Delete</button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No friends? Add one!</p>
                        )}
                    </div>
                </div>
                <div>
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
                </div>
            </div>
            <div className='rightBloc'>
                <div className='innerDiv'></div>
            </div>
        </div>
        </>
    );
};

export default Profile;
