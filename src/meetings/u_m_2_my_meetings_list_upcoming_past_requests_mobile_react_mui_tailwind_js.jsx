import React, { useState, useMemo, useEffect } from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { useTheme } from "../context/ThemeContext";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Paper,
  Chip,
  Button,
  Stack,
  Divider
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

const DEMO = {
  upcoming: [
    {
      id: "m1",
      title: "Charging Onboarding Call",
      module: "Charging",
      who: "Leslie Alexander",
      type: "1:1",
      mode: "video",
      when: "Tomorrow • 10:30 – 11:00",
      status: "Confirmed"
    },
    {
      id: "m2",
      title: "Seller Training — Group",
      module: "E-Commerce",
      who: "Core Team (5)",
      type: "group",
      mode: "video",
      when: "Fri • 15:00 – 16:00",
      status: "Confirmed"
    }
  ],
  past: [
    {
      id: "m3",
      title: "Rides Fleet Check-in",
      module: "Rides",
      who: "Alex Cooper",
      type: "1:1",
      mode: "audio",
      when: "Mon • 09:00 – 09:30",
      status: "Completed"
    }
  ],
  requests: [
    {
      id: "m4",
      title: "Investor Intro Call",
      module: "Investments",
      who: "Miguel + Co-hosts",
      type: "group",
      mode: "video",
      when: "Window: 2025-04-10 → 2025-04-14",
      status: "Awaiting guest to pick a time"
    }
  ]
};

function MeetingCard({ meeting, kind, onNavigate }) {
  const muiTheme = useMuiTheme();
  const { accent, isDark } = useTheme();
  const accentColor = accent === 'orange' ? EV.orange : accent === 'green' ? EV.green : EV.grey;
  const modeIcon = meeting.mode === "video" ? <VideocamRoundedIcon sx={{ fontSize: 18 }} /> : <PhoneRoundedIcon sx={{ fontSize: 18 }} />;

  return (
    <Paper
      variant="outlined"
      sx={{
        mb: 1.5,
        p: { xs: 1, sm: 1.5 },
        borderRadius: 2,
        borderColor: muiTheme.palette.divider,
        bgcolor: 'background.paper',
        boxShadow: 1
      }}
    >
      <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mb: 0.5 }}>
        <Box>
          <Chip
            size="small"
            label={meeting.module}
            sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : EV.light, fontSize: 10, height: 20, color: 'text.primary' }}
          />
        </Box>
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography
            variant="subtitle2"
            className="font-semibold"
            sx={{ mb: 0.2, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}
          >
            {meeting.title}
          </Typography>
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.3 }}>
            <Typography variant="caption" sx={{ opacity: 0.85 }}>
              With {meeting.who}
            </Typography>
            <Chip
              label={meeting.type === "group" ? "Group" : "1:1"}
              size="small"
                sx={{ 
                  height: 18, 
                  fontSize: 10,
                  bgcolor: meeting.type === "group" ? EV.orange : (isDark ? 'rgba(255,255,255,0.1)' : EV.light),
                  color: meeting.type === "group" ? '#fff' : 'text.primary',
                }}
            />
          </Stack>
          <Stack direction="row" spacing={0.75} alignItems="center">
            {modeIcon}
            <AccessTimeRoundedIcon sx={{ fontSize: 18, opacity: 0.7 }} />
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {meeting.when}
            </Typography>
          </Stack>
          <Typography variant="caption" sx={{ mt: 0.5, color: EV.grey }}>
            {meeting.status}
          </Typography>
        </Box>
      </Stack>
      <Divider sx={{ my: 1 }} />
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        {kind === "upcoming" && (
          <>
            <Button 
              size="small" 
              variant="outlined" 
              sx={{ textTransform: "none" }}
              onClick={() => onNavigate?.(`/meetings/${meeting.id}`)}
            >
              View
            </Button>
            <Button size="small" variant="outlined" sx={{ textTransform: "none" }}>
              Reschedule
            </Button>
            <Button 
              size="small" 
              variant="contained" 
              sx={{ textTransform: "none", bgcolor: accentColor, "&:hover": { bgcolor: accent === 'green' ? '#02b87a' : accent === 'orange' ? '#e06f00' : '#8a8a8a' } }}
              onClick={() => onNavigate?.(`/meetings/live/${meeting.id}`)}
            >
              Join
            </Button>
          </>
        )}
        {kind === "past" && (
          <>
            <Button size="small" variant="outlined" sx={{ textTransform: "none" }}>
              View
            </Button>
            <Button size="small" variant="contained" sx={{ textTransform: "none", bgcolor: EV.orange }}>
              Book again
            </Button>
          </>
        )}
        {kind === "requests" && (
          <>
            <Button size="small" variant="outlined" sx={{ textTransform: "none" }}>
              View
            </Button>
            <Button size="small" variant="outlined" color="error" sx={{ textTransform: "none" }}>
              Cancel
            </Button>
          </>
        )}
      </Stack>
    </Paper>
  );
}

export default function MyMeetingsList({ onBack, onNavigate }) {
  const muiTheme = useMuiTheme();
  const { accent, isDark } = useTheme();
  const accentColor = accent === 'orange' ? EV.orange : accent === 'green' ? EV.green : EV.grey;
  const [tab, setTab] = useState("upcoming");
  
  // Set document title
  useEffect(() => {
    document.title = "My Meetings - EVzone Chat";
    return () => {
      document.title = "EVzone Chat";
    };
  }, []);

  const data = useMemo(() => {
    if (tab === "past") return DEMO.past;
    if (tab === "requests") return DEMO.requests;
    return DEMO.upcoming;
  }, [tab]);

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
              <EventAvailableRoundedIcon sx={{ mr: 1 }} />
              <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                <Typography variant="subtitle1" className="font-semibold" noWrap>
                  My meetings
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Upcoming, past and booking requests
                </Typography>
              </Box>
              <IconButton
                onClick={() => onNavigate?.('/meetings/book')}
                aria-label="Create new meeting"
                sx={{ color: "#fff" }}
              >
                <EventAvailableRoundedIcon />
              </IconButton>
            </Toolbar>
          </AppBar>

          {/* Tabs */}
          <Box sx={{ pt: { xs: "56px", md: "64px" }, bgcolor: "#fff", width: '100%' }}>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab value="upcoming" label="Upcoming" />
              <Tab value="past" label="Past" />
              <Tab value="requests" label="Requests" />
            </Tabs>
          </Box>

          {/* List content */}
          <Box className="no-scrollbar" sx={{ 
            flex: 1, 
            px: { xs: 1.5, sm: 2, md: 3, lg: 4 }, 
            pt: 1, 
            pb: { xs: 2, md: 3 }, 
            overflowY: "auto",
            width: '100%'
          }}>
            {/* Page Title */}
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600, 
                mt: 1.5, 
                mb: 1, 
                color: 'text.primary',
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
              }}
            >
              My Meetings
            </Typography>
            
            {data.length === 0 ? (
              <Box className="h-full flex items-center justify-center">
                <Typography variant="body2" sx={{ color: EV.grey }}>
                  No meetings here yet.
                </Typography>
              </Box>
            ) : (
              data.map((m) => <MeetingCard key={m.id} meeting={m} kind={tab} onNavigate={onNavigate} />)
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}

/*
  ===== Tests (React Testing Library) — copy to MyMeetingsList.test.jsx =====

  import React from 'react';
  import { render, screen } from '@testing-library/react';
  import MyMeetingsList from './MyMeetingsList';

  test('renders header and tabs', () => {
    render(<MyMeetingsList />);
    expect(screen.getByText(/My meetings/i)).toBeInTheDocument();
    expect(screen.getByText(/Upcoming/i)).toBeInTheDocument();
    expect(screen.getByText(/Past/i)).toBeInTheDocument();
    expect(screen.getByText(/Requests/i)).toBeInTheDocument();
  });
*/
