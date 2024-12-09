import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Logs = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch logs from the backend
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/dashboard/logs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLogs(response.data);
    } catch (error) {
      toast.error("Failed to fetch logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [token]);

  // Define columns for the DataGrid with custom styling for log levels
  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "message", headerName: "Message", width: 400 },
    {
      field: "level",
      headerName: "Level",
      width: 150,
      renderCell: (params) => {
        let color = "black"; // Default color
        if (params.value === "INFO") {
          color = "blue"; // Blue for INFO
        } else if (params.value === "DELETE") {
          color = "red"; // Red for DELETE
        }
        return <span style={{ color }}>{params.value}</span>;
      },
    },
    { field: "createdAt", headerName: "Created At", width: 200 },
  ];

  return (
    <Box sx={{ height: "100vh", p: 3 }}>
      <Typography variant="h4" mb={2}>
        Logs
      </Typography>
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={logs}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          loading={loading}
          getRowId={(row) => row.id}
        />
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default Logs;
