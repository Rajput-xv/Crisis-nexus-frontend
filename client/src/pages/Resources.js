import React, { useState, useEffect } from 'react';
import { Typography, Container, List, Grid, ListItem, ListItemText, Button, Box } from '@mui/material';
import axios from 'axios';
import DonationForm from '../components/DonationForm';
import ResourceDonationForm from '../components/DonateResourceForm';

function Resources() {
  const [resources, setResources] = useState([]);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [showResourceDonationForm, setShowResourceDonationForm] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get('/api/resources');
        setResources(response.data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };
    fetchResources();
  }, []);

  const handleDonationSuccess = (donation) => {
    console.log('Donation successful:', donation);
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

  return (
    <Container>
      <Typography variant="h4" component="h4">Resources Available</Typography>
      <List>
        {resources.map((resource) => (
          <Box key={resource._id} boxShadow={3} p={2} mb={2} borderRadius={4}>
            <ListItem>
              <ListItemText
                primary={resource.name}
                secondary={
                  <>
                    <div><Typography variant="body2" component="span">Type: {resource.type}</Typography></div>
                    <div><Typography variant="body2" component="span">Quantity: {resource.quantity}</Typography></div>
                    <div><Typography variant="body2" component="span">Status: {resource.status}</Typography></div>
                    <div><Typography variant="body2" component="span">Last Updated: {new Date(resource.lastUpdated).toLocaleString()}</Typography></div>
                  </>
                }
              />
            </ListItem>
          </Box>
        ))}
      </List>
      <Button variant="contained" color="primary" onClick={handleShowDonationForm}>
        Donate Money
      </Button>
      <Button variant="contained" color="secondary" onClick={handleShowResourceDonationForm} style={{ marginLeft: '20px' }}>
        Donate Resource
      </Button>
      {showDonationForm && <DonationForm onDonationSuccess={handleDonationSuccess} />}
      {showResourceDonationForm && <ResourceDonationForm onDonationSuccess={handleDonationSuccess} />}
    </Container>
  );
}

export default Resources;