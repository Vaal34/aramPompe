import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './friendList.css';
import Select from 'react-select';
import { components } from 'react-select';

const FriendList = ({ user }) => {

    const [newFriend, setNewFriend] = useState('');
    const [friends, setFriends] = useState([]);
    const [friendError, setFriendError] = useState('');

    const handleAddFriend = async () => {
        if (newFriend) {
            try {
                const [gameName, tagGame] = newFriend.split('#');
                const response = await axios.get(`/api/riot/account/${gameName}/${tagGame}`);
                const friendData = response.data;
                const newFriendData = `${friendData.gameName}#${friendData.tagLine}`;
                if (!friends.includes(newFriendData)) {
                    setFriends([...friends, newFriendData]);
                } else {
                    setFriendError('Friend already exists');
                    return false;
                }
                setNewFriend('');
                setFriendError('');
                axios.post('/api/user/friends/addfriend', {
                    user_id: user.id,
                    friend: newFriendData
                });
            } catch (error) {
                console.error('Error checking friend:', error);
                setFriendError('User does not exist');
            }
        }
    };

    const handleDeleteFriend = (friend) => {
        setFriends(friends.filter(f => f !== friend));
        axios.post('/api/user/friends/deletefriend', {
            data: {
                user_id: user.id,
                friend: friend
            }
        });
    };

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await axios.get(`/api/user/user_info/${user.id}`);
                setFriends(response.data.friends_profile);
            } catch (error) {
                console.error('Failed to fetch friends:', error);
            }
        };
        fetchFriends();
    }, [user.id]);

    const Option = props => {
        return (
          <div className='dropDown'>
            <components.Option {...props}>
              <span>{props.data.label}</span>
            </components.Option>
            <button onClick={() => handleDeleteFriend(props.data.value)}>X</button>
          </div>
        );
      };

      return (
        <div className='innerDiv' id="friendListSection">
          <h1>Friend List</h1>
          <div className='formFriendList'>
              <input
                type="text"
                value={newFriend}
                onChange={(e) => setNewFriend(e.target.value)}
                placeholder="Add a friend (format: gameName#tagGame)"
                />
              <button onClick={handleAddFriend}>Add Friend</button>
          </div>
          {friendError && <p style={{ color: 'red', fontSize: '1rem'}}>{friendError}</p>}
          {friends.length > 0 ? (
              <Select
                className='select'
                options={friends.map(friend => ({ value: friend, label: friend }))}
                components={{ Option }}
              />
          ) : (
              <p>No friends to display</p>
          )}
        </div>
      );
};

export default FriendList;