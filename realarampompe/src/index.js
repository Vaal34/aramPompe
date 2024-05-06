import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Home from './Home';

const root = document.getElementById('root');
if (root !== null) {
  const appRoot = ReactDOM.createRoot(root);

  appRoot.render(
    <React.StrictMode>
      <Router>
        <Route exact path="/" component={App} />
        <Route path="/dashboard" component={Home} />
      </Router>
    </React.StrictMode>
  );
}