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
  TextField,
  Button,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

// In production, co‑host suggestions should come from your
// actual team/tenant directory. For now, these are demo names.
const COHOST_SUGGESTIONS = [
  "Leslie Alexander",
  "Alex Cooper",
  "Kayle",
  "Richards",
  "KB",
];

// Demo meetings data - in production this would come from API/context
const DEMO_MEETINGS = {
  m1: {
    id: "m1",
    title: "Charging Onboarding Call",
    module: "Charging",
    type: "1:1",
    selectedPerson: "Leslie Alexander",
    selectedGroup: "",
    mode: "video",
    startDate: "2025-04-11",
    endDate: "2025-04-11",
    windowStart: "10:30",
    windowEnd: "11:00",
    duration: "30",
    coHosts: [],
    notes: "We will walk through the new Charging dashboard and mobile flows."
  },
  m2: {
    id: "m2",
    title: "Seller Training — Group",
    module: "E-Commerce",
    type: "group",
    selectedPerson: "",
    selectedGroup: "Core Team",
    mode: "video",
    startDate: "2025-04-12",
    endDate: "2025-04-12",
    windowStart: "15:00",
    windowEnd: "16:00",
    duration: "60",
    coHosts: ["Alex Cooper", "Kayle"],
    notes: "Training session for new sellers on the platform."
  }
};

/**
 * MeetingBooking — Online 1:1 & Group meeting bookings (Calendly‑style)
 *
 * - All meetings are online (Video or Audio).
 * - 390px mobile frame (like other EVzone shells).
 * - Step 1: Choose EVzone module (E‑commerce, Rides, Charging, ...).
 * - Step 2: 1:1 vs Group.
 *   • 1:1: pick a single person (no co‑hosts).
 *   • Group: pick a group + optional co‑hosts (with quick suggestions + manual add).
 *   • Group helper note explains groups are managed in EVzone.
 * - Step 4: Availability window (Calendly‑style: start/end date + time + slot length).
 * - Step 5: Meeting mode (Video/Audio).
 * - Step 6: Notes/agenda.
 * - Bottom CTA & note are pinned and constrained to the mobile frame.
 */
export default function MeetingBooking({ onBack, onNavigate, location: routeLocation }) {
  const muiTheme = useMuiTheme();
  const { accent, isDark } = useTheme();
  const accentColor = accent === 'orange' ? EV.orange : accent === 'green' ? EV.green : EV.grey;

  // Check if this is a reschedule action and get meeting ID
  const rescheduleMeetingId = useMemo(() => {
    if (routeLocation?.search) {
      const params = new URLSearchParams(routeLocation.search);
      return params.get('reschedule');
    }
    return null;
  }, [routeLocation]);
  
  const isReschedule = rescheduleMeetingId !== null;
  
  // Get existing meeting data if rescheduling
  const existingMeeting = useMemo(() => {
    if (isReschedule && rescheduleMeetingId && DEMO_MEETINGS[rescheduleMeetingId]) {
      return DEMO_MEETINGS[rescheduleMeetingId];
    }
    return null;
  }, [isReschedule, rescheduleMeetingId]);
  
  // Set document title
  useEffect(() => {
    document.title = isReschedule ? "Reschedule Meeting - EVzone Chat" : "Meeting Booking - EVzone Chat";
    return () => {
      document.title = "EVzone Chat";
    };
  }, [isReschedule]);
  
  // Initialize form state
  const [meetingType, setMeetingType] = useState("1:1"); // '1:1' | 'group'
  const [module, setModule] = useState("E-Commerce");
  const [title, setTitle] = useState("");

  // availability window (Calendly‑style) — guests pick any slot inside
  const [startDate, setStartDate] = useState(""); // date range start
  const [endDate, setEndDate] = useState("");     // date range end
  const [windowStart, setWindowStart] = useState("09:00");
  const [windowEnd, setWindowEnd] = useState("17:00");
  const [duration, setDuration] = useState("30");

  // host & co‑hosts
  const [selectedPerson, setSelectedPerson] = useState("Leslie Alexander");
  const [selectedGroup, setSelectedGroup] = useState("Core Team");
  const [coHosts, setCoHosts] = useState([]); // applies only to group
  const [newCoHost, setNewCoHost] = useState("");

  // meeting mode: video or audio
  const [mode, setMode] = useState("video"); // 'video' | 'audio'

  // extra
  const [notes, setNotes] = useState("");

  // Get today's date in YYYY-MM-DD format for min date validation
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date.toISOString().split('T')[0];
  }, []);

  // Load existing meeting data when rescheduling
  useEffect(() => {
    if (existingMeeting) {
      setMeetingType(existingMeeting.type);
      setModule(existingMeeting.module);
      setTitle(existingMeeting.title);
      // Validate existing dates - if in past, set to today
      const existingStart = existingMeeting.startDate || "";
      const existingEnd = existingMeeting.endDate || "";
      setStartDate(existingStart && existingStart >= today ? existingStart : today);
      setEndDate(existingEnd && existingEnd >= today ? existingEnd : (existingStart && existingStart >= today ? existingStart : today));
      setWindowStart(existingMeeting.windowStart || "09:00");
      setWindowEnd(existingMeeting.windowEnd || "17:00");
      setDuration(existingMeeting.duration || "30");
      setSelectedPerson(existingMeeting.selectedPerson || "Leslie Alexander");
      setSelectedGroup(existingMeeting.selectedGroup || "Core Team");
      setCoHosts(existingMeeting.coHosts || []);
      setMode(existingMeeting.mode || "video");
      setNotes(existingMeeting.notes || "");
    } else if (!isReschedule) {
      // Reset form when not rescheduling (clean state for new booking)
      setMeetingType("1:1");
      setModule("E-Commerce");
      setTitle("");
      setStartDate("");
      setEndDate("");
      setWindowStart("09:00");
      setWindowEnd("17:00");
      setDuration("30");
      setSelectedPerson("Leslie Alexander");
      setSelectedGroup("Core Team");
      setCoHosts([]);
      setMode("video");
      setNotes("");
    }
  }, [existingMeeting, isReschedule, today]);

  const location = "Online"; // all online
  const modeLabel = mode === "video" ? "Online video meeting" : "Online audio meeting";

  const coHostOptions = useMemo(
    () => Array.from(new Set([...COHOST_SUGGESTIONS, ...coHosts])),
    [coHosts]
  );

  const summary = useMemo(() => {
    const who = meetingType === "1:1" ? selectedPerson : selectedGroup;
    const dateRange = startDate && endDate ? `${startDate} → ${endDate}` : "Not set";
    const timeWindow = `${windowStart} – ${windowEnd}`;
    const coHostLabel =
      meetingType === "group" && coHosts.length ? coHosts.join(", ") : "None";
    const notesLabel = notes.trim() ? notes.trim() : "None";

    return {
      module,
      who,
      coHosts: coHostLabel,
      dateRange,
      timeWindow,
      duration: `${duration} min`, // <-- fixed comma here
      mode: modeLabel,
      location,
      notes: notesLabel,
    };
  }, [
    meetingType,
    module,
    selectedPerson,
    selectedGroup,
    coHosts,
    startDate,
    endDate,
    windowStart,
    windowEnd,
    duration,
    modeLabel,
    notes,
  ]);

  const handleSchedule = () => {
    // Validate dates - must be in the future
    if (startDate && startDate < today) {
      alert("Start date cannot be in the past. Please select a future date.");
      return;
    }
    if (endDate && endDate < today) {
      alert("End date cannot be in the past. Please select a future date.");
      return;
    }
    if (startDate && endDate && endDate < startDate) {
      alert("End date must be on or after the start date.");
      return;
    }
    if (!startDate || !endDate) {
      alert("Please select both start and end dates for the availability window.");
      return;
    }
    if (!title.trim()) {
      alert("Please enter a meeting title.");
      return;
    }

    if (isReschedule && rescheduleMeetingId) {
      console.log("Meeting updated/rescheduled", {
        meetingId: rescheduleMeetingId,
        title,
        meetingType,
        summary,
      });
      if (onNavigate) {
        onNavigate('/meetings');
      } else {
        alert(`Meeting "${title}" has been updated successfully (demo).`);
      }
    } else {
    console.log("Meeting booking created", {
      title,
      meetingType,
      summary,
    });
    // Navigate to My Meetings after creating booking
    if (onNavigate) {
      onNavigate('/meetings');
    } else {
    alert("Meeting booking created (demo). Guests will pick a time inside your availability.");
      }
    }
  };

  const toggleCoHost = (name) => {
    setCoHosts((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none`}</style>

      {/* Main container - full width, responsive to all screen sizes */}
      <Box sx={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        bgcolor: 'background.default',
        position: 'relative',
        overflowX: 'hidden',
        margin: 0,
        padding: 0
      }}>
        {/* Header - matching Dealz Status style */}
        <AppBar 
          elevation={0} 
          position="static" 
          sx={{ 
            bgcolor: 'background.paper', 
            color: 'text.primary', 
            borderBottom: `1px solid ${muiTheme.palette.divider}`
          }}
        >
          <Toolbar className="!min-h-[56px]" sx={{ px: { xs: 1.5, sm: 3 } }}>
            <IconButton onClick={onBack} aria-label="Back" sx={{ color: 'text.primary', padding: { xs: '6px', sm: '8px' } }}>
                <ArrowBackRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </IconButton>
            <Typography variant="h6" className="font-bold" sx={{ color: 'text.primary', fontSize: { xs: '16px', sm: '18px' }, ml: { xs: 0.5, sm: 1 }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {isReschedule ? "Update Meeting" : "Meeting booking"}
                </Typography>
            <Box sx={{ flexGrow: 1 }} />
              <IconButton 
                onClick={() => onNavigate?.('/meetings')} 
                aria-label="My meetings" 
                title="My meetings"
              sx={{ color: 'text.primary', padding: { xs: '6px', sm: '8px' } }}
              >
                <EventAvailableRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </IconButton>
            </Toolbar>
          </AppBar>

        {/* Scrollable content - fully flexible and responsive */}
        <Box 
          className="no-scrollbar" 
          sx={{ 
            flex: 1, 
            pb: { xs: 1, sm: 1.5 }, 
            px: { xs: 1.5, sm: 2, md: 3 }, 
            overflowY: "auto",
            width: '100%',
            minHeight: 0,
            WebkitOverflowScrolling: 'touch',
          }}
        >
            {/* Page Title */}
            <Box sx={{ mb: { xs: 1, sm: 1.5 } }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600, 
                mt: { xs: 0, sm: 0.25 }, 
                  mb: { xs: 0.5, sm: 0.75 }, 
                color: 'text.primary',
                fontSize: { xs: '18px', sm: '20px', md: '22px' }
              }}
            >
                {isReschedule ? "Update Meeting" : "Meeting Booking"}
            </Typography>
              {isReschedule && existingMeeting && (
                <Chip
                  label={`Updating: ${existingMeeting.title}`}
                  size="small"
                  sx={{
                    bgcolor: accentColor,
                    color: '#fff',
                    fontSize: { xs: '10px', sm: '11px' },
                    height: { xs: 20, sm: 22 },
                    fontWeight: 500
                  }}
                />
              )}
            </Box>
            
            {/* 1. Module */}
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: { xs: 1.5, sm: 2 }, mb: { xs: 1, sm: 1.5 }, display: 'block', fontSize: { xs: '13px', sm: '14px' } }}>
              1. Choose the module for this meeting
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0.75, sm: 1 }, mb: { xs: 2, sm: 3 } }}>
              {["E-Commerce","Rides","Charging","School","Medical","Travel","Investments","Faith","Workspace","Wallet"].map((m) => (
                <Chip
                  key={m}
                  label={m}
                  clickable
                  onClick={() => setModule(m)}
                  sx={{
                    bgcolor: module === m ? accentColor : (isDark ? 'rgba(255,255,255,0.1)' : EV.light),
                    color: module === m ? '#fff' : 'text.primary',
                    border: module === m ? 'none' : `1px solid ${muiTheme.palette.divider}`,
                    fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                    height: { xs: 36, sm: 40 },
                    minHeight: { xs: 36, sm: 40 },
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 0.75, sm: 1 },
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:active': {
                      transform: 'scale(0.95)',
                    },
                    '&:hover': {
                      bgcolor: module === m ? accentColor : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)'),
                    }
                  }}
                />
              ))}
            </Box>

            {/* 2. Meeting type */}
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: { xs: 1.5, sm: 2 }, mb: { xs: 1, sm: 1.5 }, display: 'block', fontSize: { xs: '13px', sm: '14px' } }}>
              2. Meeting type
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 }, mb: { xs: 2, sm: 2.5 }, flexWrap: 'wrap' }}>
              <Chip
                icon={<PersonRoundedIcon sx={{ color: meetingType === "1:1" ? "#fff" : 'inherit', fontSize: { xs: 18, sm: 20 } }} />}
                label="1:1 meeting"
                clickable
                onClick={() => setMeetingType("1:1")}
                sx={{
                  bgcolor: meetingType === "1:1" ? accentColor : (isDark ? 'rgba(255,255,255,0.1)' : EV.light),
                  color: meetingType === "1:1" ? '#fff' : 'text.primary',
                  border: meetingType === "1:1" ? 'none' : `1px solid ${muiTheme.palette.divider}`,
                  fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                  height: { xs: 40, sm: 44 },
                  minHeight: { xs: 40, sm: 44 },
                  px: { xs: 2, sm: 2.5 },
                  py: { xs: 1, sm: 1.25 },
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:active': {
                    transform: 'scale(0.95)',
                  },
                  '&:hover': {
                    bgcolor: meetingType === "1:1" ? accentColor : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)'),
                  }
                }}
              />
              <Chip
                icon={<GroupRoundedIcon sx={{ color: meetingType === "group" ? "#fff" : 'inherit', fontSize: { xs: 18, sm: 20 } }} />}
                label="Group meeting"
                clickable
                onClick={() => setMeetingType("group")}
                sx={{
                  bgcolor: meetingType === "group" ? accentColor : (isDark ? 'rgba(255,255,255,0.1)' : EV.light),
                  color: meetingType === "group" ? '#fff' : 'text.primary',
                  border: meetingType === "group" ? 'none' : `1px solid ${muiTheme.palette.divider}`,
                  fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                  height: { xs: 40, sm: 44 },
                  minHeight: { xs: 40, sm: 44 },
                  px: { xs: 2, sm: 2.5 },
                  py: { xs: 1, sm: 1.25 },
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:active': {
                    transform: 'scale(0.95)',
                  },
                  '&:hover': {
                    bgcolor: meetingType === "group" ? accentColor : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)'),
                  }
                }}
              />
            </Box>

            {/* Title */}
            <TextField
              fullWidth
              label="Meeting title"
              placeholder={meetingType === "1:1" ? "Catch‑up with Leslie" : "Weekly team sync"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ 
                mb: { xs: 2, sm: 2.5 },
                '& .MuiInputLabel-root': {
                  color: 'text.secondary',
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                },
                '& .MuiInputBase-input': {
                  color: 'text.primary',
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'divider'
                  },
                  '&:hover fieldset': {
                    borderColor: accentColor
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: accentColor
                  }
                }
              }}
              size="small"
            />

            {/* 3. Who is this with? */}
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: { xs: 1.5, sm: 2 }, mb: { xs: 1, sm: 1.5 }, display: 'block', fontSize: { xs: '13px', sm: '14px' } }}>
              3. Who is this with?
            </Typography>
            {meetingType === "1:1" ? (
              <FormControl fullWidth size="small" sx={{ mb: { xs: 2, sm: 2.5 } }}>
                <InputLabel>Person</InputLabel>
                <Select
                  label="Person"
                  value={selectedPerson}
                  onChange={(e) => setSelectedPerson(e.target.value)}
                >
                  <MenuItem value="Leslie Alexander">Leslie Alexander</MenuItem>
                  <MenuItem value="Alex Cooper">Alex Cooper</MenuItem>
                  <MenuItem value="Kayle">Kayle</MenuItem>
                </Select>
                <FormHelperText>Choose the primary person for this 1:1 meeting</FormHelperText>
              </FormControl>
            ) : (
              <>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Group</InputLabel>
                  <Select
                    label="Group"
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                  >
                    <MenuItem value="Core Team">Core Team</MenuItem>
                    <MenuItem value="Design Team">Design Team</MenuItem>
                    <MenuItem value="Project Alpha">Project Alpha</MenuItem>
                  </Select>
                  <FormHelperText>
                    Groups are managed in EVzone. Create or manage teams there to see them here.
                  </FormHelperText>
                </FormControl>

                <Typography variant="caption" sx={{ color: 'text.secondary', mb: { xs: 1, sm: 1.5 }, display: 'block', fontSize: { xs: '13px', sm: '14px' } }}>
                  Co‑hosts (optional)
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0.75, sm: 1 }, mb: { xs: 1.5, sm: 2 } }}>
                  {coHostOptions.map((name) => (
                    <Chip
                      key={name}
                      label={name}
                      clickable
                      onClick={() => toggleCoHost(name)}
                      sx={{
                        bgcolor: coHosts.includes(name) ? EV.orange : (isDark ? 'rgba(255,255,255,0.1)' : EV.light),
                        color: coHosts.includes(name) ? '#fff' : 'text.primary',
                        border: coHosts.includes(name) ? 'none' : `1px solid ${muiTheme.palette.divider}`,
                        fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                        height: { xs: 36, sm: 40 },
                        minHeight: { xs: 36, sm: 40 },
                        px: { xs: 1.5, sm: 2 },
                        py: { xs: 0.75, sm: 1 },
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:active': {
                          transform: 'scale(0.95)',
                        },
                        '&:hover': {
                          bgcolor: coHosts.includes(name) ? EV.orange : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)'),
                        }
                      }}
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, mb: { xs: 2, sm: 2.5 }, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <TextField
                    size="small"
                    label="Add co‑host"
                    placeholder="Type name"
                    value={newCoHost}
                    onChange={(e) => setNewCoHost(e.target.value)}
                    fullWidth
                    sx={{ flex: 1 }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ 
                      minWidth: { xs: '100%', sm: 48 }, 
                      height: { xs: 36, sm: 40 },
                      borderColor: accentColor, 
                      color: accentColor, 
                      fontSize: { xs: '1.25rem', sm: '1.5rem' },
                      fontWeight: 600,
                      "&:hover": { 
                        borderColor: accentColor, 
                        bgcolor: accent === 'green' ? 'rgba(3, 205, 140, 0.1)' : accent === 'orange' ? 'rgba(247, 127, 0, 0.1)' : 'rgba(166, 166, 166, 0.1)' 
                      }
                    }}
                    onClick={() => {
                      const name = newCoHost.trim();
                      if (!name) return;
                      setCoHosts((prev) => (prev.includes(name) ? prev : [...prev, name]));
                      setNewCoHost("");
                    }}
                    title="Add co-host"
                  >
                    +
                  </Button>
                </Box>
              </>
            )}

            {/* 4. Availability window */}
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: { xs: 1.5, sm: 2 }, mb: { xs: 1, sm: 1.5 }, display: 'block', fontSize: { xs: '13px', sm: '14px' } }}>
              4. When are you available? (Guests will choose a slot)
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', mb: { xs: 1, sm: 1.5 }, display: 'block', fontSize: { xs: '11px', sm: '12px' }, fontStyle: 'italic' }}>
              Note: Only future dates can be selected. Past dates are not allowed.
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 1.5, sm: 2 }, mb: { xs: 1.5, sm: 2 } }}>
              <TextField
                label="Earliest date"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: today }}
                value={startDate}
                onChange={(e) => {
                  const selectedDate = e.target.value;
                  if (selectedDate >= today) {
                    setStartDate(selectedDate);
                    // If end date is before new start date, update it
                    if (endDate && endDate < selectedDate) {
                      setEndDate(selectedDate);
                    }
                  } else {
                    alert("Please select a date from today onwards. Past dates are not allowed.");
                  }
                }}
                sx={{
                  '& .MuiInputLabel-root': {
                    color: 'text.secondary',
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  },
                  '& .MuiInputBase-input': {
                    color: 'text.primary',
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'divider'
                    },
                    '&:hover fieldset': {
                      borderColor: accentColor
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: accentColor
                    }
                  }
                }}
              />
              <TextField
                label="Latest date"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: startDate || today }}
                value={endDate}
                onChange={(e) => {
                  const selectedDate = e.target.value;
                  const minDate = startDate || today;
                  if (selectedDate >= minDate) {
                    setEndDate(selectedDate);
                  } else {
                    alert(`Latest date must be on or after ${startDate ? 'the earliest date' : 'today'}.`);
                  }
                }}
                sx={{
                  '& .MuiInputLabel-root': {
                    color: 'text.secondary',
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  },
                  '& .MuiInputBase-input': {
                    color: 'text.primary',
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'divider'
                    },
                    '&:hover fieldset': {
                      borderColor: accentColor
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: accentColor
                    }
                  }
                }}
              />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 1.5, sm: 2 }, mb: { xs: 1.5, sm: 2 } }}>
              <TextField
                label="Earliest time"
                type="time"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={windowStart}
                onChange={(e) => setWindowStart(e.target.value)}
                sx={{
                  '& .MuiInputLabel-root': {
                    color: 'text.secondary',
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  },
                  '& .MuiInputBase-input': {
                    color: 'text.primary',
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'divider'
                    },
                    '&:hover fieldset': {
                      borderColor: accentColor
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: accentColor
                    }
                  }
                }}
              />
              <TextField
                label="Latest time"
                type="time"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={windowEnd}
                onChange={(e) => setWindowEnd(e.target.value)}
                sx={{
                  '& .MuiInputLabel-root': {
                    color: 'text.secondary',
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  },
                  '& .MuiInputBase-input': {
                    color: 'text.primary',
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'divider'
                    },
                    '&:hover fieldset': {
                      borderColor: accentColor
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: accentColor
                    }
                  }
                }}
              />
            </Box>
            <FormControl size="small" fullWidth sx={{ mb: { xs: 2, sm: 2.5 } }}>
              <InputLabel sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Slot length</InputLabel>
              <Select
                label="Slot length"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                sx={{
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                <MenuItem value="15" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>15 min</MenuItem>
                <MenuItem value="30" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>30 min</MenuItem>
                <MenuItem value="45" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>45 min</MenuItem>
                <MenuItem value="60" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>60 min</MenuItem>
              </Select>
              <FormHelperText sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>How long each booking slot should be</FormHelperText>
            </FormControl>

            {/* 5. Meeting mode */}
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: { xs: 1.5, sm: 2 }, mb: { xs: 1, sm: 1.5 }, display: 'block', fontSize: { xs: '13px', sm: '14px' } }}>
              5. Meeting mode
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 }, mb: { xs: 2, sm: 2.5 }, flexWrap: 'wrap' }}>
              <Chip
                icon={<VideocamRoundedIcon sx={{ color: mode === "video" ? "#fff" : 'inherit', fontSize: { xs: 18, sm: 20 } }} />}
                label="Video meeting"
                clickable
                onClick={() => setMode("video")}
                sx={{
                  bgcolor: mode === "video" ? EV.orange : (isDark ? 'rgba(255,255,255,0.1)' : EV.light),
                  color: mode === "video" ? '#fff' : 'text.primary',
                  border: mode === "video" ? 'none' : `1px solid ${muiTheme.palette.divider}`,
                  fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                  height: { xs: 40, sm: 44 },
                  minHeight: { xs: 40, sm: 44 },
                  px: { xs: 2, sm: 2.5 },
                  py: { xs: 1, sm: 1.25 },
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:active': {
                    transform: 'scale(0.95)',
                  },
                  '&:hover': {
                    bgcolor: mode === "video" ? EV.orange : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)'),
                  }
                }}
              />
              <Chip
                icon={<PhoneRoundedIcon sx={{ color: mode === "audio" ? "#fff" : 'inherit', fontSize: { xs: 18, sm: 20 } }} />}
                label="Audio call"
                clickable
                onClick={() => setMode("audio")}
                sx={{
                  bgcolor: mode === "audio" ? EV.orange : (isDark ? 'rgba(255,255,255,0.1)' : EV.light),
                  color: mode === "audio" ? '#fff' : 'text.primary',
                  border: mode === "audio" ? 'none' : `1px solid ${muiTheme.palette.divider}`,
                  fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                  height: { xs: 40, sm: 44 },
                  minHeight: { xs: 40, sm: 44 },
                  px: { xs: 2, sm: 2.5 },
                  py: { xs: 1, sm: 1.25 },
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:active': {
                    transform: 'scale(0.95)',
                  },
                  '&:hover': {
                    bgcolor: mode === "audio" ? EV.orange : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)'),
                  }
                }}
              />
            </Box>

            {/* 6. Notes */}
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: { xs: 1.5, sm: 2 }, mb: { xs: 1, sm: 1.5 }, display: 'block', fontSize: { xs: '13px', sm: '14px' } }}>
              6. Notes / agenda (optional)
            </Typography>
            <TextField
              fullWidth
              label="Notes for invitees"
              placeholder="Share context, agenda, or links you want them to review before the meeting"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              multiline
              minRows={3}
              maxRows={4}
              sx={{ 
                mb: { xs: 2, sm: 2.5 },
                '& .MuiInputLabel-root': {
                  color: 'text.secondary',
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                },
                '& .MuiInputBase-input': {
                  color: 'text.primary',
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'divider'
                  },
                  '&:hover fieldset': {
                    borderColor: accentColor
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: accentColor
                  }
                }
              }}
              size="small"
            />

            {/* Summary card */}
            <Box sx={{ 
              borderRadius: { xs: 2, md: 2.5 }, 
              bgcolor: 'background.paper', 
              boxShadow: { xs: 1, md: 2 }, 
              border: `1px solid ${muiTheme.palette.divider}`, 
              p: { xs: 2, md: 3 }, 
              mb: { xs: 0.5, sm: 0.75 } 
            }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                Meeting summary
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip size="small" label={summary.module} sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : EV.light, color: 'text.primary' }} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <PersonRoundedIcon sx={{ fontSize: 18, opacity: 0.8, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.875rem' }}>With: {summary.who}</Typography>
              </Box>
              {meetingType === "group" && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <PersonRoundedIcon sx={{ fontSize: 18, opacity: 0.8, color: 'text.secondary' }} />
                  <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.875rem' }}>Co‑hosts: {summary.coHosts}</Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                <AccessTimeRoundedIcon sx={{ fontSize: 18, opacity: 0.8, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.875rem' }}>
                  Guests can pick any {summary.duration} slot between {summary.timeWindow} on {summary.dateRange}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <VideocamRoundedIcon sx={{ fontSize: 18, opacity: 0.8, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.875rem' }}>{summary.mode}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <LocationOnRoundedIcon sx={{ fontSize: 18, opacity: 0.8, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.875rem' }}>{summary.location}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>Notes:</Typography>
                <Typography variant="caption" sx={{ fontSize: '12px', color: 'text.secondary' }}>{summary.notes}</Typography>
              </Box>
            </Box>
          </Box>

        {/* Bottom CTA - fully flexible */}
        <Box
          sx={{
            width: '100%',
            px: { xs: 1.5, sm: 2, md: 3, lg: 4 },
            py: { xs: 2, sm: 2.5, md: 3 },
            pb: { xs: `calc(2rem + env(safe-area-inset-bottom))`, sm: 2.5, md: 3 },
            borderTop: `1px solid ${muiTheme.palette.divider}`,
            bgcolor: 'background.paper',
            position: 'sticky',
            bottom: 0,
            zIndex: 100,
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
                  borderRadius: 2,
                  boxShadow: 2,
                  fontWeight: 600,
                  "&:hover": { 
                    bgcolor: accent === 'green' ? '#02b87a' : accent === 'orange' ? '#e06f00' : '#8a8a8a',
                    boxShadow: 4
                  },
                  mb: 1,
                  fontSize: { xs: '0.875rem', sm: '1rem', md: '1.0625rem' },
                  py: { xs: 1.25, sm: 1.5, md: 1.75 },
                  minHeight: { xs: 44, sm: 48, md: 52 },
                  transition: 'all 0.2s ease',
                }}
                onClick={handleSchedule}
                title={isReschedule ? "Save changes to update this meeting" : "Create a new meeting booking"}
              >
                {isReschedule ? "Update Meeting" : "Create meeting booking"}
              </Button>
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block', 
              textAlign: 'center', 
              color: 'text.secondary', 
              fontSize: { xs: '0.7rem', sm: '0.75rem' }
            }}
          >
                Guests will see only your available time slots
              </Typography>
        </Box>
      </Box>
    </>
  );
}

/*
  ===== Tests (React Testing Library) — copy to MeetingBooking.test.jsx =====

  import React from 'react';
  import { render, screen } from '@testing-library/react';
  import MeetingBooking from './MeetingBooking';

  test('renders meeting booking header', () => {
    render(<MeetingBooking />);
    expect(screen.getByText(/Meeting booking/i)).toBeInTheDocument();
  });

  test('renders module chips and meeting type toggles', () => {
    render(<MeetingBooking />);
    expect(screen.getByText(/E-Commerce/i)).toBeInTheDocument();
    expect(screen.getByText(/1:1 meeting/i)).toBeInTheDocument();
    expect(screen.getByText(/Group meeting/i)).toBeInTheDocument();
  });
*/
