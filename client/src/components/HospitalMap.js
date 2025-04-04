import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom red marker icon for hospitals
const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Custom blue marker icon for the user's location
const userLocationIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const HospitalMap = ({ hospitals = [], userLocation }) => {
    if (!userLocation?.latitude || !userLocation?.longitude) {
        return <p>User location is not available.</p>;
    }

    return (
        <MapContainer center={[userLocation.latitude, userLocation.longitude]} zoom={13} style={{ height: "400px", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* User's current location marker */}
            <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userLocationIcon}>
                <Popup>
                    <strong>Your Location</strong>
                </Popup>
            </Marker>
            {/* Hospital markers */}
            {hospitals?.map((hospital, index) => (
                <Marker
                    key={index}
                    position={[hospital.latitude, hospital.longitude]} // Ensure latitude and longitude are available
                    icon={redIcon}
                >
                    <Popup>
                        <strong>{hospital.name}</strong><br />
                        {hospital.address}<br />
                        {hospital.website && (
                            <a href={hospital.website} target="_blank" rel="noopener noreferrer">
                                Visit Website
                            </a>
                        )}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default HospitalMap;