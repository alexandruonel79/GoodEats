import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, IconButton, Container, Switch } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const UserNavbar = ({ darkMode, setDarkMode }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  // Handles opening the menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handles closing the menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handles logout
  const handleLogout = async () => {
    handleClose();
    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Toggle dark mode
  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <AppBar position="sticky" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
          🍴GoodEats🍴
          </Link>
        </Typography>
        <Container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button component={Link} to="/home" color="inherit">
            Home
          </Button>
          <Button component={Link} to="/restaurants" color="inherit">
            Restaurants
          </Button>
          <Button component={Link} to="/map" color="inherit">
            Map
          </Button>
          <Switch
            checked={darkMode}
            onChange={handleThemeToggle}
            color="default"
            inputProps={{ 'aria-label': 'theme toggle' }}
          />
          <IconButton color="inherit" onClick={handleClick}>
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem component={Link} to="/account" onClick={handleClose}>
              Account Info
            </MenuItem>
            <MenuItem component={Link} to="/change-password" onClick={handleClose}>
              Change Password
            </MenuItem>
            <MenuItem component={Link} to="/chat" onClick={handleClose}>
              Support Chat
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default UserNavbar;
