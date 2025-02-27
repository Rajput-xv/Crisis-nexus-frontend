import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom icon for incident markers
const incidentIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom icon for user location marker
const userLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const SetViewOnClick = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, 13);
    }
  }, [coords, map]);
  return null;
};

const IncidentMap = ({ incidents = [], latitude = 0, longitude = 0 }) => {
  const centerCoords = (latitude !== 0 && longitude !== 0) ? [latitude, longitude] : (incidents.length > 0 ? [incidents[0].incidentLocation.latitude, incidents[0].incidentLocation.longitude] : [0, 0]);

  return (
    <MapContainer center={centerCoords} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <SetViewOnClick coords={centerCoords} />
      {latitude !== 0 && longitude !== 0 && (
        <Marker position={[latitude, longitude]} icon={userLocationIcon}>
          <Popup>
            <strong>Your Location</strong>
          </Popup>
        </Marker>
      )}
      {Array.isArray(incidents) && incidents.map(incident => (
        incident.incidentLocation.latitude !== undefined && incident.incidentLocation.longitude !== undefined && (
          <Marker
            key={incident.incidentId}
            position={[incident.incidentLocation.latitude, incident.incidentLocation.longitude]}
            icon={incidentIcon}
          >
            <Popup>
              <strong>{incident.incidentType}</strong><br />
              {incident.incidentLocation.address}<br />
              {new Date(incident.incidentDate).toLocaleDateString()}
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
};

export default IncidentMap;