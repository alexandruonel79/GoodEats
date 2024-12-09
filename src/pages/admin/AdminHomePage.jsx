import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSpring, animated } from '@react-spring/web'; // Import react-spring
import './AdminHomePage.css';

const AdminHomePage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    users: 0,
    posts: 0,
    restaurants: 0
  });

  // Spring animation values for each statistic
  const usersProps = useSpring({ number: dashboardData.users, from: { number: 0 }, config: { tension: 150, friction: 50 } });
  const postsProps = useSpring({ number: dashboardData.posts, from: { number: 0 }, config: { tension: 100, friction: 50 } });
  const restaurantsProps = useSpring({ number: dashboardData.restaurants, from: { number: 0 }, config: { tension: 150, friction: 50 } });

  // Fetch dashboard data from the backend
  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      // Make API call to get dashboard data
      fetch('http://localhost:5000/api/dashboard/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then((response) => response.json())
        .then((data) => {
          setDashboardData({
            users: data.usersCount,
            posts: data.postsCount,
            restaurants: data.restaurantsCount
          });
        })
        .catch((error) => {
          console.error('Error fetching dashboard data:', error);
        });
    }
  }, [token, navigate]);

  return (
    <div className="home-container">
      <h2>Welcome to the Admin Dashboard</h2>
      <div className="dashboard-stats">
        <div className="stat">
          <h3>Users</h3>
          <animated.p>{usersProps.number.to(n => n.toFixed())}</animated.p> {/* animated number */}
        </div>
        <div className="stat">
          <h3>Posts</h3>
          <animated.p>{postsProps.number.to(n => n.toFixed())}</animated.p> {/* animated number */}
        </div>
        <div className="stat">
          <h3>Restaurants</h3>
          <animated.p>{restaurantsProps.number.to(n => n.toFixed())}</animated.p> {/* animated number */}
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
