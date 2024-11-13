import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  return (
    <div className="home-container">
      <h2>Welcome to the App!</h2>
      <p>Use the navigation to log in or register.</p>
    </div>
  );
};

export default HomePage;
