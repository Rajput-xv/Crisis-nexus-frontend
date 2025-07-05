import React, { useEffect, useRef, useState } from 'react';
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

const HospitalMap = ({ hospitals = [], userLocation, selectedHospital, onHospitalSelect }) => {
    const mapRef = useRef();
    const [routeLayer, setRouteLayer] = useState(null);
    const [nearestHospital, setNearestHospital] = useState(null);

    if (!userLocation?.latitude || !userLocation?.longitude) {
        return <div>User location is not available.</div>;
    }

    // Filter hospitals with valid coordinates
    const validHospitals = hospitals.filter(hospital => hospital.lat && hospital.lng);

    // Find nearest hospital (hospitals are already sorted by distance from backend)
    useEffect(() => {
        if (validHospitals.length > 0) {
            // Since hospitals are already sorted by distance, the first one is the nearest
            const nearest = validHospitals[0];
            setNearestHospital(nearest);
        }
    }, [validHospitals]);

    // Function to draw route between two points
    const drawRoute = async (startLat, startLng, endLat, endLng, isNearest = false) => {
        try {
            // Clear existing route first
            if (routeLayer && mapRef.current) {
                mapRef.current.removeLayer(routeLayer);
                setRouteLayer(null);
            }

            // Construct OSRM API URL
            const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
            
            const response = await fetch(osrmUrl);
            const routeData = await response.json();

            if (routeData.routes && routeData.routes.length > 0 && mapRef.current) {
                const route = routeData.routes[0];
                const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]); // Convert [lon, lat] to [lat, lon]
                
                // Create route polyline
                const polyline = L.polyline(coordinates, { 
                    color: isNearest ? '#4CAF50' : '#ff0000', // Green for nearest, red for others
                    weight: 5,
                    opacity: 0.8
                });

                polyline.addTo(mapRef.current);
                setRouteLayer(polyline);

                // Add route info popup
                const distance = (route.distance / 1000).toFixed(1); // Convert to km
                const duration = Math.round(route.duration / 60); // Convert to minutes
                
                polyline.bindPopup(`
                    <div style="text-align: center;">
                        <strong>Route to ${isNearest ? 'Nearest' : 'Selected'} Hospital</strong><br/>
                        <span style="color: #666;">Distance: ${distance} km</span><br/>
                        <span style="color: #666;">Duration: ${duration} minutes</span>
                    </div>
                `);

                // Auto-scale map after 1 second to show the full route
                setTimeout(() => {
                    if (mapRef.current) {
                        const bounds = L.latLngBounds([
                            [startLat, startLng],
                            [endLat, endLng]
                        ]);
                        mapRef.current.fitBounds(bounds, { padding: [20, 20] });
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('Error fetching route:', error);
            // Fallback: draw a simple straight line if routing fails
            if (mapRef.current) {
                // Clear existing route before drawing fallback
                if (routeLayer) {
                    mapRef.current.removeLayer(routeLayer);
                    setRouteLayer(null);
                }
                
                const straightLine = L.polyline([
                    [startLat, startLng],
                    [endLat, endLng]
                ], { 
                    color: isNearest ? '#4CAF50' : '#ff0000', // Green for nearest, red for others
                    weight: 3,
                    opacity: 0.6,
                    dashArray: '10, 10'
                });
                straightLine.addTo(mapRef.current);
                setRouteLayer(straightLine);
                
                straightLine.bindPopup(`
                    <div style="text-align: center;">
                        <strong>Direct Line to ${isNearest ? 'Nearest' : 'Selected'} Hospital</strong><br/>
                        <span style="color: #666;">Routing service unavailable</span>
                    </div>
                `);

                // Auto-scale map after 1 second to show the full route
                setTimeout(() => {
                    if (mapRef.current) {
                        const bounds = L.latLngBounds([
                            [startLat, startLng],
                            [endLat, endLng]
                        ]);
                        mapRef.current.fitBounds(bounds, { padding: [20, 20] });
                    }
                }, 1000);
            }
        }
    };

    // Draw route to nearest hospital by default when hospitals are loaded (only if no hospital is selected)
    useEffect(() => {
        if (nearestHospital && userLocation && mapRef.current && !selectedHospital) {
            drawRoute(
                userLocation.latitude, 
                userLocation.longitude, 
                nearestHospital.lat, 
                nearestHospital.lng,
                true
            );
        }
    }, [nearestHospital, userLocation, selectedHospital]);

    // Draw route to selected hospital when it changes
    useEffect(() => {
        if (selectedHospital && userLocation && mapRef.current) {
            const isNearest = nearestHospital && selectedHospital.name === nearestHospital.name;
            drawRoute(
                userLocation.latitude, 
                userLocation.longitude, 
                selectedHospital.lat, 
                selectedHospital.lng,
                isNearest
            );
        }
    }, [selectedHospital, userLocation, nearestHospital]);

    // Handle hospital marker click
    const handleHospitalClick = (hospital) => {
        if (userLocation && onHospitalSelect) {
            onHospitalSelect(hospital); // Update selected hospital in parent component
        }
    };

    return (
        <MapContainer 
            center={[userLocation.latitude, userLocation.longitude]} 
            zoom={13} 
            style={{ height: "400px", width: "100%" }}
            whenCreated={(map) => {
                mapRef.current = map;
            }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* User's current location marker */}
            <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userLocationIcon}>
                <Popup>
                    <div style={{ textAlign: 'center' }}>
                        <strong>Your Location</strong>
                        {nearestHospital && (
                            <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                                Nearest Hospital: {nearestHospital.name}
                            </div>
                        )}
                    </div>
                </Popup>
            </Marker>
            {/* Hospital markers */}
            {validHospitals?.map((hospital, index) => {
                const isNearest = nearestHospital && hospital.name === nearestHospital.name;
                const isSelected = selectedHospital && hospital.name === selectedHospital.name;
                
                // Use different icon for selected/nearest hospital
                let hospitalIcon;
                if (isSelected && isNearest) {
                    // Selected and nearest - green with special styling
                    hospitalIcon = new L.Icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                        iconSize: [30, 45],
                        iconAnchor: [15, 45],
                        popupAnchor: [1, -34],
                        shadowSize: [45, 45]
                    });
                } else if (isSelected) {
                    // Selected but not nearest - blue
                    hospitalIcon = new L.Icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                        iconSize: [28, 42],
                        iconAnchor: [14, 42],
                        popupAnchor: [1, -34],
                        shadowSize: [42, 42]
                    });
                } else if (isNearest) {
                    // Nearest but not selected - green
                    hospitalIcon = new L.Icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    });
                } else {
                    // Regular hospital - red
                    hospitalIcon = redIcon;
                }

                return (
                    <Marker
                        key={index}
                        position={[hospital.lat, hospital.lng]}
                        icon={hospitalIcon}
                        eventHandlers={{
                            click: () => handleHospitalClick(hospital)
                        }}
                    >
                        <Popup>
                            <div style={{ minWidth: '200px' }}>
                                <strong>{hospital.name}</strong>
                                {isNearest && (
                                    <div style={{ 
                                        background: '#4CAF50', 
                                        color: 'white', 
                                        padding: '2px 6px', 
                                        borderRadius: '3px', 
                                        fontSize: '10px', 
                                        display: 'inline-block', 
                                        marginLeft: '8px' 
                                    }}>
                                        NEAREST
                                    </div>
                                )}
                                {isSelected && !isNearest && (
                                    <div style={{ 
                                        background: '#2196F3', 
                                        color: 'white', 
                                        padding: '2px 6px', 
                                        borderRadius: '3px', 
                                        fontSize: '10px', 
                                        display: 'inline-block', 
                                        marginLeft: '8px' 
                                    }}>
                                        SELECTED
                                    </div>
                                )}
                                <br />
                                <div style={{ marginTop: '4px', fontSize: '12px' }}>
                                    {hospital.address}
                                </div>
                                {hospital.website && (
                                    <div style={{ marginTop: '4px' }}>
                                        <a 
                                            href={hospital.website} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            style={{ fontSize: '12px' }}
                                        >
                                            Visit Website
                                        </a>
                                    </div>
                                )}
                                <div style={{ 
                                    marginTop: '8px', 
                                    padding: '4px', 
                                    background: '#f0f0f0', 
                                    borderRadius: '3px',
                                    fontSize: '11px',
                                    textAlign: 'center'
                                }}>
                                    {isSelected ? 'Selected for directions' : 'Click marker to select'}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default HospitalMap;