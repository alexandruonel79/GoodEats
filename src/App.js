import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserHomePage from "./pages/user/UserHomePage";
import AdminHomePage from "./pages/admin/AdminHomePage";
import UserNavbar from "./pages/user/UserNavbar";
import AdminNavbar from "./pages/admin/AdminNavbar";
import ChangePassword from "./pages/common/ChangePassword";
import UserRestaurants from "./pages/user/UserRestaurants";
import UserMap from "./pages/user/UserMap";
import AccountInfo from "./pages/common/AccountInfo";
import AdminRestaurantsDashboard from "./pages/admin/AdminRestaurantDashboard";
import AdminPosts from "./pages/admin/AdminPosts";
import Logs from "./pages/admin/Logs";
import ChatPage from "./pages/common/ChatPage";
import Layout from "./components/Layout"; // Import Layout component

const App = () => {
  const { token, role } = useAuth();

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!token) {
      return <Navigate to="/login" />;
    }
    if (!allowedRoles.includes(role)) {
      return <Navigate to="/login" />;
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

        {/* Wrap Protected Routes with Layout */}
        <Route element={<Layout />}>
          <Route
            path="/chat"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                {role === "user" && (
                  <>
                    <UserNavbar />
                    <ChatPage />
                  </>
                )}
                {role === "admin" && (
                  <>
                    <AdminNavbar />
                    <ChatPage />
                  </>
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                {role === "user" && (
                  <>
                    <UserNavbar />
                    <UserHomePage />
                  </>
                )}
                {role === "admin" && (
                  <>
                    <AdminNavbar />
                    <AdminHomePage />
                  </>
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-restaurants-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminNavbar />
                <AdminRestaurantsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-posts"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminNavbar />
                <AdminPosts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logs"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminNavbar />
                <Logs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/userHome"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserNavbar />
                <UserHomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/restaurants"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserNavbar />
                <UserRestaurants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/map"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserNavbar />
                <UserMap />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
