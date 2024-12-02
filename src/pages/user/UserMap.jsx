import React, { useEffect, useRef } from "react";
import { Box, Typography, Container } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
// Import modules directly from @arcgis/core
import WebMap from "@arcgis/core/WebMap";
import MapView from "@arcgis/core/views/MapView";
import esriConfig from "@arcgis/core/config";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";


const UserMap = () => {
  const mapRef = useRef(null);
  const { token } = useAuth();

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
            id: "be080c3c69ca4b7a8ff2dc5253b2e826", // Replace this with your actual WebMap ID
          },
        });

        // Create the MapView
        view = new MapView({
          container: mapRef.current, // Reference to the container
          map: webMap, // Reference to the WebMap
        });

        // Add GraphicsLayer to the map
        const graphicsLayer = new GraphicsLayer();
        webMap.add(graphicsLayer);

        // Fetch data from your database
        const data = await fetchPointsFromDatabase();

        // Add points as Graphics to the GraphicsLayer
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
            website: item.website,
            cuisine: item.cuisine,
          };
        
          const graphic = new Graphic({
            geometry: point,
            symbol: symbol,
            attributes: attributes,
            popupTemplate: popupTemplate,
          });
        
          graphicsLayer.add(graphic);
        });        
      } catch (error) {
        console.error("Error initializing the map:", error);
      }
    };

    initializeMap();

    // Cleanup function to destroy the view
    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, []);

  // Simulate fetching data from an API
  const fetchPointsFromDatabase = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/restaurant/get-all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Fetched data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching points from database:", error);
      return [];
    }
  };
  
  

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" gutterBottom>
        Explore Restaurants on the Map
      </Typography>
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
