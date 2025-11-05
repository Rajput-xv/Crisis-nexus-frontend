import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  CircularProgress,
  useMediaQuery,
  useTheme,
  InputAdornment,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { sendResetCode } from '../services/api';

const AuthContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  background: theme.palette.background.default,
}));

const AuthCard = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[4],
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    boxShadow: theme.shadows[2],
  },
}));

const AuthButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontSize: '1rem',
  fontWeight: 600,
  letterSpacing: 0.5,
  transition: 'all 0.3s ease',
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[2],
  },
}));

function ForgotPassword() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      await sendResetCode(email);
      setMessage('Reset code sent to your email successfully!');
      // Navigate to reset password page after 2 seconds
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer maxWidth="xs">
      <AuthCard>
        <Box textAlign="center" mb={4}>
          <EmailIcon 
            fontSize="large" 
            color="primary" 
            sx={{ 
              mb: 2,
              fontSize: 48,
              transform: 'scale(1.5)'
            }} 
          />
          <Typography 
            variant="h3" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              letterSpacing: '-0.5px',
              color: theme.palette.text.primary,
              fontSize: isMobile ? '2rem' : '2.5rem'
            }}
          >
            Forgot Password?
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Enter your email address and we'll send you a verification code to reset your password
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            required
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
              sx: { borderRadius: 2 }
            }}
            sx={{ mb: 3 }}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          <AuthButton
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ mb: 3 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Send Reset Code'
            )}
          </AuthButton>

          <Button
            fullWidth
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/login')}
            sx={{ 
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline'
              }
            }}
          >
            Back to Login
          </Button>
        </form>
      </AuthCard>
    </AuthContainer>
  );
}

export default ForgotPassword;