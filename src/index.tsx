import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/loader.css'; // Import the loader CSS
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
