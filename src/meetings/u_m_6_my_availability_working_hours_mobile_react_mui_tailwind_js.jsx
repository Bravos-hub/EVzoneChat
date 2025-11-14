import React, { useState, useEffect } from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { useTheme } from "../context/ThemeContext";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Chip,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Button,
  Stack
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
// import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded"; // Unused

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

const DEFAULT_MODULES = [
  {
    id: "ecom",
    name: "E-Commerce",
    enabled: true,
    days: "Mon–Fri",
    start: "09:00",
    end: "16:00",
    slot: "30",
  },
  {
    id: "rides",
    name: "Rides",
    enabled: false,
    days: "Sat–Sun",
    start: "10:00",
    end: "14:00",
    slot: "15",
  },
  {
    id: "charging",
    name: "Charging",
    enabled: true,
    days: "Mon–Sat",
    start: "08:00",
    end: "18:00",
    slot: "30",
  },
];

export default function MyAvailabilityWorkingHours({ onBack, onNavigate }) {
  const muiTheme = useMuiTheme();
  const { accent, isDark } = useTheme();
  const accentColor = accent === 'orange' ? EV.orange : accent === 'green' ? EV.green : EV.grey;
  const [modules, setModules] = useState(DEFAULT_MODULES);
  
  // Set document title
  useEffect(() => {
    document.title = "My Availability - EVzone Chat";
    return () => {
      document.title = "EVzone Chat";
    };
  }, []);

  const updateModule = (id, patch) => {
    setModules((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  };

  const handleSave = () => {
    console.log("Availability saved", modules);
    alert("Availability preferences saved (demo). Meeting booking will use these defaults.");
    // Navigate back after saving
    if (onNavigate) {
      onNavigate(-1);
    }
  };

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none`}</style>

      <Box sx={{ width: '100%', height: '100%', bgcolor: 'background.default', overflowX: 'hidden', margin: 0, padding: 0 }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <AppBar elevation={0} position="fixed" sx={{ bgcolor: accentColor, color: "#fff", width: '100%', zIndex: 1100 }}>
            <Toolbar
              sx={{ 
                minHeight: { xs: '56px', md: '64px' },
                width: "100%",
                px: { xs: 1.5, sm: 2, md: 3, lg: 4 }
              }}
            >
              <IconButton
                onClick={onBack}
                aria-label="Back"
                sx={{ color: "#fff", mr: 1 }}
              >
                <ArrowBackRoundedIcon />
              </IconButton>
              <AccessTimeRoundedIcon sx={{ mr: 1 }} />
              <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                <Typography variant="subtitle1" className="font-semibold" noWrap>
                  My availability
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Default working hours per module
                </Typography>
              </Box>
            </Toolbar>
          </AppBar>

          {/* Content */}
          <Box
            className="no-scrollbar"
            sx={{ 
              flex: 1, 
              overflowY: "auto", 
              pt: { xs: "56px", md: "64px" }, 
              pb: { xs: 8, md: 10 }, 
              px: { xs: 1.5, sm: 2, md: 3, lg: 4 },
              width: '100%'
            }}
          >
            {/* Page Title */}
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600, 
                mt: 2, 
                mb: 1, 
                color: 'text.primary',
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
              }}
            >
              My Availability
            </Typography>
            
            <Typography variant="caption" className="text-gray-600 mt-1 mb-2 block">
              These settings power your meeting booking defaults, so you don&apos;t have to re-enter times every time.
            </Typography>

            {modules.map((m) => (
              <Paper
                key={m.id}
                elevation={0}
                sx={{
                  mb: 2,
                  p: { xs: 1.5, sm: 1.75 },
                  borderRadius: 2,
                  border: `1px solid ${muiTheme.palette.divider}`,
                  bgcolor: 'background.paper',
                }}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      size="small"
                      label={m.name}
                      sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : EV.light, fontSize: 11, height: 22, color: 'text.primary' }}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={m.enabled}
                          onChange={(e) => updateModule(m.id, { enabled: e.target.checked })}
                          size="small"
                        />
                      }
                      label={m.enabled ? "Enabled" : "Off"}
                      sx={{ m: 0, ml: 0.5 }}
                    />
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={1} sx={{ mb: 1.25 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Days</InputLabel>
                    <Select
                      label="Days"
                      value={m.days}
                      onChange={(e) => updateModule(m.id, { days: e.target.value })}
                    >
                      <MenuItem value="Mon–Fri">Mon–Fri</MenuItem>
                      <MenuItem value="Mon–Sat">Mon–Sat</MenuItem>
                      <MenuItem value="Sat–Sun">Sat–Sun</MenuItem>
                      <MenuItem value="Every day">Every day</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>

                <Stack direction="row" spacing={1} sx={{ mb: 1.25 }}>
                  <TextField
                    label="Start"
                    type="time"
                    size="small"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={m.start}
                    onChange={(e) => updateModule(m.id, { start: e.target.value })}
                  />
                  <TextField
                    label="End"
                    type="time"
                    size="small"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={m.end}
                    onChange={(e) => updateModule(m.id, { end: e.target.value })}
                  />
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Slot length</InputLabel>
                    <Select
                      label="Slot length"
                      value={m.slot}
                      onChange={(e) => updateModule(m.id, { slot: e.target.value })}
                    >
                      <MenuItem value="15">15 min</MenuItem>
                      <MenuItem value="30">30 min</MenuItem>
                      <MenuItem value="45">45 min</MenuItem>
                      <MenuItem value="60">60 min</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant="caption" sx={{ color: EV.grey }}>
                    Used as default slot length for this module
                  </Typography>
                </Stack>
              </Paper>
            ))}
          </Box>

          {/* Bottom save button */}
          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              width: '100%',
              pb: { xs: `calc(2rem + env(safe-area-inset-bottom))`, sm: 2.5, md: 3 },
              display: "flex",
              justifyContent: "center",
              zIndex: 100,
            }}
          >
            <Box
              sx={{
                width: "100%",
                px: { xs: 1.5, sm: 2, md: 3, lg: 4 },
                pt: { xs: 2, sm: 2.5, md: 3 },
                pb: { xs: 2, sm: 2.5, md: 3 },
                borderTop: `1px solid ${muiTheme.palette.divider}`,
                bgcolor: 'background.paper',
              }}
            >
              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  bgcolor: accentColor,
                  color: "#fff",
                  textTransform: "none",
                  borderRadius: 999,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
                  "&:hover": { bgcolor: accent === 'green' ? '#02b87a' : accent === 'orange' ? '#e06f00' : '#8a8a8a' },
                }}
                onClick={handleSave}
              >
                Save availability
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

/*
  ===== Tests (React Testing Library) — copy to MyAvailabilityWorkingHours.test.jsx =====

  import React from 'react';
  import { render, screen } from '@testing-library/react';
  import MyAvailabilityWorkingHours from './MyAvailabilityWorkingHours';

  test('renders my availability header', () => {
    render(<MyAvailabilityWorkingHours />);
    expect(screen.getByText(/My availability/i)).toBeInTheDocument();
  });
*/
