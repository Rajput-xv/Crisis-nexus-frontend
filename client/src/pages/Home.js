import React, { useEffect, useState } from 'react';
import { Typography, Container } from '@mui/material';
import axios from 'axios';
import IncidentMap from '../components/IncidentMap';
import Weather from '../components/Weather';

function Home() {
  const [incidents, setIncidents] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [placeName, setPlaceName] = useState('');

  const fetchIncidents = async () => {
    try {
      const response = await axios.get('/api/report/report');
      setIncidents(response?.data);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    }
  };

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        () => {
          console.error('Geolocation is not supported by this browser.');
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const fetchPlaceName = async (lat, lon) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${process.env.REACT_APP_GOOGLE_PLACES_API_KEY}&language=en`);
      const results = response.data.results;
      let locality = '';
      let administrativeArea = '';
      let country = '';

      for (let i = 0; i < results.length; i++) {
        const addressComponents = results[i].address_components;
        for (let j = 0; j < addressComponents.length; j++) {
          if (addressComponents[j].types.includes('locality')) {
            locality = addressComponents[j].long_name;
          }
          if (addressComponents[j].types.includes('administrative_area_level_1')) {
            administrativeArea = addressComponents[j].long_name;
          }
          if (addressComponents[j].types.includes('country')) {
            country = addressComponents[j].long_name;
          }
        }
        if (locality && administrativeArea && country) break;
      }

      const place = `${locality}, ${administrativeArea}, ${country}`;
      setPlaceName(place);
    } catch (error) {
      console.error('Error fetching place name:', error);
    }
  };

  useEffect(() => {
    fetchIncidents();
    fetchLocation();
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      fetchPlaceName(latitude, longitude);
    }
  }, [latitude, longitude]);

  return (
    <Container>
      <Typography variant="h2">Welcome to Crisis Nexus</Typography>
      <Typography variant="body1">
        Our platform helps coordinate disaster relief efforts, manage resources, and build community resilience.
      </Typography>

      {latitude && longitude && (
        <>
          <h2>Weather Information</h2>
          <Typography variant="h6">Place Name: {placeName}</Typography>
          <Weather lat={latitude} lon={longitude} />
        </>
      )}

      <h2>Incident Map</h2>
      <IncidentMap incidents={incidents} />

    </Container>
  );
}

export default Home;