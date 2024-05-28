import React from 'react';
import './index.css';
import App from './App/App';
import Login from './auth/login/login';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import Profile from './profile/profile';

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
  }
]);

const root = createRoot(document.getElementById('root')); // Use createRoot from react-dom/client
root.render(
    <RouterProvider router={router} />
);
