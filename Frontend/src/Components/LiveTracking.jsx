import React, { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS

const LiveTracking = () => {
  const [currentLocation, setCurrentLocation] = useState({
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    const mapContainer = document.getElementById("map"); // Assuming the container is pre-initialized

    if (!mapContainer) {
      console.error("Map container not found");
      return;
    }

    // Initialize the map if not already initialized
    if (!mapContainer._leaflet_id) {
      const leafletMap = L.map(mapContainer).setView([0, 0], 15);

      // Add a tile layer (you can use any tile service here)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(leafletMap);

      // Add marker for current location
      const marker = L.marker([0, 0]).addTo(leafletMap);

      // Fetch location periodically
      const fetchLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setCurrentLocation({
                lat: latitude,
                lng: longitude,
              });
              marker.setLatLng([latitude, longitude]); // Update marker position
              leafletMap.setView([latitude, longitude], 15); // Update map center
            },
            (error) => {
              console.error("Error fetching location:", error);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            }
          );
        } else {
          console.error("Geolocation is not supported by this browser.");
        }
      };

      fetchLocation(); // Fetch initial location
      const intervalId = setInterval(fetchLocation, 5000); // Update every 5 seconds

      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }
  }, []);

  return (
    <div>
      <div id="map" style={{ width: "100%", height: "400px" }}></div>
    </div>
  );
};

export default LiveTracking;
