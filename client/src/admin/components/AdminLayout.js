import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Event,
  Report,
  AdminPanelSettings,
  Logout,
  AccountCircle,
  Settings
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const drawerWidth = 280;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, 0.1)',
}));

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (!token || !user) {
      navigate('/admin/login');
      return;
    }
    
    try {
      setAdminUser(JSON.parse(user));
    } catch (error) {
      console.error('Error parsing admin user:', error);
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/admin/dashboard',
      description: 'Overview & Statistics'
    },
    {
      text: 'Users Management',
      icon: <People />,
      path: '/admin/users',
      description: 'Manage Platform Users'
    },
    {
      text: 'Incident Management',
      icon: <Report />,
      path: '/admin/incidents',
      description: 'Monitor & Update Incidents'
    },
    {
      text: 'Event Management',
      icon: <Event />,
      path: '/admin/events',
      description: 'Create & Manage Events'
    }
  ];

  const drawer = (
    <Box>
      <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
        <AdminPanelSettings sx={{ fontSize: 48, mb: 1 }} />
        <Typography variant="h6" fontWeight="bold">
          Crisis Nexus
        </Typography>
        <Typography variant="caption">
          Admin Panel
        </Typography>
        {adminUser && (
          <Chip 
            label={adminUser.username}
            size="small"
            sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
          />
        )}
      </Box>
      <Divider />
      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'white' : 'inherit',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.dark' : 'action.hover',
                  },
                  py: 1.5
                }}
              >
                <ListItemIcon sx={{ 
                  color: isActive ? 'white' : 'primary.main',
                  minWidth: 40
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  secondary={!isActive ? item.description : null}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 'bold' : 'medium',
                    fontSize: '0.9rem'
                  }}
                  secondaryTypographyProps={{
                    fontSize: '0.75rem',
                    color: 'text.secondary'
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  if (!adminUser) {
    return null; // or loading spinner
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledAppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find(item => item.path === location.pathname)?.text || 'Admin Panel'}
          </Typography>

          <Box display="flex" alignItems="center">
            <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
              Welcome, {adminUser.username}
            </Typography>
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
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </StyledAppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default'
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
