import React, { useEffect, useRef } from "react";
import { Box, Typography, Container } from "@mui/material";
// Import modules directly from @arcgis/core
import WebMap from "@arcgis/core/WebMap";
import MapView from "@arcgis/core/views/MapView";
import esriConfig from "@arcgis/core/config";

const UserMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    let view;

    const initializeMap = () => {
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
