import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Typography, 
  CircularProgress, 
  Grid, 
  Card, 
  CardContent, 
  Chip,
  Avatar,
  useTheme,
  Paper,
  LinearProgress
} from '@mui/material';
import axios from 'axios';
import {
  Thermostat as TempIcon,
  Opacity as HumidityIcon,
  Air as WindIcon,
  Compress as PressureIcon,
  WbSunny as SunIcon,
  NightsStay as MoonIcon,
  Today as DateIcon,
  Schedule as TimeIcon
} from '@mui/icons-material';

const Weather = ({ lat, lon }) => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState('current');
  const [weatherData, setWeatherData] = useState([]);
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleHourChange = (event, newValue) => {
    setSelectedHour(newValue);
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/weather/${lat}/${lon}?type=${selectedTab}`);
        setWeatherData(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [selectedTab]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const WeatherCard = ({ title, value, unit, icon, color = 'primary' }) => (
    <Card sx={{ height: '100%', background: theme.palette.background.paper }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: theme.palette[color].main + '20', color: theme.palette[color].main }}>
          {icon}
        </Avatar>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
          <Typography variant="h5">{value} {unit}</Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const renderCurrentWeather = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <DateIcon /> {new Date().toLocaleDateString()}
          <TimeIcon sx={{ ml: 2 }} /> {new Date().toLocaleTimeString()}
        </Typography>
      </Grid>
      <Grid item xs={6} sm={4} md={3}>
        <WeatherCard 
          title="Temperature" 
          value={weatherData.temperature} 
          unit="°C" 
          icon={<TempIcon />}
        />
      </Grid>
      <Grid item xs={6} sm={4} md={3}>
        <WeatherCard 
          title="Feels Like" 
          value={weatherData.feels_like} 
          unit="°C" 
          icon={<TempIcon />}
          color="secondary"
        />
      </Grid>
      <Grid item xs={6} sm={4} md={3}>
        <WeatherCard 
          title="Humidity" 
          value={weatherData.humidity} 
          unit="%" 
          icon={<HumidityIcon />}
          color="info"
        />
      </Grid>
      <Grid item xs={6} sm={4} md={3}>
        <WeatherCard 
          title="Pressure" 
          value={weatherData.pressure} 
          unit="hPa" 
          icon={<PressureIcon />}
          color="warning"
        />
      </Grid>
      <Grid item xs={6} sm={4} md={3}>
        <WeatherCard 
          title="Wind Speed" 
          value={weatherData.wind_speed} 
          unit="m/s" 
          icon={<WindIcon />}
          color="success"
        />
      </Grid>
      <Grid item xs={12} sx={{ mt: 2 }}>
        <Chip
          label={weatherData.description}
          color="primary"
          variant="filled"
          sx={{ 
            fontSize: '1.2rem',
            padding: 2,
            textTransform: 'capitalize' 
          }}
        />
      </Grid>
    </Grid>
  );

  const renderHourlyWeather = () => (
    <Box>
      <Tabs
        value={selectedHour}
        onChange={handleHourChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ 
          mb: 3,
          '& .MuiTab-root': {
            minWidth: 120,
            fontSize: '0.9rem',
            flexDirection: 'row',
            gap: 1,
            alignItems: 'center'
          }
        }}
      >
        {Array.isArray(weatherData) && weatherData.map((hour, index) => (
          <Tab
            key={index}
            label={<>
              <Typography variant="subtitle2">
                {new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit' })}
              </Typography>
              <TempIcon fontSize="small" /> {hour.temperature}°C
            </>}
            sx={{ py: 1.5 }}
          />
        ))}
      </Tabs>
      {weatherData[selectedHour] && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <DateIcon /> {new Date(weatherData[selectedHour].dt * 1000).toLocaleDateString()}
              <TimeIcon sx={{ ml: 2 }} /> {new Date(weatherData[selectedHour].dt * 1000).toLocaleTimeString()}
            </Typography>
            <Chip
              label={weatherData[selectedHour].description}
              color="primary"
              variant="filled"
              sx={{ 
                fontSize: '1rem',
                padding: 1.5,
                textTransform: 'capitalize',
                mb: 2
              }}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <WeatherCard 
              title="Temperature" 
              value={weatherData[selectedHour].temperature} 
              unit="°C" 
              icon={<TempIcon />}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <WeatherCard 
              title="Feels Like" 
              value={weatherData[selectedHour].feels_like} 
              unit="°C" 
              icon={<TempIcon />}
              color="secondary"
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <WeatherCard 
              title="Humidity" 
              value={weatherData[selectedHour].humidity} 
              unit="%" 
              icon={<HumidityIcon />}
              color="info"
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <WeatherCard 
              title="Pressure" 
              value={weatherData[selectedHour].pressure} 
              unit="hPa" 
              icon={<PressureIcon />}
              color="warning"
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <WeatherCard 
              title="Wind Speed" 
              value={weatherData[selectedHour].wind_speed} 
              unit="m/s" 
              icon={<WindIcon />}
              color="success"
            />
          </Grid>
          {weatherData[selectedHour].rain && (
            <Grid item xs={6} sm={4} md={3}>
              <WeatherCard 
                title="Rain" 
                value={weatherData[selectedHour].rain} 
                unit="mm" 
                icon={<Opacity />}
                color="info"
              />
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );

  const renderDailyWeather = () => (
    <Box>
      <Tabs
        value={selectedDateIndex}
        onChange={(event, newValue) => setSelectedDateIndex(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ 
          mb: 3,
          '& .MuiTab-root': {
            minWidth: 120,
            flexDirection: 'column',
            gap: 1
          }
        }}
      >
        {Array.isArray(weatherData) && weatherData.map((day, index) => (
          <Tab
            key={index}
            label={<>
              <Typography variant="subtitle2">
                {new Date(day.dt * 1000).toLocaleDateString([], { weekday: 'short' })}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TempIcon fontSize="small" /> 
                {day.temperature}°C
              </Box>
            </>}
          />
        ))}
      </Tabs>
      {weatherData[selectedDateIndex] && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card sx={{ background: theme.palette.primary.light + '20' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Day Overview</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <WeatherCard 
                      title="Max Temp" 
                      value={weatherData[selectedDateIndex].temperature_max} 
                      unit="°C" 
                      icon={<TempIcon />}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <WeatherCard 
                      title="Min Temp" 
                      value={weatherData[selectedDateIndex].temperature_min} 
                      unit="°C" 
                      icon={<TempIcon />}
                      color="secondary"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ background: theme.palette.secondary.light + '20' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Additional Info</Typography>
                <Grid container spacing={2}>
                  {['sunrise', 'sunset', 'humidity', 'pressure', 'wind_speed'].map((key) => (
                    <Grid item xs={6} sm={4} key={key}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          {key.replace(/_/g, ' ')}
                        </Typography>
                        <Typography variant="h6">
                          {key.includes('sun') ? (
                            new Date(weatherData[selectedDateIndex][key] * 1000).toLocaleTimeString()
                          ) : (
                            <>
                              {Math.round(weatherData[selectedDateIndex][key])}
                              {key === 'humidity' && '%'}
                              {key === 'pressure' && 'hPa'}
                              {key === 'wind_speed' && 'm/s'}
                            </>
                          )}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );

  return (
    <Paper sx={{ p: 3, borderRadius: 4, background: theme.palette.background.paper }}>
      <Tabs 
        value={selectedTab} 
        onChange={handleTabChange}
        sx={{
          mb: 3,
          '& .MuiTab-root': {
            minWidth: 120,
            fontSize: '1rem',
            textTransform: 'capitalize'
          }
        }}
      >
        <Tab label="Current" value="current" />
        <Tab label="Hourly" value="hourly" />
        <Tab label="Daily" value="daily" />
      </Tabs>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : (
        <Box mt={2}>
          {selectedTab === 'current' && renderCurrentWeather()}
          {selectedTab === 'hourly' && renderHourlyWeather()}
          {selectedTab === 'daily' && renderDailyWeather()}
        </Box>
      )}
    </Paper>
  );
};

export default Weather;