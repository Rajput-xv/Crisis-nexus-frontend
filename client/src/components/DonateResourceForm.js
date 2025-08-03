import React, { useState } from 'react';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Typography, Container } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext'; // Import the useAuth hook
import { useNavigate } from 'react-router-dom';

const essentialItems = [
  'Water',
  'Food',
  'Clothing',
  'Medical Supplies',
  'Shelter Materials',
  'Hygiene Kits',
  'Tools',
  'Blankets'
];

const ResourceDonationForm = ({ onDonationSuccess }) => {
  const { user } = useAuth(); // Get the current user from the authentication context
  const navigate = useNavigate(); // Use the useNavigate hook for navigation
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem || !quantity) {
      setError('Please select an item and enter a quantity.');
      return;
    }
    setSuccessMessage('');
    setError('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/resources`, {
        item: selectedItem,
        quantity: parseInt(quantity, 10),
        donor: user._id, // Include the current user's ID,
        createdAt: new Date().toISOString() // Add createdAt field
      });

      onDonationSuccess(response.data);
      setSuccessMessage('Donation successful! Thank you for your generosity.');
      setTimeout(() => {
        navigate('/dashboard'); // Redirect to the home page after 3 seconds
      }, 3000); // Redirect after 3 seconds
    } catch (error) {
      setError('Error processing donation');
      console.error('Error making donation:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h6" sx={{ mb: 2 }} style={{ marginTop: '20px' }} >Donate Resource</Typography>
      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Item</InputLabel>
          <Select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            required
          >
            {essentialItems.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          sx={{ mb: 2 }}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Donate
        </Button>
      </form>
    </Container>
  );
};

export default ResourceDonationForm;