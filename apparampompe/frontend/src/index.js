import React from 'react';
import './index.css';
import App from './App/App';
import Login from './auth/login/login';
import Match from './Match/Match';
import Profile from './profile/profile';
import Dashboard from './Dashboard/Dashboard';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/app",
    element: <App />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: "/Match",
    element: <Match />
  }
]);

const root = createRoot(document.getElementById('root')); // Use createRoot from react-dom/client
root.render(
    <RouterProvider router={router} />
);
