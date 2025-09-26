import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import CreateAccountPage from './pages/CreateAccountPage';
import './styles/main.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const handleLogin = (user, role) => {
    setLoggedInUser(user);
    setUserRole(role);
    if (role === 'admin') {
      setCurrentPage('adminDashboard');
    } else {
      setCurrentPage('home');
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setUserRole(null);
    setCurrentPage('home');
  };

  const handleLoginClick = () => {
    setCurrentPage('login');
  };

  const handleCreateAccountClick = () => {
    setCurrentPage('createAccount');
  };

  const handleGoBack = () => {
    setCurrentPage('login');
  };

  const handleLoginSuccess = (userName) => {
    setLoggedInUser(userName);
    setUserRole('client');
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onLoginClick={handleLoginClick} loggedInUser={loggedInUser} onLogout={handleLogout} />;
      case 'login':
        return <LoginPage onGoBack={handleGoBack} onLogin={handleLogin} onCreateAccountClick={handleCreateAccountClick} />;
      case 'createAccount':
        return <CreateAccountPage onGoBack={handleGoBack} onLoginSuccess={handleLoginSuccess} />;
      case 'adminDashboard':
        return <AdminDashboard onLogout={handleLogout} />;
      default:
        return <HomePage onLoginClick={handleLoginClick} loggedInUser={loggedInUser} onLogout={handleLogout} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;