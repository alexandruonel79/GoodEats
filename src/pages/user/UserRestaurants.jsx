import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Rating,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthContext";
import "./UserRestaurants.css";

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
    } catch (error) {
      console.error(error);
      toast.error("Could not fetch restaurants.");
    }
  };

  const fetchAllRestaurants = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/restaurant/get-all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch all restaurants");
      }

      const data = await response.json();
      setRestaurants(data);
      toast.success("All restaurants fetched successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Could not fetch all restaurants.");
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

  const handleRatingChange = async (restaurantId, newRating) => {
    try {
      const response = await fetch(`http://localhost:5000/api/restaurant/rate/${restaurantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: newRating }),
      });

      if (!response.ok) {
        throw new Error("Failed to update rating");
      }

      const updatedRestaurant = await response.json();
      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((restaurant) =>
          restaurant.id === restaurantId ? updatedRestaurant : restaurant
        )
      );
      toast.success("Rating updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Could not update rating.");
    }
  };

  return (
    <div
      className={`${
        localStorage.getItem("theme") === "dark"
          ? "dark-container"
          : "light-container"
      }`}
    >
      <ToastContainer />
      <Typography variant="h4" className="title" align="center">
        Restaurant Suggestion
      </Typography>

      <Box component="form" noValidate autoComplete="off" className="form">
        <Grid container spacing={3}>
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
              label="Latitude"
              fullWidth
              value={newRestaurant.longitude}
              onChange={(e) =>
                setNewRestaurant({
                  ...newRestaurant,
                  longitude: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Longitude"
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
              fullWidth
            >
              Add Restaurant
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box className="filter-toggle" sx={{ mb: 4 }}>
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
        <Button
          variant="contained"
          color="secondary"
          onClick={fetchAllRestaurants}
          sx={{ ml: 2 }}
        >
          View All Restaurants
        </Button>
      </Box>

      <Box>
        <Typography variant="h5" gutterBottom align="center">
          {filter === "approved"
            ? "Approved Restaurants"
            : filter === "denied"
            ? "Denied Restaurants"
            : filter === "pending"
            ? "Pending Restaurants"
            : "All Restaurants"}
        </Typography>
        <div className="restaurant-list">
          {restaurants.length === 0 ? (
            <Typography variant="body1" align="center" sx={{ width: "100%" }}>
              No restaurants found.
            </Typography>
          ) : (
            restaurants.map((restaurant) => (
              <div className="restaurant-card" key={restaurant.id}>
                <div className="restaurant-card-header">
                  <Typography variant="h6">{restaurant.name}</Typography>
                </div>
                <div className="restaurant-card-content">
                  <Typography variant="body2" color="text.secondary">
                    Cuisine: {restaurant.cuisine || "Not Specified"}
                  </Typography>
                  <Typography variant="body2">
                    Validated: {restaurant.validated ? "Yes" : "No"}
                  </Typography>
                  <Rating
                    name={`rating-${restaurant.id}`}
                    value={restaurant.rating || 0}
                    onChange={(event, newValue) =>
                      handleRatingChange(restaurant.id, newValue)
                    }
                  />
                </div>
                <div className="restaurant-card-footer">
                  <Typography variant="caption" color="text.secondary">
                    Proposed: {new Date(restaurant.createdAt).toLocaleString()}
                  </Typography>
                </div>
              </div>
            ))
          )}
        </div>
      </Box>
    </div>
  );
};

export default UserRestaurants;
