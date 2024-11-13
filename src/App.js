import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DemoPage from './pages/DemoPage';
import HomePage from './pages/HomePage';
import './assets/styles.css';

const App = () => {
  const { token, role } = useAuth();

  // Redirect based on role
  const roleBasedRedirect = (role) => {
    switch(role) {
      case 'admin':
        return <Navigate to="/demo" />;
      case 'user':
        return <Navigate to="/home" />;
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes */}
        {/* Redirect based on role */}
        <Route path="/demo" element={role === 'admin' ? <DemoPage /> : roleBasedRedirect(role)} />
        <Route path="/home" element={role === 'user' ? <HomePage /> : roleBasedRedirect(role)} />
        
      </Routes>
    </Router>
  );
};

export default App;
