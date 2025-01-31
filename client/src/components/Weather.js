import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import axios from 'axios';

const Weather = ({ lat, lon }) => {
  const [selectedTab, setSelectedTab] = useState('current');
  const [weatherData, setWeatherData] = useState([]);
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  const handleHourChange = (event, newValue) => {
    setSelectedHour(newValue);
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(`/api/weather/${lat}/${lon}?type=${selectedTab}`);
        setWeatherData(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, [selectedTab]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const renderWeatherData = () => {
    if (selectedTab === 'current' && weatherData.temperature !== undefined) {
      const currentDateTime = new Date().toLocaleString();
      return (
        <Box>
          <Typography variant="h6" component="div" style={{ fontWeight: 'bold' }}>
            Date and Time: {currentDateTime}
          </Typography>
          <Typography variant="h6">Current Temperature: {weatherData.temperature} °C</Typography>
          <Typography variant="h6">Minimum Temperature: {weatherData.temperature_min} °C</Typography>
          <Typography variant="h6">Maximum Temperature: {weatherData.temperature_max} °C</Typography>
          <Typography variant="h6">Feels Like: {weatherData.feels_like} °C</Typography>
          <Typography variant="h6">Humidity: {weatherData.humidity} %</Typography>
          <Typography variant="h6">Pressure: {weatherData.pressure} hPa</Typography>
          <Typography variant="h6">Wind Speed: {weatherData.wind_speed} m/s</Typography>
          <Typography variant="h6">Description: {weatherData.description}</Typography>
        </Box>
      );
    } else if (selectedTab === 'hourly' && Array.isArray(weatherData)) {
      return (
        <Box>
          <Tabs
            value={selectedHour}
            onChange={handleHourChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {weatherData.map((hour, index) => (
              <Tab
                key={index}
                label={`${new Date(hour.dt * 1000).toLocaleTimeString()} - ${new Date((hour.dt + 3600) * 1000).toLocaleTimeString()}`}
              />
            ))}
          </Tabs>
          {weatherData[selectedHour] && (
            <Box mb={2}>
              <Typography variant="h6" style={{ fontWeight: 'bold' }}>Date and Time: {new Date(weatherData[selectedHour].dt * 1000).toLocaleString()}</Typography>
              <Typography variant="h6">Temperature: {weatherData[selectedHour].temperature} °C</Typography>
              <Typography variant="h6">Feels Like: {weatherData[selectedHour].feels_like} °C</Typography>
              <Typography variant="h6">Humidity: {weatherData[selectedHour].humidity} %</Typography>
              <Typography variant="h6">Pressure: {weatherData[selectedHour].pressure} hPa</Typography>
              <Typography variant="h6">Wind Speed: {weatherData[selectedHour].wind_speed} m/s</Typography>
              <Typography variant="h6">Description: {weatherData[selectedHour].description}</Typography>
            </Box>
          )}
        </Box>
      );
    } else if (selectedTab === 'daily' && Array.isArray(weatherData)) {
      return (
        <Box>
          <Tabs
            value={selectedDateIndex}
            onChange={(event, newValue) => setSelectedDateIndex(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ marginLeft: 6 }}
          >
            {weatherData.map((day, index) => (
              <Tab
                key={index}
                label={new Date(day.dt * 1000).toLocaleDateString()}
              />
            ))}
          </Tabs>
          {weatherData[selectedDateIndex] && (
            <Box mb={2}>
              <Typography variant="h6">Day Temperature: {weatherData[selectedDateIndex].temperature} °C</Typography>
              <Typography variant="h6">Min Temperature: {weatherData[selectedDateIndex].temperature_min} °C</Typography>
              <Typography variant="h6">Max Temperature: {weatherData[selectedDateIndex].temperature_max} °C</Typography>
              <Typography variant="h6">Sunrise: {new Date(weatherData[selectedDateIndex].sunrise * 1000).toLocaleTimeString()}</Typography>
              <Typography variant="h6">Sunset: {new Date(weatherData[selectedDateIndex].sunset * 1000).toLocaleTimeString()}</Typography>
              <Typography variant="h6">Feels Like (Day): {weatherData[selectedDateIndex].feels_like} °C</Typography>
              <Typography variant="h6">Humidity: {weatherData[selectedDateIndex].humidity} %</Typography>
              <Typography variant="h6">Pressure: {weatherData[selectedDateIndex].pressure} hPa</Typography>
              <Typography variant="h6">Wind Speed: {weatherData[selectedDateIndex].wind_speed} m/s</Typography>
              <Typography variant="h6">Description: {weatherData[selectedDateIndex].description}</Typography>
            </Box>
          )}
        </Box>
      );
    }
    return <pre>{JSON.stringify(weatherData, null, 2)}</pre>;
  };

  return (
    <Box>
      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label="Current Weather" value="current" />
        <Tab label="Hourly Weather" value="hourly" />
        <Tab label="Daily Weather" value="daily" />
      </Tabs>
      <Box mt={2}>
        {renderWeatherData()}
      </Box>
    </Box>
  );
};

export default Weather;