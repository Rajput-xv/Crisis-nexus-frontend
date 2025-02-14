import React, { useState } from 'react';
import axios from 'axios';

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
      await axios.post(process.env.REACT_APP_API_URL + 'api/report/', reportData, {
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
    <form onSubmit={handleSubmit} style={{ margin: '20px', padding: '20px', border: '1px solid #ccc' }}>
      <div>
        <label>Incident Type</label>
        <select value={incidentType} onChange={(e) => setIncidentType(e.target.value)} required>
          <option value="">Select</option>
          <option value="Flood">Flood</option>
          <option value="Earthquake">Earthquake</option>
          <option value="Fire">Fire</option>
          <option value="Cyclone">Cyclone</option>
          <option value="Accident">Accident</option>
          <option value="Others">Others</option>
        </select>
        {incidentType === 'Others' && (
          <input type="text" value={otherIncident} onChange={(e) => setOtherIncident(e.target.value)} placeholder="Specify incident" required />
        )}
      </div>
      <div>
        <label>Incident Date</label>
        <input type="date" value={incidentDate} onChange={(e) => setIncidentDate(e.target.value)} required />
      </div>
      <div>
        <label>Incident Location</label>
        <button type="button" onClick={handleLocation}>Get Current Location</button>
        <div>
          <p>Latitude: {incidentLocation.latitude}</p>
          <p>Longitude: {incidentLocation.longitude}</p>
          <p>Address: {incidentLocation.address}</p>
        </div>
      </div>
      <div>
        <label>Incident Description</label>
        <textarea value={incidentDescription} onChange={(e) => setIncidentDescription(e.target.value)} required />
      </div>
      <div>
        <label>Affected Individuals</label>
        <input type="number" value={affectedIndividuals} onChange={(e) => setAffectedIndividuals(e.target.value)} required />
      </div>
      <div>
        <label>Incident Status</label>
        <select value={incidentStatus} onChange={(e) => setIncidentStatus(e.target.value)} required>
          <option value="">Select</option>
          <option value="Active">Active</option>
          <option value="Closed">Closed</option>
        </select>
      </div>
      <div>
        <label>Urgency</label>
        <select value={urgency} onChange={(e) => setUrgency(e.target.value)} required>
          <option value="">Select</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
      <button type="submit">Submit</button>
      {submitted && <p>Submitted!</p>}
    </form>
  );
};

export default ReportForm;