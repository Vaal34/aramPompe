import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './profile.css';
import EditProfile from './editProfile/editProfile';
import UserProfile from './userProfile/userProfile';
import FriendList from './friendList/friendList';
import TargetList from './targetList/targetList';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editUser, setEditUser] = useState(false);

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

    console.log(user)

    const handleImageClick = () => {
        setEditUser(!editUser);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }
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
                <div className='leftBlocTop'>
                    <FriendList user={user}/>
                </div>
                <div className='leftBlocBot'>
                    <TargetList user={user}/>
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
