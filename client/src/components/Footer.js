import React from 'react';
import { Typography, Container, Link, Grid, Box } from '@mui/material';
import { Email, Phone, Facebook, Twitter, Instagram } from '@mui/icons-material';

function Footer() {
  return (
    <Box component="footer" style={{ padding: '2rem 0', backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="textPrimary" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2" color="textSecondary">
              We are dedicated to providing disaster relief and recovery services to communities in need.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="textPrimary" gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <Email style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
              contact@example.com
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <Phone style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
              +123 456 7890
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="textPrimary" gutterBottom>
              Follow Us
            </Typography>
            <Link href="https://facebook.com" color="inherit" target="_blank" rel="noopener">
              <Facebook style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
              Facebook
            </Link>
            <br />
            <Link href="https://twitter.com" color="inherit" target="_blank" rel="noopener">
              <Twitter style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
              Twitter
            </Link>
            <br />
            <Link href="https://instagram.com" color="inherit" target="_blank" rel="noopener">
              <Instagram style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
              Instagram
            </Link>
          </Grid>
        </Grid>
        <Box mt={4}>
          <Typography variant="body2" color="textSecondary" align="center">
            {'© '}
            <Link color="inherit" href="/">
            Crisis Nexus
            </Link>{' '}
            {2024}
            {'.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;