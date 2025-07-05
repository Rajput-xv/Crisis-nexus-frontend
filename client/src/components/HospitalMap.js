import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

// Component to capture map reference
const MapRefSetter = ({ setMapRef }) => {
    const map = useMap();
    useEffect(() => {
        setMapRef(map);
    }, [map, setMapRef]);
    return null;
};

const HospitalMap = ({ hospitals = [], userLocation, selectedHospital, onHospitalSelect, searchMode, setNearestHospital: setParentNearestHospital }) => {
    const mapRef = useRef();
    const [routeLayer, setRouteLayer] = useState(null);
    const [nearestHospital, setNearestHospital] = useState(null);

    // Function to set map reference
    const setMapRef = (map) => {
        mapRef.current = map;
    };

    if (!userLocation?.latitude || !userLocation?.longitude) {
        return <div>User location is not available.</div>;
    }

    // Find nearest hospital (hospitals are already sorted by distance from backend)
    useEffect(() => {
        const validHospitals = hospitals.filter(hospital => hospital.lat && hospital.lng);
        if (validHospitals.length > 0) {
            // Set nearest hospital in both location and city search modes
            const nearest = validHospitals[0];
            setNearestHospital(nearest);
            if (setParentNearestHospital) {
                setParentNearestHospital(nearest); // Update parent state as well
            }
        } else {
            // Clear nearest hospital when no hospitals
            setNearestHospital(null);
            if (setParentNearestHospital) {
                setParentNearestHospital(null); // Update parent state as well
            }
        }
    }, [hospitals, setParentNearestHospital]);

    // Comprehensive route cleanup effect
    useEffect(() => {
        // Clear route when:
        // 1. Search mode changes
        // 2. Hospitals array becomes empty
        // 3. Selected hospital becomes null
        // 4. Hospitals array changes completely
        
        const shouldClearRoute = (
            hospitals.length === 0 || 
            !selectedHospital ||
            (hospitals.length > 0 && selectedHospital && !hospitals.some(h => h.name === selectedHospital.name))
        );

        if (shouldClearRoute && routeLayer && mapRef.current) {
            try {
                mapRef.current.removeLayer(routeLayer);
                setRouteLayer(null);
            } catch (error) {
                console.warn('Error removing route layer:', error);
            }
        }
        
        // Reset nearest hospital state when hospitals array becomes empty
        if (hospitals.length === 0) {
            setNearestHospital(null);
            if (setParentNearestHospital) {
                setParentNearestHospital(null);
            }
        }
    }, [searchMode, hospitals, selectedHospital, routeLayer, setParentNearestHospital]);

    // Function to draw route between two points
    const drawRoute = useCallback(async (startLat, startLng, endLat, endLng, isNearest = false) => {
        // Validate coordinates
        if (!startLat || !startLng || !endLat || !endLng || 
            isNaN(startLat) || isNaN(startLng) || isNaN(endLat) || isNaN(endLng)) {
            console.error('Invalid coordinates provided to drawRoute');
            return;
        }

        try {
            // Clear existing route first
            if (routeLayer && mapRef.current) {
                mapRef.current.removeLayer(routeLayer);
                setRouteLayer(null);
            }

            // Construct OSRM API URL
            const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
            
            const response = await fetch(osrmUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
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

                // Don't auto-scale map - let user control the view
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

                // Don't auto-scale map - let user control the view
            }
        }
    }, [routeLayer]); // Only depend on routeLayer

    // Auto-select nearest hospital in both modes when hospitals are loaded
    useEffect(() => {
        if (nearestHospital && userLocation && mapRef.current && !selectedHospital) {
            // Auto-select the nearest hospital in both location and city search modes
            onHospitalSelect(nearestHospital);
        }
    }, [nearestHospital, userLocation, selectedHospital, onHospitalSelect]);

    // Focus map on selected hospital (only once when hospital is selected)
    useEffect(() => {
        if (selectedHospital && userLocation && mapRef.current) {
            // Create bounds that include both user location and selected hospital
            const bounds = L.latLngBounds([
                [userLocation.latitude, userLocation.longitude],
                [selectedHospital.lat, selectedHospital.lng]
            ]);
            
            // Fit map to show both locations with padding
            mapRef.current.fitBounds(bounds, { 
                padding: [50, 50],
                maxZoom: 15 // Don't zoom in too much
            });
            
            // Draw the route
            const isNearest = nearestHospital && selectedHospital.name === nearestHospital.name;
            drawRoute(
                userLocation.latitude, 
                userLocation.longitude, 
                selectedHospital.lat, 
                selectedHospital.lng,
                isNearest
            );
        }
    }, [selectedHospital]); // Only depend on selectedHospital - focus only when selection changes

    // Handle hospital marker click
    const handleHospitalClick = (hospital) => {
        if (userLocation && onHospitalSelect) {
            onHospitalSelect(hospital); // Update selected hospital in parent component
        }
    };

    // Cleanup effect for component unmounting
    useEffect(() => {
        return () => {
            // Clean up route layer when component unmounts
            if (routeLayer && mapRef.current) {
                try {
                    mapRef.current.removeLayer(routeLayer);
                } catch (error) {
                    console.warn('Error cleaning up route layer:', error);
                }
            }
        };
    }, [routeLayer]);

    return (
        <MapContainer 
            center={[userLocation.latitude, userLocation.longitude]} 
            zoom={13} 
            style={{ height: "400px", width: "100%" }}
            ref={mapRef}
        >
            <MapRefSetter setMapRef={setMapRef} />
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
            {hospitals.filter(hospital => hospital.lat && hospital.lng)?.map((hospital, index) => {
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
                        key={hospital.name || hospital.id || `hospital-${index}`} // Better unique key
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