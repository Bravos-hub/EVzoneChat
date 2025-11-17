/**
 * Session Timeout Dialog
 * Shows warning and handles session expiration
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  LinearProgress,
  Box
} from '@mui/material';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useTheme } from '../context/ThemeContext';

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6" };

export default function SessionTimeoutDialog({ 
  open, 
  onClose, 
  onExtend, 
  onLogout,
  timeRemaining,
  type = 'warning' // 'warning' | 'timeout' | 'expired'
}) {
  const { accent } = useTheme();
  const accentColor = accent === 'orange' ? EV.orange : accent === 'green' ? EV.green : EV.grey;
  const [countdown, setCountdown] = useState(timeRemaining || 0);

  useEffect(() => {
    if (!open || type !== 'warning') return;

    const interval = setInterval(() => {
      setCountdown(prev => {
        const newValue = Math.max(0, prev - 1000);
        if (newValue === 0) {
          clearInterval(interval);
        }
        return newValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, type]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  const progress = timeRemaining ? (countdown / timeRemaining) * 100 : 0;

  if (type === 'warning') {
    return (
      <Dialog 
        open={open} 
        onClose={onExtend}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            bgcolor: 'background.paper'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningRoundedIcon sx={{ color: accentColor, fontSize: 24 }} />
            <Typography variant="h6" sx={{ fontSize: { xs: '16px', sm: '18px' } }}>
              Session Timeout Warning
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Your session will expire in <strong>{formatTime(countdown)}</strong> due to inactivity.
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 6, 
              borderRadius: 3,
              bgcolor: 'background.default',
              '& .MuiLinearProgress-bar': {
                bgcolor: accentColor
              }
            }} 
          />
          <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
            Click "Stay Logged In" to extend your session.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={onLogout} 
            variant="outlined"
            startIcon={<LogoutRoundedIcon />}
            sx={{ 
              borderColor: 'divider',
              color: 'text.secondary',
              textTransform: 'none'
            }}
          >
            Logout
          </Button>
          <Button 
            onClick={onExtend} 
            variant="contained"
            sx={{ 
              bgcolor: accentColor,
              textTransform: 'none',
              '&:hover': {
                bgcolor: accent === 'green' ? '#02b87a' : accent === 'orange' ? '#e06f00' : '#8a8a8a'
              }
            }}
          >
            Stay Logged In
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  if (type === 'timeout' || type === 'expired') {
    return (
      <Dialog 
        open={open} 
        onClose={() => {}} // Prevent closing
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            bgcolor: 'background.paper'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningRoundedIcon sx={{ color: '#b71c1c', fontSize: 24 }} />
            <Typography variant="h6" sx={{ fontSize: { xs: '16px', sm: '18px' } }}>
              Session Expired
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Your session has expired due to inactivity. For security reasons, you have been logged out.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={onLogout} 
            variant="contained"
            fullWidth
            sx={{ 
              bgcolor: accentColor,
              textTransform: 'none',
              '&:hover': {
                bgcolor: accent === 'green' ? '#02b87a' : accent === 'orange' ? '#e06f00' : '#8a8a8a'
              }
            }}
          >
            Return to Login
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return null;
}

