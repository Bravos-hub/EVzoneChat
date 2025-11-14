import React, { useState } from "react";
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
  Stack,
  Divider,
  Snackbar
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import EditCalendarRoundedIcon from "@mui/icons-material/EditCalendarRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

// Demo confirmation data — in production, pass this via props/route loader
const DEMO_CONFIRM = {
  id: "bk-2025-0001",
  role: "guest", // 'host' | 'guest'
  title: "Charging Onboarding Call",
  module: "Charging",
  host: "Leslie Alexander",
  who: "You", // or guest name when viewed as host
  type: "1:1", // '1:1' | 'group'
  mode: "video", // 'video' | 'audio'
  location: "Online",
  datetimeLabel: "Thu, Apr 10 • 10:30 – 11:00 (EAT)",
  joinUrl: "https://evzone.meet/join/bk-2025-0001",
  canReschedule: true,
  canCancel: true,
};

export default function MeetingConfirmationJoin({ onBack, onNavigate }) {
  const { accent, isDark } = useTheme();
  const accentColor = accent === 'orange' ? EV.orange : accent === 'green' ? EV.green : EV.grey;
  const [snack, setSnack] = useState("");
  const b = DEMO_CONFIRM;

  const modeIcon =
    b.mode === "video" ? (
      <VideocamRoundedIcon sx={{ fontSize: 18 }} />
    ) : (
      <PhoneRoundedIcon sx={{ fontSize: 18 }} />
    );

  const handleCopyJoin = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(b.joinUrl);
        setSnack("Join link copied");
      } else {
        setSnack("Cannot access clipboard in this environment");
      }
    } catch {
      setSnack("Failed to copy link");
    }
  };

  const handleAddToCalendar = () => {
    // In production, redirect or download ICS.
    setSnack("Calendar entry will be generated (stub)");
  };

  const handleJoin = () => {
    // Navigate to live meeting screen
    if (onNavigate) {
      onNavigate(`/meetings/live/${b.id}`);
    } else {
    setSnack("Joining meeting (stub) — wire to live call screen");
    }
  };

  const handleReschedule = () => {
    setSnack("Reschedule flow goes here");
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      setSnack("Meeting cancelled (stub)");
    }
  };

  const roleLabel = b.role === "host" ? "You are the host" : "You are attending";

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none`}</style>

      <Box sx={{ width: '100%', height: '100%', bgcolor: 'background.default', maxWidth: '100vw', overflowX: 'hidden' }}>
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
              <EventAvailableRoundedIcon sx={{ mr: 1 }} />
              <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                <Typography variant="subtitle1" className="font-semibold" noWrap>
                  Meeting confirmed
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {roleLabel}
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
              pb: { xs: 12, md: 14 }, 
              px: { xs: 1.5, sm: 2, md: 3, lg: 4 },
              width: '100%'
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mt: 2,
                borderRadius: 2,
                border: "1px solid rgba(0,0,0,0.06)",
                bgcolor: "#fff",
              }}
            >
              {/* Title + module */}
              <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mb: 1 }}>
                <Chip
                  size="small"
                  label={b.module}
                  sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : EV.light, fontSize: 10, height: 20, color: 'text.primary' }}
                />
                <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                  <Typography
                    variant="subtitle1"
                    className="font-semibold"
                    sx={{ mb: 0.4, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}
                  >
                    {b.title}
                  </Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <PersonRoundedIcon sx={{ fontSize: 18, opacity: 0.8 }} />
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                      Host: {b.host}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>

              {/* Date/time & mode */}
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                <AccessTimeRoundedIcon sx={{ fontSize: 18, opacity: 0.8 }} />
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {b.datetimeLabel}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                {modeIcon}
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {b.mode === "video" ? "Video" : "Audio"} • {b.location}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <LocationOnRoundedIcon sx={{ fontSize: 18, opacity: 0.8 }} />
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Join via EVzone meeting room
                </Typography>
              </Stack>

              <Divider sx={{ my: 1.5 }} />

              {/* Actions */}
              <Stack spacing={1.5}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: accentColor,
                    color: "#fff",
                    textTransform: "none",
                    borderRadius: 999,
                    "&:hover": { bgcolor: accent === 'green' ? '#02b87a' : accent === 'orange' ? '#e06f00' : '#8a8a8a' },
                  }}
                  onClick={handleJoin}
                >
                  Join meeting
                </Button>

                <Stack direction="row" spacing={1}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<CalendarMonthRoundedIcon />}
                    sx={{ textTransform: "none" }}
                    onClick={handleAddToCalendar}
                  >
                    Add to calendar
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ContentCopyRoundedIcon />}
                    sx={{ textTransform: "none" }}
                    onClick={handleCopyJoin}
                  >
                    Copy join link
                  </Button>
                </Stack>

                <Stack direction="row" spacing={1} sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                  {b.canReschedule && (
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<EditCalendarRoundedIcon />}
                      sx={{ textTransform: "none", flex: { xs: '1 1 auto', sm: 1 } }}
                      onClick={handleReschedule}
                    >
                      Reschedule
                    </Button>
                  )}
                  {b.canCancel && (
                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      startIcon={<CancelRoundedIcon />}
                      sx={{ textTransform: "none", flex: { xs: '1 1 auto', sm: 1 } }}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  )}
                </Stack>
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
  ===== Tests (React Testing Library) — copy to MeetingConfirmationJoin.test.jsx =====

  import React from 'react';
  import { render, screen } from '@testing-library/react';
  import MeetingConfirmationJoin from './MeetingConfirmationJoin';

  test('renders meeting confirmed header', () => {
    render(<MeetingConfirmationJoin />);
    expect(screen.getByText(/Meeting confirmed/i)).toBeInTheDocument();
  });
*/
