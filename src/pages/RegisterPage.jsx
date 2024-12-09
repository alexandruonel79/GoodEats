import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Card, Typography, Container, Box, Grid } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/auth/register', { email, password, name });
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
          Create an Account
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                type="text"
                variant="outlined"
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                sx={{
                  padding: '10px 20px',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  background: '#4f84e4',
                }}
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </form>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Already have an account?{' '}
            <Button
              variant="text"
              color="primary"
              onClick={() => navigate('/login')}
              sx={{ textTransform: 'none' }}
            >
              Login here
            </Button>
          </Typography>
        </Box>
      </Card>
      <ToastContainer />
    </Container>
  );
};

export default RegisterPage;
