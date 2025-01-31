import React, { useState, useEffect } from 'react';
import { Typography, Container, Card, CardContent, Button } from '@mui/material';
import api from '../services/api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState({});

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response.data);

        // Fetch registration status for each event
        const statusResponse = await api.get('/user/registrations');
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
        const response = await api.get('/user');
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
      await api.post(`/events/${eventId}/register`);
      // Refresh events after registration
      const response = await api.get('/events');
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
    <Container>
      <Typography variant="h4">Events</Typography>
      {events.map((event) => {
        const isRegistered = registrationStatus[event._id];
        return (
          <Card key={event._id} style={{ marginBottom: 16 }}>
            <CardContent>
              <Typography variant="h6">{event.title}</Typography>
              <Typography variant="body2">{event.description}</Typography>
              <Typography variant="body2">Type: {event.type}</Typography>
              <Typography variant="body2">Date: {new Date(event.date).toLocaleDateString()}</Typography>
              <Typography variant="body2">Location: {event.location.coordinates.join(', ')}</Typography>
              <Typography variant="body2">Capacity: {event.capacity}</Typography>
              <Typography variant="body2">Registered Participants: {event.registeredParticipants.length}</Typography>
              <Button
                variant="contained"
                style={{ backgroundColor: isRegistered ? "green" : "#1976d2", color: "white" }} 
                onClick={() => handleRegister(event._id)}
                disabled={isRegistered}
              >
                {isRegistered ? "Registered" : "Register"}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </Container>
  );
}

export default Events;