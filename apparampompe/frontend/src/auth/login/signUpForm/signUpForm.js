
import React from 'react';
import './signUpForm.css';
import axios from 'axios';

const SignUpForm = () => {
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    const handleSignUp = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setError('Invalid email format');
                return;
            }
        try {
            const response = await axios.post('/api/users/register', {
                username,
                email,
                password
            });
            setSuccess('User registered successfully', response.data.token);
            setError('');
        } catch (error) {
            setError('Error registering user');
            setSuccess('');
            console.error('Error registering user:', error);
        }
    };

    return (
        <form className="signUpCard" onSubmit={handleSignUp}>
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
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    placeholder="Confirm Password"
                />
            </div>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <button className="sendSignUp" type="submit">Sign Up</button>
        </form>
    );
};

export default SignUpForm;