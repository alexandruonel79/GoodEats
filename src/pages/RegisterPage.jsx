import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Card, Typography, Container, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/auth/register', { email, password, role });
      toast.success('Registration successful! Redirecting to login...', {
        position: 'top-right',
        autoClose: 2000,
        onClose: () => navigate('/login'),
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error registering. Please try again.';
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <Container maxWidth="sm" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" align="center" gutterBottom>Register</Typography>
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
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              label="Role"
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register
          </Button>
        </form>
      </Card>
      <ToastContainer />
    </Container>
  );
};

export default RegisterPage;
