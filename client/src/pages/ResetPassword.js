import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import LockIcon from '@mui/icons-material/Lock';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { verifyResetCode, resetPassword } from '../services/api';

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

function ResetPassword() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [step, setStep] = useState(1); // 1: verify code, 2: set new password
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      await verifyResetCode(email, code);
      setMessage('Code verified successfully!');
      setStep(2);
    } catch (err) {
      setError(err.message || 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }
    
    try {
      await resetPassword(email, code, newPassword);
      setMessage('Password reset successful! Redirecting to login...');
      // Navigate to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <AuthContainer maxWidth="xs">
        <AuthCard>
          <Box textAlign="center" mb={4}>
            <VerifiedUserIcon 
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
              Verify Code
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Enter the verification code sent to {email}
            </Typography>
          </Box>

          <form onSubmit={handleVerifyCode}>
            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              required
              label="Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VerifiedUserIcon color="action" />
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
                'Verify Code'
              )}
            </AuthButton>

            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/forgot-password')}
              sx={{ 
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline'
                }
              }}
            >
              Resend Code
            </Button>
          </form>
        </AuthCard>
      </AuthContainer>
    );
  }

  return (
    <AuthContainer maxWidth="xs">
      <AuthCard>
        <Box textAlign="center" mb={4}>
          <LockIcon 
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
            Set New Password
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Enter your new password below
          </Typography>
        </Box>

        <form onSubmit={handleResetPassword}>
          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            required
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
              sx: { borderRadius: 2 }
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            required
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
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
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Reset Password'
            )}
          </AuthButton>
        </form>
      </AuthCard>
    </AuthContainer>
  );
}

export default ResetPassword;