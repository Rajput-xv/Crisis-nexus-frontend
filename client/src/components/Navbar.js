import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem, 
  useMediaQuery, 
  Divider,
  Box,
  Drawer
} from '@mui/material';
import { VolunteerActivism } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { styled } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2c3e50 30%, #3498db 90%)',
  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, 0.1)',
}));

const NavTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginLeft: theme.spacing(2),
  letterSpacing: 1.2,
  '&:hover': {
    opacity: 0.9,
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  fontWeight: 500,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    background: 'rgba(255, 255, 255, 0.1)',
  },
}));

const MobileMenuButton = styled(IconButton)(({ theme }) => ({
  color: 'inherit',
  marginLeft: 'auto',
}));

function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Report Incident', path: '/report' },
    { name: 'Hospitals', path: '/hospital' },
    ...(user ? [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Resources', path: '/resources' },
      { name: 'Events', path: '/events' },
    ] : []),
  ];

  const authLinks = user ? [
    { name: 'Logout', action: logout }
  ] : [
    { name: 'Login', path: '/login' },
    { name: 'Register', path: '/register' }
  ];

  const drawerContent = (
    <Box sx={{ width: 250, padding: 2 }}>
      <NavTitle variant="h6" gutterBottom>
        Crisis Nexus
      </NavTitle>
      <Divider />
      {navLinks.map((link) => (
        <MenuItem 
          key={link.name}
          component={RouterLink}
          to={link.path}
          onClick={handleDrawerToggle}
        >
          {link.name}
        </MenuItem>
      ))}
      <Divider />
      {authLinks.map((link) => (
        <MenuItem
          key={link.name}
          component={link.path ? RouterLink : 'button'}
          to={link.path}
          onClick={link.action ? () => { link.action(); handleDrawerToggle(); } : handleDrawerToggle}
        >
          {link.name}
        </MenuItem>
      ))}
    </Box>
  );

  return (
    <StyledAppBar position="sticky">
      <Toolbar>
      <VolunteerActivism sx={{ color: 'secondary.main' }} fontSize="large" />
        <NavTitle 
          variant="h6" 
          component={RouterLink} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'inherit' 
          }}
        >
          Crisis Nexus
        </NavTitle>

        {isMobile ? (
          <>
            <MobileMenuButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </MobileMenuButton>
            <Drawer
              anchor="right"
              open={mobileOpen}
              onClose={handleDrawerToggle}
            >
              {drawerContent}
            </Drawer>
          </>
        ) : (
          <>
            {navLinks.map((link) => (
              <NavButton
                key={link.name}
                color="inherit"
                component={RouterLink}
                to={link.path}
              >
                {link.name}
              </NavButton>
            ))}
            
            {user ? (
              <>
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={handleMenuOpen}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  {authLinks.map((link) => (
                    <MenuItem
                      key={link.name}
                      onClick={() => {
                        if (link.action) link.action();
                        handleMenuClose();
                      }}
                    >
                      {link.name}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              authLinks.map((link) => (
                <NavButton
                  key={link.name}
                  color="inherit"
                  component={RouterLink}
                  to={link.path}
                >
                  {link.name}
                </NavButton>
              ))
            )}
          </>
        )}
      </Toolbar>
    </StyledAppBar>
  );
}

export default Navbar;