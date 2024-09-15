import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { addMarkers } from './addMarkers';  // Use external addMarkers function

// Set Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1Ijoidmlyc2dhbmRoaSIsImEiOiJjbTEya21wNnAwZm4xMnFvaTAwemZxcDFrIn0.DSEyJcbaSyOpg29_UZeYoQ';  // Replace with your Mapbox token

// Define a type for the hospital data
interface Hospital {
  name: string;
  lat: number;
  lng: number;
  website: string;
  suggestiveFactor: number;
}

const LoadMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  // Fetch hospital data from backend
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/hospitals');
        const data = await response.json();

        if (response.ok) {
          const hospitalData: Hospital[] = data.hospitals.map((hospital: any) => ({
            name: hospital.NAME,
            lat: parseFloat(hospital.LATITUDE),
            lng: parseFloat(hospital.LONGITUDE),
            website: hospital.WEBSITE || '',
            suggestiveFactor: parseFloat(hospital.Suggestive_Factor),
          }));

          setHospitals(hospitalData);
        } else {
          console.error('Error fetching hospitals:', data.error);
        }
      } catch (error) {
        console.error('Error fetching hospitals:', error);
      }
    };

    fetchHospitals();  // Fetch hospital data on component mount
  }, []);

  const getCenter = (hospitals: Hospital[]): [number, number] => {
    if (hospitals.length === 0) return [0, 0];  // Default to [0, 0] if no hospitals are loaded

    const latSum = hospitals.reduce((sum, hospital) => sum + hospital.lat, 0);
    const lngSum = hospitals.reduce((sum, hospital) => sum + hospital.lng, 0);
    const centerLat = latSum / hospitals.length - 363 / 111.32;
    const centerLng = lngSum / hospitals.length - 2878 / 111.32;

    console.log("Calculated center: ", [centerLng, centerLat]); // Log for debugging

    return [centerLng, centerLat];  // Ensure the result is a tuple [lng, lat]
  };
  // Initialize the map and add markers
  useEffect(() => {
    if (mapContainerRef.current && hospitals.length > 0) {
      const center: [number, number] = getCenter(hospitals);  // Ensure it returns a tuple
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: center,  // Use the dynamic center as LngLatLike
        zoom: 12,
      });

      // Add the markers using external addMarkers function
      map.on('load', () => {
        addMarkers(map, hospitals);
      });

      mapRef.current = map;

      // Clean up on unmount
      return () => map.remove();
    }
  }, [hospitals]);

  return (
    <div>
      {/* Map container with enhanced styling */}
      <div
        ref={mapContainerRef}
        style={{
          width: '90%', 
          height: '600px',
          margin: '40px auto',  // Center the map and add top/bottom space
          padding: '20px',  // Add inner padding
          backgroundColor: '#f4f4f4',  // Light background
          borderRadius: '15px',  // Curved edges
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',  // Soft shadow
          border: '1px solid #ddd',  // Thin border
        }}
      />
    </div>
  );
};

export default LoadMap;
