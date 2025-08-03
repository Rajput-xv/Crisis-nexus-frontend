import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  People,
  Event,
  Report,
  AttachMoney,
  Inventory,
  TrendingUp,
  Warning,
  CheckCircle
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const StatsCard = styled(Card)(({ theme }) => ({
  height: '100%',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const MetricCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[8],
  },
}));

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setStats(response.data);
    } catch (err) {
      setError('Failed to fetch dashboard statistics');
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Loading Dashboard...</Typography>
        <LinearProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const statsData = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: <People fontSize="large" />,
      color: '#4CAF50'
    },
    {
      title: 'Total Events',
      value: stats?.totalEvents || 0,
      icon: <Event fontSize="large" />,
      color: '#2196F3'
    },
    {
      title: 'Total Incidents',
      value: stats?.totalIncidents || 0,
      icon: <Report fontSize="large" />,
      color: '#FF9800'
    },
    {
      title: 'Total Donations',
      value: stats?.totalDonations || 0,
      icon: <AttachMoney fontSize="large" />,
      color: '#9C27B0'
    },
    {
      title: 'Total Resources',
      value: stats?.totalResources || 0,
      icon: <Inventory fontSize="large" />,
      color: '#607D8B'
    },
    {
      title: 'Upcoming Events',
      value: stats?.upcomingEvents || 0,
      icon: <TrendingUp fontSize="large" />,
      color: '#FF5722'
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" gutterBottom fontWeight="bold" color="primary">
        Admin Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome to Crisis Nexus Administration Panel
      </Typography>

      {/* Main Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <StatsCard>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ color: 'rgba(255,255,255,0.9)', mb: 1 }}>
                  {stat.icon}
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {stat.title}
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>
        ))}
      </Grid>

      {/* Incident Status Overview */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <MetricCard>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Warning color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Active Incidents
                </Typography>
              </Box>
              <Typography variant="h3" color="warning.main" fontWeight="bold">
                {stats?.activeIncidents || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Incidents requiring immediate attention
              </Typography>
              <Chip 
                label="High Priority" 
                color="warning" 
                size="small" 
                sx={{ mt: 1 }}
              />
            </CardContent>
          </MetricCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <MetricCard>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <CheckCircle color="success" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Closed/Inactive Incidents
                </Typography>
              </Box>
              <Typography variant="h3" color="success.main" fontWeight="bold">
                {stats?.closedIncidents || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Successfully resolved incidents
              </Typography>
              <Chip 
                label="Resolved" 
                color="success" 
                size="small" 
                sx={{ mt: 1 }}
              />
            </CardContent>
          </MetricCard>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
              <Typography variant="body1" fontWeight="medium">
                View All Users
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
              <Typography variant="body1" fontWeight="medium">
                Manage Events
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
              <Typography variant="body1" fontWeight="medium">
                Incident Reports
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
              <Typography variant="body1" fontWeight="medium">
                System Settings
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
