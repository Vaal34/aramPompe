import React, { useState } from 'react';
import axios from 'axios';
import './friendList.css';

const FriendList = () => {

    const [newFriend, setNewFriend] = useState('');
    const [friends, setFriends] = useState([]);
    const [friendError, setFriendError] = useState('');

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

    return (
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
    );
};

export default FriendList;