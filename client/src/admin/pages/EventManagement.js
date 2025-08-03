import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
  Fab,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import {
  Edit,
  Delete,
  Visibility,
  Add,
  Event as EventIcon,
  LocationOn,
  CalendarToday,
  People,
  Save,
  Cancel
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'workshop',
    date: new Date(),
    location: { coordinates: [0, 0] },
    capacity: 50
  });
  const [isEditing, setIsEditing] = useState(false);

  const eventTypes = [
    { value: 'workshop', label: 'Workshop', color: 'primary' },
    { value: 'training', label: 'Training', color: 'success' },
    { value: 'drill', label: 'Drill', color: 'warning' },
    { value: 'seminar', label: 'Seminar', color: 'info' },
    { value: 'meeting', label: 'Meeting', color: 'secondary' }
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/events`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setEvents(response.data);
    } catch (err) {
      setError('Failed to fetch events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    setFormData({
      title: '',
      description: '',
      type: 'workshop',
      date: new Date(),
      location: { coordinates: [0, 0] },
      capacity: 50
    });
    setIsEditing(false);
    setEditDialogOpen(true);
  };

  const handleEditEvent = async (event) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/events/${event._id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const eventData = response.data;
      
      setFormData({
        title: eventData.title,
        description: eventData.description,
        type: eventData.type,
        date: new Date(eventData.date),
        location: eventData.location,
        capacity: eventData.capacity
      });
      setSelectedEvent(eventData);
      setIsEditing(true);
      setEditDialogOpen(true);
    } catch (err) {
      setError('Failed to fetch event details');
      console.error('Error fetching event:', err);
    }
  };

  const handleSaveEvent = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const eventData = {
        ...formData,
        registeredParticipants: isEditing ? selectedEvent.registeredParticipants : []
      };

      if (isEditing) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/admin/events/${selectedEvent._id}`,
          eventData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setSuccess('Event updated successfully');
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/admin/events`,
          eventData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setSuccess('Event created successfully');
      }
      
      setEditDialogOpen(false);
      fetchEvents();
      setError('');
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} event`);
      console.error('Error saving event:', err);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/admin/events/${selectedEvent._id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setDeleteDialogOpen(false);
      fetchEvents();
      setSuccess('Event deleted successfully');
      setError('');
    } catch (err) {
      setError('Failed to delete event');
      console.error('Error deleting event:', err);
    }
  };

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setViewDialogOpen(true);
  };

  const confirmDelete = (event) => {
    setSelectedEvent(event);
    setDeleteDialogOpen(true);
  };

  const getEventTypeConfig = (type) => {
    return eventTypes.find(eventType => eventType.value === type) || 
           { value: type, label: type, color: 'default' };
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: field === 'latitude' 
          ? [parseFloat(value) || 0, prev.location.coordinates[1]]
          : [prev.location.coordinates[0], parseFloat(value) || 0]
      }
    }));
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Loading Events...</Typography>
        <LinearProgress />
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h3" fontWeight="bold" color="primary">
              Event Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Create, edit, and manage all platform events
            </Typography>
          </Box>
          <Fab 
            color="primary" 
            onClick={handleCreateEvent}
            sx={{ mr: 2 }}
          >
            <Add />
          </Fab>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Event</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Capacity</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Registered</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => {
                const typeConfig = getEventTypeConfig(event.type);
                const isUpcoming = new Date(event.date) > new Date();
                const registrationPercentage = (event.registeredParticipants.length / event.capacity) * 100;
                
                return (
                  <TableRow key={event._id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {event.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {event.description.length > 50 
                            ? `${event.description.substring(0, 50)}...`
                            : event.description
                          }
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={typeConfig.label}
                        color={typeConfig.color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <CalendarToday fontSize="small" color="action" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">
                          {new Date(event.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {event.capacity}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {event.registeredParticipants.length}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ({registrationPercentage.toFixed(1)}% full)
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={isUpcoming ? 'Upcoming' : 'Past'}
                        color={isUpcoming ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        onClick={() => handleViewEvent(event)}
                        color="primary"
                        size="small"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleEditEvent(event)}
                        color="secondary"
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        onClick={() => confirmDelete(event)}
                        color="error"
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Create/Edit Event Dialog */}
        <Dialog 
          open={editDialogOpen} 
          onClose={() => setEditDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h5" fontWeight="bold">
              {isEditing ? 'Edit Event' : 'Create New Event'}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Event Title"
                  value={formData.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Event Type</InputLabel>
                  <Select
                    value={formData.type}
                    label="Event Type"
                    onChange={(e) => handleFormChange('type', e.target.value)}
                  >
                    {eventTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleFormChange('capacity', parseInt(e.target.value))}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <DateTimePicker
                  label="Event Date & Time"
                  value={formData.date}
                  onChange={(newValue) => handleFormChange('date', newValue)}
                  slots={{
                    textField: TextField
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Latitude"
                  type="number"
                  value={formData.location.coordinates[0]}
                  onChange={(e) => handleLocationChange('latitude', e.target.value)}
                  inputProps={{ step: "any" }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Longitude"
                  type="number"
                  value={formData.location.coordinates[1]}
                  onChange={(e) => handleLocationChange('longitude', e.target.value)}
                  inputProps={{ step: "any" }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setEditDialogOpen(false)}
              startIcon={<Cancel />}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEvent}
              variant="contained"
              startIcon={<Save />}
            >
              {isEditing ? 'Update Event' : 'Create Event'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Event Dialog */}
        <Dialog 
          open={viewDialogOpen} 
          onClose={() => setViewDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h5" fontWeight="bold">
              Event Details
            </Typography>
          </DialogTitle>
          <DialogContent>
            {selectedEvent && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={8}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        {selectedEvent.title}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {selectedEvent.description}
                      </Typography>
                      <Box display="flex" alignItems="center" mb={1}>
                        <EventIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          <strong>Type:</strong> {getEventTypeConfig(selectedEvent.type).label}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mb={1}>
                        <CalendarToday fontSize="small" color="action" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          <strong>Date:</strong> {new Date(selectedEvent.date).toLocaleString()}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mb={1}>
                        <People fontSize="small" color="action" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          <strong>Capacity:</strong> {selectedEvent.capacity}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <LocationOn fontSize="small" color="action" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          <strong>Location:</strong> {selectedEvent.location.coordinates[0]}, {selectedEvent.location.coordinates[1]}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        Registered Participants ({selectedEvent.registeredParticipants.length})
                      </Typography>
                      {selectedEvent.registeredParticipants.length > 0 ? (
                        <List dense>
                          {selectedEvent.registeredParticipants.slice(0, 5).map((participant, index) => (
                            <ListItem key={index} disablePadding>
                              <ListItemAvatar>
                                <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                                  {participant.username ? participant.username.charAt(0).toUpperCase() : 'U'}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText 
                                primary={participant.username || 'Unknown User'}
                                secondary={participant.email}
                              />
                            </ListItem>
                          ))}
                          {selectedEvent.registeredParticipants.length > 5 && (
                            <Typography variant="caption" color="text.secondary">
                              +{selectedEvent.registeredParticipants.length - 5} more
                            </Typography>
                          )}
                        </List>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No participants registered yet
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the event "{selectedEvent?.title}"? 
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteEvent} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default EventManagement;
