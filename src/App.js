import React, { useState, useEffect } from "react";
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
import { ThemeProvider, createTheme } from "@mui/material/styles";

const App = () => {
  const { token, role } = useAuth();
  const [darkMode, setDarkMode] = useState(null); // Start with `null` to indicate theme is loading

  // Read the theme from localStorage when the component first mounts
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme"); // Get the saved theme from localStorage
    if (savedTheme) {
      setDarkMode(savedTheme === "dark"); // If a theme is saved, apply it
    } else {
      setDarkMode(false); // Default to light mode if nothing is saved
    }
  }, []); // Empty dependency array ensures this runs only once during initial load

  // Save the theme to localStorage whenever darkMode changes
  useEffect(() => {
    if (darkMode !== null) {
      localStorage.setItem("theme", darkMode ? "dark" : "light"); // Save the theme to localStorage
    }
  }, [darkMode]); // This runs every time darkMode changes

  // Define light and dark themes
  const lightTheme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#0056b3",
      },
      background: {
        default: "#ffffff",
        paper: "#f5f5f5",
      },
      text: {
        primary: "#000000",
      },
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#bb86fc",
      },
      background: {
        default: "#121212",
        paper: "#1e1e1e",
      },
      text: {
        primary: "#ffffff",
      },
    },
  });

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!token) {
      return <Navigate to="/login" />;
    }
    if (!allowedRoles.includes(role)) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  // If darkMode is still `null`, we can show a loading state to avoid rendering without theme
  if (darkMode === null) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Wrap Protected Routes with Layout */}
          <Route element={<Layout darkMode={darkMode} setDarkMode={setDarkMode} />}>
            <Route
              path="/chat"
              element={
                <ProtectedRoute allowedRoles={["user", "admin"]}>
                  {role === "user" && (
                    <>
                      <UserNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
                      <ChatPage />
                    </>
                  )}
                  {role === "admin" && (
                    <>
                      <AdminNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
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
                      <UserNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
                      <UserHomePage />
                    </>
                  )}
                  {role === "admin" && (
                    <>
                      <AdminNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
                      <AdminHomePage />
                    </>
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/change-password"
              element={
                <ProtectedRoute allowedRoles={["user", "admin"]}>
                  {role === "user" && (
                    <>
                      <UserNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
                      <ChangePassword />
                    </>
                  )}
                  {role === "admin" && (
                    <>
                      <AdminNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
                      <ChangePassword />
                    </>
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute allowedRoles={["user", "admin"]}>
                  {role === "user" && (
                    <>
                      <UserNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
                      <AccountInfo />
                    </>
                  )}
                  {role === "admin" && (
                    <>
                      <AdminNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
                      <AccountInfo />
                    </>
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-restaurants-dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
                  <AdminRestaurantsDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-posts"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
                  <AdminPosts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/logs"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
                  <Logs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/userHome"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <UserNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
                  <UserHomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/restaurants"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <UserNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
                  <UserRestaurants />
                </ProtectedRoute>
              }
            />
            <Route
              path="/map"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <UserNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
                  <UserMap />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
