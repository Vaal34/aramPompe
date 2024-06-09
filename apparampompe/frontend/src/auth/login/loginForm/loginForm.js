import React, { useState, /*useEffect*/ } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './loginForm.css';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loggedInUser, setLoggedInUser] = useState(null);

    const navigate = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/api/users/login', {
                username,
                password
            });
            setSuccess('Login successful');
            setError('');
            setLoggedInUser(response.data.username);
            navigate('/profile');
        } catch (error) {
            setError('Error logging in');
            setSuccess('');
            console.error('Error logging in:', error);
        }
    };

    // useEffect(() => {
    //     const fetchCurrentUser = async () => {
    //         try {
    //             const response = await axios.get('/api/users/current');
    //             setLoggedInUser(response.data.username);
    //         } catch (error) {
    //             console.error('Error fetching current user:', error);
    //         }
    //     };
    //     fetchCurrentUser();
    // }, []);

    return (
        <div>
            {loggedInUser ? (
                <div>
                    <h2>Welcome, {loggedInUser}!</h2>
                </div>
            ) : (
                <form className="loginCard" onSubmit={handleLogin}>
                    <div className="title">
                        <h1>Login</h1>
                    </div>
                    <div className="loginForm">
                        <input
                            type="text"
                            value={username}
                            onChange={handleUsernameChange}
                            placeholder="Username"
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="Password"
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    {success && <p className="success">{success}</p>}
                    <button className="sendLogin" type="submit">Login</button>
                </form>
            )}
        </div>
    );
};

export default LoginForm;
