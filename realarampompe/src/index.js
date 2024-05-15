import React from 'react';
import './index.css';
import App from './App/App';
import Home from './Dashboard/Dashboard';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/dashboard",
    element: <Home />
  }
]);

const root = createRoot(document.getElementById('root')); // Use createRoot from react-dom/client
root.render(
  <Auth0Provider
    domain="dev-j5vxf0wt6o0ebzsv.eu.auth0.com"
    clientId="4FNuNjguf6gZ9SPRAkp3g3rlM6vIuan6"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <RouterProvider router={router} />
  </Auth0Provider>,
);
