import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { useTheme } from '../context/ThemeContext';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

/**
 * AudioPlayer Component
 * A reusable audio player for voice messages with play/pause, progress tracking, and duration display
 * 
 * @param {string} audioUrl - URL or blob URL of the audio file
 * @param {string} text - Display text for the message (e.g., "Voice message (1:23)")
 * @param {string} accentColor - Theme accent color
 * @param {string} textColor - Text color for the message
 * @param {boolean} isMine - Whether this is the user's own message
 * @param {Object} sx - Additional styling props
 */
export default function AudioPlayer({ 
  audioUrl, 
  text, 
  accentColor, 
  textColor = '#fff',
  isMine = true,
  sx = {} 
}) {
  const { accent } = useTheme();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const progressIntervalRef = useRef(null);

  // Get theme accent color if not provided
  const themeAccentColor = accentColor || (accent === 'orange' ? EV.orange : accent === 'green' ? EV.green : EV.grey);

  // Load audio metadata
  useEffect(() => {
    if (!audioRef.current || !audioUrl) {
      setIsLoading(true);
      return;
    }

    const audio = audioRef.current;
    setIsLoading(true);
    setCurrentTime(0);
    setDuration(0);
    
    const handleLoadedMetadata = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      if (audio.currentTime && isFinite(audio.currentTime)) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      // Update progress every 100ms for smooth animation
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      progressIntervalRef.current = setInterval(() => {
        if (audio && !audio.paused) {
          setCurrentTime(audio.currentTime);
        }
      }, 100);
    };

    const handleError = (e) => {
      console.error('Audio error:', e);
      setIsLoading(false);
      setIsPlaying(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    // Set src and load the audio
    if (audio.src !== audioUrl) {
      audio.src = audioUrl;
    }
    audio.load();

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      });
    }
  };

  const formatTime = (seconds) => {
    if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.5, width: '100%', ...sx }}>
      {/* Play/Pause Button */}
      <IconButton
        size="small"
        onClick={togglePlayPause}
        disabled={isLoading || !audioUrl}
        sx={{
          bgcolor: themeAccentColor,
          color: '#fff',
          width: '2.5rem',
          height: '2.5rem',
          flexShrink: 0,
          '&:hover': {
            bgcolor: accent === 'orange' ? '#e06f00' : accent === 'green' ? '#02b37b' : '#8f8f8f',
          },
          '&:disabled': {
            bgcolor: themeAccentColor,
            opacity: 0.6,
          },
        }}
      >
        {isPlaying ? (
          <PauseRoundedIcon sx={{ fontSize: 20 }} />
        ) : (
          <PlayArrowRoundedIcon sx={{ fontSize: 20 }} />
        )}
      </IconButton>

      {/* Audio Element (Hidden) */}
      <audio
        ref={audioRef}
        preload="metadata"
        style={{ display: 'none' }}
      />

      {/* Progress and Info */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        {/* Waveform Visual - Animated bars */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, height: 24, px: 0.5 }}>
          {Array.from({ length: 20 }).map((_, i) => {
            // Create animated waveform bars - higher bars in middle, lower on edges
            const baseHeight = Math.abs(Math.sin((i / 20) * Math.PI * 2)) * 0.6 + 0.3;
            const isActive = isPlaying && (i < (progress / 100) * 20);
            const barHeight = isActive ? baseHeight : baseHeight * 0.4;
            
            return (
              <Box
                key={i}
                sx={{
                  width: 2,
                  height: `${barHeight * 100}%`,
                  minHeight: 4,
                  bgcolor: isActive ? themeAccentColor : (isMine ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)'),
                  borderRadius: 1,
                  transition: 'all 0.1s ease',
                  animation: isPlaying ? 'waveform 0.5s ease-in-out infinite' : 'none',
                  animationDelay: `${i * 0.05}s`,
                  '@keyframes waveform': {
                    '0%, 100%': { height: `${barHeight * 100}%` },
                    '50%': { height: `${(barHeight + 0.2) * 100}%` },
                  },
                }}
              />
            );
          })}
        </Box>

        {/* Text and Time */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontSize: '12px',
              fontWeight: 600,
              color: textColor,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
            }}
          >
            {text || 'Voice message'}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: '11px',
              color: isMine ? 'rgba(255, 255, 255, 0.8)' : 'text.secondary',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              fontWeight: 500,
            }}
          >
            {formatTime(duration)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

