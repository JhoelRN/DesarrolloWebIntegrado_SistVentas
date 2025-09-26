import logo from './logo.svg';
import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import './styles/main.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleLoginClick = () => {
    setCurrentPage('login');
  };

  const handleGoBack = () => {
    setCurrentPage('home');
  };

  return (
    <div className="App">
      {currentPage === 'home' ? (
        <HomePage onLoginClick={handleLoginClick} />
      ) : (
        <LoginPage onGoBack={handleGoBack} />
      )}
    </div>
  );
}

export default App;
