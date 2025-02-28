import React, { useState, useEffect } from 'react';
import { Typography, Container, Card, CardContent, Button, Grid } from '@mui/material';
import axios from 'axios';
import api from '../services/api';
import '../css/Event.css';

const Events = () => {
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

  return (
    <Container className="events-container">
      <Typography variant="h4" className="events-title">Events</Typography>
      <Grid container spacing={3}>
        {events.map((event) => {
          const isRegistered = registrationStatus[event._id];
          const placeName = placeNames[event._id];
          return (
            <Grid item xs={12} sm={6} key={event._id}>
              <Card className="event-card">
                <CardContent>
                  <Typography variant="h6" className="event-title">{event.title}</Typography>
                  <Typography variant="body2" className="event-description">{event.description}</Typography>
                  <Typography variant="body2" className="event-info">Type: {event.type}</Typography>
                  <Typography variant="body2" className="event-info">Date: {new Date(event.date).toLocaleDateString()}</Typography>
                  <Typography variant="body2" className="event-info">Location: {placeName}</Typography>
                  <Typography variant="body2" className="event-info">Capacity: {event.capacity}</Typography>
                  <Typography variant="body2" className="event-info">Registered Participants: {event.registeredParticipants.length}</Typography>
                  <Button
                    variant="contained"
                    className={isRegistered ? "registered-button" : "register-button"} 
                    onClick={() => handleRegister(event._id)}
                    disabled={isRegistered}
                  >
                    {isRegistered ? "Registered" : "Register"}
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