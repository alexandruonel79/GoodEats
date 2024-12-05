import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Button,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import WebMap from "@arcgis/core/WebMap";
import MapView from "@arcgis/core/views/MapView";
import esriConfig from "@arcgis/core/config";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Search from "@arcgis/core/widgets/Search";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";

const UserMap = () => {
  const mapRef = useRef(null);
  const { token } = useAuth();

  const [cuisine, setCuisine] = useState("");
  const [rating, setRating] = useState(0);
  const [distance, setDistance] = useState(5000); // Default distance: 5km
  const [restaurantData, setRestaurantData] = useState([]);
  const [graphicsLayer, setGraphicsLayer] = useState(null);

  // Function to display points on the map
  const displayPoints = (data, layer) => {
    layer.removeAll(); // Clear existing graphics
    data.forEach((item) => {
      const point = {
        type: "point",
        longitude: item.longitude,
        latitude: item.latitude,
      };

      const symbol = {
        type: "simple-marker",
        color: "blue",
        size: "8px",
        outline: {
          color: "white",
          width: 1,
        },
      };

      const popupTemplate = {
        title: "{name}",
        content: `
          <b>Cuisine:</b> {cuisine}<br>
          <b>Rating:</b> {rating}<br>
          <b>Website:</b> <a href="{website}" target="_blank">{website}</a>
        `,
      };

      const attributes = {
        name: item.name,
        rating: item.rating,
        cuisine: item.cuisine,
        website: item.website,
      };

      const graphic = new Graphic({
        geometry: point,
        symbol: symbol,
        attributes: attributes,
        popupTemplate: popupTemplate,
      });

      layer.add(graphic);
    });
  };

  useEffect(() => {
    let view;

    const initializeMap = async () => {
      try {
        // Set the API key
        esriConfig.apiKey =
          "AAPTxy8BH1VEsoebNVZXo8HurG_hkGiOzgc4SwX1prvcLiaX63GT2bnDVo3EkyTbIntxHWOoaui5_q0KEAGWSrov-EegubpXBA9yIzl0LMZiNuyviuT2F-7Ov08CqsJLiigfpv3ekOTyCXr2aIHq0L7AHU4IbrHtc4HMpVIk49_xC3d6ZLol0D9iF1DKRdnGNsGoABA-0CILhfoySAwhxTJVIckJxXBZKrHVF6zJSllAL4o.AT1_4bMGrY4c";

        // Create a WebMap using your map's item ID
        const webMap = new WebMap({
          portalItem: {
            id: "be080c3c69ca4b7a8ff2dc5253b2e826", // Replace with your WebMap ID
          },
        });

        // Create the MapView
        view = new MapView({
          container: mapRef.current,
          map: webMap,
        });

        // Add GraphicsLayer to the map
        const layer = new GraphicsLayer();
        webMap.add(layer);
        setGraphicsLayer(layer);

        // Fetch and display points
        const data = await fetchPointsFromDatabase();
        setRestaurantData(data); // Store fetched data in state
        displayPoints(data, layer);

        // Add Search Widget
        const searchWidget = new Search({
          view: view,
          placeholder: "Search for a location or restaurant",
        });
        view.ui.add(searchWidget, {
          position: "top-right",
        });

        // Handle search results
        searchWidget.on("select-result", (event) => {
          const location = event.result.feature.geometry;
          findNearbyPoints(location, data, layer);
        });
      } catch (error) {
        console.error("Error initializing the map:", error);
      }
    };

    const findNearbyPoints = (location, data, layer) => {
      const nearbyPoints = data.filter((item) => {
        const point = {
          type: "point",
          longitude: item.longitude,
          latitude: item.latitude,
        };
        return geometryEngine.distance(location, point, "meters") <= distance;
      });

      displayPoints(nearbyPoints, layer);
    };

    initializeMap();

    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, [token]);

  const fetchPointsFromDatabase = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/restaurant/get-all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching points from database:", error);
      return [];
    }
  };

  const applyFilters = () => {
    if (!graphicsLayer) return;

    const filteredData = restaurantData.filter((item) => {
      const matchesCuisine = cuisine ? item.cuisine === cuisine : true;
      const matchesRating = item.rating >= rating;
      return matchesCuisine && matchesRating;
    });

    displayPoints(filteredData, graphicsLayer);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" gutterBottom>
        Explore Restaurants on the Map
      </Typography>

      {/* Filter Panel */}
      <Box display="flex" justifyContent="space-between" marginBottom={2} flexWrap="wrap" gap={2}>
        <FormControl>
          <InputLabel>Cuisine</InputLabel>
          <Select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Romanian">Romanian</MenuItem>
            <MenuItem value="Japanese">Japanese</MenuItem>
            {/* Add more cuisines */}
          </Select>
        </FormControl>

        <FormControl>
          <Typography gutterBottom>Minimum Rating</Typography>
          <Slider
            value={rating}
            onChange={(e, value) => setRating(value)}
            step={0.5}
            marks
            min={0}
            max={5}
            valueLabelDisplay="auto"
          />
        </FormControl>

        <Button variant="contained" color="primary" onClick={applyFilters}>
          Apply Filters
        </Button>
      </Box>

      {/* Map Container */}
      <Box
        ref={mapRef}
        sx={{
          width: "100%",
          height: "80vh",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      ></Box>
    </Container>
  );
};

export default UserMap;
