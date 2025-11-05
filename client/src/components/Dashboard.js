import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Paper, 
  Button, 
  Box, 
  Chip,
  Avatar,
  LinearProgress,
  useTheme
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
  Event as EventIcon,
  VolunteerActivism as DonationIcon,
  LocalLibrary as ResourceIcon,
  Star as StarIcon,
  ChevronRight as ArrowIcon
} from '@mui/icons-material';

function Dashboard() {
  const theme = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({ 
    eventsAttended: 0,
    resourcesContributed: 0,
    pointsEarned: 0,
    level: 1,
    totalDonations: 0,
    currency: 'INR'
  });
  const [latestEvents, setLatestEvents] = useState([]);
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || !user._id) {
        console.error('User not loaded');
        return;
      }

      try {
        const [statsResponse, eventsResponse, registrationsResponse, donationsResponse, resourcesResponse] = await Promise.all([
          api.get('api/user/stat'), 
          api.get('api/events/latest'),
          api.get('api/user/registrations'),
          api.get(`api/donations?userId=${user._id}`),
          api.get('api/user/resources-donated')
        ]);
        
        setUserStats({
          ...statsResponse.data,
          eventsAttended: registrationsResponse.data.length,
          totalDonations: donationsResponse.data.reduce((total, donation) => total + donation.amount, 0),
          currency: donationsResponse.data.length > 0 ? donationsResponse.data[0].currency : 'INR',
          resourcesContributed: resourcesResponse.data.totalQuantity
        });
        setLatestEvents(eventsResponse.data.slice(0, 5)); // Limit to top 5 latest events
        setDonations(donationsResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleViewDetails = (eventId) => {
    navigate(`/events/`);
  };

  const handleViewForm = () => {
    navigate(`/resources/`);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}
        >
          Welcome back, {user ? user.username : 'Guest'}!
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip 
            label={`Level ${userStats.level}`}
            color="secondary"
            avatar={<Avatar><StarIcon fontSize="small" /></Avatar>}
          />
          <Typography variant="subtitle1" color="text.secondary">
            Role: {user ? user.role : 'N/A'} | Points: {userStats.points}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <StatCard 
                title="Events Attended"
                value={userStats.eventsAttended}
                icon={<EventIcon fontSize="large" />}
                color={theme.palette.primary.main}
              />
            </Grid>
            <Grid item xs={6}>
              <StatCard 
                title="Resources Contributed"
                value={userStats.resourcesContributed}
                icon={<ResourceIcon fontSize="large" />}
                color={theme.palette.success.main}
              />
            </Grid>
            <Grid item xs={6}>
              <StatCard 
                title="Total Donations"
                value={`${userStats.currency} ${userStats.totalDonations}`}
                icon={<DonationIcon fontSize="large" />}
                color={theme.palette.warning.main}
              />
            </Grid>
            <Grid item xs={6}>
              <StatCard 
                title="Current Level"
                value={userStats.level}
                progress={((userStats.points % 1000) / 1000) * 100}
                icon={<StarIcon fontSize="large" />}
                color={theme.palette.secondary.main}
              />
            </Grid>
          </Grid>

          <Paper sx={{ p: 3, borderRadius: 4, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<DonationIcon />}
                  onClick={() => handleViewForm()}
                  sx={{ py: 1.5, borderRadius: 3 }}
                >
                  Donate Money
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ResourceIcon />}
                  onClick={() => handleViewForm()}
                  sx={{ py: 1.5, borderRadius: 3 }}
                >
                  Donate Resources
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>Upcoming Events</Typography>
            {latestEvents.map((event) => (
              <Card 
                key={event._id} 
                sx={{ 
                  mb: 2, 
                  transition: '0.3s',
                  ':hover': { 
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[6]
                  }
                }}
              >
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={8}>
                      <Typography variant="h6" sx={{ mb: 1 }}>{event.title}</Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {event.description}
                      </Typography>
                      <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          label={event.type} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                        <Chip 
                          label={new Date(event.date).toLocaleDateString()} 
                          size="small"
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
                      <Button
                        variant="contained"
                        endIcon={<ArrowIcon />}
                        onClick={() => handleViewDetails(event._id)}
                        sx={{ borderRadius: 3 }}
                      >
                        Details
                      </Button>
                      <LinearProgress 
                        variant="determinate" 
                        value={(event.registeredParticipants?.length / event.capacity) * 100} 
                        sx={{ mt: 2, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {event.registeredParticipants?.length}/{event.capacity} registered
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

const StatCard = ({ title, value, icon, color, progress }) => (
  <Card sx={{ 
    height: '100%', 
    position: 'relative',
    overflow: 'hidden',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: -20,
      right: -20,
      width: 60,
      height: 60,
      background: color,
      borderRadius: '50%',
      opacity: 0.1
    }
  }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>{value}</Typography>
        </div>
        <Avatar sx={{ bgcolor: color + '20', color: color, width: 48, height: 48 }}>
          {icon}
        </Avatar>
      </Box>
      {progress && (
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ mt: 2, height: 8, borderRadius: 4 }} 
        />
      )}
    </CardContent>
  </Card>
);

export default Dashboard;