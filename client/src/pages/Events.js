import React, { useState, useEffect } from 'react';
import { Typography, Container, Card, CardContent, Button, Grid } from '@mui/material';
import api from '../services/api';
import '../css/Event.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState({});

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

  return (
    <Container className="events-container">
      <Typography variant="h4" className="events-title">Events</Typography>
      <Grid container spacing={3}>
        {events.map((event) => {
          const isRegistered = registrationStatus[event._id];
          return (
            <Grid item xs={12} sm={6} key={event._id}>
              <Card className="event-card">
                <CardContent>
                  <Typography variant="h6" className="event-title">{event.title}</Typography>
                  <Typography variant="body2" className="event-description">{event.description}</Typography>
                  <Typography variant="body2" className="event-info">Type: {event.type}</Typography>
                  <Typography variant="body2" className="event-info">Date: {new Date(event.date).toLocaleDateString()}</Typography>
                  <Typography variant="body2" className="event-info">Location: {event.location.coordinates.join(', ')}</Typography>
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