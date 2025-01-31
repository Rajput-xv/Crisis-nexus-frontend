import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
import Events from './pages/Events';
import IncidentReport from './pages/ReportIncident';
import { AuthProvider } from './contexts/AuthContext';
import './App.css'; // Import the CSS file for styling

const theme = createTheme({
  // Customize your theme here
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <div className="app-container">
          <Navbar />
          <div className="content-wrap">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/events" element={<Events />} />
              <Route path="/report" element={<IncidentReport />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;