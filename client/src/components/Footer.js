import React from 'react';
import { 
  Typography, 
  Container, 
  Link, 
  Grid, 
  Box, 
  useTheme,
  useMediaQuery,
  IconButton
} from '@mui/material';
import { 
  Email, 
  Phone, 
  Facebook, 
  Twitter, 
  Instagram,
  LocationOn,
  VolunteerActivism
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const FooterContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2c3e50 30%, #3498db 90%)',
  boxShadow: '0 -3px 5px 2px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(6, 0),
  color: theme.palette.common.white,
  marginTop: 'auto',
}));

const FooterLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  transition: 'all 0.3s ease',
  color: theme.palette.common.white,
  '&:hover': {
    color: theme.palette.secondary.main,
    transform: 'translateX(4px)'
  },
}));

const SocialIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.common.white,
  transition: 'all 0.3s ease',
  '&:hover': {
    color: theme.palette.secondary.main,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <FooterContainer component="footer">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Column */}
          <Grid item xs={12} sm={6} md={4}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <VolunteerActivism fontSize="large" sx={{ color: 'secondary.main' }} />
              <Typography variant="h6" sx={{ color: 'common.white' }}>
                Crisis Nexus
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'common.white', opacity: 0.9 }}>
              Dedicated to providing immediate disaster relief and long-term recovery support 
              to affected communities worldwide.
            </Typography>
          </Grid>

          {/* Contact Column */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom sx={{ color: 'common.white' }}>
              Contact Information
            </Typography>
            <Box display="flex" flexDirection="column" gap={1.5}>
              <FooterLink href="mailto:contact@example.com">
                <Email fontSize="small" />
                contact@crisisnexus.org
              </FooterLink>
              <FooterLink href="tel:+1234567890">
                <Phone fontSize="small" />
                +1 (234) 567-890
              </FooterLink>
              <FooterLink>
                <LocationOn fontSize="small" />
                123 Relief Avenue, Crisis City
              </FooterLink>
            </Box>
          </Grid>

          {/* Social Media Column */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ color: 'common.white' }}>
              Stay Connected
            </Typography>
            <Box display="flex" gap={1}>
              <SocialIconButton aria-label="Facebook" href="https://facebook.com" target="_blank">
                <Facebook fontSize={isMobile ? "medium" : "large"} />
              </SocialIconButton>
              <SocialIconButton aria-label="Twitter" href="https://twitter.com" target="_blank">
                <Twitter fontSize={isMobile ? "medium" : "large"} />
              </SocialIconButton>
              <SocialIconButton aria-label="Instagram" href="https://instagram.com" target="_blank">
                <Instagram fontSize={isMobile ? "medium" : "large"} />
              </SocialIconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright Section */}
        <Box mt={4} pt={4} borderTop={`1px solid rgba(255, 255, 255, 0.2)`}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="body2" sx={{ color: 'common.white', opacity: 0.8 }}>
                © {new Date().getFullYear()} Crisis Nexus. All rights reserved.
              </Typography>
            </Grid>
            <Grid item>
              <Box display="flex" gap={2}>
                <FooterLink href="/privacy" variant="body2">
                  Privacy Policy
                </FooterLink>
                <FooterLink href="/terms" variant="body2">
                  Terms of Service
                </FooterLink>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </FooterContainer>
  );
}

export default Footer;