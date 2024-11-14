import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
const UserHomePage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  return (
    <div className="home-container">
      <h2>Welcome to the User home page!</h2>
      <p>Use the navigation to log in or register.</p>
    </div>
  );
};

export default UserHomePage;
