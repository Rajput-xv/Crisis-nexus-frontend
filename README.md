# Crisis Nexus

## A Central Hub for Disaster Awareness and Management

Crisis Nexus is a comprehensive disaster management platform designed to enhance community resilience and coordinate relief efforts in disaster-prone areas. The platform serves as a centralized solution for disaster preparedness, response, and recovery operations.

## Table of Contents
- [Project Overview](#project-overview)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

Crisis Nexus is a React-based web application that provides essential disaster management tools for communities, relief organizations, and emergency responders. The platform integrates real-time data, mapping services, and resource management to ensure effective disaster response coordination.

## Core Features

### Incident Management
- Real-time incident reporting with location-based mapping
- Interactive incident visualization using Leaflet maps
- Incident status tracking and management
- Urgency level classification (High, Medium, Low)

### Hospital Finder
- Location-based hospital discovery
- Real-time route calculation and directions
- City-based hospital search functionality
- Interactive hospital mapping with detailed information

### Resource Management
- Community resource inventory tracking
- Donation management system (money and resources)
- Resource status monitoring (In Stock, Low, Out of Stock)
- Donor contribution tracking

### Event Coordination
- Workshop and seminar management
- Event registration system
- Capacity tracking and progress monitoring
- Location-based event discovery

### Weather Integration
- Real-time weather information
- Location-based weather forecasting
- Weather data visualization

### User Management
- Role-based authentication system
- Personal dashboard with statistics
- User activity tracking and achievements
- Secure login and registration

## Technology Stack

### Frontend
- **React 17.0.2** - Component-based UI framework
- **Material-UI (MUI)** - Modern React UI component library
- **React Router DOM** - Client-side routing
- **Styled Components** - CSS-in-JS styling solution
- **Leaflet & React-Leaflet** - Interactive mapping
- **Recharts** - Data visualization
- **Axios** - HTTP client for API communication

### Additional Libraries
- **Bootstrap** - CSS framework for responsive design
- **Date-fns** - Date utility library
- **JSON Web Token** - Authentication token management

### APIs and Services
- **Google Places API** - Location and mapping services
- **OpenWeatherMap API** - Weather data integration
- **Custom REST API** - Backend service integration

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/crisis-nexus-frontend.git
   cd crisis-nexus-frontend
   ```

2. **Navigate to the client directory**
   ```bash
   cd client
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

## Environment Configuration

Create a `.env` file in the `client` directory with the following variables:

```env
REACT_APP_API_URL=https://crisis-nexus-server.vercel.app/
REACT_APP_GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
```

### API Key Setup

1. **Google Places API Key**:
   - Visit the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Places API and Geocoding API
   - Create credentials and copy the API key
   - Replace `your_google_places_api_key_here` with your actual API key

## Usage

### Development Mode

To start the development server:

```bash
cd client
npm start
```

The application will open at `http://localhost:3000` in your browser.

## Key Features Guide

### For Community Members
- **Report Incidents**: Use the incident reporting system to alert authorities about emergencies
- **Find Hospitals**: Locate nearby hospitals with real-time directions
- **Donate Resources**: Contribute money or physical resources to relief efforts
- **Join Events**: Participate in community workshops and disaster preparedness events

### For Relief Organizations
- **Monitor Incidents**: Track reported incidents on interactive maps
- **Manage Resources**: Oversee resource inventory and distribution
- **Coordinate Events**: Organize and manage community events
- **View Analytics**: Access dashboard statistics and community insights

### For Emergency Responders
- **Real-time Updates**: Access live incident reports and location data
- **Resource Allocation**: Monitor available resources and distribution needs
- **Route Planning**: Use integrated mapping for efficient response routes

## Contributing

We welcome contributions to improve Crisis Nexus. To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

**Crisis Nexus** - Building resilient communities through technology and collaboration.
