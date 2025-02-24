import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Alert,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from 'axios';
import HospitalMap from '../components/HospitalMap';

function Hospital(){
    const [city, setCity] = useState(""); // City input state
    const [hospitals, setHospitals] = useState([]); // Stores the list of hospitals
    const [error, setError] = useState(""); // Error message state
    const [searched, setSearched] = useState(false); // To track if a search has been performed
    
    // Function to fetch hospitals from the API
    const fetchHospitals = async () => {
        setSearched(true); // Mark search as performed
        setError(""); // Reset error
        setHospitals([]); // Clear previous hospitals data before the new request
    
        try {
            const response = await axios.get(`api/hospital/${city}`);
            setHospitals(response.data); // Update the hospital state with the API response
            setError(""); // Reset error if successful
        } catch (err) {
            console.error("Error fetching data:", err); // Log error for debugging
            setHospitals([]); // Reset hospitals data
            setError("No hospitals found in this city"); // Set error message
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (city.trim()) {
            fetchHospitals(); // Trigger the fetch if city is provided
        } else {
            setError("City name cannot be empty"); // Show error if city is empty
            setHospitals([]); // Clear hospitals data when no city is provided
            setSearched(true); // Mark search as attempted
        }
    };
    
    return (
        <Container maxWidth="sm" style={{ marginTop: "50px", textAlign: "center" }}>
            <Typography variant="h4" gutterBottom>
                🏥 Hospital Finder
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={8}>
                        <TextField
                            fullWidth
                            label="Enter City Name"
                            variant="outlined"
                            value={city}
                            onChange={(e) => setCity(e.target.value)} // Update city state on change
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                        >
                            Search
                        </Button>
                    </Grid>
                </Grid>
            </form>
        
            <div style={{ marginTop: "30px" }}>
                {/* Show error after a search attempt */}
                {searched && error && (
                    <Alert severity="error" style={{ marginTop: "20px" }}>
                        {error}
                    </Alert>
                )}
        
                {/* Display hospital data */}
                {hospitals.length > 0 && (
                    <List>
                        {hospitals.map((hospital) => (
                            <ListItem
                                key={hospital.id}
                                style={{
                                    backgroundColor: "#f9f9f9",
                                    marginBottom: "10px",
                                    borderRadius: "5px",
                                    padding: "10px",
                                }}
                            >
                                <ListItemText
                                    primary={hospital.name}
                                    secondary={
                                        <>
                                            <Typography variant="body2">
                                                <strong>City:</strong> {hospital.city}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Pin Code:</strong> {hospital.pinCode}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Phone Number:</strong> {hospital.phoneNumber}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Rating:</strong> {hospital.rating} ⭐
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </div>
            <h2>Hospital Map</h2>
            <HospitalMap hospitals={hospitals} />
        </Container>
    );
}

export default Hospital;