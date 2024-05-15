import React from "react";
import './Login.css';
import { addUser } from "../../Databases/DB";
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
  const { user } = useAuth0();
  const { loginWithRedirect } = useAuth0();

  return <div 
    className="divLogin"><button 
    className="loginButton" 
    onClick={() => {loginWithRedirect(), addUser(user.email)}}
  >Log In</button></div>;
};

export default LoginButton;