import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Initialize dark mode class based on localStorage before first render to prevent flash
const savedTheme = localStorage.getItem('ecochain_theme');
if (savedTheme === 'dark' || !savedTheme) {
  document.documentElement.classList.add('dark');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
