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
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Collapse
} from '@mui/material';
import {
  Visibility,
  ExpandMore,
  ExpandLess,
  Person,
  AttachMoney,
  Inventory,
  EmojiEvents,
  Star
} from '@mui/icons-material';
import axios from 'axios';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [expandedUser, setExpandedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/users`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/users/${userId}/donations`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setUserDetails(response.data);
    } catch (err) {
      console.error('Error fetching user details:', err);
    }
  };

  const handleViewDetails = async (user) => {
    setSelectedUser(user);
    setDetailsOpen(true);
    await fetchUserDetails(user._id);
  };

  const handleExpandUser = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'volunteer': return 'primary';
      case 'donor': return 'success';
      default: return 'default';
    }
  };

  const getLevelColor = (level) => {
    if (level >= 10) return 'error';
    if (level >= 5) return 'warning';
    if (level >= 2) return 'info';
    return 'success';
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Loading Users...</Typography>
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

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" gutterBottom fontWeight="bold" color="primary">
        Users Management
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Manage and monitor all platform users
      </Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>User</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Role</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Level</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Points</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Money Donated</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Resources</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Events</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <React.Fragment key={user._id}>
                <TableRow hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {user.username.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {user.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role} 
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={`Level ${user.profile?.level || 1}`} 
                      color={getLevelColor(user.profile?.level || 1)}
                      size="small"
                      icon={<Star />}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {user.profile?.points || 0} pts
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="success.main" fontWeight="bold">
                      ${user.totalMoneyDonated || 0}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {user.totalResourcesDonated || 0} items
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {user.registeredEventsCount || 0} events
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      onClick={() => handleViewDetails(user)}
                      color="primary"
                      size="small"
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleExpandUser(user._id)}
                      size="small"
                    >
                      {expandedUser === user._id ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                    <Collapse in={expandedUser === user._id} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined">
                              <CardContent>
                                <Box display="flex" alignItems="center" mb={1}>
                                  <Person color="primary" sx={{ mr: 1 }} />
                                  <Typography variant="h6">Profile Details</Typography>
                                </Box>
                                <Typography variant="body2">
                                  <strong>User ID:</strong> {user._id}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Created:</strong> {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Skills:</strong> {user.skills?.join(', ') || 'None'}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined">
                              <CardContent>
                                <Box display="flex" alignItems="center" mb={1}>
                                  <AttachMoney color="success" sx={{ mr: 1 }} />
                                  <Typography variant="h6">Donation Summary</Typography>
                                </Box>
                                <Typography variant="body2">
                                  <strong>Total Donations:</strong> {user.donations || 0}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Resource Donations:</strong> {user.resourceDonations || 0}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Total Value:</strong> ${user.totalMoneyDonated || 0}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined">
                              <CardContent>
                                <Box display="flex" alignItems="center" mb={1}>
                                  <EmojiEvents color="warning" sx={{ mr: 1 }} />
                                  <Typography variant="h6">Activity</Typography>
                                </Box>
                                <Typography variant="body2">
                                  <strong>Events Registered:</strong> {user.registeredEventsCount || 0}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Current Level:</strong> {user.profile?.level || 1}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Total Points:</strong> {user.profile?.points || 0}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* User Details Dialog */}
      <Dialog 
        open={detailsOpen} 
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">
            User Details: {selectedUser?.username}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Money Donations
                    </Typography>
                    {userDetails?.moneyDonations?.length > 0 ? (
                      userDetails.moneyDonations.map((donation, index) => (
                        <Box key={index} sx={{ mb: 1, p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                          <Typography variant="body2">
                            <strong>Amount:</strong> ${donation.amount || 0}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Date:</strong> {new Date(donation.donatedAt || donation.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No money donations found
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Resource Donations
                    </Typography>
                    {userDetails?.resourceDonations?.length > 0 ? (
                      userDetails.resourceDonations.map((donation, index) => (
                        <Box key={index} sx={{ mb: 1, p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                          <Typography variant="body2">
                            <strong>Item:</strong> {donation.item}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Quantity:</strong> {donation.quantity}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Date:</strong> {new Date(donation.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No resource donations found
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UsersManagement;
