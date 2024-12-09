import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AccountCircle } from '@mui/icons-material';

const AdminNavbar = () => {
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
      // post request to logout
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
    // Redirect function
    const handleRedirect = () => {
      navigate("/home"); // Redirect to the desired route
    };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }} onClick={handleRedirect}>
          Admin Dashboard
        </Typography>
        {/* Navigation buttons */}
        <Button color="inherit" component={Link} to="/admin-restaurants-dashboard">
          Manage Restaurants
        </Button>
        
        <Button color="inherit" component={Link} to="/manage-posts">
          Manage Posts
        </Button>

        <Button color="inherit" component={Link} to="/logs">
          Logs
        </Button>
        
        {/* Account Dropdown Menu */}
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
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;
