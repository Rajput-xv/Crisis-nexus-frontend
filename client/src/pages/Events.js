import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  Button, 
  Grid, 
  Box, 
  Avatar, 
  Chip,
  useTheme,
  LinearProgress
} from '@mui/material';
import axios from 'axios';
import api from '../services/api';
import {
  EventAvailable as EventIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  CalendarToday as DateIcon,
  HowToReg as RegIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';

const Events = () => {
  const theme = useTheme();
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState({});
  const [placeNames, setPlaceNames] = useState({});

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('api/events');
        setEvents(response.data);

        // Fetch registration status for each event
        const statusResponse = await api.get('api/user/registrations');
        const statusData = statusResponse.data.reduce((acc, eventId) => {
          acc[eventId] = true;
          return acc;
        }, {});
        setRegistrationStatus(statusData);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await api.get('api/user');
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchEvents();
    fetchUser();
  }, []);

  const handleRegister = async (eventId) => {
    try {
      await api.post(`api/events/${eventId}/register`);
      // Refresh events after registration
      const response = await api.get('api/events');
      setEvents(response.data);
      // Update registration status
      setRegistrationStatus((prevStatus) => ({
        ...prevStatus,
        [eventId]: true
      }));
    } catch (error) {
      console.error('Error registering for event:', error);
    }
  };

  const fetchPlaceName = async (lat, lon, eventId) => {
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
      setPlaceNames((prevPlaceNames) => ({
        ...prevPlaceNames,
        [eventId]: place
      }));
    } catch (error) {
      console.error('Error fetching place name:', error);
    }
  };

  useEffect(() => {
    if (events.length > 0) {
      events.forEach(event => {
        const [latitude, longitude] = event.location.coordinates;
        fetchPlaceName(latitude, longitude, event._id);
      });
    }
  }, [events]);

  const getEventTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'workshop': return 'secondary';
      case 'seminar': return 'primary';
      case 'meetup': return 'success';
      default: return 'info';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography 
        variant="h3" 
        sx={{
          fontWeight: 700,
          textAlign: 'center',
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 4
        }}
      >
        Upcoming Events
      </Typography>

      <Grid container spacing={3}>
        {events.map((event) => {
          const isRegistered = registrationStatus[event._id];
          const placeName = placeNames[event._id];
          const progressValue = (event.registeredParticipants.length / event.capacity) * 100;

          return (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                  transition: '0.3s',
                  ':hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[6]
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ 
                      bgcolor: theme.palette[getEventTypeColor(event.type)].main + '20', 
                      color: theme.palette[getEventTypeColor(event.type)].main,
                      mr: 2
                    }}>
                      <EventIcon />
                    </Avatar>
                    <Typography variant="h5" component="div">
                      {event.title}
                    </Typography>
                  </Box>

                  <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
                    {event.description}
                  </Typography>

                  <Grid container spacing={1} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Chip
                        icon={<DateIcon />}
                        label={new Date(event.date).toLocaleDateString()}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Chip
                        icon={<LocationIcon />}
                        label={placeName || 'Loading...'}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Chip
                      icon={<PeopleIcon />}
                      label={`${event.registeredParticipants.length}/${event.capacity}`}
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={event.type}
                      color={getEventTypeColor(event.type)}
                      variant="filled"
                    />
                  </Box>

                  <LinearProgress 
                    variant="determinate" 
                    value={progressValue} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4, 
                      mb: 2,
                      '.MuiLinearProgress-bar': {
                        borderRadius: 4
                      }
                    }}
                  />

                  <Button
                    fullWidth
                    variant={isRegistered ? "contained" : "outlined"}
                    startIcon={isRegistered ? <CheckIcon /> : <RegIcon />}
                    onClick={() => handleRegister(event._id)}
                    disabled={isRegistered}
                    sx={{
                      borderRadius: 3,
                      ...(isRegistered && {
                        background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                        color: theme.palette.common.white
                      })
                    }}
                  >
                    {isRegistered ? "Registered" : "Register Now"}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}

export default Events;