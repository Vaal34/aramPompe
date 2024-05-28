import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="profileCard">
            <h1>Profile</h1>
            {user ? (
                <div>
                    <p>Username: {user.username}</p>
                    <p>Email: {user.email}</p>
                </div>
            ) : (
                <p>No user information available</p>
            )}
        </div>
    );
};

export default Profile;
