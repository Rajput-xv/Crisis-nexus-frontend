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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Pagination,
  Alert,
  LinearProgress,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  Edit,
  Visibility,
  LocationOn,
  CalendarToday,
  Report,
  Warning,
  CheckCircle,
  Cancel,
  Pending
} from '@mui/icons-material';
import axios from 'axios';

const IncidentManagement = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newStatus, setNewStatus] = useState('');

  const statusOptions = [
    { value: 'active', label: 'Active', color: 'error', icon: <Warning /> },
    { value: 'pending', label: 'Pending', color: 'warning', icon: <Pending /> },
    { value: 'resolved', label: 'Resolved', color: 'success', icon: <CheckCircle /> },
    { value: 'closed', label: 'Closed', color: 'default', icon: <Cancel /> },
    { value: 'inactive', label: 'Inactive', color: 'secondary', icon: <Cancel /> }
  ];

  useEffect(() => {
    fetchIncidents();
  }, [statusFilter, currentPage]);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      params.append('page', currentPage);
      params.append('limit', 10);

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/incidents?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setIncidents(response.data.incidents);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('Failed to fetch incidents');
      console.error('Error fetching incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/admin/incidents/${selectedIncident._id}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setEditDialogOpen(false);
      fetchIncidents();
      setError('');
    } catch (err) {
      setError('Failed to update incident status');
      console.error('Error updating incident:', err);
    }
  };

  const handleEditIncident = (incident) => {
    setSelectedIncident(incident);
    setNewStatus(incident.incidentStatus);
    setEditDialogOpen(true);
  };

  const handleViewIncident = (incident) => {
    setSelectedIncident(incident);
    setViewDialogOpen(true);
  };

  const getStatusConfig = (status) => {
    return statusOptions.find(option => option.value === status) || 
           { value: status, label: status, color: 'default', icon: <Report /> };
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  if (loading && incidents.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Loading Incidents...</Typography>
        <LinearProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" gutterBottom fontWeight="bold" color="primary">
        Incident Management
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Monitor and manage all incident reports
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Filter by Status"
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <MenuItem value="">All Incidents</MenuItem>
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box display="flex" alignItems="center">
                        {option.icon}
                        <Box ml={1}>{option.label}</Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="body2" color="text.secondary">
                Total Incidents: {incidents.length} | Page {currentPage} of {totalPages}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Incident</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Urgency</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Location</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <LinearProgress />
                </TableCell>
              </TableRow>
            ) : incidents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" color="text.secondary">
                    No incidents found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              incidents.map((incident) => {
                const statusConfig = getStatusConfig(incident.incidentStatus);
                return (
                  <TableRow key={incident._id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {incident.incidentType}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {incident.incidentId}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={incident.incidentType} 
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={statusConfig.label}
                        color={statusConfig.color}
                        size="small"
                        icon={statusConfig.icon}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={incident.urgency || 'Medium'}
                        color={getUrgencyColor(incident.urgency)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <LocationOn fontSize="small" color="action" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" noWrap>
                          {incident.incidentLocation?.address || 'Unknown'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <CalendarToday fontSize="small" color="action" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">
                          {new Date(incident.incidentDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        onClick={() => handleViewIncident(incident)}
                        color="primary"
                        size="small"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleEditIncident(incident)}
                        color="secondary"
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination 
            count={totalPages}
            page={currentPage}
            onChange={(event, page) => setCurrentPage(page)}
            color="primary"
          />
        </Box>
      )}

      {/* Edit Status Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Update Incident Status</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>New Status</InputLabel>
              <Select
                value={newStatus}
                label="New Status"
                onChange={(e) => setNewStatus(e.target.value)}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box display="flex" alignItems="center">
                      {option.icon}
                      <Box ml={1}>{option.label}</Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained">
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">
            Incident Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedIncident && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Basic Information
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Type:</strong> {selectedIncident.incidentType}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Status:</strong> {selectedIncident.incidentStatus}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Urgency:</strong> {selectedIncident.urgency || 'Medium'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Date:</strong> {new Date(selectedIncident.incidentDate).toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Affected Individuals:</strong> {selectedIncident.affectedIndividuals || 'Unknown'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Location & Description
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <strong>Address:</strong> {selectedIncident.incidentLocation?.address || 'Not provided'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <strong>Coordinates:</strong> 
                      {selectedIncident.incidentLocation?.latitude && selectedIncident.incidentLocation?.longitude 
                        ? ` ${selectedIncident.incidentLocation.latitude}, ${selectedIncident.incidentLocation.longitude}`
                        : ' Not available'
                      }
                    </Typography>
                    <Typography variant="body2">
                      <strong>Description:</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                      {selectedIncident.incidentDescription || 'No description provided'}
                    </Typography>
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
    </Container>
  );
};

export default IncidentManagement;
