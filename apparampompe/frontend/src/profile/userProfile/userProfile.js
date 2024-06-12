import React from 'react';
import './userProfile.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserProfile = ({ user }) => {

    const navigate = useNavigate();

    const handleLogout = () => {
        axios.post('/api/users/logout')
        .then(response => {
            if (response.status === 200) {
                console.log('Logged out');
                navigate('/');
            } else {
            throw new Error('Failed to logout');
            }
        })
        .catch(error => {
            console.error(error);
        });
    }

    return (
        <>
            {user ? (
                <>
                    <div className='dataProfil'>
                        <p>email :</p>
                        <h2>{user.email}</h2>
                    </div>
                    <button className='buttonLogout' onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <p>No user information available</p>
            )}
        </>
    );
};


export default UserProfile;
