import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Box, 
  Chip,
  Avatar,
  useTheme,
  Paper
} from '@mui/material';
import axios from 'axios';
import DonationForm from '../components/DonationForm';
import ResourceDonationForm from '../components/DonateResourceForm';
import {
  LocalShipping as ResourceIcon,
  AttachMoney as MoneyIcon,
  Inventory2 as InventoryIcon,
  Update as UpdateIcon,
  Category as TypeIcon
} from '@mui/icons-material';
import { format } from 'date-fns'; 

function Resources() {
  const theme = useTheme();
  const [resources, setResources] = useState([]);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [showResourceDonationForm, setShowResourceDonationForm] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/resources`);
        setResources(response.data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };
    fetchResources();
  }, []);

  const handleDonationSuccess = (donation) => {
    // console.log('Donation successful:', donation);
    setShowDonationForm(false);
    setShowResourceDonationForm(false);
    // Update the resources list after a successful donation
    setResources((prevResources) => {
      const updatedResources = prevResources.map((resource) => {
        if (resource.name === donation.name) {
          return { ...resource, quantity: resource.quantity + donation.quantity };
        }
        return resource;
      });
      // If the resource is new, add it to the list
      if (!updatedResources.some(resource => resource.name === donation.name)) {
        updatedResources.push(donation);
      }
      return updatedResources;
    });
  };

  const handleShowDonationForm = () => {
    setShowDonationForm(true);
    setShowResourceDonationForm(false);
  };

  const handleShowResourceDonationForm = () => {
    setShowResourceDonationForm(true);
    setShowDonationForm(false);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'in stock': return 'success';
      case 'low': return 'warning';
      case 'out of stock': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{
            fontWeight: 700,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          Community Resources
        </Typography>
        
        <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<MoneyIcon />}
              onClick={handleShowDonationForm}
              sx={{ 
                py: 2, 
                borderRadius: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
              }}
            >
              Donate Money
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<ResourceIcon />}
              onClick={handleShowResourceDonationForm}
              sx={{ 
                py: 2, 
                borderRadius: 3,
                background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`
              }}
            >
              Donate Resources
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {resources.map((resource) => (
          <Grid item xs={12} sm={6} md={4} key={resource._id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: '0.3s',
                ':hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: theme.shadows[6]
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ 
                    bgcolor: theme.palette.primary.main + '20', 
                    color: theme.palette.primary.main,
                    mr: 2
                  }}>
                    <InventoryIcon />
                  </Avatar>
                  <Typography variant="h5" component="div">
                    {resource.name}
                  </Typography>
                </Box>

                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Chip
                      icon={<TypeIcon />}
                      label={resource.type}
                      variant="outlined"
                      color="primary"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                  <Chip
                    icon={<UpdateIcon />}
                    label={
                      resource.lastUpdated
                        ? format(new Date(resource.lastUpdated), 'dd MMM yyyy')
                        : 'N/A' // Fallback value if lastUpdated is invalid
                    }
                    variant="outlined"
                    size="small"
                  />
                  </Grid>
                </Grid>

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 2
                }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Quantity Available:
                  </Typography>
                  <Chip 
                    label={resource.quantity} 
                    color="primary"
                    variant="filled"
                    size="medium"
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Status:
                  </Typography>
                  <Chip
                    label={resource.status}
                    color={getStatusColor(resource.status)}
                    variant="filled"
                    size="medium"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {(showDonationForm || showResourceDonationForm) && (
        <Paper sx={{ 
          mt: 4, 
          p: 4, 
          borderRadius: 4,
          background: theme.palette.background.paper
        }}>
          {showDonationForm && <DonationForm onDonationSuccess={handleDonationSuccess} />}
          {showResourceDonationForm && <ResourceDonationForm onDonationSuccess={handleDonationSuccess} />}
        </Paper>
      )}
    </Container>
  );
}

export default Resources;