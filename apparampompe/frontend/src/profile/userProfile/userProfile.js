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
                var Cookies = document.cookie.split(';');
                for (var i = 0; i < Cookies.length; i++) {
                    document.cookie = Cookies[i] + "=; expires="+ new Date(0).toUTCString();
                }
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
