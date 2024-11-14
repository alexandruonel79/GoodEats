import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Card, Typography, Container } from '@mui/material';
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
    <Container maxWidth="sm" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" align="center" gutterBottom>Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
      </Card>
      <ToastContainer />
    </Container>
  );
};

export default LoginPage;
