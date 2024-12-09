import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify"; // Import ToastContainer here
import { useAuth } from "../../context/AuthContext";

const UserRestaurants = () => {
  const { token } = useAuth(); // Access token from AuthContext
  const [restaurants, setRestaurants] = useState([]);
  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    longitude: "",
    latitude: "",
    cuisine: "",
    rating: "",
    website: "",
  });
  const [filter, setFilter] = useState("approved"); // Filter for approved/denied/pending restaurants

  // Fetch restaurants based on filter
  useEffect(() => {
    if (token) {
      fetchRestaurants();
    } else {
      toast.error("You must be logged in to view restaurants.");
    }
  }, [token, filter]);

  const fetchRestaurants = async () => {
    let endpoint;
    switch (filter) {
      case "approved":
        endpoint = "http://localhost:5000/api/restaurant/get-approved";
        break;
      case "denied":
        endpoint = "http://localhost:5000/api/restaurant/get-denied";
        break;
      case "pending":
        endpoint = "http://localhost:5000/api/restaurant/get-pending";
        break;
      default:
        return;
    }

    try {
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch restaurants");
      }

      const data = await response.json();
      setRestaurants(data);
      // toast.success("Restaurants fetched successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Could not fetch restaurants.");
    }
  };

  const handleAddRestaurant = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/restaurant/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRestaurant),
      });

      if (!response.ok) {
        throw new Error("Failed to add restaurant");
      }

      const addedRestaurant = await response.json();
      toast.success("Restaurant added successfully!");
      setRestaurants([...restaurants, addedRestaurant]);
      setNewRestaurant({
        name: "",
        longitude: "",
        latitude: "",
        cuisine: "",
        rating: "",
        website: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Could not add restaurant.");
    }
  };

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  return (
    <Container maxWidth="md">
      <br />
      <Typography variant="h4" align="center" gutterBottom>
        Restaurant suggestion
      </Typography>

      {/* Add Restaurant Form */}
      <Box component="form" noValidate autoComplete="off" sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Name"
              fullWidth
              value={newRestaurant.name}
              onChange={(e) =>
                setNewRestaurant({ ...newRestaurant, name: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Longitude"
              fullWidth
              value={newRestaurant.longitude}
              onChange={(e) =>
                setNewRestaurant({ ...newRestaurant, longitude: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Latitude"
              fullWidth
              value={newRestaurant.latitude}
              onChange={(e) =>
                setNewRestaurant({ ...newRestaurant, latitude: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Cuisine"
              fullWidth
              value={newRestaurant.cuisine}
              onChange={(e) =>
                setNewRestaurant({ ...newRestaurant, cuisine: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Rating"
              fullWidth
              value={newRestaurant.rating}
              onChange={(e) =>
                setNewRestaurant({ ...newRestaurant, rating: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Website"
              fullWidth
              value={newRestaurant.website}
              onChange={(e) =>
                setNewRestaurant({ ...newRestaurant, website: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddRestaurant}
            >
              Add Restaurant
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Filter Toggle */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={handleFilterChange}
          aria-label="restaurant filter"
        >
          <ToggleButton value="approved" aria-label="approved">
            Approved
          </ToggleButton>
          <ToggleButton value="denied" aria-label="denied">
            Denied
          </ToggleButton>
          <ToggleButton value="pending" aria-label="pending">
            Pending
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Restaurant List */}
      <Box>
        <Typography variant="h5" gutterBottom>
          {filter === "approved"
            ? "Approved Restaurants"
            : filter === "denied"
            ? "Denied Restaurants"
            : "Pending Restaurants"}
        </Typography>
        <Grid container spacing={2}>
          {restaurants.length === 0 ? (
            <Typography variant="body1" align="center" sx={{ width: "100%" }}>
              No restaurants found.
            </Typography>
          ) : (
            restaurants.map((restaurant) => (
              <Grid item xs={12} sm={6} key={restaurant.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{restaurant.name}</Typography>
                    <Typography color="text.secondary">
                      {restaurant.location} - {restaurant.category}
                    </Typography>
                    <Typography variant="body2">
                      Validated: {restaurant.validated}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Typography variant="caption">
                      Proposed:{" "}
                      {new Date(restaurant.createdAt).toLocaleString()}
                    </Typography>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>

      {/* Add Toastify Container here */}
      <ToastContainer />
    </Container>
  );
};

export default UserRestaurants;
