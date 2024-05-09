import React from 'react';
import './index.css';
import App from './App/App';
import Home from './Home/Home';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

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
  <RouterProvider router={router} />
);
