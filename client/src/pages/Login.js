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
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';

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

const SocialButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

function Login() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

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
            Welcome Back
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Sign in to continue to your account
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            required
            label="Email Address"
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
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            required
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {error}
            </Typography>
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
              'Sign In'
            )}
          </AuthButton>

          <Box sx={{ my: 3 }}>
            <Divider>
              <Typography variant="body2" color="textSecondary">
                OR CONTINUE WITH
              </Typography>
            </Divider>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <SocialButton
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
            >
              Google
            </SocialButton>
            <SocialButton
              fullWidth
              variant="outlined"
              startIcon={<GitHubIcon />}
            >
              GitHub
            </SocialButton>
          </Box>

          <Box textAlign="center">
            <Button
              variant="text"
              color="primary"
              onClick={() => navigate('/register')}
              sx={{ 
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline'
                }
              }}
            >
              Don't have an account? Create one
            </Button>
          </Box>

          {/* Forgot Password Link */}
          <Box textAlign="center" sx={{ mt: 1 }}>
            <Button
              variant="text"
              color="primary"
              onClick={() => navigate('/forgot-password')}
              sx={{ 
                fontWeight: 500,
                fontSize: '0.9rem',
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline'
                }
              }}
            >
              Forgot Password?
            </Button>
          </Box>

          {/* Admin Access Link */}
          <Box textAlign="center" sx={{ mt: 2 }}>
            <Button
              variant="text"
              size="small"
              onClick={() => navigate('/admin/login')}
              sx={{ 
                color: 'text.secondary',
                fontSize: '0.8rem',
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline'
                }
              }}
            >
              Admin Access
            </Button>
          </Box>
        </form>
      </AuthCard>
    </AuthContainer>
  );
}

export default Login;