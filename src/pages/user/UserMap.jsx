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
import './UserMap.css'; // Assuming the CSS is in the same folder as the component

const UserMap = () => {
  const mapRef = useRef(null);
  const { token } = useAuth();

  const [cuisine, setCuisine] = useState("All");
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

      // Enhanced Symbol for markers
      const symbol = {
        type: "simple-marker",
        color: [24, 114, 200], // Blue color
        size: "12px", // Bigger size for visibility
        outline: {
          color: [255, 255, 255], // White outline
          width: 2, // Thicker outline
        },
        shadowColor: "rgba(0, 0, 0, 0.2)", // Subtle shadow for depth
        shadowBlur: 5, // Blur effect for shadow
        shadowOffsetX: 3, // Offset for shadow effect
        shadowOffsetY: 3,
      };

      // Custom Popup Template
      const popupTemplate = {
        title: "{name}",
        content: `
        <div class="popup-title">${item.name}</div>
        <div><b>Cuisine:</b> <span class="popup-cuisine">${item.cuisine}</span></div>
        <div><b>Rating:</b> <span class="popup-rating">${item.rating}</span> ★</div>
        <div><b>Website:</b> <a href="${item.website}" target="_blank" class="popup-link">${item.website}</a></div>
        <div class="popup-footer">Click for details</div>
      `,
      };

      // Custom Attributes
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

      // Add graphic to the layer
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

        // Add Search Widget with Enhanced Styling
        const searchWidget = new Search({
          view: view,
          placeholder: "Search for a location or restaurant",
          // You can customize the search widget here, like setting more properties
        });

        // Add the search widget to the UI in a styled container
        view.ui.add(searchWidget, {
          position: "top-right",
          index: 2, // Adjust index if needed to avoid overlap with other widgets
        });

        // Apply custom styles using JavaScript or add a class to the widget
        searchWidget.domNode.classList.add("custom-search-widget");

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
      const matchesCuisine = cuisine !== 'All' ? item.cuisine === cuisine : true;
      const matchesRating = item.rating >= rating;
      return matchesCuisine && matchesRating;
    });

    displayPoints(filteredData, graphicsLayer);
  };

  return (
    <div className={`container ${localStorage.getItem('theme') === 'dark' ? 'dark-container' : 'light-container'}`}>
      <Container maxWidth="lg">
        {/* Filter Panel */}
        <Box className="filter-panel">
          <FormControl>
            <Typography gutterBottom>Cuisine</Typography>
            <Select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
              <MenuItem value="All">All</MenuItem>
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
          className="map-container"
        ></Box>
      </Container>
    </div>
  );
};

export default UserMap;
