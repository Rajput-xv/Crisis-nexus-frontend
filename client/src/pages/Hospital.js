import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
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
  IconButton
} from "@mui/material";
import axios from 'axios';
import HospitalMap from '../components/HospitalMap';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PhoneIcon from '@mui/icons-material/Phone';
import StarRateIcon from '@mui/icons-material/StarRate';

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
//   height: '600px',
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
  const [city, setCity] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [allHospitals, setAllHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);

  const fetchAllHospitals = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + `api/hospital`);
      setAllHospitals(response.data);
    } catch (err) {
      console.error("Error fetching all hospitals:", err);
    } finally {
      setMapLoading(false);
    }
  };

  const fetchHospitals = async () => {
    setSearched(true);
    setError("");
    setHospitals([]);
    setLoading(true);

    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + `api/hospital/${city}`);
      setHospitals(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "No hospitals found in this city");
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchHospitals();
    } else {
      setError("City name cannot be empty");
      setSearched(true);
    }
  };

  useEffect(() => {
    fetchAllHospitals();
  }, []);

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

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={9}>
              <TextField
                fullWidth
                label="Enter City Name"
                variant="outlined"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <LocationOnIcon 
                      color="action" 
                      sx={{ mr: 1, fontSize: 28 }} 
                    />
                  ),
                  sx: {
                    borderRadius: 2,
                    '& .MuiOutlinedInput-input': {
                      padding: theme.spacing(2),
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  height: '56px',
                  borderRadius: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
                startIcon={<SearchIcon />}
              >
                {loading ? <CircularProgress size={24} /> : 'Search'}
              </Button>
            </Grid>
          </Grid>
        </form>

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

      {hospitals.length > 0 && (
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
            {hospitals.length} Hospitals Found in {city}
          </Typography>
          <List>
            {hospitals.map((hospital) => (
              <HospitalItem key={hospital.id}>
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
                          label={`${hospital.city}, ${hospital.pinCode}`}
                          variant="outlined"
                          size="small"
                        />
                        <Chip 
                          icon={<PhoneIcon fontSize="small" />}
                          label={hospital.phoneNumber}
                          variant="outlined"
                          size="small"
                        />
                        <Chip 
                          icon={<StarRateIcon fontSize="small" />}
                          label={`${hospital.rating} Rating`}
                          color="warning"
                          size="small"
                        />
                      </Box>
                    </Box>
                  }
                />
              </HospitalItem>
            ))}
          </List>
        </Box>
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
          {mapLoading ? (
            <Box 
              display="flex" 
              justifyContent="center" 
              alignItems="center" 
              height="100%"
            >
              <CircularProgress />
            </Box>
          ) : (
            <HospitalMap hospitals={allHospitals} />
          )}
        </MapContainer>
      </Box>
    </StyledContainer>
  );
}

export default Hospital;