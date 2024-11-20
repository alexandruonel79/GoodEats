import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserHomePage from './pages/user/UserHomePage';
import AdminHomePage from './pages/admin/AdminHomePage';
import UserNavbar from './pages/user/UserNavbar';
import AdminNavbar from './pages/admin/AdminNavbar';
import ChangePassword from './pages/common/ChangePassword';
import UserRestaurants from './pages/user/UserRestaurants';

const App = () => {
  const { token, role } = useAuth();

  // Protecting routes based on user role and authentication
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!token) {
      return <Navigate to="/login" />; // Redirect to login if not authenticated
    }
    if (!allowedRoles.includes(role)) {
      return <Navigate to="/login" />; // Redirect if user doesn't have the required role
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* // change-password route */}
        <Route
          path="/change-password"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              {/* Conditionally render the Navbar and Home Page */}
              {role === 'user' && (
                <>
                  <UserNavbar />
                  <ChangePassword />
                </>
              )}
              {role === 'admin' && (
                <>
                  <AdminNavbar />
                  <ChangePassword />
                </>
              )}
            </ProtectedRoute>
          }
        />
        
        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              {/* Conditionally render the Navbar and Home Page */}
              {role === 'user' && (
                <>
                  <UserNavbar />
                  <UserHomePage />
                </>
              )}
              {role === 'admin' && (
                <>
                  <AdminNavbar />
                  <AdminHomePage />
                </>
              )}
            </ProtectedRoute>
          }
        />

        {/* Role-specific Home Pages */}
        <Route
          path="/adminHome"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminNavbar />
              <AdminHomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userHome"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserNavbar />
              <UserHomePage />
            </ProtectedRoute>
          }
        />

        {/* User Restaurants Page */}
        <Route
          path="/restaurants"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserNavbar />
              <UserRestaurants />
            </ProtectedRoute>
          }
        />
        
      </Routes>
    </Router>
  );
};

export default App;
