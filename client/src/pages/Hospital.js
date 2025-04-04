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
} from "@mui/material";
import axios from 'axios';
import HospitalMap from '../components/HospitalMap';
import { styled } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PhoneIcon from '@mui/icons-material/Phone';
import StarRateIcon from '@mui/icons-material/StarRate';
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

function Hospital() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [hospitals, setHospitals] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { location } = uselocation(); // Access location from context

  useEffect(() => {
    let isMounted = true; // Flag to track if the component is mounted

    const fetchNearbyHospitals = async (latitude, longitude) => {
      try {
        setLoading(true);
        const response = await fetch(process.env.REACT_APP_API_URL+`api/hospital/nearby?lat=${latitude}&lng=${longitude}`);
        if (!response.ok) {
          throw new Error('Failed to fetch hospitals.');
        }
        const data = await response.json();
        if (isMounted) {
          setHospitals(data.places);
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
      fetchNearbyHospitals(location.latitude, location.longitude);
    }

    return () => {
      isMounted = false; // Cleanup: prevent state updates after unmount
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
              {hospitals.map((hospital, index) => (
                <HospitalItem key={index}>
                  <ListItemText
                    primary={
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {hospital.name}
                      </Typography>
                    }
                    secondary={
                      <Box component="div">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Chip
                            icon={<LocationOnIcon fontSize="small" />}
                            label={hospital.address}
                            variant="outlined"
                            size="small"
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
              ))}
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
        <MapContainer>
          {/* Pass valid location to HospitalMap */}
          {location?.latitude && location?.longitude ? (
            <HospitalMap 
              hospitals={hospitals} 
              userLocation={{
                latitude: parseFloat(location.latitude), // Ensure valid numbers
                longitude: parseFloat(location.longitude),
              }} 
            />
          ) : (
            <Typography variant="body1" color="textSecondary">
              Unable to fetch user location. Please enable location services.
            </Typography>
          )}
        </MapContainer>
      </Box>
    </StyledContainer>
  );
}

export default Hospital;