import React from 'react';
import './index.css';
import App from './App/App';
import Login from './auth/login/login';
import Dashboard from './Dashboard/Dashboard';
import Profile from './profile/profile';
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
    path: "/profile",
    element: <Profile />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  }
]);

const root = createRoot(document.getElementById('root')); // Use createRoot from react-dom/client
root.render(
    <RouterProvider router={router} />
);
