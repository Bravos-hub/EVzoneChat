import React, { useMemo, useState, useEffect } from "react";
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
  Button,
  // Divider, // Unused
  TextField,
  Stack
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

// Demo booking data — in production this would come from the backend via slug/ID
const DEMO_BOOKING = {
  title: "Charging Onboarding Call",
  module: "Charging",
  host: "Leslie Alexander",
  duration: 30, // minutes
  mode: "video", // 'video' | 'audio'
  location: "Online",
  availability: {
    startDate: "2025-04-10",
    endDate: "2025-04-14",
    windowStart: "09:00",
    windowEnd: "17:00",
  },
};

function parseTimeToMinutes(t) {
  // t = "HH:MM"
  const [h, m] = t.split(":").map((x) => parseInt(x, 10));
  return h * 60 + m;
}

function minutesToTime(m) {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function rangeDates(start, end) {
  const out = [];
  const startDate = new Date(start);
  const endDate = new Date(end);
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    out.push(new Date(d));
  }
  return out;
}

export default function PublicBookingPage({ onBack, onNavigate }) {
  const muiTheme = useMuiTheme();
  const { accent, isDark } = useTheme();
  const accentColor = accent === 'orange' ? EV.orange : accent === 'green' ? EV.green : EV.grey;
  const { title, module, host, duration, mode, location, availability } = DEMO_BOOKING;
  
  // Set document title
  useEffect(() => {
    document.title = "Book Meeting - EVzone Chat";
    return () => {
      document.title = "EVzone Chat";
    };
  }, []);

  const [selectedDate, setSelectedDate] = useState(availability.startDate);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guestNotes, setGuestNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const dates = useMemo(
    () => rangeDates(availability.startDate, availability.endDate),
    [availability.startDate, availability.endDate]
  );

  const slots = useMemo(() => {
    const startMin = parseTimeToMinutes(availability.windowStart);
    const endMin = parseTimeToMinutes(availability.windowEnd);
    const out = [];
    for (let m = startMin; m + duration <= endMin; m += duration) {
      out.push({ start: minutesToTime(m), end: minutesToTime(m + duration) });
    }
    return out;
  }, [availability.windowStart, availability.windowEnd, duration]);

  const modeIcon = mode === "video" ? <VideocamRoundedIcon sx={{ fontSize: 18 }} /> : <PhoneRoundedIcon sx={{ fontSize: 18 }} />;

  const handleConfirm = () => {
    if (!selectedSlot || !selectedDate || !name || !email) {
      alert("Please select a date, time and fill in your name and email.");
      return;
    }
    // In production, send this to backend and return a confirmation + calendar link.
    console.log("Booking confirmed", {
      date: selectedDate,
      slot: selectedSlot,
      guest: { name, email, phone },
      notes: guestNotes,
    });
    setConfirmed(true);
    // Navigate to confirmation page after booking
    if (onNavigate) {
      onNavigate('/meetings/confirm/bk-2025-0001');
    }
  };

  const isSameDate = (dStr) => selectedDate === dStr;

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none`}</style>

      <Box sx={{ width: '100%', height: '100%', bgcolor: 'background.default', overflowX: 'hidden', margin: 0, padding: 0 }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <AppBar elevation={0} position="fixed" sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom: `1px solid ${muiTheme.palette.divider}`, width: '100%', zIndex: 1100 }}>
            <Toolbar sx={{ 
              minHeight: { xs: '56px', md: '64px' },
              width: "100%",
              px: { xs: 1.5, sm: 2, md: 3, lg: 4 }
            }}>
              <IconButton onClick={onBack} aria-label="Back" sx={{ color: 'text.primary', mr: 1 }}>
                <ArrowBackRoundedIcon />
              </IconButton>
              <EventAvailableRoundedIcon sx={{ mr: 1, color: accentColor }} />
              <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                <Typography variant="subtitle1" className="font-semibold" noWrap>
                  Book a slot
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {module} • {duration} min • {mode === "video" ? "Video" : "Audio"}
                </Typography>
              </Box>
            </Toolbar>
          </AppBar>

          {/* Content */}
          <Box className="no-scrollbar" sx={{ 
            flex: 1, 
            pt: { xs: "56px", md: "64px" }, 
            pb: { xs: 10, md: 12 }, 
            px: { xs: 1.5, sm: 2, md: 3, lg: 4 },
            overflowY: "auto",
            width: '100%'
          }}>
            {/* Page Title */}
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600, 
                mt: 2, 
                mb: 1.5, 
                color: 'text.primary',
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
              }}
            >
              Book Meeting
            </Typography>
            
            {/* Meeting header card */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mt: 1.5,
                borderRadius: 2,
                border: "1px solid rgba(0,0,0,0.06)",
                bgcolor: "#fff",
              }}
            >
              <Typography variant="subtitle1" className="font-semibold" sx={{ mb: 0.5 }}>
                {title}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                <Chip size="small" label={module} sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : EV.light, color: 'text.primary' }} />
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <PersonRoundedIcon sx={{ fontSize: 18, opacity: 0.8 }} />
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>Hosted by {host}</Typography>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                {modeIcon}
                <AccessTimeRoundedIcon sx={{ fontSize: 18, opacity: 0.8 }} />
                <Typography variant="caption" sx={{ opacity: 0.9 }}>{duration} min</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocationOnRoundedIcon sx={{ fontSize: 18, opacity: 0.8 }} />
                <Typography variant="caption" sx={{ opacity: 0.9 }}>{location}</Typography>
              </Stack>
            </Paper>

            {/* Date picker */}
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 2.5, mb: 1, display: 'block' }}>
              1. Pick a day
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1, mb: 2, className: 'no-scrollbar' }}>
              {dates.map((d) => {
                const iso = d.toISOString().slice(0, 10);
                const label = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
                const selected = isSameDate(iso);
                return (
                  <Button
                    key={iso}
                    variant={selected ? "contained" : "outlined"}
                    size="small"
                    sx={{
                      textTransform: "none",
                      borderRadius: 999,
                      minWidth: "auto",
                      px: { xs: 1, sm: 1.5 },
                      whiteSpace: "nowrap",
                      bgcolor: selected ? accentColor : 'background.paper',
                      color: selected ? "#fff" : 'text.primary',
                      borderColor: selected ? accentColor : muiTheme.palette.divider,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                    onClick={() => {
                      setSelectedDate(iso);
                      setSelectedSlot(null);
                    }}
                  >
                    {label}
                  </Button>
                );
              })}
            </Box>

            {/* Time slots */}
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, mb: 1, display: 'block' }}>
              2. Pick a time
            </Typography>
            {slots.length === 0 ? (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                No available slots for this day.
              </Typography>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1, mb: 2 }}>
                {slots.map((s, idx) => {
                  const label = `${s.start} – ${s.end}`;
                  const selected = selectedSlot === label;
                  return (
                    <Button
                      key={idx}
                      variant={selected ? "contained" : "outlined"}
                      size="small"
                      sx={{
                        textTransform: "none",
                        borderRadius: 999,
                        fontSize: { xs: 11, sm: 12 },
                        bgcolor: selected ? accentColor : 'background.paper',
                        color: selected ? "#fff" : 'text.primary',
                        borderColor: selected ? accentColor : muiTheme.palette.divider,
                      }}
                      onClick={() => setSelectedSlot(label)}
                    >
                      {label}
                    </Button>
                  );
                })}
              </Box>
            )}

            {/* Guest details */}
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 2, mb: 1, display: 'block' }}>
              3. Your details
            </Typography>
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="small"
              sx={{ mb: 1.5 }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="small"
              sx={{ mb: 1.5 }}
            />
            <TextField
              fullWidth
              label="Phone (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              size="small"
              sx={{ mb: 1.5 }}
            />
            <TextField
              fullWidth
              label="Message to host (optional)"
              value={guestNotes}
              onChange={(e) => setGuestNotes(e.target.value)}
              size="small"
              multiline
              minRows={3}
              sx={{ mb: 2 }}
            />

            {/* Confirmation card once booked */}
            {confirmed && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 3,
                  borderRadius: 2,
                  border: "1px solid rgba(0,0,0,0.06)",
                  bgcolor: "#f0fff4",
                }}
              >
                <Typography variant="subtitle2" className="font-semibold" sx={{ mb: 0.5 }}>
                  Booking confirmed
                </Typography>
                <Typography variant="caption" sx={{ display: "block", mb: 0.5 }}>
                  {selectedDate} • {selectedSlot}
                </Typography>
                <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
                  A confirmation email will contain your join link and calendar invite.
                </Typography>
                <Button size="small" variant="outlined" sx={{ textTransform: "none" }}>
                  Add to calendar (ICS)
                </Button>
              </Paper>
            )}
          </Box>

          {/* Bottom CTA */}
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
                background: isDark
                  ? "linear-gradient(to top, rgba(18,18,18,0.96), rgba(18,18,18,0.86))"
                  : "linear-gradient(to top, rgba(255,255,255,0.96), rgba(255,255,255,0.86))",
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
                  mb: 1,
                }}
                onClick={handleConfirm}
              >
                Confirm booking
              </Button>
              <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: 'text.secondary' }}>
                You will receive an email with your join link and calendar invite
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

/*
  ===== Tests (React Testing Library) — copy to PublicBookingPage.test.jsx =====

  import React from 'react';
  import { render, screen } from '@testing-library/react';
  import PublicBookingPage from './PublicBookingPage';

  test('renders guest booking header', () => {
    render(<PublicBookingPage />);
    expect(screen.getByText(/Book a slot/i)).toBeInTheDocument();
  });
*/
