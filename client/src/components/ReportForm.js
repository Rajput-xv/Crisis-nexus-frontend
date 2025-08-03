import React, { useState } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const FormContainer = styled.form`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  display: grid;
  gap: 1.5rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
    gap: 1rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const FormGroup = styled.div`
  display: grid;
  gap: 0.75rem;

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const Label = styled.label`
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const Input = styled.input`
  padding: 0.875rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #4dabf7;
    box-shadow: 0 0 0 3px rgba(77, 171, 247, 0.25);
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    font-size: 0.95rem;
  }
`;

const TextArea = styled.textarea`
  padding: 0.875rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  transition: all 0.2s ease;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #4dabf7;
    box-shadow: 0 0 0 3px rgba(77, 171, 247, 0.25);
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    font-size: 0.95rem;
    min-height: 100px;
  }
`;

const Select = styled.select`
  padding: 0.875rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 1rem;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  transition: all 0.2s ease;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #4dabf7;
    box-shadow: 0 0 0 3px rgba(77, 171, 247, 0.25);
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    font-size: 0.95rem;
    background-position: right 0.75rem center;
  }
`;

const Button = styled.button`
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 8px;
  background: #4dabf7;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: fit-content;

  &:hover {
    background: #339af0;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #adb5bd;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 1rem;
    font-size: 1rem;
  }
`;

const SecondaryButton = styled(Button)`
  background: #f1f3f5;
  color: #2c3e50;
  border: 1px solid #dee2e6;

  &:hover {
    background: #e9ecef;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SuccessMessage = styled.div`
  background: #40c057;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  animation: ${fadeIn} 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
    padding: 1rem;
    font-size: 0.9rem;
  }
`;

const LocationInfo = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  display: grid;
  gap: 0.5rem;

  p {
    margin: 0;
    color: #495057;
    font-size: 0.9rem;
    line-height: 1.4;

    strong {
      font-weight: 500;
      color: #2c3e50;
    }
  }

  @media (max-width: 480px) {
    padding: 0.875rem;
    font-size: 0.85rem;
  }
`;

const ReportForm = ({ onReportSubmitted }) => {
  const [incidentType, setIncidentType] = useState('');
  const [otherIncident, setOtherIncident] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [incidentLocation, setIncidentLocation] = useState({ latitude: '', longitude: '', address: '' });
  const [incidentDescription, setIncidentDescription] = useState('');
  const [affectedIndividuals, setAffectedIndividuals] = useState('');
  const [incidentStatus, setIncidentStatus] = useState('');
  const [urgency, setUrgency] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
        .then(response => response.json())
        .then(data => {
          setIncidentLocation({ latitude, longitude, address: data.locality });
        });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reportData = {
      incidentType,
      otherIncident,
      incidentDate,
      incidentLocation: JSON.stringify(incidentLocation),
      incidentDescription,
      affectedIndividuals,
      incidentStatus,
      urgency
    };
  
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/report/`, reportData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setSubmitted(true);
      onReportSubmitted(); // Call the function to fetch updated incidents
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormGroup>
        <Label>Incident Type</Label>
        <Select value={incidentType} onChange={(e) => setIncidentType(e.target.value)} required>
          <option value="">Select Incident Type</option>
          <option value="Flood">Flood</option>
          <option value="Earthquake">Earthquake</option>
          <option value="Fire">Fire</option>
          <option value="Cyclone">Cyclone</option>
          <option value="Accident">Accident</option>
          <option value="Others">Others</option>
        </Select>
        {incidentType === 'Others' && (
          <Input
            type="text"
            value={otherIncident}
            onChange={(e) => setOtherIncident(e.target.value)}
            placeholder="Specify incident type"
            required
          />
        )}
      </FormGroup>

      <FormGroup>
        <Label>Incident Date</Label>
        <Input
          type="date"
          value={incidentDate}
          onChange={(e) => setIncidentDate(e.target.value)}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Incident Location</Label>
        <SecondaryButton type="button" onClick={handleLocation}>
          Get Current Location
        </SecondaryButton>
        {incidentLocation.address && (
          <LocationInfo>
            <p><strong>Address:</strong> {incidentLocation.address}</p>
            <p><strong>Latitude:</strong> {incidentLocation.latitude}</p>
            <p><strong>Longitude:</strong> {incidentLocation.longitude}</p>
          </LocationInfo>
        )}
      </FormGroup>

      <FormGroup>
        <Label>Incident Description</Label>
        <TextArea
          value={incidentDescription}
          onChange={(e) => setIncidentDescription(e.target.value)}
          required
          placeholder="Provide detailed description of the incident..."
        />
      </FormGroup>

      <FormGroup>
        <Label>Affected Individuals</Label>
        <Input
          type="number"
          value={affectedIndividuals}
          onChange={(e) => setAffectedIndividuals(e.target.value)}
          required
          min="0"
        />
      </FormGroup>

      <FormGroup>
        <Label>Incident Status</Label>
        <Select
          value={incidentStatus}
          onChange={(e) => setIncidentStatus(e.target.value)}
          required
        >
          <option value="">Select Status</option>
          <option value="Active">Active</option>
          <option value="Closed">Closed</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label>Urgency Level</Label>
        <Select
          value={urgency}
          onChange={(e) => setUrgency(e.target.value)}
          required
        >
          <option value="">Select Urgency</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </Select>
      </FormGroup>

      <Button type="submit">Submit Report</Button>
      {submitted && <SuccessMessage>✓ Report Submitted Successfully</SuccessMessage>}
    </FormContainer>
  );
};

export default ReportForm;