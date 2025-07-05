import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Alert,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Box,
  Chip,
  Button,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import axios from 'axios';
import HospitalMap from '../components/HospitalMap';
import { styled } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PhoneIcon from '@mui/icons-material/Phone';
import StarRateIcon from '@mui/icons-material/StarRate';
import DirectionsIcon from '@mui/icons-material/Directions';
import NearMeIcon from '@mui/icons-material/NearMe';
import { uselocation } from '../contexts/LocationContext';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  [theme.breakpoints.down('sm')]: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

const SearchCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[4],
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    boxShadow: theme.shadows[1],
  },
}));

const MapContainer = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  boxShadow: theme.shadows[4],
  marginTop: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    height: '400px',
  },
}));

const HospitalItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.action.hover,
  },
}));

const RouteControlCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
}));

function Hospital() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [hospitals, setHospitals] = useState(() => {
    const savedHospitals = localStorage.getItem('hospitals');
    return savedHospitals ? JSON.parse(savedHospitals) : [];
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [nearestHospital, setNearestHospital] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const { location, setLocation } = uselocation(); // Access location from context

  // Find nearest hospital when hospitals change (hospitals are already sorted by distance from backend)
  useEffect(() => {
    if (hospitals.length > 0) {
      // Since hospitals are already sorted by distance, the first one is the nearest
      const nearest = hospitals[0];
      setNearestHospital(nearest);
      
      // Set selected hospital to nearest by default if no hospital is selected
      if (!selectedHospital) {
        setSelectedHospital(nearest);
      }
    }
  }, [hospitals, selectedHospital]);

  useEffect(() => {
    const savedLocation = localStorage.getItem('location');
    if (savedLocation) {
      setLocation(JSON.parse(savedLocation));
    }
  }, [setLocation]);

  useEffect(() => {
    let isMounted = true;

    const fetchNearbyHospitals = async (latitude, longitude) => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_API_URL}api/hospital/nearby`, {
                params: { lat: latitude, lng: longitude } // Send lat and lng as query parameters
            });
            if (isMounted) {
                const data = response.data;
                setHospitals(data.places); // Use the refined `places` array from the backend
                localStorage.setItem('hospitals', JSON.stringify(data.places)); // Save to localStorage
                setError(null);
            }
        } catch (err) {
            if (isMounted) {
                setError('Failed to fetch hospitals.');
            }
        } finally {
            if (isMounted) {
                setLoading(false);
            }
        }
    };

    if (location?.latitude && location?.longitude) {
        localStorage.setItem('location', JSON.stringify(location)); // Save location to localStorage
        fetchNearbyHospitals(location.latitude, location.longitude);
    }

    return () => {
        isMounted = false;
    };
}, [location]);

  return (
    <StyledContainer maxWidth="lg">
      <SearchCard>
        <Box textAlign="center" mb={4}>
          <Typography 
            variant="h3" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              color: theme.palette.text.primary,
              [theme.breakpoints.down('sm')]: {
                fontSize: '2rem',
              },
            }}
          >
            <LocalHospitalIcon sx={{ fontSize: 40, verticalAlign: 'middle', mr: 1 }} />
            Hospital Finder
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mt: 3,
              borderRadius: 2,
              '& .MuiAlert-message': {
                fontWeight: 500,
              }
            }}
          >
            {error}
          </Alert>
        )}
      </SearchCard>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      ) : (
        hospitals.length > 0 && (
          <Box>
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <LocalHospitalIcon color="primary" />
              {hospitals.length} Hospitals Found Nearby
            </Typography>
            <List>
              {hospitals.map((hospital, index) => {
                const isNearest = nearestHospital && hospital.name === nearestHospital.name;
                // Use the distance from backend data (already calculated and sorted)
                const distance = hospital.distance ? hospital.distance.toFixed(1) : null;

                return (
                  <HospitalItem 
                    key={index} 
                    sx={{ 
                      border: isNearest ? '2px solid #4CAF50' : 
                             (selectedHospital && hospital.name === selectedHospital.name) ? '2px solid #2196F3' : 'none',
                      position: 'relative',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedHospital(hospital)}
                  >
                    {isNearest && (
                      <Chip
                        label="NEAREST"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.7rem'
                        }}
                      />
                    )}
                    {selectedHospital && hospital.name === selectedHospital.name && !isNearest && (
                      <Chip
                        label="SELECTED"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: '#2196F3',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.7rem'
                        }}
                      />
                    )}
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {hospital.name}
                          </Typography>
                          {distance && (
                            <Chip
                              icon={<DirectionsIcon fontSize="small" />}
                              label={`${distance} km`}
                              size="small"
                              variant="outlined"
                              color={isNearest ? "success" : "default"}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box component="div">
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              flexWrap: 'wrap', 
                              alignItems: 'center', 
                              gap: 1, 
                              mb: 1 
                            }}
                          >
                            <Chip
                              icon={<LocationOnIcon fontSize="small" />}
                              label={
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    wordWrap: 'break-word', 
                                    whiteSpace: 'normal', // Allow text to wrap
                                    overflow: 'hidden', 
                                    textOverflow: 'ellipsis', 
                                    maxWidth: { xs: '100%', sm: '250px', md: '100%' }, 
                                    lineHeight: 1.5 
                                  }}
                                >
                                  {hospital.address}
                                </Typography>
                              }
                              variant="outlined"
                              size="medium" // Use medium size for better spacing
                              sx={{
                                height: 'auto', // Allow dynamic height
                                padding: '8px', // Add padding for better appearance
                              }}
                            />
                            {hospital.website && (
                              <Chip
                                label="Visit Website"
                                component="a"
                                href={hospital.website}
                                target="_blank"
                                clickable
                                variant="outlined"
                                size="small"
                              />
                            )}
                          </Box>
                        </Box>
                      }
                    />
                  </HospitalItem>
                );
              })}
            </List>
          </Box>
        )
      )}

      <Box mt={6}>
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            fontWeight: 600,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <LocationOnIcon color="primary" />
          Hospital Map View
        </Typography>

        {/* Route Control Card */}
        {selectedHospital && (
          <RouteControlCard>
            <CardContent>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
                  <NearMeIcon color="success" />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Selected Hospital: <strong>{selectedHospital.name}</strong>
                    {nearestHospital && selectedHospital.name === nearestHospital.name && (
                      <Chip
                        label="NEAREST"
                        size="small"
                        sx={{
                          ml: 1,
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.6rem'
                        }}
                      />
                    )}
                  </Typography>
                </Box>
                <Typography 
                  variant="body2" 
                  color="textSecondary"
                  sx={{ 
                    fontStyle: 'italic',
                    textAlign: { xs: 'center', sm: 'right' }
                  }}
                >
                  <DirectionsIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                  Click any hospital from the list to select it.<br/>
                  Routes will be shown on the map below.
                </Typography>
              </Stack>
            </CardContent>
          </RouteControlCard>
        )}

        <MapContainer>
          {/* Pass valid location to HospitalMap */}
          {location?.latitude && location?.longitude ? (
            <HospitalMap 
              hospitals={hospitals} 
              userLocation={{
                latitude: parseFloat(location.latitude), // Ensure valid numbers
                longitude: parseFloat(location.longitude),
              }}
              selectedHospital={selectedHospital}
              onHospitalSelect={setSelectedHospital}
            />
          ) : (
            <Typography variant="body1" color="textSecondary">
              Unable to fetch user location. Please enable location services.
            </Typography>
          )}
        </MapContainer>
      </Box>

      {/* Route control section */}
      {selectedHospital && (
        <RouteControlCard>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Selected Hospital: {selectedHospital.name}
              {nearestHospital && selectedHospital.name === nearestHospital.name && (
                <Chip
                  label="NEAREST"
                  size="small"
                  sx={{
                    ml: 1,
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.7rem'
                  }}
                />
              )}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<DirectionsIcon />}
                fullWidth
                onClick={() => {
                  // Handle route navigation to the selected hospital
                  window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.lat},${selectedHospital.lng}`, '_blank');
                }}
              >
                Get Directions
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                startIcon={<NearMeIcon />}
                fullWidth
                onClick={() => {
                  // Handle re-calculating the route from the current location
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((position) => {
                      const { latitude, longitude } = position.coords;
                      window.open(`https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${selectedHospital.lat},${selectedHospital.lng}`, '_blank');
                    });
                  } else {
                    alert('Geolocation is not enabled in this browser.');
                  }
                }}
              >
                Recalculate Route
              </Button>
            </Stack>
          </CardContent>
        </RouteControlCard>
      )}
    </StyledContainer>
  );
}

export default Hospital;