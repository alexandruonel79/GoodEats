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
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const UserRestaurants = () => {
  const { token } = useAuth(); // Access token from AuthContext
  const [restaurants, setRestaurants] = useState([]);
  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    location: "",
    category: "",
  });
  const [filter, setFilter] = useState("approved"); // Filter for approved/denied restaurants

  // Fetch restaurants based on filter
  useEffect(() => {
    if (token) {
      fetchRestaurants();
    } else {
      toast.error("You must be logged in to view restaurants.");
    }
  }, [token, filter]);

  const fetchRestaurants = async () => {
    const endpoint =
      filter === "approved"
        ? "http://localhost:5000/api/restaurant/get-approved"
        : "http://localhost:5000/api/restaurant/get-denied";

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
      setNewRestaurant({ name: "", location: "", category: "" });
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
              label="Location"
              fullWidth
              value={newRestaurant.location}
              onChange={(e) =>
                setNewRestaurant({ ...newRestaurant, location: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Category"
              fullWidth
              value={newRestaurant.category}
              onChange={(e) =>
                setNewRestaurant({ ...newRestaurant, category: e.target.value })
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
        </ToggleButtonGroup>
      </Box>

      {/* Restaurant List */}
      <Box>
        <Typography variant="h5" gutterBottom>
          {filter === "approved"
            ? "Approved Restaurants"
            : "Denied Restaurants"}
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
                      Validated: {restaurant.validated ? "Yes" : "No"}
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
    </Container>
  );
};

export default UserRestaurants;
