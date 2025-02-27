import React, { useEffect, useState } from 'react';
import ReportForm from '../components/ReportForm';
import axios from 'axios';
import IncidentMap from '../components/IncidentMap';

const ReportIncident = () => {
  const [incidents, setIncidents] = useState([]);

  const fetchIncidents = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL+'api/report');
      setIncidents(response.data);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  // Filter incidents to include only those with valid coordinates
  const validIncidents = incidents.filter(incident => 
    incident.incidentLocation.latitude !== undefined && 
    incident.incidentLocation.longitude !== undefined
  );

  return (
    <div style={{ width: '80%', center: 'center', margin: '0 auto' }}>
      <h1>Report an Incident</h1>
      <ReportForm onReportSubmitted={fetchIncidents} />

      <h2>Recent Incidents</h2>
      <div>
        {incidents.sort((a, b) => new Date(b.incidentDate) - new Date(a.incidentDate)).map(incident => (
          <div key={incident.incidentId} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
            <h3>{incident.incidentType}</h3>
            <p><strong>Date:</strong> {new Date(incident.incidentDate).toLocaleDateString()}</p>
            <p><strong>Location:</strong> {incident.incidentLocation.address}</p>
            <p><strong>Description:</strong> {incident.incidentDescription}</p>
            <p><strong>Affected Individuals:</strong> {incident.affectedIndividuals}</p>
            <p><strong>Status:</strong> {incident.incidentStatus}</p>
            <p><strong>Urgency:</strong> {incident.urgency}</p>
          </div>
        ))}
      </div>

      <h2>Incident Map</h2>
      <IncidentMap incidents={validIncidents} />
    </div>
  );
};

export default ReportIncident;