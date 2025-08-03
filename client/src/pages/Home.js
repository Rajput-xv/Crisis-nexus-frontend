import React, { useEffect, useState } from 'react';
import { Typography, Container, Grid, Card, CardContent, Button, CardMedia, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import IncidentMap from '../components/IncidentMap';
import Weather from '../components/Weather';
import { useAuth } from '../contexts/AuthContext';
import ImgHome from '../assets/home.jpg';
import { useLocation } from '../contexts/LocationContext';

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [placeName, setPlaceName] = useState('');
  const { location, setLocation } = useLocation(); // Access location from context

  const fetchIncidents = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/report`);
      setIncidents(response?.data);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    }
  };

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
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
    fetchLocation();
    fetchIncidents();
  }, []);

  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      fetchPlaceName(location.latitude, location.longitude);
    }
  }, [location]);

  const handleFindEventsClick = () => {
    if (user) {
      navigate('/events');
    } else {
      navigate('/register');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <Box 
        sx={{
          height: '90vh',
          width: '100%',
          position: 'relative',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${ImgHome})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <Container>
          <Typography 
            variant="h1" 
            gutterBottom 
            sx={{
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
              mb: 4
            }}
          >
            Welcome to Crisis Nexus
          </Typography>
          <Typography 
            variant="h4"
            sx={{
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
              mb: 4
            }}
          >
            Our platform helps coordinate disaster relief efforts, manage resources, and build community resilience.
          </Typography>
        </Container>
      </Box>

      {/* Content Section */}
      <Container sx={{ py: 8 }}>
        <Grid container spacing={4} sx={{ mt: 0 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ 
              boxShadow: 6,
              transition: 'transform 0.3s',
              '&:hover': { transform: 'scale(1.03)' }
            }}>
              <CardMedia 
                component="img" 
                height="250" 
                image="https://www.sine.co/wp-content/uploads/2022/02/Blog-Importance-of-effective-Incident-Reports.jpg" 
                alt="Report Incident" 
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h5" gutterBottom>Report Incident</Typography>
                <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/report')}>
                  Report Now
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card sx={{ 
              boxShadow: 6,
              transition: 'transform 0.3s',
              '&:hover': { transform: 'scale(1.03)' }
            }}>
              <CardMedia 
                component="img" 
                height="250" 
                image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1S5fFIEEAT_XGMedF_ra2w3eyGL8bKVqLRMet0MTQ1c-_cGA-GwpSRm9UdpZ2_U4rCzo&usqp=CAU" 
                alt="Find Events" 
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h5" gutterBottom>Find Events</Typography>
                <Button variant="contained" color="primary" fullWidth onClick={handleFindEventsClick}>
                  View Events
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card sx={{ 
              boxShadow: 6,
              transition: 'transform 0.3s',
              '&:hover': { transform: 'scale(1.03)' }
            }}>
              <CardMedia 
                component="img" 
                height="250" 
                image="https://static.vecteezy.com/system/resources/thumbnails/007/681/899/small/hospital-building-outside-composition-vector.jpg" 
                alt="Search Hospital" 
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h5" gutterBottom>Search Hospital</Typography>
                <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/hospital')}>
                Search Hospitals
                </Button>
              </CardContent>
            </Card>
          </Grid>          
        </Grid>

        {location?.latitude && location?.longitude && (
          <>
            <Typography variant="h3" sx={{ mt: 8, mb: 4 }}>Weather Information</Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>Location: {placeName}</Typography>
            <Weather lat={location.latitude} lon={location.longitude} />
          </>
        )}

        {location?.latitude && location?.longitude && (
          <>
            <Typography variant="h3" sx={{ mt: 8, mb: 4 }}>Incident Map</Typography>
            <IncidentMap incidents={incidents} latitude={location.latitude} longitude={location.longitude} />
          </>
        )}
      </Container>
    </div>
  );
}

export default Home;