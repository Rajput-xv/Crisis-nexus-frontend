import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom icon for the marker
const redIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const IncidentMap = ({ incidents }) => {
  return (
    <MapContainer center={[0, 0]} zoom={2} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {incidents.map(incident => (
        <Marker
          key={incident.incidentId}
          position={[incident.incidentLocation.latitude, incident.incidentLocation.longitude]}
          icon={redIcon}
        >
          <Popup>
            <strong>{incident.incidentType}</strong><br />
            {incident.incidentLocation.address}<br />
            {new Date(incident.incidentDate).toLocaleDateString()}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default IncidentMap;