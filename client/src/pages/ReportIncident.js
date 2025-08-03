import React, { useEffect, useState } from 'react';
import ReportForm from '../components/ReportForm';
import axios from 'axios';
import IncidentMap from '../components/IncidentMap';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h1`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Section = styled.section`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin: 2rem 0;

  @media (max-width: 768px) {
    padding: 1rem;
    margin: 1.5rem 0;
  }

  h2 {
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
    color: #2c3e50;

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
`;

const IncidentList = styled.div`
  display: grid;
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const IncidentCard = styled.div`
  padding: 1.5rem;
  border-radius: 8px;
  background: ${props => {
    if (props.urgency === 'High') return '#ffeef0';
    if (props.urgency === 'Medium') return '#fff4e6';
    return '#f8f9fa';
  }};
  border-left: 4px solid ${props => {
    if (props.urgency === 'High') return '#ff6b6b';
    if (props.urgency === 'Medium') return '#ff922b';
    return '#adb5bd';
  }};
  transition: transform 0.2s ease;
  display: grid;
  gap: 0.75rem;

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 0.5rem;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.5rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const BadgeWrapper = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const Badge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  background: ${props => {
    if (props.status === 'Active') return '#d0ebff';
    return '#e9ecef';
  }};
  color: ${props => {
    if (props.status === 'Active') return '#1864ab';
    return '#495057';
  }};
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const MapContainer = styled.div`
  // height: 500px;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    height: 350px;
  }
`;

const IncidentDetail = styled.p`
  margin: 0;
  color: #666;
  line-height: 1.6;
  font-size: 0.95rem;

  strong {
    color: #2c3e50;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const ReportIncident = () => {
  const [incidents, setIncidents] = useState([]);

  const fetchIncidents = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/report`);
      setIncidents(response.data);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const validIncidents = incidents.filter(incident => 
    incident.incidentLocation.latitude !== undefined && 
    incident.incidentLocation.longitude !== undefined
  );

  return (
    <Container>
      <Title>Report an Incident</Title>
      
      <Section>
        <ReportForm onReportSubmitted={fetchIncidents} />
      </Section>

      <Section>
        <h2>Recent Incidents</h2>
        <IncidentList>
          {incidents.sort((a, b) => new Date(b.incidentDate) - new Date(a.incidentDate)).map(incident => (
            <IncidentCard key={incident.incidentId} urgency={incident.urgency}>
              <CardHeader>
                <h3 style={{ margin: 0, color: '#2c3e50' }}>{incident.incidentType}</h3>
                <BadgeWrapper>
                  <Badge status={incident.incidentStatus}>{incident.incidentStatus}</Badge>
                  <Badge urgency={incident.urgency}>{incident.urgency}</Badge>
                </BadgeWrapper>
              </CardHeader>
              <IncidentDetail>
                <strong>Date:</strong> {new Date(incident.incidentDate).toLocaleDateString()}
              </IncidentDetail>
              <IncidentDetail>
                <strong>Location:</strong> {incident.incidentLocation.address}
              </IncidentDetail>
              <IncidentDetail>
                <strong>Description:</strong> {incident.incidentDescription}
              </IncidentDetail>
              <IncidentDetail>
                <strong>Affected Individuals:</strong> {incident.affectedIndividuals}
              </IncidentDetail>
            </IncidentCard>
          ))}
        </IncidentList>
      </Section>

      <Section>
        <h2>Incident Map</h2>
        <MapContainer>
          <IncidentMap incidents={validIncidents} />
        </MapContainer>
      </Section>
    </Container>
  );
};

export default ReportIncident;