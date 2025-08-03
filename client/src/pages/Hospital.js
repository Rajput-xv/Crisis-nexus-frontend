import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Container,
  Typography,
  Alert,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  useTheme,
  Box,
  Chip,
  Button,
  Stack,
  Card,
  CardContent,
  TextField,
  InputAdornment,
} from "@mui/material";
import axios from 'axios';
import HospitalMap from '../components/HospitalMap';
import { styled } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import DirectionsIcon from '@mui/icons-material/Directions';
import NearMeIcon from '@mui/icons-material/NearMe';
import SearchIcon from '@mui/icons-material/Search';
import { useLocation } from '../contexts/LocationContext';

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
  const mapRef = useRef(null); // Reference to the map container
  const [hospitals, setHospitals] = useState(() => {
    const savedHospitals = localStorage.getItem('hospitals');
    return savedHospitals ? JSON.parse(savedHospitals) : [];
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [nearestHospital, setNearestHospital] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [searchCity, setSearchCity] = useState("");
  const [searchMode, setSearchMode] = useState(false); // false = location-based, true = city-based
  const { location, setLocation } = useLocation(); // Access location from context

  // Memoized function to prevent unnecessary re-renders in child components
  const handleSetNearestHospital = useCallback((hospital) => {
    setNearestHospital(hospital);
  }, []);

  // Function to handle hospital selection and scroll to map
  const handleHospitalSelect = useCallback((hospital) => {
    setSelectedHospital(hospital);
    
    // Scroll to map component with smooth animation
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100); // Small delay to ensure state update
  }, []); // No dependencies needed since it only sets state

  // Function to search hospitals by city
  const handleCitySearch = async () => {
    if (!searchCity.trim()) {
      setError("Please enter a city name");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      // Clear all previous state immediately when switching to city search
      setSelectedHospital(null);
      setNearestHospital(null);
      setHospitals([]); // Clear hospitals to trigger route clearing
      
      // Clear any cached data that might persist
      localStorage.removeItem('hospitals');
      localStorage.removeItem('nearestHospital');
      localStorage.removeItem('selectedHospital');
      
      // Force a small delay to ensure route clearing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setSearchMode(true); // Set search mode to trigger route clearing in map
      
      // Include user location in the request if available for better sorting
      const params = new URLSearchParams();
      if (location?.latitude && location?.longitude) {
        params.append('lat', location.latitude);
        params.append('lng', location.longitude);
      }
      
      const queryString = params.toString();
      const url = `${process.env.REACT_APP_API_URL}/api/hospital/city/${encodeURIComponent(searchCity.trim())}${queryString ? `?${queryString}` : ''}`;
      
      const response = await axios.get(url);
      
      const data = response.data;
      
      // Set new data after clearing
      setHospitals(data.places || data);
      localStorage.setItem('hospitals', JSON.stringify(data.places || data));
      localStorage.setItem('searchCity', searchCity.trim());
      
    } catch (err) {
      console.error("Error searching hospitals by city:", err);
      setError(err.response?.data?.message || 'Failed to fetch hospitals for this city.');
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to clear search and return to location-based search
  const handleClearSearch = async () => {
    setSearchCity("");
    setError("");
    setSelectedHospital(null);
    setNearestHospital(null);
    setHospitals([]); // Clear hospitals to trigger route clearing
    
    // Force a small delay to ensure route clearing
    await new Promise(resolve => setTimeout(resolve, 100));
    
    setSearchMode(false);
    localStorage.removeItem('searchCity');
    localStorage.removeItem('hospitals');
    
    // Clear any cached data that might persist
    localStorage.removeItem('nearestHospital');
    localStorage.removeItem('selectedHospital');
    
    // Trigger location-based search after clearing
    if (location?.latitude && location?.longitude) {
      // The useEffect will automatically refetch when searchMode becomes false
      // No need to manually set hospitals to empty array again
    }
  };

  // Find nearest hospital when hospitals change - let HospitalMap handle auto-selection
  useEffect(() => {
    if (hospitals.length > 0) {
      // Set nearest hospital in both location and city search modes
      const nearest = hospitals[0];
      setNearestHospital(nearest);
    } else {
      // Clear nearest hospital when no hospitals
      setNearestHospital(null);
      setSelectedHospital(null); // Also clear selected hospital
    }
  }, [hospitals]); // Only depend on hospitals array

  // Separate effect to check if selected hospital is still valid
  useEffect(() => {
    if (hospitals.length > 0 && selectedHospital) {
      // Check if current selectedHospital is still in the new hospitals array
      if (!hospitals.some(hospital => hospital.name === selectedHospital.name)) {
        setSelectedHospital(null); // Clear selection if hospital is not in current array
      }
    }
  }, [hospitals, selectedHospital]); // Include selectedHospital in dependencies

  useEffect(() => {
    const savedLocation = localStorage.getItem('location');
    const savedCity = localStorage.getItem('searchCity');
    
    if (savedCity) {
      setSearchCity(savedCity);
      setSearchMode(true);
    } else if (savedLocation) {
      setLocation(JSON.parse(savedLocation));
    }
  }, [setLocation]);

  useEffect(() => {
    let isMounted = true;

    if (location?.latitude && location?.longitude && !searchMode) {
      localStorage.setItem('location', JSON.stringify(location));
      
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/hospital/nearby`, {
            params: { lat: location.latitude, lng: location.longitude }
          });
          if (isMounted) {
            const data = response.data;
            setHospitals(data.places);
            localStorage.setItem('hospitals', JSON.stringify(data.places));
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

      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [location, searchMode]);

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
          
          {/* Search Bar */}
          <Box sx={{ mt: 3, maxWidth: 600, mx: 'auto' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter city name to search hospitals..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCitySearch();
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleCitySearch}
                        disabled={loading}
                        sx={{ minWidth: 'auto', px: 2 }}
                      >
                        Search
                      </Button>
                      {(searchMode || searchCity) && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleClearSearch}
                          sx={{ minWidth: 'auto', px: 2 }}
                        >
                          Clear
                        </Button>
                      )}
                    </Stack>
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: theme.palette.background.default,
                }
              }}
            />
            
            {searchMode && (
              <Typography 
                variant="body2" 
                color="primary" 
                sx={{ mt: 1, fontWeight: 500 }}
              >
                🏙️ Showing hospitals in: {localStorage.getItem('searchCity')}
              </Typography>
            )}
          </Box>
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
              {hospitals.length} Hospitals Found {searchMode ? `in ${localStorage.getItem('searchCity')}` : 'Nearby'}
            </Typography>
            <List>
              {hospitals.map((hospital, index) => {
                const isNearest = nearestHospital && hospital.name === nearestHospital.name;
                // Use the distance from backend data (already calculated and sorted)
                const distance = hospital.distance ? hospital.distance.toFixed(1) : null;

                return (
                  <HospitalItem 
                    key={hospital.name || index} 
                    sx={{ 
                      border: isNearest ? '2px solid #4CAF50' : 
                             (selectedHospital && hospital.name === selectedHospital.name) ? '2px solid #2196F3' : 'none',
                      position: 'relative',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleHospitalSelect(hospital)}
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
                      secondaryTypographyProps={{ component: 'div' }}
                    />
                  </HospitalItem>
                );
              })}
            </List>
          </Box>
        )
      )}

      <Box mt={6} ref={mapRef}>
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
        {selectedHospital && hospitals.length > 0 && 
         hospitals.some(hospital => hospital.name === selectedHospital.name) && (
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
              onHospitalSelect={handleHospitalSelect}
              searchMode={searchMode} // Pass search mode to trigger route clearing
              setNearestHospital={handleSetNearestHospital} // Pass memoized function to set nearest hospital
            />
          ) : (
            <Typography variant="body1" color="textSecondary">
              Unable to fetch user location. Please enable location services.
            </Typography>
          )}
        </MapContainer>
      </Box>

      {/* Route control section */}
      {selectedHospital && hospitals.length > 0 && 
       hospitals.some(hospital => hospital.name === selectedHospital.name) && (
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