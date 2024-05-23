import React, { useEffect } from "react";
import './Login.css';
import { useAuth0 } from '@auth0/auth0-react';
import { useMutation } from 'react-query';
import { error } from "jquery";

const LoginButton = () => {
  const { isAuthenticated, user, loginWithRedirect } = useAuth0();

  const mutation = useMutation(({email, create_at}) =>
    fetch('http://localhost:3001/usersAUTH', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, create_at }),
    }),
    {
      onSuccess: () => {
        console.log(`${user.email} has been added to the database`);
      },
      onError: (err) => {
        console.log(`Error adding ${error} to the database`);
      },
    }
  );

  useEffect(() => {
    if (user) {
      console.log(user);
      mutation.mutate({ email: user.email, create_at: new Date().toISOString() });
    }
  }, [user, mutation]);

  return (
    <div className="divLogin">
      <button className="loginButton" onClick={loginWithRedirect}>Log In</button>
    </div>
  );
};

export default LoginButton;