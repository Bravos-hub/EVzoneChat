import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Chip,
  Paper,
  Stack,
  Button
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
// import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded"; // Unused

/**
 * U‑M7: Live Meeting Shell — Mobile
 *
 * This is a thin wrapper that:
 *  - Shows meeting summary at the top (module, title, host, time, mode).
 *  - Hosts the actual live call UI for 1:1 (U04‑10) or Group (U04‑11).
 *
 * In production, you would import your real call components:
 *   import OneToOneCall from '...U04-10...';
 *   import GroupCallParticipants from '...U04-11...';
 * and render them in the "call area" below.
 */

const DEMO_MEETING = {
  id: "bk-2025-0001",
  type: "1:1", // '1:1' | 'group'
  module: "Charging",
  title: "Charging Onboarding Call",
  host: "You",
  with: "Leslie Alexander",
  datetimeLabel: "Thu, Apr 10 • 10:30 – 11:00 (EAT)",
  mode: "video", // 'video' | 'audio'
  location: "Online",
};

export default function LiveMeetingShell({ onBack, onNavigate, location, registry }) {
  const muiTheme = useMuiTheme();
  const routeLocation = useLocation();
  
  // Set document title
  useEffect(() => {
    document.title = "Live Meeting - EVzone Chat";
    return () => {
      document.title = "EVzone Chat";
    };
  }, []);
  
  // Get meeting ID from URL (for future use when fetching real meeting data)
  // const meetingId = useMemo(() => {
  //   if (routeLocation?.pathname) {
  //     const match = routeLocation.pathname.match(/\/meetings\/live\/([^/]+)/);
  //     return match ? match[1] : null;
  //   }
  //   return null;
  // }, [routeLocation]);

  // In production, fetch meeting data by ID
  // For now, use demo data
  const m = DEMO_MEETING;
  
  // Get call components from registry
  const OneToOneCall = registry?.['U04-10'];
  const GroupCallParticipants = registry?.['U04-11'];

  const modeIcon =
    m.mode === "video" ? (
      <VideocamRoundedIcon sx={{ fontSize: 18 }} />
    ) : (
      <PhoneRoundedIcon sx={{ fontSize: 18 }} />
    );

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none`}</style>

      <Box sx={{ width: '100%', height: '100%', bgcolor: '#000', overflowX: 'hidden', margin: 0, padding: 0 }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header - matching Dealz Status style (dark theme for live meeting) */}
          <AppBar
            elevation={0}
            position="static"
            sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom: `1px solid ${muiTheme.palette.divider}` }}
          >
            <Toolbar className="!min-h-[56px]" sx={{ px: { xs: 1.5, sm: 3 } }}>
              <IconButton
                onClick={onBack}
                aria-label="Back"
                sx={{ color: 'text.primary', padding: { xs: '6px', sm: '8px' } }}
              >
                <ArrowBackRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </IconButton>
              <Typography variant="h6" className="font-bold" sx={{ color: 'text.primary', fontSize: { xs: '16px', sm: '18px' }, ml: { xs: 0.5, sm: 1 }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Live meeting
                </Typography>
            </Toolbar>
          </AppBar>

          {/* Page Title */}
          <Box sx={{ 
            px: { xs: 1.5, sm: 2, md: 3, lg: 4 }, 
            pb: 1,
            width: '100%'
          }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600, 
                mb: 1, 
                color: '#fff',
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
              }}
            >
              Live Meeting
            </Typography>
          </Box>
          
          {/* Meeting summary pill just under header */}
          <Box sx={{ 
            px: { xs: 1.5, sm: 2, md: 3, lg: 4 }, 
            pb: 1,
            width: '100%'
          }}>
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.12)",
                bgcolor: "rgba(0,0,0,0.7)",
                color: "#fff",
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  size="small"
                  label={m.module}
                  sx={{ bgcolor: "rgba(0,0,0,0.5)", color: "#fff", fontSize: 10, height: 20 }}
                />
                <Stack spacing={0} sx={{ minWidth: 0, flexGrow: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{ whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}
                  >
                    Host: {m.host} • With {m.with}
                  </Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <AccessTimeRoundedIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption">{m.datetimeLabel}</Typography>
                  </Stack>
                </Stack>
                <Stack spacing={0.25} alignItems="flex-end">
                  {m.type === "group" ? (
                    <GroupRoundedIcon sx={{ fontSize: 18 }} />
                  ) : (
                    <PersonRoundedIcon sx={{ fontSize: 18 }} />
                  )}
                  <Stack direction="row" spacing={0.25} alignItems="center">
                    {modeIcon}
                    <Typography variant="caption">{m.location}</Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Paper>
          </Box>

          {/* Live call area — plug in U04‑10 / U04‑11 here */}
          <Box className="flex-1" sx={{ px: 0, pb: 0, pt: 1 }}>
            <Box className="w-full h-full flex flex-col">
              {m.type === '1:1' && OneToOneCall ? (
                <OneToOneCall 
                  type={m.mode} 
                  state="connected" 
                  remote={{ name: m.with }}
                  onBack={onBack}
                  onNavigate={onNavigate}
                  location={routeLocation}
                />
              ) : m.type === 'group' && GroupCallParticipants ? (
                <GroupCallParticipants 
                  onBack={onBack}
                  onNavigate={onNavigate}
                  location={routeLocation}
                />
              ) : (
              <Box className="w-full h-full flex items-center justify-center text-center text-white/70 px-4">
                <div>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Live call UI placeholder
                  </Typography>
                  <Typography variant="caption">
                      {m.type === '1:1' 
                        ? 'U04‑10 (1:1 Call) component not found in registry'
                        : 'U04‑11 (Group Call Participants) component not found in registry'}
                  </Typography>
                </div>
              </Box>
              )}
            </Box>
          </Box>

          {/* Optional bottom controls (for future use) */}
          <Box sx={{ 
            position: "sticky", 
            bottom: 0, 
            width: '100%',
            pb: { xs: `calc(2rem + env(safe-area-inset-bottom))`, sm: 2, md: 2.5 }, 
            display: "flex", 
            justifyContent: "center",
            zIndex: 100
          }}>
            <Box sx={{ 
              width: "100%", 
              px: { xs: 1.5, sm: 2, md: 3, lg: 4 }, 
              pb: { xs: 2, md: 2.5 } 
            }}>
              <Stack direction="row" spacing={1} justifyContent="space-between">
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ textTransform: "none", borderColor: "rgba(255,255,255,0.4)", color: "#fff" }}
                >
                  View details
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ textTransform: "none", borderColor: "rgba(255,255,255,0.4)", color: "#fff" }}
                >
                  Leave
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

/*
  ===== Tests (React Testing Library) — copy to LiveMeetingShell.test.jsx =====

  import React from 'react';
  import { render, screen } from '@testing-library/react';
  import LiveMeetingShell from './LiveMeetingShell';

  test('renders live meeting header', () => {
    render(<LiveMeetingShell />);
    expect(screen.getByText(/Live meeting/i)).toBeInTheDocument();
  });
*/
