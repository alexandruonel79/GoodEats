import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box, Typography, Tabs, Tab } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const AdminRestaurantDashboard = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [approvedRestaurants, setApprovedRestaurants] = useState([]);
  const [deniedRestaurants, setDeniedRestaurants] = useState([]);
  const [pendingRestaurants, setPendingRestaurants] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch approved restaurants
  const fetchApprovedRestaurants = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/restaurant/get-approved", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApprovedRestaurants(response.data);
    } catch (error) {
      toast.error("Failed to fetch approved restaurants.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch denied restaurants
  const fetchDeniedRestaurants = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/restaurant/get-denied", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDeniedRestaurants(response.data);
    } catch (error) {
      toast.error("Failed to fetch denied restaurants.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch pending restaurants
  const fetchPendingRestaurants = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/restaurant/get-pending", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPendingRestaurants(response.data);
    } catch (error) {
      toast.error("Failed to fetch pending restaurants.");
    } finally {
      setLoading(false);
    }
  };

  // Approve a restaurant
  const approveRestaurant = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/restaurant/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Restaurant approved successfully!");
      fetchPendingRestaurants(); // Refresh pending restaurants
      fetchApprovedRestaurants(); // Refresh approved restaurants
    } catch (error) {
      toast.error("Failed to approve the restaurant.");
    }
  };

  // Deny a restaurant
  const denyRestaurant = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/restaurant/${id}/deny`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Restaurant denied successfully!");
      fetchPendingRestaurants(); // Refresh pending restaurants
      fetchDeniedRestaurants(); // Refresh denied restaurants
    } catch (error) {
      toast.error("Failed to deny the restaurant.");
    }
  };

  // Delete a restaurant
  const deleteRestaurant = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/restaurant/${id}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Restaurant deleted successfully!");
      if (activeTab === 0) fetchApprovedRestaurants();
      else if (activeTab === 1) fetchDeniedRestaurants();
      else if (activeTab === 2) fetchPendingRestaurants();
    } catch (error) {
      toast.error("Failed to delete the restaurant.");
    }
  };

  useEffect(() => {
    fetchApprovedRestaurants();
    fetchDeniedRestaurants();
    fetchPendingRestaurants();
  }, [token]);

  // Define columns for the DataGrid
  const columns = [
    { field: "id", headerName: "ID", width: 200 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "status", headerName: "Status", width: 150 },
    { field: "createdAt", headerName: "Created At", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          {activeTab === 2 && (
            <>
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={() => approveRestaurant(params.row.id)}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="warning"
                size="small"
                onClick={() => denyRestaurant(params.row.id)}
              >
                Deny
              </Button>
            </>
          )}
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => deleteRestaurant(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: "100vh", p: 3 }}>
      <Typography variant="h4" mb={2}>
        Admin Restaurant Dashboard
      </Typography>
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
        <Tab label="Approved Restaurants" />
        <Tab label="Denied Restaurants" />
        <Tab label="Pending Restaurants" />
      </Tabs>
      <Box sx={{ height: 600, width: "100%", mt: 3 }}>
        {activeTab === 0 && (
          <DataGrid
            rows={approvedRestaurants}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            loading={loading}
            getRowId={(row) => row.id}
          />
        )}
        {activeTab === 1 && (
          <DataGrid
            rows={deniedRestaurants}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            loading={loading}
            getRowId={(row) => row.id}
          />
        )}
        {activeTab === 2 && (
          <DataGrid
            rows={pendingRestaurants}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            loading={loading}
            getRowId={(row) => row.id}
          />
        )}
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default AdminRestaurantDashboard;
