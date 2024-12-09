import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, TextField, Button } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../context/AuthContext';

const AccountInfo = () => {
  const { token } = useAuth(); // Get the token from context
  const [accountInfo, setAccountInfo] = useState({
    name: '',
    email: '',
    role: '',
    createdAt: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user account information
  useEffect(() => {
    if (!token) {
      toast.error('No authentication token found. Please login.');
      return;
    }

    const fetchAccountInfo = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/account-info', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Use the token from context
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAccountInfo({
            name: data.name,
            email: data.email,
            role: data.role,
            createdAt: new Date(data.createdAt).toLocaleDateString(), // Format date
          });
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || 'Failed to fetch account information');
        }
      } catch (error) {
        console.error('Error fetching account information:', error);
        toast.error('An error occurred. Please try again.');
      }
    };

    fetchAccountInfo();
  }, [token]);

  // Handle save changes
  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/update-info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Use the token from context
        },
        body: JSON.stringify({
          name: accountInfo.name,
          email: accountInfo.email,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Account information updated successfully');
        setAccountInfo((prevInfo) => ({
          ...prevInfo,
          name: data.name,
          email: data.email,
        }));
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update account information');
      }
    } catch (error) {
      console.error('Error updating account information:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4} mb={2}>
        <Typography variant="h5" component="h1">
          Account Information
        </Typography>
      </Box>
      <Box mt={2}>
        <TextField
          label="Name"
          value={accountInfo.name}
          onChange={(e) =>
            setAccountInfo({ ...accountInfo, name: e.target.value })
          }
          variant="outlined"
          fullWidth
          margin="normal"
          InputProps={{
            readOnly: !isEditing,
          }}
        />
        <TextField
          label="Email"
          value={accountInfo.email}
          onChange={(e) =>
            setAccountInfo({ ...accountInfo, email: e.target.value })
          }
          variant="outlined"
          fullWidth
          margin="normal"
          InputProps={{
            readOnly: !isEditing,
          }}
        />
        <TextField
          label="Role"
          value={accountInfo.role}
          variant="outlined"
          fullWidth
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Created At"
          value={accountInfo.createdAt}
          variant="outlined"
          fullWidth
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
        />
        <Box mt={2} display="flex" justifyContent="space-between">
          {!isEditing ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                color="success"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </>
          )}
        </Box>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default AccountInfo;
