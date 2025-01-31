import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
        Crisis Nexus
        </Typography>
        <Button color="inherit" component={RouterLink} to="/">Home</Button>
        <Button color="inherit" component={RouterLink} to="/report">Report Incident</Button>
        {user ? (
          <>
            <Button color="inherit" component={RouterLink} to="/dashboard">Dashboard</Button>
            <Button color="inherit" component={RouterLink} to="/resources">Resources</Button>
            <Button color="inherit" component={RouterLink} to="/events">Events</Button>
            <Button color="inherit" onClick={logout}>Logout</Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={RouterLink} to="/login">Login</Button>
            <Button color="inherit" component={RouterLink} to="/register">Register</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;