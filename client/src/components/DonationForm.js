import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext'; // Import the useAuth hook
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

function DonationForm({ onDonationSuccess }) {
  const { user } = useAuth(); // Get the current user from the authentication context
  const navigate = useNavigate(); // Use the useNavigate hook for navigation
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const currencies = [
    { code: 'INR', label: 'Indian Rupee (₹)' },
    { code: 'USD', label: 'US Dollar ($)' },
    { code: 'EUR', label: 'Euro (€)' },
    { code: 'GBP', label: 'British Pound (£)' }
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      // Proceed with donation using the current user's ID
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/donations`, {
        donor: user._id, // current user's ID
        amount: parseFloat(amount), // Ensures amount is a number
        currency,
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
      <Typography variant="h6" sx={{ mb: 2 }} style={{ marginTop: '20px' }} >Make a Donation</Typography>
      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          sx={{ mb: 2 }}
          required
        />
        <Select
          fullWidth
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          sx={{ mb: 2 }}
        >
          {currencies.map((option) => (
            <MenuItem key={option.code} value={option.code}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        <Button type="submit" variant="contained" color="primary">
          Donate
        </Button>
      </form>
    </Container>
  );
}

export default DonationForm;