import React from 'react';
import './loginForm.css';

const LoginForm = () => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleLogin = () => {
        // Handle login logic here
    };

    return (
        <div className="loginCard">
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
            <button className="sendLogin" onClick={handleLogin}>
                Login
            </button>
        </div>
    );
};

export default LoginForm;