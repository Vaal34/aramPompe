import React, { useState } from 'react';
import axios from 'axios';
import './loginForm.css';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [rememberMe, setRememberMe] = React.useState(false);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleRememberMeChange = (event) => {
        setRememberMe(event.target.checked);
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
            localStorage.setItem('token', response.data.token);
        } catch (error) {
            setError('Error logging in');
            setSuccess('');
            console.error('Error logging in:', error);
        }
    };

    return (
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
                <div className='remenberMe'>
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={handleRememberMeChange}
                    />
                    <label>Remember Me</label>
                </div>
            </div>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <button className="sendLogin" type="submit">Login</button>
        </form>
    );
};

export default LoginForm;
