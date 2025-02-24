import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom red marker icon
const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const HospitalMap = ({ hospitals = [] }) => {
    const defaultPosition = [23.259933, 77.412613]; // Default position (Bhopal)

    // Ensure hospitals is an array before mapping
    const hospitalList = Array.isArray(hospitals) ? hospitals : [];

    return (
        <MapContainer center={defaultPosition} zoom={13} style={{ height: "400px", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {hospitalList?.map((hospital) => (
                <Marker
                    key={hospital.id}
                    position={[hospital.latitude, hospital.longitude]}
                    icon={redIcon}
                >
                    <Popup>
                        <strong>{hospital.name}</strong><br />
                        {hospital.city}<br />
                        {hospital.pinCode}<br />
                        {hospital.phoneNumber}<br />
                        Rating: {hospital.rating} ⭐
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default HospitalMap;