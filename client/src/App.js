import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
import Events from './pages/Events';
import IncidentReport from './pages/ReportIncident';
import Hospital from './pages/Hospital';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import './App.css'; 
import { LocationProvider } from './contexts/LocationContext';

// Admin imports
import {
  AdminLogin,
  AdminDashboard,
  UsersManagement,
  IncidentManagement,
  EventManagement,
  AdminLayout
} from './admin';

const theme = createTheme({
  // Customize your theme here
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocationProvider>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="incidents" element={<IncidentManagement />} />
            <Route path="events" element={<EventManagement />} />
          </Route>
              
              {/* Regular App Routes */}
              <Route path="/" element={
                <div className="app-container">
                  <Navbar />
                  <div className="content-wrap">
                    <Home />
                  </div>
                  <Footer />
                </div>
              } />
              <Route path="/login" element={
                <div className="app-container">
                  <Navbar />
                  <div className="content-wrap">
                    <Login />
                  </div>
                  <Footer />
                </div>
              } />
              <Route path="/register" element={
                <div className="app-container">
                  <Navbar />
                  <div className="content-wrap">
                    <Register />
                  </div>
                  <Footer />
                </div>
              } />
              <Route path="/forgot-password" element={
                <div className="app-container">
                  <Navbar />
                  <div className="content-wrap">
                    <ForgotPassword />
                  </div>
                  <Footer />
                </div>
              } />
              <Route path="/reset-password" element={
                <div className="app-container">
                  <Navbar />
                  <div className="content-wrap">
                    <ResetPassword />
                  </div>
                  <Footer />
                </div>
              } />
              <Route path="/dashboard" element={
                <div className="app-container">
                  <Navbar />
                  <div className="content-wrap">
                    <Dashboard />
                  </div>
                  <Footer />
                </div>
              } />
              <Route path="/resources" element={
                <div className="app-container">
                  <Navbar />
                  <div className="content-wrap">
                    <Resources />
                  </div>
                  <Footer />
                </div>
              } />
              <Route path="/events" element={
                <div className="app-container">
                  <Navbar />
                  <div className="content-wrap">
                    <Events />
                  </div>
                  <Footer />
                </div>
              } />
              <Route path="/report" element={
                <div className="app-container">
                  <Navbar />
                  <div className="content-wrap">
                    <IncidentReport />
                  </div>
                  <Footer />
                </div>
              } />
              <Route path="/hospital" element={
                <div className="app-container">
                  <Navbar />
                  <div className="content-wrap">
                    <Hospital />
                  </div>
                  <Footer />
                </div>
              } />
            </Routes>
          </LocationProvider>
    </ThemeProvider>
  );
}

export default App;