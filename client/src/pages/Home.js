import React, { useEffect, useState } from 'react';
import { Typography, Container, TextField, List, ListItem, ListItemText, Card, CardContent, Button, Grid, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import IncidentMap from '../components/IncidentMap';
import Weather from '../components/Weather';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [placeName, setPlaceName] = useState('');

  const fetchIncidents = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + 'api/report');
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
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${process.env.REACT_APP_GOOGLE_PLACES_API_KEY}&language=en`
      );
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

  const handleFindEventsClick = () => {
    if (user) {
      navigate('/events');
    } else {
      navigate('/register');
    }
  };

  return (
    <Container>
      <Typography variant="h2" gutterBottom style={{ marginTop: '20px' }}>
        Welcome to Crisis Nexus
      </Typography>
      <Typography variant="body1">
        Our platform helps coordinate disaster relief efforts, manage resources, and build community resilience.
      </Typography>

      <div style={{ width: '100%', height: '500px', background: 'url("https://www.vuelio.com/uk/wp-content/uploads/2015/10/charity1.jpg") center/cover', margin: '20px 0' }} />

      <Grid container spacing={3} style={{ marginTop: '50px' }}>
        <Grid item xs={12} sm={4}>
          <Card style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)'}}>
            <CardMedia component="img" height="250" image="https://www.sine.co/wp-content/uploads/2022/02/Blog-Importance-of-effective-Incident-Reports.jpg" alt="Report Incident" />
            <CardContent>
              <Typography variant="h5">Report Incident</Typography>
              <Button variant="contained" color="primary" fullWidth style={{ marginTop: '10px' }} onClick={() => navigate('/report')}>
                Report Now
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)'}}>
            <CardMedia component="img" height="250" image="https://static.vecteezy.com/system/resources/thumbnails/007/681/899/small/hospital-building-outside-composition-vector.jpg" alt="Find a Hospital" />
            <CardContent>
              <Typography variant="h5">Find a Hospital</Typography>
              <Button variant="contained" color="secondary" fullWidth style={{ marginTop: '10px' }} onClick={() => navigate('/hospital')}>
                Search Hospitals
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)'}}>
            <CardMedia component="img" height="250" image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1S5fFIEEAT_XGMedF_ra2w3eyGL8bKVqLRMet0MTQ1c-_cGA-GwpSRm9UdpZ2_U4rCzo&usqp=CAU" alt="Find Events" />
            <CardContent>
              <Typography variant="h5">Find Events</Typography>
              <Button variant="contained" color="success" fullWidth style={{ marginTop: '10px' }} onClick={handleFindEventsClick}>
                View Events
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {latitude && longitude && (
        <>
          <h2 style={{marginTop:'50px'}}>Weather Information</h2>
          <Typography variant="h6">Place Name: {placeName}</Typography>
          <Weather lat={latitude} lon={longitude} />
        </>
      )}

      {latitude && longitude && (
        <>
          <h2 style={{ marginTop: '50px' }}>Incident Map</h2>
          <IncidentMap incidents={incidents} latitude={latitude} longitude={longitude} />
        </>
      )}
    </Container>
  );
}

export default Home;
