import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, IconButton, Container } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

const UserNavbar = () => {
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

  // Handles logout by calling the API and removing the token
  const handleLogout = async () => {
    handleClose(); // Close the menu
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming the token is stored in localStorage
        }
      });

      if (response.ok) {
        localStorage.removeItem('token'); // Remove token from local storage
        navigate('/login'); // Redirect to login page
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AppBar position="sticky" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
            MyApp
          </Link>
        </Typography>
        <Container sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button component={Link} to="/home" color="inherit">
            Home
          </Button>
          <Button component={Link} to="/restaurants" color="inherit">
            Restaurants
          </Button>
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
            <MenuItem component={Link} to="/account" onClick={handleClose}>Account Info</MenuItem>
            <MenuItem component={Link} to="/change-password" onClick={handleClose}>Change Password</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default UserNavbar;
