import React, { useState } from 'react';
import './login.css';
import LoginForm from './loginForm/loginForm';
import SignUpForm from './signUpForm/signUpForm';

function Login() {
    const [isSignUp, setIsSignUp] = useState(false);
    // eslint-disable-next-line
    const [isRegistered, setIsRegistered] = useState(false);

    const handleSignUpClick = () => {
        setIsSignUp(true);
    };

    const handleLoginClick = () => {
        setIsSignUp(false);
    };

    const handleRegisterSuccess = (success) => {
        if (success) {
            setIsRegistered(true);
            setIsSignUp(false);
        }
    };

    return (
        <div className="container">
            <div className="login">
                <div className="logo">
                    <img src={require("../../assets/logoAramPompe.png")} alt="" />
                </div>
                {isSignUp ? <SignUpForm onRegisterSuccess={handleRegisterSuccess}/> : <LoginForm />}
                <button className="swapForm" onClick={isSignUp ? handleLoginClick : handleSignUpClick}>
                    {isSignUp ? 'Login' : 'Sign Up'}
                </button>
            </div>
            <div className="background">
                <video autoPlay loop muted>
                    <source src={require("../../assets/Background1.webm")} type="video/webm" />
                </video>
            </div>
        </div>
    );
}

export default Login;