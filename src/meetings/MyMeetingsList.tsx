import { useState, useMemo, useEffect } from "react";
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
  
  const handleCardClick = () => {
    // Allow clicking the card itself to view details
    onNavigate?.(`/meetings/${meeting.id}`);
  };
  const modeIcon = meeting.mode === "video" ? (
    <VideocamRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
  ) : (
    <PhoneRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
  );

  return (
    <Paper
      variant="outlined"
      onClick={handleCardClick}
      sx={{
        mb: { xs: 1, sm: 1.5 },
        p: { xs: 1.25, sm: 1.5 },
        borderRadius: 2,
        borderColor: muiTheme.palette.divider,
        bgcolor: 'background.paper',
        boxShadow: 1,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: 2,
          borderColor: accentColor,
          transform: 'translateY(-2px)'
        }
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
            sx={{ mb: 0.2, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", color: 'text.primary' }}
          >
            {meeting.title}
          </Typography>
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.3 }}>
            <Typography variant="caption" sx={{ opacity: 0.85, color: 'text.secondary' }}>
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
            <AccessTimeRoundedIcon sx={{ fontSize: 18, opacity: 0.7, color: 'text.secondary' }} />
            <Typography variant="caption" sx={{ opacity: 0.8, color: 'text.secondary' }}>
              {meeting.when}
            </Typography>
          </Stack>
          <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary' }}>
            {meeting.status}
          </Typography>
        </Box>
      </Stack>
      <Divider sx={{ my: 1 }} />
      <Stack 
        direction="row" 
        spacing={1} 
        justifyContent="flex-end"
        onClick={(e) => e.stopPropagation()} // Prevent card click when clicking buttons
      >
        {kind === "upcoming" && (
          <>
            <Button 
              size="small" 
              variant="outlined" 
              sx={{ 
                textTransform: "none", 
                fontSize: { xs: '12px', sm: '13px' }, 
                py: { xs: 0.5, sm: 0.75 },
                px: { xs: 1, sm: 1.5 },
                borderColor: 'text.secondary',
                color: 'text.primary',
                '&:hover': {
                  borderColor: accentColor,
                  bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                }
              }}
              onClick={() => onNavigate?.(`/meetings/${meeting.id}`)}
              title={`View details for "${meeting.title}"`}
            >
              View
            </Button>
            <Button 
              size="small" 
              variant="outlined" 
              sx={{ 
                textTransform: "none", 
                fontSize: { xs: '12px', sm: '13px' }, 
                py: { xs: 0.5, sm: 0.75 },
                px: { xs: 1, sm: 1.5 },
                borderColor: 'text.secondary',
                color: 'text.primary',
                '&:hover': {
                  borderColor: accentColor,
                  bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                }
              }}
              onClick={() => onNavigate?.(`/meetings/book?reschedule=${meeting.id}`)}
              title={`Update or reschedule "${meeting.title}"`}
            >
              Reschedule
            </Button>
            <Button 
              size="small" 
              variant="contained" 
              sx={{ 
                textTransform: "none", 
                bgcolor: accentColor, 
                color: '#fff',
                fontSize: { xs: '12px', sm: '13px' }, 
                py: { xs: 0.5, sm: 0.75 },
                px: { xs: 1.5, sm: 2 },
                fontWeight: 600,
                "&:hover": { 
                  bgcolor: accent === 'green' ? '#02b87a' : accent === 'orange' ? '#e06f00' : '#8a8a8a',
                  boxShadow: 2
                } 
              }}
              onClick={() => onNavigate?.(`/meetings/live/${meeting.id}`)}
              title={`Join "${meeting.title}" meeting`}
            >
              Join
            </Button>
          </>
        )}
        {kind === "past" && (
          <>
            <Button 
              size="small" 
              variant="outlined" 
              sx={{ 
                textTransform: "none", 
                fontSize: { xs: '12px', sm: '13px' }, 
                py: { xs: 0.5, sm: 0.75 },
                px: { xs: 1, sm: 1.5 },
                borderColor: 'text.secondary',
                color: 'text.primary',
                '&:hover': {
                  borderColor: accentColor,
                  bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                }
              }}
              onClick={() => onNavigate?.(`/meetings/${meeting.id}`)}
              title={`View details for "${meeting.title}"`}
            >
              View
            </Button>
            <Button 
              size="small" 
              variant="contained" 
              sx={{ 
                textTransform: "none", 
                bgcolor: accentColor,
                color: '#fff',
                fontSize: { xs: '12px', sm: '13px' }, 
                py: { xs: 0.5, sm: 0.75 },
                px: { xs: 1.5, sm: 2 },
                fontWeight: 600,
                "&:hover": { 
                  bgcolor: accent === 'green' ? '#02b87a' : accent === 'orange' ? '#e06f00' : '#8a8a8a',
                  boxShadow: 2
                } 
              }}
              onClick={() => onNavigate?.('/meetings/book')}
              title="Create a new meeting with the same details"
            >
              Book again
            </Button>
          </>
        )}
        {kind === "requests" && (
          <>
            <Button 
              size="small" 
              variant="outlined" 
              sx={{ 
                textTransform: "none", 
                fontSize: { xs: '12px', sm: '13px' }, 
                py: { xs: 0.5, sm: 0.75 },
                px: { xs: 1, sm: 1.5 },
                borderColor: 'text.secondary',
                color: 'text.primary',
                '&:hover': {
                  borderColor: accentColor,
                  bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                }
              }}
              onClick={() => onNavigate?.(`/meetings/${meeting.id}`)}
              title={`View details for "${meeting.title}"`}
            >
              View
            </Button>
            <Button 
              size="small" 
              variant="outlined" 
              color="error" 
              sx={{ 
                textTransform: "none",
                fontSize: { xs: '12px', sm: '13px' }, 
                py: { xs: 0.5, sm: 0.75 },
                px: { xs: 1, sm: 1.5 },
                '&:hover': {
                  bgcolor: isDark ? 'rgba(211, 47, 47, 0.1)' : 'rgba(211, 47, 47, 0.08)',
                  borderColor: 'error.main',
                }
              }}
              onClick={() => {
                if (window.confirm(`Are you sure you want to cancel "${meeting.title}"?`)) {
                  // In production, this would call an API to cancel the meeting
                  alert(`Meeting "${meeting.title}" has been cancelled (demo).`);
                  // Optionally navigate back or refresh the list
                  // onNavigate?.('/meetings');
                }
              }}
              title={`Cancel "${meeting.title}" meeting request`}
            >
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
  const { accent } = useTheme();
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
                  My meetings
                </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Button
                onClick={() => onNavigate?.('/meetings/book')}
                variant="contained"
                startIcon={<EventAvailableRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                sx={{ 
                  bgcolor: accentColor,
                  color: '#fff',
                  textTransform: 'none',
                  fontSize: { xs: '12px', sm: '13px' },
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 0.5, sm: 0.75 },
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: accent === 'green' ? '#02b87a' : accent === 'orange' ? '#e06f00' : '#8a8a8a',
                    boxShadow: 2
                  },
                  transition: 'all 0.2s ease',
                }}
                title="Create a new meeting booking"
              >
                Book Meeting
              </Button>
            </Toolbar>
          </AppBar>

          {/* Tabs */}
          <Box sx={{ bgcolor: 'background.paper', width: '100%', borderBottom: `1px solid ${muiTheme.palette.divider}` }}>
            <Tabs
              value={tab}
              onChange={(_, v) => {
                if (v === "new") {
                  onNavigate?.('/meetings/book');
                } else {
                  setTab(v);
                }
              }}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
              sx={{
                '& .MuiTab-root': {
                  fontSize: { xs: '13px', sm: '14px' },
                  minHeight: { xs: 44, sm: 48 },
                  textTransform: 'none',
                  fontWeight: 500,
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: accentColor,
                    fontWeight: 600
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: accentColor,
                  height: 3
                }
              }}
            >
              <Tab value="new" label="New" title="Book a new meeting" />
              <Tab value="upcoming" label="Upcoming" title="View upcoming meetings" />
              <Tab value="past" label="Past" title="View past meetings" />
              <Tab value="requests" label="Requests" title="View meeting requests" />
            </Tabs>
          </Box>

          {/* List content */}
          <Box className="no-scrollbar" sx={{ 
            flex: 1, 
            px: { xs: 1.5, sm: 2, md: 3 }, 
            pt: { xs: 1, sm: 1.5 }, 
            pb: { xs: 2, sm: 3 }, 
            overflowY: "auto",
            width: '100%'
          }}>
            
            {data.length === 0 ? (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                minHeight: { xs: '200px', sm: '300px' },
                py: { xs: 4, sm: 6 }
              }}>
                <EventAvailableRoundedIcon sx={{ fontSize: { xs: 48, sm: 64 }, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', mb: 1 }}>
                  {tab === "new" ? "Click 'New' tab to book a meeting" : 
                   tab === "upcoming" ? "No upcoming meetings" :
                   tab === "past" ? "No past meetings" :
                   "No meeting requests"}
                </Typography>
                {tab !== "new" && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onNavigate?.('/meetings/book')}
                    sx={{
                      mt: 2,
                      textTransform: 'none',
                      borderColor: accentColor,
                      color: accentColor,
                      fontSize: { xs: '12px', sm: '13px' },
                      px: { xs: 2, sm: 2.5 },
                      py: { xs: 0.75, sm: 1 },
                      '&:hover': {
                        borderColor: accentColor,
                        bgcolor: accent === 'green' ? 'rgba(3, 205, 140, 0.1)' : accent === 'orange' ? 'rgba(247, 127, 0, 0.1)' : 'rgba(166, 166, 166, 0.1)'
                      }
                    }}
                    title="Create a new meeting booking"
                  >
                    Book a Meeting
                  </Button>
                )}
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
