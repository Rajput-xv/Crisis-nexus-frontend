import React, { useState, useEffect } from 'react';
import { Typography, Container, Grid, Card, CardContent, Paper, Button, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({ 
    eventsAttended: 0,
    resourcesContributed: 0,
    pointsEarned: 0,
    level: 1,
    totalDonations: 0,
    currency: 'USD' // Default currency
  });
  const [latestEvents, setLatestEvents] = useState([]);
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, eventsResponse, registrationsResponse, donationsResponse, resourcesResponse] = await Promise.all([
          api.get('/user/stat'), 
          api.get('/events/latest'),
          api.get('/user/registrations'),
          api.get('/donations'),
          api.get('/user/resources-donated')
        ]);
        
        setUserStats({
          ...statsResponse.data,
          eventsAttended: registrationsResponse.data.length,
          totalDonations: donationsResponse.data.reduce((total, donation) => total + donation.amount, 0),
          currency: donationsResponse.data.length > 0 ? donationsResponse.data[0].currency : 'USD', // Set currency from donations
          resourcesContributed: resourcesResponse.data.totalQuantity
        });
        setLatestEvents(eventsResponse.data.slice(0, 5)); // Limit to top 5 latest events
        setDonations(donationsResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const handleViewDetails = (eventId) => {
    navigate(`/events/`);
  };

  const handleViewForm = () => {
    navigate(`/resources/`);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom style={{ marginTop: '20px' }}>
        Welcome, {user ? user.username : 'Guest'}!
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Role: {user ? user.role : 'N/A'} | Level: {userStats.level}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper style={{ padding: '20px', marginTop: '20px' }}>
            <Typography variant="h6">Your Stats</Typography>
            <Typography>Events Attended: {userStats.eventsAttended}</Typography>
            <Typography>Resources Contributed: {userStats.resourcesContributed}</Typography>
            <Typography>Total Donations: {userStats.currency} {userStats.totalDonations}</Typography>
            <Typography>Points Earned: {userStats.points}</Typography>
          </Paper>
          <Box mb={2}>
            <Button variant="contained" color="primary" onClick={() => handleViewForm()} style={{ marginTop: '20px' }}>
              Donate Money
            </Button>
          </Box>
          <Box mb={2}>
            <Button variant="contained" color="primary" onClick={() => handleViewForm()}>
              Donate Resources
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper style={{ padding: '16px' }}>
            <Typography variant="h6">Upcoming Events</Typography>
            {latestEvents.map((event) => (
              <Card key={event._id} style={{ marginBottom: 16 }}>
                <CardContent>
                  <Typography variant="h6">{event.title}</Typography>
                  <Typography variant="body2">{event.description}</Typography>
                  <Typography variant="body2">Type: {event.type}</Typography>
                  <Typography variant="body2">Date: {new Date(event.date).toLocaleDateString()}</Typography>
                  <Typography variant="body2">Location: {event.location?.coordinates?.join(', ')}</Typography>
                  <Typography variant="body2">Capacity: {event.capacity}</Typography>
                  <Typography variant="body2">Registered Participants: {event.registeredParticipants?.length}</Typography>
                  <Button
                    variant="contained"
                    className="view-details-button"
                    onClick={() => handleViewDetails(event._id)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;