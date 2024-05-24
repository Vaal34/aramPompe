
import React from 'react';
import './signUpForm.css';

const SignUpForm = () => {
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSignUp = () => {
        // Handle login logic here
    };

    return (
        <div className="signUpCard">
            <div className="title">
                <h1>Sign Up</h1>
            </div>
            <div className="signUpForm">
                <input
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder="Username"
                />
                <input
                    type="text"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Email"
                />
                <input
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Password"
                />
                <input
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Confirm Password"
                />
            </div>
            <button className="sendSignUp" onClick={handleSignUp}> Sign Up </button>
        </div>
    );
};

export default SignUpForm;