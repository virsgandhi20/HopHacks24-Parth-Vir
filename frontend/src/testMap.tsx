import React, { useEffect, useState } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow
} from "@vis.gl/react-google-maps";
import HospitalRadialChart from './FilteredHospitalsVisualization';  // Import the radial chart component

// Define your Google Maps API key
const API_KEY = 'AIzaSyChSikYbVghK-lTIHMu2scvuamSOTVnBb0';

interface Hospital {
  name: string;
  lat: number;
  lng: number;
  website: string;
  suggestiveFactor: number;
  beds: number;
  patients: number;
  staff: number;
  trauma: number;
  helipad: number;
  distance: number;  // Add distance property for distance from user
}

export default function Intro() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [zoom, setZoom] = useState(15); 
  const MAX_DISTANCE_KM = 10;  // Max distance for filtering

  // Function to get the current location of the user
  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

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
            beds: parseInt(hospital.BEDS),
            patients: parseInt(hospital.Patie),
            staff: parseInt(hospital.STAFF),
            trauma: parseFloat(hospital.TRAUMA),
            helipad: parseInt(hospital.HELIPAD),
            distance: 0  // Default distance, will be calculated later
          }));

          setHospitals(hospitalData);
        } else {
          console.error('Error fetching hospitals:', data.error);
        }
      } catch (error) {
        console.error('Error fetching hospitals:', error);
      }
    };

    fetchHospitals();
    getLocation();
  }, []);

  // Function to calculate the distance using the Haversine formula
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
  };

  // Filter and sort hospitals based on distance and suggestive factor
  useEffect(() => {
    if (userLocation && hospitals.length > 0) {
      const nearbyHospitals = hospitals.map(hospital => ({
        ...hospital,
        distance: calculateDistance(userLocation.lat, userLocation.lng, hospital.lat, hospital.lng)
      })).filter(hospital => hospital.distance <= MAX_DISTANCE_KM);

      const sortedHospitals = nearbyHospitals.sort((a, b) => a.suggestiveFactor - b.suggestiveFactor);

      setFilteredHospitals(sortedHospitals);
    }
  }, [userLocation, hospitals]);

  return (
    <APIProvider apiKey={API_KEY}>
      <div style={{ height: '100vh', width: '90%', margin: '0 auto', alignItems: 'center' }}>

        <Map
          zoom={zoom}
          center={userLocation}
          mapId={"26817ae0c020858b"}
          zoomControl={true}
        >
          {userLocation && (
            <AdvancedMarker position={userLocation}>
              <Pin background={"black"} borderColor={"pink"} />
            </AdvancedMarker>
          )}

          {filteredHospitals.map((hospital) => (
            <AdvancedMarker
              key={hospital.name}
              position={{ lat: hospital.lat, lng: hospital.lng }}
              onClick={() => setSelectedHospital(hospital)}
            >
              <Pin background={hospital.suggestiveFactor > 1 ? "green" : hospital.suggestiveFactor < 1 ? "red" : "yellow"} />
            </AdvancedMarker>
          ))}

          {selectedHospital && (
            <InfoWindow
              position={{ lat: selectedHospital.lat, lng: selectedHospital.lng }}
              onCloseClick={() => setSelectedHospital(null)}
            >
              <div>
                <h3>{selectedHospital.name}</h3>
                <p>Suggestive Factor: {selectedHospital.suggestiveFactor}</p>
                <a href={selectedHospital.website} target="_blank" rel="noopener noreferrer">Visit Website</a>
              </div>
            </InfoWindow>
          )}
        </Map>

        {/* Add the Radial Visualization here */}
        <HospitalRadialChart hospitals={filteredHospitals} maxDistance={MAX_DISTANCE_KM} />
      </div>
    </APIProvider>
  );
}
