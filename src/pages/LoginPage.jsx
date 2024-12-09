import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Card, Typography, Container, Box, Grid } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const { token, role } = response.data;

      // Show success toast
      toast.success('Login succeeded!', {
        position: "top-right",
      });

      // Wait for 1 second before redirecting to /home
      setTimeout(() => {
        navigate('/home');
      }, 1000); // 1000ms = 1 second

      // Call login function to save token and role
      login(token, role);
    } catch (error) {
      // Show error toast with server error message
      const errorMessage = error.response?.data?.message || 'Error logging in. Please try again.';
      toast.error(errorMessage, {
        position: "top-right",
      });
    }
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(to right, #4f84e4, #1e3c72)', // Blue gradient background
      }}
    >
      <Card sx={{ p: 4, width: '100%', maxWidth: 400, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom color="primary" fontWeight="bold">
          Welcome Back!
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                InputLabelProps={{
                  style: { color: '#4f84e4' }, // Label color
                }}
                InputProps={{
                  style: { borderRadius: 20, borderColor: '#4f84e4' }, // Rounded borders and custom color
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputLabelProps={{
                  style: { color: '#4f84e4' }, // Label color
                }}
                InputProps={{
                  style: { borderRadius: 20, borderColor: '#4f84e4' }, // Rounded borders and custom color
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', background: '#4f84e4' }}
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Don't have an account?{' '}
            <Button
              variant="text"
              color="primary"
              onClick={() => navigate('/register')}
              sx={{ textTransform: 'none' }}
            >
              Register here
            </Button>
          </Typography>
        </Box>
      </Card>
      <ToastContainer />
    </Container>
  );
};

export default LoginPage;
