// src/index.js
// Import React and ReactDOM
import React from 'react';
import ReactDOM from 'react-dom';
// Import the App component and CSS
import App from './App';
import './index.css'; // You can also import the CSS directly in this file

// Render the App component into the 'root' div
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // This targets the div in index.html
);

