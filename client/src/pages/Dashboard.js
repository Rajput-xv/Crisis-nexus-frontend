import React from 'react';
import { Typography, Container, Grid, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import DashboardStats from '../components/Dashboard';

function Dashboard() {
  const { user } = useAuth();

  return (
    <Container>
      <DashboardStats />
    </Container>
  );
}

export default Dashboard;