import React from 'react';
import './loginForm.css';

const LoginForm = () => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
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
                <div className='remenberMe'>
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={handleRememberMeChange}
                    />
                    <label>Remember Me</label>
                </div>
            </div>
            <button className="sendLogin" onClick={handleLogin}>
                Login
            </button>
        </div>
    );
};

export default LoginForm;