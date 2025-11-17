import React, { useState, useMemo, useEffect } from "react";
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
  Divider,
  Stack,
  Snackbar
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import EditCalendarRoundedIcon from "@mui/icons-material/EditCalendarRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
// import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded"; // Unused

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

// Demo booking data — in production this would come via props or route loader
const DEMO_BOOKING = {
  id: "req-1234",
  title: "Charging Onboarding Call",
  module: "Charging",
  type: "group", // '1:1' | 'group'
  host: "You",
  who: "Core Team (5)",
  coHosts: ["Alex Cooper", "Kayle"],
  mode: "video", // 'video' | 'audio'
  location: "Online",
  availability: {
    startDate: "2025-04-10",
    endDate: "2025-04-14",
    windowStart: "09:00",
    windowEnd: "17:00",
    duration: "30", // minutes
  },
  notes:
    "We will walk through the new Charging dashboard and mobile flows. Please review the spec before the call.",
  bookingLink: "https://evzone.meet/book/req-1234",
};

export default function MeetingBookingDetails({ onBack, onNavigate, location: routeLocation }) {
  const muiTheme = useMuiTheme();
  const { isDark } = useTheme();
  const [snack, setSnack] = useState("");
  
  // Set document title
  useEffect(() => {
    document.title = "Meeting Details - EVzone Chat";
    return () => {
      document.title = "EVzone Chat";
    };
  }, []);

  // Get meeting ID from URL if available
  const meetingId = useMemo(() => {
    if (routeLocation?.pathname) {
      const match = routeLocation.pathname.match(/\/meetings\/([^/]+)/);
      return match ? match[1] : null;
    }
    return null;
  }, [routeLocation]);

  const { module, title, type, who, coHosts, mode, location, availability, notes, bookingLink } =
    DEMO_BOOKING;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(bookingLink);
        setSnack("Booking link copied");
      } else {
        setSnack("Cannot access clipboard in this environment");
      }
    } catch {
      setSnack("Failed to copy link");
    }
  };

  const modeIcon = mode === "video" ? (
    <VideocamRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
  ) : (
    <PhoneRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
  );

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none`}</style>

      <Box sx={{ width: '100%', height: '100%', bgcolor: 'background.default', overflowX: 'hidden', margin: 0, padding: 0 }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header - matching Dealz Status style */}
          <AppBar elevation={0} position="static" sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom: `1px solid ${muiTheme.palette.divider}` }}>
            <Toolbar className="!min-h-[56px]" sx={{ px: { xs: 1.5, sm: 3 } }}>
              <IconButton
                onClick={onBack}
                aria-label="Back"
                sx={{ color: 'text.primary', padding: { xs: '6px', sm: '8px' } }}
              >
                <ArrowBackRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </IconButton>
              <Typography variant="h6" className="font-bold" sx={{ color: 'text.primary', fontSize: { xs: '16px', sm: '18px' }, ml: { xs: 0.5, sm: 1 }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Meeting details
                </Typography>
            </Toolbar>
          </AppBar>

          {/* Content */}
          <Box
            className="no-scrollbar"
            sx={{ 
              flex: 1, 
              overflowY: "auto", 
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
                mb: 1.5, 
                color: 'text.primary',
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
              }}
            >
              Meeting Details
            </Typography>
            
            <Paper
              elevation={0}
              sx={{
                p: { xs: 1.5, sm: 2 },
                mt: 1.5,
                borderRadius: 2,
                border: `1px solid ${muiTheme.palette.divider}`,
                bgcolor: 'background.paper',
              }}
            >
              {/* Title & module */}
              <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mb: 1 }}>
                <Box>
                  <Chip
                    size="small"
                    label={module}
                    sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : EV.light, fontSize: 10, height: 20, color: 'text.primary' }}
                  />
                </Box>
                <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                  <Typography
                    variant="subtitle1"
                    className="font-semibold"
                    sx={{ mb: 0.4, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", color: 'text.primary' }}
                  >
                    {title}
                  </Typography>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    {type === "group" ? (
                      <GroupRoundedIcon sx={{ fontSize: 18, opacity: 0.8, color: 'text.secondary' }} />
                    ) : (
                      <PersonRoundedIcon sx={{ fontSize: 18, opacity: 0.8, color: 'text.secondary' }} />
                    )}
                    <Typography variant="caption" sx={{ opacity: 0.9, color: 'text.secondary' }}>
                      {type === "group" ? "Group" : "1:1"} • With {who}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>

              {/* Mode + location */}
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Box sx={{ color: 'text.secondary' }}>{modeIcon}</Box>
                <Typography variant="caption" sx={{ opacity: 0.9, color: 'text.secondary' }}>
                  {mode === "video" ? "Video" : "Audio"} • {location}
                </Typography>
              </Stack>

              {/* Availability window */}
              <Box sx={{ mt: 1.5, mb: 1.5 }}>
                <Typography variant="subtitle2" className="font-semibold" sx={{ mb: 0.5, color: 'text.primary' }}>
                  Availability window
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <AccessTimeRoundedIcon sx={{ fontSize: 18, opacity: 0.8, color: 'text.secondary' }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Dates: {availability.startDate} → {availability.endDate}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <AccessTimeRoundedIcon sx={{ fontSize: 18, opacity: 0.8, color: 'text.secondary' }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Daily window: {availability.windowStart} – {availability.windowEnd}
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ display: "block", opacity: 0.9, color: 'text.secondary' }}>
                  Slot length: {availability.duration} minutes
                </Typography>
              </Box>

              {/* Co-hosts & notes */}
              {type === "group" && (
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="subtitle2" className="font-semibold" sx={{ mb: 0.5, color: 'text.primary' }}>
                    Co‑hosts
                  </Typography>
                  {coHosts.length === 0 ? (
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      None
                    </Typography>
                  ) : (
                    <Stack direction="row" flexWrap="wrap" gap={0.5}>
                      {coHosts.map((name) => (
                        <Chip 
                          key={name} 
                          size="small" 
                          label={name}
                          sx={{ 
                            bgcolor: isDark ? 'rgba(255,255,255,0.1)' : EV.light,
                            color: 'text.primary'
                          }}
                        />
                      ))}
                    </Stack>
                  )}
                </Box>
              )}

              <Box sx={{ mb: 1.5 }}>
                <Typography variant="subtitle2" className="font-semibold" sx={{ mb: 0.5, color: 'text.primary' }}>
                  Notes / agenda
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 13, color: 'text.primary' }}>
                  {notes}
                </Typography>
              </Box>

              {/* Booking link */}
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="subtitle2" className="font-semibold" sx={{ mb: 0.5, color: 'text.primary' }}>
                  Booking link
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    p: 1,
                    borderRadius: 1,
                    bgcolor: isDark ? 'rgba(255,255,255,0.1)' : EV.light,
                    color: 'text.primary',
                    wordBreak: "break-all",
                    mb: 0.5,
                  }}
                >
                  {bookingLink}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<ContentCopyRoundedIcon />}
                  sx={{ textTransform: "none" }}
                  onClick={handleCopyLink}
                >
                  Copy link
                </Button>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              {/* Host actions */}
              <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' }, gap: { xs: 1, sm: 1 } }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<EditCalendarRoundedIcon />}
                  sx={{ textTransform: "none", flex: { xs: '1 1 auto', sm: 'none' }, minWidth: { xs: 'auto', sm: 120 } }}
                  onClick={() => onNavigate?.('/meetings/availability')}
                >
                  Edit availability
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ textTransform: "none", flex: { xs: '1 1 auto', sm: 'none' }, minWidth: { xs: 'auto', sm: 120 } }}
                  onClick={() => onNavigate?.(`/meetings/book/${meetingId || 'req-1234'}`)}
                >
                  View public page
                </Button>
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  startIcon={<CancelRoundedIcon />}
                  sx={{ textTransform: "none", flex: { xs: '1 1 auto', sm: 'none' }, minWidth: { xs: 'auto', sm: 120 } }}
                >
                  Cancel booking
                </Button>
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={!!snack}
        autoHideDuration={1600}
        onClose={() => setSnack("")}
        message={snack}
      />
    </>
  );
}

/*
  ===== Tests (React Testing Library) — copy to MeetingBookingDetails.test.jsx =====

  import React from 'react';
  import { render, screen } from '@testing-library/react';
  import MeetingBookingDetails from './MeetingBookingDetails';

  test('renders meeting booking details header', () => {
    render(<MeetingBookingDetails />);
    expect(screen.getByText(/Meeting booking details/i)).toBeInTheDocument();
  });
*/
