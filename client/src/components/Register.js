import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  MenuItem, 
  CircularProgress,
  useMediaQuery,
  useTheme,
  InputAdornment,
  IconButton,
  Alert,
  FormControl
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  LockOpen as LockOpenIcon,
  CheckCircle as CheckCircleIcon,
  Send as SendIcon,
  Visibility,
  VisibilityOff,
  Person,
  Email
} from '@mui/icons-material';

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
  maxWidth: 520,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 3,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[6],
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius * 2,
  },
}));

const AuthButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.75),
  fontSize: '1rem',
  fontWeight: 700,
  letterSpacing: 0.75,
  transition: 'all 0.3s ease',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
  '&:disabled': {
    background: theme.palette.action.disabledBackground,
  },
}));

const RoleMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: theme.spacing(2),
  '&.Mui-selected': {
    backgroundColor: theme.palette.action.selected,
    borderRadius: theme.shape.borderRadius,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderRadius: theme.shape.borderRadius,
  },
}));

function Register() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('volunteer');
  const [verificationCode, setVerificationCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendVerificationCode = async () => {
    setError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSendingCode(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/send-verification`,
        { email }
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification code');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setError('Please enter verification code');
      return;
    }

    setIsVerifyingCode(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/verify-code`,
        { email, code: verificationCode } 
      );
      setIsEmailVerified(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isEmailVerified) {
      setError('Please verify your email first');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        { username, email, password, role }
      );
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer maxWidth="xs">
      <AuthCard>
        <Box textAlign="center" mb={4}>
          <LockOpenIcon 
            sx={{ 
              fontSize: 64,
              color: 'primary.main',
              mb: 2,
              filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))'
            }} 
          />
          <Typography 
            variant="h3" 
            gutterBottom 
            sx={{ 
              fontWeight: 800,
              letterSpacing: '-0.75px',
              color: 'text.primary',
              fontSize: isMobile ? '2rem' : '2.5rem',
              lineHeight: 1.2
            }}
          >
            Join Our Community
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Create your account to start making an impact
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              variant="outlined"
              required
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 3 }
              }}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              variant="outlined"
              required
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      color={isEmailVerified ? 'success' : 'secondary'}
                      onClick={handleSendVerificationCode}
                      disabled={isSendingCode || isEmailVerified}
                      endIcon={isEmailVerified ? <CheckCircleIcon /> : <SendIcon />}
                      sx={{ 
                        borderRadius: 3,
                        textTransform: 'none',
                        px: 3
                      }}
                    >
                      {isSendingCode ? (
                        <CircularProgress size={20} />
                      ) : isEmailVerified ? (
                        'Verified'
                      ) : (
                        'Send Code'
                      )}
                    </Button>
                  </InputAdornment>
                ),
                sx: { borderRadius: 3 }
              }}
            />
          </FormControl>

          {!isEmailVerified && (
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              mt: 2,
              flexDirection: isMobile ? 'column' : 'row'
            }}>
              <TextField
                fullWidth
                variant="outlined"
                label="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                disabled={isEmailVerified}
                sx={{ flex: 2 }}
              />
              <Button
                fullWidth={isMobile}
                variant="contained"
                onClick={handleVerifyCode}
                disabled={isVerifyingCode || isEmailVerified}
                sx={{
                  flex: 1,
                  borderRadius: 3,
                  py: 1.75,
                  textTransform: 'none'
                }}
              >
                {isVerifyingCode ? (
                  <CircularProgress size={24} />
                ) : (
                  'Verify Code'
                )}
              </Button>
            </Box>
          )}

          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <TextField
              variant="outlined"
              required
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOpenIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 3 }
              }}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <TextField
              select
              variant="outlined"
              required
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      borderRadius: 3,
                      marginTop: 1,
                      boxShadow: theme.shadows[3]
                    }
                  }
                }
              }}
              sx={{ borderRadius: 3 }}
            >
              <RoleMenuItem value="admin">Administrator</RoleMenuItem>
              <RoleMenuItem value="volunteer">Volunteer</RoleMenuItem>
              <RoleMenuItem value="donor">Donor</RoleMenuItem>
            </TextField>
          </FormControl>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
              {error}
            </Alert>
          )}

          <AuthButton
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading || !isEmailVerified}
            sx={{ 
              mt: 1,
              borderRadius: 3,
              py: 2,
              fontSize: '1.1rem'
            }}
          >
            {loading ? (
              <CircularProgress size={26} color="inherit" />
            ) : (
              'Create Account'
            )}
          </AuthButton>

          <Box textAlign="center" mt={3}>
            <Button
              variant="text"
              color="primary"
              onClick={() => navigate('/login')}
              sx={{ 
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline'
                }
              }}
            >
              Already have an account? Sign In
            </Button>
          </Box>
        </form>
      </AuthCard>
    </AuthContainer>
  );
}

export default Register;