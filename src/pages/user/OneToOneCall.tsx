import React from 'react';
import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { useCall } from "../../context/CallContext";
import { useTheme } from "../../context/ThemeContext";
import {
  AppBar, Toolbar, IconButton, Box, Avatar, Button, Menu, MenuItem, ListItemIcon, ListItemText,
  List, ListItem, ListItemAvatar, ListItemText as ListItemTextComp, Divider, Chip, Typography,
  TextField, InputAdornment
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import MicNoneRoundedIcon from "@mui/icons-material/MicNoneRounded";
import MicOffRoundedIcon from "@mui/icons-material/MicOffRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import VideocamOffRoundedIcon from "@mui/icons-material/VideocamOffRounded";
import ScreenShareRoundedIcon from "@mui/icons-material/ScreenShareRounded";
import FlipCameraAndroidRoundedIcon from "@mui/icons-material/FlipCameraAndroidRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VolumeDownRoundedIcon from "@mui/icons-material/VolumeDownRounded";
import CallEndRoundedIcon from "@mui/icons-material/CallEndRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import ClosedCaptionRoundedIcon from "@mui/icons-material/ClosedCaptionRounded";
import SignalCellularAltRoundedIcon from "@mui/icons-material/SignalCellularAltRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import VideoCallRoundedIcon from "@mui/icons-material/VideoCallRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import DialpadRoundedIcon from "@mui/icons-material/DialpadRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CallMadeRoundedIcon from "@mui/icons-material/CallMadeRounded";
import CallReceivedRoundedIcon from "@mui/icons-material/CallReceivedRounded";
import CallMissedRoundedIcon from "@mui/icons-material/CallMissedRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

/**
 * U04-10 — OneToOneCall (pro)
 *
 * Props:
 *  - type: 'voice' | 'video'           (default 'video')
 *  - state: 'incoming' | 'dialing' | 'ringing' | 'connecting' | 'connected' | 'reconnecting' (default 'dialing')
 *  - remote: { name, avatar }
 *  - onBack, onEnd, onAccept, onReject
 *  - onOpenChat, onReport, onHelp
 *  - flags: { share?:boolean, captions?:boolean } initial flags
 */
export default function OneToOneCall({
  type = "video",
  state = "dialing",
  remote = { name: "Leslie Alexander", avatar: "https://i.pravatar.cc/100?img=5" },
  onBack, onEnd, onAccept, onReject,
  onOpenChat, onReport, onHelp,
  flags = { share: false, captions: false },
  location,
  onNavigate,
  layoutMode = 'mobile'
}) {
  const isDesktopLayout = layoutMode === 'desktop';
  // Get call parameters from URL
  const callType = useMemo(() => {
    const params = new URLSearchParams(location?.search || '');
    return params.get('type') || type;
  }, [location, type]);

  const contactName = useMemo(() => {
    const params = new URLSearchParams(location?.search || '');
    return params.get('contact') || remote.name;
  }, [location, remote.name]);

  const callModule = useMemo(() => {
    const params = new URLSearchParams(location?.search || '');
    return params.get('module') || (remote as any).module || 'E-Commerce';
  }, [location, remote]);

  const callStateFromUrl = useMemo(() => {
    const params = new URLSearchParams(location?.search || '');
    return params.get('state') || state;
  }, [location, state]);

  // Check if this is a live session call
  const isLiveSession = useMemo(() => {
    const params = new URLSearchParams(location?.search || '');
    return params.get('live') !== null;
  }, [location]);

  // Check if this is a group call (based on contact name or URL parameter)
  const isGroupCall = useMemo(() => {
    const params = new URLSearchParams(location?.search || '');
    const groupParam = params.get('group');
    const contact = contactName || remote.name;
    // Check if it's explicitly marked as group, or if contact name suggests group call
    return groupParam === 'true' || 
           contact?.toLowerCase().includes('group') || 
           contact?.toLowerCase().includes('chat');
  }, [location, contactName, remote.name]);

  const actualType = callType === 'voice' ? 'voice' : 'video';
  const actualRemote = { ...remote, name: contactName };

  // If no call params, show calls list instead
  const showCallList = useMemo(() => {
    const params = new URLSearchParams(location?.search || '');
    return !params.get('type') && !params.get('contact');
  }, [location]);

  // Calls list data
  const CALLS = [
    { id: 'c1', name: 'Leslie Alexander', avatar: 'https://i.pravatar.cc/100?img=5', type: 'video', time: '2:30 PM', duration: '14:22', status: 'completed', missed: false, direction: 'outgoing', module: 'E-Commerce' },
    { id: 'c2', name: 'Etty Duke', avatar: 'https://i.pravatar.cc/100?img=1', type: 'voice', time: 'Yesterday', duration: '5:10', status: 'completed', missed: false, direction: 'incoming', module: 'Rides & Logistics' },
    { id: 'c3', name: 'Dr. Cohen', avatar: 'https://i.pravatar.cc/100?img=12', type: 'video', time: 'Mon', duration: '—', status: 'missed', missed: true, direction: 'missed', module: 'Medical & Health Care' },
    { id: 'c4', name: 'EVzone Support', avatar: 'https://i.pravatar.cc/100?img=8', type: 'voice', time: 'Last week', duration: '8:45', status: 'completed', missed: false, direction: 'outgoing', module: 'EV Charging' },
    { id: 'c5', name: 'Team Meeting', avatar: 'https://i.pravatar.cc/100?img=15', type: 'conference', time: 'Today', duration: '32:15', status: 'completed', missed: false, direction: 'incoming', module: 'Virtual Workspace' },
    { id: 'c6', name: 'Project Review', avatar: 'https://i.pravatar.cc/100?img=16', type: 'meeting', time: 'Today', duration: '45:30', status: 'completed', missed: false, direction: 'outgoing', module: 'Virtual Workspace' },
  ];

  // All hooks must be called before any conditional returns
  const muiTheme = useMuiTheme();
  const { accentColor } = useTheme();
  const { startCall, endCall, updateCallState, activeCall } = useCall();
  
  // Toggles (uncontrolled defaults)
  const [muted, setMuted] = useState(false);
  const [camOn, setCamOn] = useState(actualType === "video");
  const [speakerMode, setSpeakerMode] = useState('loud'); // 'normal' or 'loud'
  // eslint-disable-next-line no-unused-vars
  const [sharing, setSharing] = useState(flags.share);
  const [captions, setCaptions] = useState(flags.captions);
  const [menuEl, setMenuEl] = useState(null);
  const [callSearch, setCallSearch] = useState("");

  // Call state management - auto-transition through dialing states
  const [callState, setCallState] = useState(callStateFromUrl);
  const [elapsed, setElapsed] = useState(0);
  const [isEnding, setIsEnding] = useState(false);
  
  // Update state when URL changes
  useEffect(() => {
    setCallState(callStateFromUrl);
  }, [callStateFromUrl]);
  
  // Sync call state with global call context
  useEffect(() => {
    if (callState && (callState === 'dialing' || callState === 'ringing' || callState === 'connecting' || callState === 'connected')) {
      startCall(actualType, actualRemote.name);
    }
  }, [callState, actualType, actualRemote.name, actualRemote.avatar, startCall]);
  
  // Update global call state
  useEffect(() => {
    if (activeCall && activeCall.state !== callState) {
      updateCallState(callState as any);
    }
  }, [callState, activeCall, updateCallState]);
  
  // Auto-transition dialing states
  useEffect(() => {
    if (callState === "dialing") {
      const timer1 = setTimeout(() => setCallState("ringing"), 1500);
      return () => clearTimeout(timer1);
    } else if (callState === "ringing") {
      const timer2 = setTimeout(() => setCallState("connecting"), 2000);
      return () => clearTimeout(timer2);
    } else if (callState === "connecting") {
      const timer3 = setTimeout(() => setCallState("connected"), 1500);
      return () => clearTimeout(timer3);
    }
  }, [callState]);

  // Timer for connected state
  useEffect(() => {
    if (callState !== "connected") return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [callState]);
  
  const hhmmss = useMemo(
    () => `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`,
    [elapsed]
  );

  const filteredCalls = useMemo(() => {
    const q = callSearch.trim().toLowerCase();
    if (!q) return CALLS;
    return CALLS.filter((call) => [call.name, call.module, call.type].join(" ").toLowerCase().includes(q));
  }, [CALLS, callSearch]);

  // PiP drag (video) - Positioned from top-left, above control bar
  const pipRef = useRef(null);
  const [pip, setPip] = useState({ x: 12, y: 80 }); // Start near top-right, below header
  const drag = useRef({ active: false, sx: 0, sy: 0, ox: 0, oy: 0, t0: 0, taps: 0 });
  
  // Control bar height + padding (approximately 5.5rem = 88px from bottom)
  const CONTROL_BAR_HEIGHT = 88;
  
  
  const onPipDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const t = ("touches" in e ? e.touches?.[0] : e);
    drag.current = { active: true, sx: t.clientX, sy: t.clientY, ox: pip.x, oy: pip.y, t0: Date.now(), taps: drag.current.taps };
  };
  
  const onPipMove = (e) => {
    if (!drag.current.active) return;
    e.preventDefault();
    e.stopPropagation();
    const t = ("touches" in e ? e.touches?.[0] : e);
    const container = pipRef.current?.parentElement;
    const containerWidth = container?.offsetWidth || window.innerWidth;
    const containerHeight = container?.offsetHeight || window.innerHeight;
    const pipWidth = 112; // w-28 = 7rem = 112px
    const pipHeight = 160; // h-40 = 10rem = 160px
    const headerHeight = 56; // AppBar height
    const minTop = headerHeight + 12; // Below header
    const maxTop = containerHeight - pipHeight - CONTROL_BAR_HEIGHT - 12; // Above control bar
    
    const newX = Math.max(12, Math.min(containerWidth - pipWidth - 12, drag.current.ox + (t.clientX - drag.current.sx)));
    const newY = Math.max(minTop, Math.min(maxTop, drag.current.oy + (t.clientY - drag.current.sy)));
    
    setPip({ x: newX, y: newY });
  };
  
  const onPipUp = (e) => {
    if (!drag.current.active) return;
    e.preventDefault();
    e.stopPropagation();
    drag.current.active = false;
    // Double-tap swap main <-> pip
    const dt = Date.now() - drag.current.t0;
    if (dt < 200) {
      drag.current.taps += 1;
      if (drag.current.taps === 2) {
        // swap feeds (mock: just toggle camOn to simulate swap)
        setCamOn((c) => c); // placeholder for swap logic
        drag.current.taps = 0;
      }
      setTimeout(() => (drag.current.taps = 0), 250);
    }
  };
  
  // Add global mouse/touch move and up handlers for smooth dragging
  useEffect(() => {
    const handleMove = (e) => {
      if (drag.current.active) {
        onPipMove(e);
      }
    };
    const handleUp = (e) => {
      if (drag.current.active) {
        onPipUp(e);
      }
    };
    
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - handlers check drag.current.active internally and functions are stable

  // Derived label
  const status = useMemo(() => {
    const callTypeLabel = isGroupCall 
      ? (actualType === "video" ? "Group Call" : "Group Call")
      : (actualType === "video" ? "Video Call" : "Voice Call");
    
    switch (callState) {
      case "incoming": return actualType === "video" ? "Incoming video call…" : "Incoming voice call…";
      case "dialing": return "Dialing…";
      case "ringing": return "Ringing…";
      case "connecting": return "Connecting…";
      case "reconnecting": return "Reconnecting…";
      case "connected": return `${callTypeLabel} • ${hhmmss}`;
      default: return "";
    }
  }, [callState, actualType, hhmmss, isGroupCall]);

  if (showCallList && isDesktopLayout) {
    const desktopActions = [
      { icon: <CallRoundedIcon sx={{ fontSize: 34 }} />, label: "Call", onClick: () => onNavigate?.("/call?type=video&state=dialing") },
      { icon: <CalendarMonthRoundedIcon sx={{ fontSize: 34 }} />, label: "Schedule", onClick: () => onNavigate?.("/meetings/book") },
      { icon: <DialpadRoundedIcon sx={{ fontSize: 34 }} />, label: "Keypad", onClick: () => onNavigate?.("/call?type=voice&state=dialing") },
      { icon: <FavoriteBorderRoundedIcon sx={{ fontSize: 34 }} />, label: "Favorites", onClick: () => onNavigate?.("/group-call?type=conference") },
    ];
    const actionCircleBg = muiTheme.palette.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(17,27,33,0.08)";
    const actionCircleHover = muiTheme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(17,27,33,0.14)";

    return (
      <>
        <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
        <Box className="desktop-calls-layout" sx={{ bgcolor: 'transparent' }}>
          <Box className="desktop-calls-list-pane" sx={{ borderRight: `1px solid ${muiTheme.palette.divider}` }}>
            <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5 }}>
              <Typography sx={{ fontSize: { xs: "2.25rem", md: "2.5rem" }, fontWeight: 600, color: "text.primary", lineHeight: 1 }}>Calls</Typography>
            </Box>
            <Box sx={{ px: 2, pb: 1.5 }}>
              <TextField
                fullWidth
                size="small"
                value={callSearch}
                onChange={(e) => setCallSearch(e.target.value)}
                placeholder="Search name or number"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 999,
                    minHeight: 44,
                    bgcolor: muiTheme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(17,27,33,0.07)',
                    '& fieldset': { borderColor: 'transparent' },
                    '&:hover fieldset': { borderColor: 'transparent' },
                    '&.Mui-focused fieldset': { borderColor: `${accentColor}80`, borderWidth: '1px' }
                  },
                  '& input': { fontSize: "0.95rem" }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  )
                }}
              />
            </Box>
            <Box sx={{ px: 2.5, pb: 1 }}>
              <Typography sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' }, fontWeight: 600, color: 'text.primary', lineHeight: 1.1 }}>Recent</Typography>
            </Box>
            <Box className="desktop-pane-scroll no-scrollbar" sx={{ overflowY: 'auto' }}>
              <List sx={{ py: 0 }}>
                {filteredCalls.map((call, idx) => (
                  <React.Fragment key={call.id}>
                    <ListItem
                      button
                      onClick={() => {
                        const moduleParam = call.module ? `&module=${encodeURIComponent(call.module)}` : '';
                        const callType = call.type === 'conference' || call.type === 'meeting' ? 'video' : call.type;
                        onNavigate?.(`/call?type=${callType}&contact=${encodeURIComponent(call.name)}&state=connecting${moduleParam}`);
                      }}
                      sx={{
                        px: 2.25,
                        py: 1.3,
                        '&:hover': { bgcolor: muiTheme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(17,27,33,0.04)' }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar src={call.avatar} sx={{ width: 50, height: 50 }} />
                      </ListItemAvatar>
                      <ListItemTextComp
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                            <Typography
                              sx={{
                                color: 'text.primary',
                                fontSize: { xs: '1.04rem', md: '1.1rem' },
                                fontWeight: 600,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {call.name}
                            </Typography>
                            <Typography sx={{ fontSize: '13px', color: 'text.secondary', flexShrink: 0 }}>{call.time}</Typography>
                          </Box>
                        }
                        secondary={
                          <Typography
                            sx={{
                              color: call.missed ? '#ef5350' : 'text.secondary',
                              fontSize: '0.85rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {call.missed ? 'Missed' : call.type === 'video' ? 'Outgoing video call' : 'Outgoing voice call'}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {idx < filteredCalls.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
                {filteredCalls.length === 0 && (
                  <Box sx={{ px: 2, py: 4, color: 'text.secondary', textAlign: 'center' }}>No recent calls found.</Box>
                )}
              </List>
            </Box>
          </Box>

          <Box className="desktop-calls-right-pane">
            <Box
              sx={{
                width: '100%',
                maxWidth: 840,
                px: { xs: 2.5, md: 6 },
                py: { xs: 4.5, md: 5.5 },
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                gap: { xs: 2, md: 2.5 },
                alignItems: 'start'
              }}
            >
              {desktopActions.map((action) => (
                <Box
                  key={action.label}
                  onClick={action.onClick}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1.5,
                    cursor: 'pointer',
                    color: 'text.primary',
                    minWidth: 0
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 80, md: 88 },
                      height: { xs: 80, md: 88 },
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'text.primary',
                      border: `1px solid ${muiTheme.palette.divider}`,
                      bgcolor: actionCircleBg,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: actionCircleHover,
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    {action.icon}
                  </Box>
                  <Typography
                    sx={{
                      mt: 0.25,
                      fontSize: { xs: '0.95rem', md: '1rem' },
                      fontWeight: 500,
                      lineHeight: 1.2,
                      color: 'text.secondary',
                      textAlign: 'center'
                    }}
                  >
                    {action.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </>
    );
  }

  // If showing calls list, render list view (after all hooks)
  if (showCallList) {
    const actionButtons = [
      { icon: <CallRoundedIcon sx={{ fontSize: { xs: 22, sm: 25 }, color: 'text.primary' }} />, label: 'Call', onClick: () => onNavigate?.('/call?type=video&state=dialing') },
      { icon: <CalendarMonthRoundedIcon sx={{ fontSize: { xs: 22, sm: 25 }, color: 'text.primary' }} />, label: 'Schedule', onClick: () => onNavigate?.('/meetings/book') },
      { icon: <DialpadRoundedIcon sx={{ fontSize: { xs: 22, sm: 25 }, color: 'text.primary' }} />, label: 'Keypad', onClick: () => onNavigate?.('/call?type=voice&state=dialing') },
      { icon: <FavoriteBorderRoundedIcon sx={{ fontSize: { xs: 22, sm: 25 }, color: 'text.primary' }} />, label: 'Favorites', onClick: () => onNavigate?.('/group-call?type=conference') },
    ];
    const quickActionBg = muiTheme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(17,27,33,0.08)';
    const quickActionHover = muiTheme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(17,27,33,0.14)';
    const utilityBg = muiTheme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(17,27,33,0.1)';
    const searchBg = muiTheme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(17,27,33,0.08)';
    const rowBorder = muiTheme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(17,27,33,0.08)';
    
    return (
      <>
        <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
        <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: 'transparent', color: 'text.primary' }}>
          <Box sx={{ px: { xs: 2, sm: 2.5 }, pt: { xs: 1.5, sm: 2 }, pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <IconButton
                onClick={(e) => setMenuEl(e.currentTarget)}
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: utilityBg,
                  color: 'text.primary',
                  '&:hover': { bgcolor: quickActionHover }
                }}
                aria-label="More options"
              >
                <MoreHorizRoundedIcon sx={{ fontSize: 22 }} />
              </IconButton>
              <IconButton
                onClick={() => onNavigate?.('/group-call?type=conference')}
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: accentColor,
                  color: '#001a11',
                  '&:hover': { bgcolor: accentColor, filter: 'brightness(1.07)' }
                }}
                aria-label="Start new call"
              >
                <AddRoundedIcon sx={{ fontSize: 24 }} />
              </IconButton>
            </Box>
            <Typography sx={{ fontSize: { xs: '2.35rem', sm: '2.6rem' }, fontWeight: 700, lineHeight: 1, color: 'text.primary' }}>
              Calls
            </Typography>
          </Box>

          <Box sx={{ px: { xs: 2, sm: 2.5 }, pb: 2 }}>
            <TextField
              fullWidth
              size="small"
              value={callSearch}
              onChange={(e) => setCallSearch(e.target.value)}
              placeholder="Search"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  minHeight: 48,
                  bgcolor: searchBg,
                  '& fieldset': { borderColor: 'transparent' },
                  '&:hover fieldset': { borderColor: 'transparent' },
                  '&.Mui-focused fieldset': { borderColor: `${accentColor}80`, borderWidth: '1px' }
                },
                '& input': {
                  fontSize: '1.02rem',
                  color: 'text.primary'
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ color: 'text.secondary', fontSize: 23 }} />
                  </InputAdornment>
                )
              }}
            />
          </Box>

          <Box sx={{ px: { xs: 2, sm: 2.5 }, pb: 2.3 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                gap: { xs: 0.8, sm: 1.2 },
                alignItems: 'flex-start',
                width: '100%'
              }}
            >
              {actionButtons.map((button) => (
                <Box
                  key={button.label}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.85,
                    cursor: 'pointer',
                    minWidth: 0,
                    width: '100%'
                  }}
                  onClick={button.onClick}
                >
                  <Box
                    sx={{
                      width: { xs: 62, sm: 66 },
                      height: { xs: 62, sm: 66 },
                      borderRadius: '50%',
                      bgcolor: quickActionBg,
                      border: `1px solid ${muiTheme.palette.divider}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        bgcolor: quickActionHover
                      },
                      flexShrink: 0
                    }}
                  >
                    {button.icon}
                  </Box>
                  <Typography
                    sx={{
                      mt: 0.1,
                      fontSize: { xs: '0.73rem', sm: '0.78rem' },
                      color: 'text.secondary',
                      fontWeight: 500,
                      textAlign: 'center',
                      lineHeight: 1.15,
                      width: '100%'
                    }}
                  >
                    {button.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ px: { xs: 2, sm: 2.5 }, pb: 0.75 }}>
            <Typography sx={{ fontSize: { xs: '2rem', sm: '2.15rem' }, fontWeight: 700, lineHeight: 1, color: 'text.primary' }}>
              Recent
            </Typography>
          </Box>

          <Box className="flex-1 no-scrollbar" sx={{ overflowY: 'auto' }}>
            <List disablePadding>
              {filteredCalls.map((call, idx) => {
                const direction = (call as any).direction || ((call as any).missed ? 'missed' : 'outgoing');
                const isMissed = direction === 'missed' || Boolean(call.missed || call.status === 'missed');
                const isIncoming = direction === 'incoming';
                const directionIcon = isMissed
                  ? <CallMissedRoundedIcon sx={{ fontSize: 17, color: '#ff5f75' }} />
                  : isIncoming
                    ? <CallReceivedRoundedIcon sx={{ fontSize: 17, color: 'text.secondary' }} />
                    : <CallMadeRoundedIcon sx={{ fontSize: 17, color: 'text.secondary' }} />;
                const directionLabel = isMissed ? 'Missed' : isIncoming ? 'Incoming' : 'Outgoing';
                const directionColor = isMissed ? '#ff5f75' : muiTheme.palette.text.secondary;

                return (
                  <ListItem
                    key={call.id}
                    button
                    onClick={() => onNavigate?.(`/call?type=${call.type}&contact=${encodeURIComponent(call.name)}&state=dialing`)}
                    sx={{
                      px: { xs: 2, sm: 2.5 },
                      py: 1.2,
                      borderBottom: idx < filteredCalls.length - 1 ? `1px solid ${rowBorder}` : 'none',
                      alignItems: 'center'
                    }}
                  >
                    <ListItemAvatar sx={{ minWidth: 58 }}>
                      <Avatar src={call.avatar} sx={{ width: 52, height: 52 }} />
                    </ListItemAvatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                        <Typography
                          sx={{
                            color: isMissed ? '#ff5f75' : 'text.primary',
                            fontSize: { xs: '1.05rem', sm: '1.12rem' },
                            fontWeight: 500,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {call.name}
                        </Typography>
                        <Typography sx={{ fontSize: { xs: '1rem', sm: '1.06rem' }, color: 'text.secondary', flexShrink: 0, fontWeight: 500 }}>
                          {call.time}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.35, mt: 0.2 }}>
                        {directionIcon}
                        <Typography
                          sx={{
                            color: directionColor,
                            fontSize: { xs: '0.9rem', sm: '0.95rem' },
                            fontWeight: 500,
                            lineHeight: 1.15
                          }}
                        >
                          {directionLabel}
                        </Typography>
                      </Box>

                      {call.module && (
                        <Typography
                          sx={{
                            mt: 0.15,
                            fontSize: { xs: '0.75rem', sm: '0.78rem' },
                            color: 'text.secondary',
                            opacity: 0.75,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {call.module}
                        </Typography>
                      )}
                    </Box>

                    <IconButton
                      size="small"
                      sx={{
                        ml: 0.6,
                        width: 30,
                        height: 30,
                        color: 'text.secondary',
                        border: `1px solid ${muiTheme.palette.divider}`,
                        bgcolor: 'transparent'
                      }}
                      aria-label={`Call info for ${call.name}`}
                    >
                      <InfoOutlinedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </ListItem>
                );
              })}
              {filteredCalls.length === 0 && (
                <Box sx={{ px: 2, py: 4, color: 'text.secondary', textAlign: 'center' }}>No recent calls found.</Box>
              )}
            </List>
          </Box>

          <Menu
            anchorEl={menuEl}
            open={Boolean(menuEl)}
            onClose={() => setMenuEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            PaperProps={{
              sx: {
                mt: 0.5,
                borderRadius: 2,
                bgcolor: 'background.paper',
                minWidth: 170
              }
            }}
          >
            <MenuItem onClick={() => { setMenuEl(null); onNavigate?.('/settings'); }}>Call settings</MenuItem>
            <MenuItem onClick={() => { setMenuEl(null); onNavigate?.('/help'); }}>Help</MenuItem>
          </Menu>
        </Box>
      </>
    );
  }

  // Render call interface
  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      {/* Call interface - Always dark background regardless of theme */}
      <Box 
        className="w-full h-full mx-auto flex flex-col" 
        sx={{ 
          bgcolor: '#000 !important', 
          color: '#fff', 
          position: isDesktopLayout ? 'relative' : 'fixed',
          top: isDesktopLayout ? 'auto' : 0,
          left: isDesktopLayout ? 'auto' : 0,
          right: isDesktopLayout ? 'auto' : 0,
          bottom: isDesktopLayout ? 'auto' : 0,
          zIndex: isDesktopLayout ? 1 : 1300,
          height: isDesktopLayout ? '100%' : '100dvh', // Dynamic viewport height for mobile (fallback to 100vh for older browsers)
          minHeight: isDesktopLayout ? 0 : '100vh',
          maxHeight: '100%',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <AppBar 
          elevation={0} 
          position="static" 
          sx={{ 
            bgcolor: "rgba(0,0,0,0.55) !important", 
            color: "#fff",
            pt: isDesktopLayout ? 0 : 'env(safe-area-inset-top)',
            minHeight: { xs: '56px', sm: '64px' }
          }}
        >
          <Toolbar 
            sx={{ 
              minHeight: { xs: '56px !important', sm: '64px !important' },
              px: { xs: 0.75, sm: 1, md: 2 },
              py: { xs: 0.5, sm: 1 },
              gap: { xs: 0.5, sm: 1 },
              display: 'flex',
              alignItems: 'center',
              width: '100%'
            }}
          >
            <IconButton 
              onClick={() => {
              onBack?.();
              }} 
              aria-label="Back" 
              sx={{ 
                color: "#fff",
                padding: { xs: '6px', sm: '8px', md: '12px' },
                flexShrink: 0,
                mr: { xs: 0.5, sm: 1 }
              }}
            >
              <ArrowBackRoundedIcon sx={{ fontSize: { xs: 20, sm: 22, md: 24 } }} />
            </IconButton>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              flex: 1, 
              minWidth: 0, 
              overflow: 'hidden',
              maxWidth: { xs: 'calc(100vw - 140px)', sm: 'calc(100vw - 180px)', md: 'none' }
            }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: "#fff", 
                  fontWeight: 600, 
                  fontSize: { xs: '0.8125rem', sm: '0.9375rem', md: '1rem' }, 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis',
                  lineHeight: 1.2,
                  width: '100%'
                }}
              >
                {actualRemote.name}
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { xs: 0.375, sm: 0.5 }, 
                mt: { xs: 0.125, sm: 0.25 }, 
                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                width: '100%',
                minWidth: 0
              }}>
                <Chip 
                  label={callModule} 
                  size="small" 
                  sx={{ 
                    height: { xs: 15, sm: 17, md: 18 }, 
                    fontSize: { xs: '7px', sm: '8px', md: '9px' }, 
                    bgcolor: 'rgba(255,255,255,0.15)', 
                    color: '#fff',
                    maxWidth: { xs: '100%', sm: 'none' },
                    minWidth: 0,
                    flexShrink: { xs: 1, sm: 0 },
                    '& .MuiChip-label': { 
                      px: { xs: 0.5, sm: 0.625, md: 0.75 }, 
                      py: 0,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: 1.2,
                      maxWidth: { xs: '100px', sm: '120px', md: 'none' }
                    }
                  }} 
                />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: "rgba(255,255,255,0.8)", 
                    fontSize: { xs: '0.5625rem', sm: '0.625rem', md: '0.6875rem' },
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minWidth: 0,
                    flex: { xs: '1 1 100%', sm: '0 0 auto' },
                    maxWidth: { xs: '100%', sm: 'none' }
                  }}
                >
                {status}
              </Typography>
              </Box>
            </Box>
            <Box sx={{ flexShrink: 0, ml: 'auto' }}>
            <IconButton 
              aria-label="More" 
              onClick={(e)=>setMenuEl(e.currentTarget)} 
              sx={{ 
                color: "#fff",
                padding: { xs: '6px', sm: '8px', md: '12px' },
                flexShrink: 0
              }}
            >
              <MoreVertRoundedIcon sx={{ fontSize: { xs: 20, sm: 22, md: 24 } }} />
            </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Overflow menu */}
        <Menu
          anchorEl={menuEl}
          open={Boolean(menuEl)}
          onClose={()=>setMenuEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{ 
            sx:{ 
              width: { xs: '90vw', sm: '280px', md: '320px' }, 
              maxWidth: { xs: "calc(100vw - 1rem)", sm: "320px" }, 
              borderRadius: 2, 
              py: 0.5, 
              mt: 0.5,
              bgcolor: 'background.paper',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              '& .MuiMenuItem-root': {
                color: 'text.primary',
              }
            } 
          }}
        >
          <MenuItem onClick={()=>{ 
            setMenuEl(null); 
            setCaptions(c=>!c); 
            alert(captions ? 'Captions disabled' : 'Captions enabled');
          }}>
            <ListItemIcon><ClosedCaptionRoundedIcon fontSize="small" sx={{ color: 'text.primary' }}/></ListItemIcon>
            <ListItemText primary={captions? "Disable captions" : "Enable captions"} />
          </MenuItem>
          {/* Only show "View participants" for group/conference calls, not 1:1 calls */}
          {actualType === 'video' && (
          <MenuItem onClick={()=>{ 
            setMenuEl(null); 
            if (isGroupCall) {
              const params = new URLSearchParams(location?.search || '');
              const module = params.get('module');
              const moduleParam = module ? `&module=${encodeURIComponent(module)}` : '';
              onNavigate?.(`/group-call?type=${actualType}&contact=${encodeURIComponent(contactName)}${moduleParam}`);
            } else {
              // For 1:1 calls, show info message
              alert('This is a one-to-one call. View participants is only available for group calls.');
            }
          }}>
            <ListItemIcon><PeopleAltRoundedIcon fontSize="small" sx={{ color: 'text.primary' }}/></ListItemIcon>
            <ListItemText primary="View participants" />
          </MenuItem>
          )}
          <MenuItem onClick={()=>{ 
            setMenuEl(null); 
            // Navigate to conversation with this contact
            onNavigate?.(`/conversation/${encodeURIComponent(actualRemote.name)}`);
            onOpenChat?.();
          }}>
            <ListItemIcon><ChatBubbleOutlineRoundedIcon fontSize="small" sx={{ color: 'text.primary' }}/></ListItemIcon>
            <ListItemText primary="Open chat" />
          </MenuItem>
          <MenuItem onClick={()=>{ 
            setMenuEl(null); 
            alert('Quality report submitted. Thank you for your feedback!');
            onReport?.();
          }}>
            <ListItemIcon><SignalCellularAltRoundedIcon fontSize="small" sx={{ color: 'text.primary' }}/></ListItemIcon>
            <ListItemText primary="Report quality" />
          </MenuItem>
          <MenuItem onClick={()=>{ 
            setMenuEl(null); 
            onNavigate?.('/help');
            onHelp?.();
          }}>
            <ListItemIcon><ArrowBackRoundedIcon fontSize="small" sx={{ color: 'text.primary' }}/></ListItemIcon>
            <ListItemText primary="Help" />
          </MenuItem>
        </Menu>

        {/* Body */}
        <Box className="flex-1 relative" sx={{ bgcolor: '#000', minHeight: 0 }}>
          {actualType === "video" ? (
            <>
              {/* Remote feed (main view) - Always show */}
              <Box className="absolute inset-0" sx={{ bgcolor: '#000' }}>
                {callState === "connected" ? (
                  <video className="w-full h-full object-cover" muted loop autoPlay playsInline>
                    <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" type="video/webm" />
                  </video>
                ) : (
                  <Box className="w-full h-full grid place-items-center">
                    <Avatar src={actualRemote.avatar} sx={{ width: '8rem', height: '8rem' }} />
                  </Box>
                )}
              </Box>

              {/* Local preview (PiP) - Show only when camera is on and call is connected - Positioned above controls */}
              {camOn && callState === "connected" && (
                <Box
                  ref={pipRef}
                  sx={{
                    position: 'absolute',
                    width: { xs: '6rem', sm: '7rem', md: '8rem' },
                    height: { xs: '8rem', sm: '10rem', md: '12rem' },
                    top: `${pip.y}px`,
                    left: `${pip.x}px`,
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    cursor: 'move',
                    zIndex: 100,
                    userSelect: 'none',
                    touchAction: 'none',
                    maxWidth: { xs: '30%', sm: '25%' },
                    maxHeight: { xs: '25%', sm: '30%' }
                  }}
                  onMouseDown={onPipDown}
                  onTouchStart={onPipDown}
                  aria-label="Local preview - Drag to move"
                >
                  <video className="w-full h-full object-cover" muted loop autoPlay playsInline>
                    <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" type="video/webm" />
                  </video>
                </Box>
              )}
              
              {/* Camera off indicator - Show avatar when camera is off - Positioned above controls */}
              {!camOn && callState === "connected" && (
                <Box
                  ref={pipRef}
                  sx={{
                    position: 'absolute',
                    width: { xs: '6rem', sm: '7rem', md: '8rem' },
                    height: { xs: '8rem', sm: '10rem', md: '12rem' },
                    top: `${pip.y}px`,
                    left: `${pip.x}px`,
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    bgcolor: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'move',
                    zIndex: 100,
                    userSelect: 'none',
                    touchAction: 'none',
                    maxWidth: { xs: '30%', sm: '25%' },
                    maxHeight: { xs: '25%', sm: '30%' }
                  }}
                  onMouseDown={onPipDown}
                  onTouchStart={onPipDown}
                  aria-label="Camera off - Drag to move"
                >
                  <Avatar src="https://i.pravatar.cc/100?img=20" sx={{ width: { xs: '3rem', sm: '4rem', md: '4.5rem' }, height: { xs: '3rem', sm: '4rem', md: '4.5rem' } }} />
                </Box>
              )}

              {/* Incoming call overlay */}
              {callState === "incoming" && (
                <Box className="absolute inset-0 grid place-items-center" sx={{ bgcolor: 'rgba(0,0,0,0.7)', zIndex: 10 }}>
                  <Box className="flex flex-col items-center gap-4" sx={{ zIndex: 1 }}>
                    {/* Pulsing animation for incoming call */}
                    <Box className="relative" sx={{ width: '5rem', height: '5rem' }}>
                      <Box className="absolute inset-0 rounded-full call-pulse" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                      <Box className="absolute inset-0 rounded-full call-pulse-delayed" sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                      <Avatar 
                        src={actualRemote.avatar} 
                        sx={{ 
                          width: '5rem', 
                          height: '5rem',
                          position: 'relative',
                          zIndex: 1,
                          border: '3px solid rgba(255,255,255,0.3)'
                        }} 
                      />
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      gap: 0.5,
                      mt: 1
                    }}>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          color: '#fff', 
                          fontWeight: 600, 
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          textAlign: 'center',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          maxWidth: '90vw',
                          px: 1
                        }}
                      >
                        {actualRemote.name}
                      </Typography>
                        <Chip 
                          label={callModule} 
                          size="small" 
                          sx={{ 
                            height: 20, 
                            fontSize: { xs: '10px', sm: '11px' }, 
                            bgcolor: 'rgba(255,255,255,0.15)', 
                            color: '#fff',
                            maxWidth: '90vw',
                            '& .MuiChip-label': { 
                              px: 1,
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word',
                              whiteSpace: 'normal',
                              textAlign: 'center'
                            }
                          }} 
                        />
                      <Box 
                        className="px-4 py-2 rounded-full backdrop-blur" 
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.1)', 
                          color: '#fff', 
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }, 
                          fontWeight: 500,
                          textAlign: 'center',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          maxWidth: '90vw',
                          whiteSpace: 'normal',
                          px: { xs: 2, sm: 4 },
                          py: { xs: 1, sm: 2 }
                        }}
                      >
                        {status}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Dialing/connecting overlays with animation */}
              {callState !== "connected" && callState !== "incoming" && (
                <Box className="absolute inset-0 grid place-items-center" sx={{ bgcolor: 'rgba(0,0,0,0.7)', zIndex: 10 }}>
                  <Box className="flex flex-col items-center gap-4" sx={{ zIndex: 1 }}>
                    {/* Pulsing animation for dialing/ringing/connecting */}
                    <Box className="relative" sx={{ width: '5rem', height: '5rem' }}>
                      <Box className="absolute inset-0 rounded-full call-pulse" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                      <Box className="absolute inset-0 rounded-full call-pulse-delayed" sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                      <Avatar 
                        src={actualRemote.avatar} 
                        sx={{ 
                          width: '5rem', 
                          height: '5rem',
                          position: 'relative',
                          zIndex: 1,
                          border: '3px solid rgba(255,255,255,0.3)'
                        }} 
                      />
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      gap: 0.5,
                      mt: 1
                    }}>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          color: '#fff', 
                          fontWeight: 600, 
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          textAlign: 'center',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          maxWidth: '90vw',
                          px: 1
                        }}
                      >
                        {actualRemote.name}
                      </Typography>
                        <Chip 
                          label={callModule} 
                          size="small" 
                          sx={{ 
                            height: 20, 
                            fontSize: { xs: '10px', sm: '11px' }, 
                            bgcolor: 'rgba(255,255,255,0.15)', 
                            color: '#fff',
                            maxWidth: '90vw',
                            '& .MuiChip-label': { 
                              px: 1,
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word',
                              whiteSpace: 'normal',
                              textAlign: 'center'
                            }
                          }} 
                        />
                      <Box 
                        className="px-4 py-2 rounded-full backdrop-blur" 
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.1)', 
                          color: '#fff', 
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }, 
                          fontWeight: 500,
                          textAlign: 'center',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          maxWidth: '90vw',
                          whiteSpace: 'normal',
                          px: { xs: 2, sm: 4 },
                          py: { xs: 1, sm: 2 }
                        }}
                      >
                        {status}
                      </Box>
                      {callState === "ringing" && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'rgba(255,255,255,0.7)', 
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          textAlign: 'center',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          maxWidth: '90vw',
                          px: 1
                        }}
                      >
                        Waiting for answer...
                      </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              )}
            </>
          ) : (
            <Box className="absolute inset-0 grid place-items-center" sx={{ bgcolor: '#000', width: '100%', height: '100%' }}>
              <Box className="flex flex-col items-center gap-4" sx={{ zIndex: 1 }}>
                {callState === "incoming" ? (
                  <>
                    {/* Pulsing animation for incoming voice call */}
                    <Box className="relative" sx={{ width: '6.5rem', height: '6.5rem' }}>
                      <Box className="absolute inset-0 rounded-full call-pulse" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                      <Box className="absolute inset-0 rounded-full call-pulse-delayed" sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                      <Avatar 
                        src={actualRemote.avatar} 
                        sx={{ 
                          width: '6.5rem', 
                          height: '6.5rem',
                          position: 'relative',
                          zIndex: 1,
                          border: '3px solid rgba(255,255,255,0.3)'
                        }} 
                      />
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      gap: 0.5,
                      mt: 1
                    }}>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          color: '#fff', 
                          fontWeight: 600, 
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          textAlign: 'center',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          maxWidth: '90vw',
                          px: 1
                        }}
                      >
                        {actualRemote.name}
                      </Typography>
                        <Chip 
                          label={callModule} 
                          size="small" 
                          sx={{ 
                            height: 20, 
                            fontSize: { xs: '10px', sm: '11px' }, 
                            bgcolor: 'rgba(255,255,255,0.15)', 
                            color: '#fff',
                            maxWidth: '90vw',
                            '& .MuiChip-label': { 
                              px: 1,
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word',
                              whiteSpace: 'normal',
                              textAlign: 'center'
                            }
                          }} 
                        />
                      <Box 
                        className="px-4 py-2 rounded-full backdrop-blur" 
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.1)', 
                          color: '#fff', 
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }, 
                          fontWeight: 500,
                          textAlign: 'center',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          maxWidth: '90vw',
                          whiteSpace: 'normal',
                          px: { xs: 2, sm: 4 },
                          py: { xs: 1, sm: 2 }
                        }}
                      >
                        {status}
                      </Box>
                    </Box>
                  </>
                ) : callState !== "connected" ? (
                  <>
                    {/* Pulsing animation for voice call dialing */}
                    <Box className="relative" sx={{ width: '6.5rem', height: '6.5rem' }}>
                      <Box className="absolute inset-0 rounded-full call-pulse" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                      <Box className="absolute inset-0 rounded-full call-pulse-delayed" sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                      <Avatar 
                        src={actualRemote.avatar} 
                        sx={{ 
                          width: '6.5rem', 
                          height: '6.5rem',
                          position: 'relative',
                          zIndex: 1,
                          border: '3px solid rgba(255,255,255,0.3)'
                        }} 
                      />
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      gap: 0.5,
                      mt: 1
                    }}>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          color: '#fff', 
                          fontWeight: 600, 
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          textAlign: 'center',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          maxWidth: '90vw',
                          px: 1
                        }}
                      >
                        {actualRemote.name}
                      </Typography>
                        <Chip 
                          label={callModule} 
                          size="small" 
                          sx={{ 
                            height: 20, 
                            fontSize: { xs: '10px', sm: '11px' }, 
                            bgcolor: 'rgba(255,255,255,0.15)', 
                            color: '#fff',
                            maxWidth: '90vw',
                            '& .MuiChip-label': { 
                              px: 1,
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word',
                              whiteSpace: 'normal',
                              textAlign: 'center'
                            }
                          }} 
                        />
                      <Box 
                        className="px-4 py-2 rounded-full backdrop-blur" 
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.1)', 
                          color: '#fff', 
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }, 
                          fontWeight: 500,
                          textAlign: 'center',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          maxWidth: '90vw',
                          whiteSpace: 'normal',
                          px: { xs: 2, sm: 4 },
                          py: { xs: 1, sm: 2 }
                        }}
                      >
                        {status}
                      </Box>
                      {callState === "ringing" && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'rgba(255,255,255,0.7)', 
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          textAlign: 'center',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          maxWidth: '90vw',
                          px: 1
                        }}
                      >
                        Waiting for answer...
                      </Typography>
                      )}
                    </Box>
                  </>
                ) : (
                  <>
                    <Avatar src={actualRemote.avatar} sx={{ width: '6.5rem', height: '6.5rem', border: '3px solid rgba(255,255,255,0.2)' }} />
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      gap: 0.5,
                      mt: 1
                    }}>
                      <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>
                        {actualRemote.name}
                      </Typography>
                        <Chip 
                          label={callModule} 
                          size="small" 
                          sx={{ 
                            height: 20, 
                            fontSize: '11px', 
                            bgcolor: 'rgba(255,255,255,0.15)', 
                            color: '#fff',
                            '& .MuiChip-label': { px: 1 }
                          }} 
                        />
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'rgba(255,255,255,0.8)', 
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          textAlign: 'center',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          maxWidth: '90vw',
                          px: 1
                        }}
                      >
                        Connected • {hhmmss}
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            </Box>
          )}

          {/* Incoming sheet */}
          {callState === "incoming" && (
            <div className="absolute inset-x-0 bottom-24 grid place-items-center">
              <div className="flex gap-6">
                <Button
                  variant="contained"
                  onClick={()=>onAccept?.()}
                  sx={{ bgcolor: EV.green, color: "#fff", "&:hover": { bgcolor: "#02b47c" } }}
                >
                  Accept
                </Button>
                <Button
                  variant="contained"
                  onClick={()=>onReject?.()}
                  sx={{ bgcolor: "#e53935", color: "#fff", "&:hover": { bgcolor: "#c62828" } }}
                >
                  Decline
                </Button>
              </div>
            </div>
          )}
        </Box>

        {/* Controls (glass) - Positioned just above bottom navigation */}
        <Box 
          sx={{ 
            position: isDesktopLayout ? 'absolute' : 'fixed',
            // Position directly above bottom nav with small gap
            bottom: isDesktopLayout ? 16 : { 
              xs: 'calc(4.5rem + 1.5rem + env(safe-area-inset-bottom) + 8px)', 
              sm: 'calc(4.5rem + 1.5rem + env(safe-area-inset-bottom) + 10px)',
              md: 'calc(4.5rem + 1.5rem + env(safe-area-inset-bottom) + 12px)'
            },
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: isDesktopLayout ? 40 : 1200, // Above bottom nav (zIndex 1100)
            width: { 
              xs: isDesktopLayout ? 'calc(100% - 32px)' : 'calc(100% - 32px)', 
              sm: 'calc(100% - 32px)', 
              md: 'auto' 
            },
            maxWidth: isDesktopLayout ? { xs: '100%', sm: '760px', md: '860px' } : { xs: '100%', sm: '600px', md: '700px' },
            px: { xs: 1, sm: 1.5, md: 2 }
          }}
        >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
            justifyContent: 'center', 
            bgcolor: 'rgba(0,0,0,0.85)', 
            borderRadius: { xs: 2.5, sm: 3 }, 
            px: { xs: 0.75, sm: 1, md: 1.5 }, 
            py: { xs: 0.75, sm: 1, md: 1.5 }, 
            backdropFilter: 'blur(20px)',
            gap: { xs: 0.375, sm: 0.5, md: 0.75 },
            flexWrap: 'nowrap',
            overflowX: 'auto',
            overflowY: 'hidden',
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
            boxShadow: '0 4px 20px rgba(0,0,0,0.7)',
            border: '1px solid rgba(255,255,255,0.1)',
            WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
            minWidth: 0,
            width: '100%'
            }}>
              {/* mic - Always visible */}
              <IconButton 
                onClick={()=>{
                  setMuted(m=>!m);
                }} 
                aria-label={muted ? "Unmute microphone" : "Mute microphone"}
                sx={{ 
                  color:"#fff", 
                  flexShrink: 0,
                  bgcolor: muted ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                  width: { xs: "40px", sm: "44px", md: "48px" },
                  height: { xs: "40px", sm: "44px", md: "48px" },
                  minWidth: { xs: "40px", sm: "44px", md: "48px" },
                  padding: { xs: '8px', sm: '10px', md: '12px' },
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                  "&:active": { transform: 'scale(0.95)' }
                }}
              >
                {muted ? <MicOffRoundedIcon sx={{ fontSize: { xs: 20, sm: 22, md: 24 } }} /> : <MicNoneRoundedIcon sx={{ fontSize: { xs: 20, sm: 22, md: 24 } }} />}
              </IconButton>

              {/* camera (video) - Always visible for video calls */}
              {actualType === "video" && (
                <IconButton 
                  onClick={()=>{
                    setCamOn(c=>!c);
                  }} 
                  aria-label={camOn ? "Turn camera off" : "Turn camera on"}
                  sx={{ 
                    color:"#fff", 
                    flexShrink: 0,
                  bgcolor: !camOn ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                  width: { xs: "40px", sm: "44px", md: "48px" },
                  height: { xs: "40px", sm: "44px", md: "48px" },
                  minWidth: { xs: "40px", sm: "44px", md: "48px" },
                  padding: { xs: '8px', sm: '10px', md: '12px' },
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                  "&:active": { transform: 'scale(0.95)' }
                  }}
                >
                  {camOn ? <VideocamRoundedIcon sx={{ fontSize: { xs: 20, sm: 22, md: 24 } }} /> : <VideocamOffRoundedIcon sx={{ fontSize: { xs: 20, sm: 22, md: 24 } }} />}
                </IconButton>
              )}

              {/* flip camera (video) */}
              {actualType === "video" && (
                <IconButton 
                  onClick={()=>{
                    alert('Camera flipped');
                  }} 
                  aria-label="Flip camera" 
                  sx={{ 
                    color:"#fff", 
                    flexShrink: 0,
                    bgcolor: "rgba(255,255,255,0.1)",
                    width: { xs: "40px", sm: "44px", md: "48px" },
                    height: { xs: "40px", sm: "44px", md: "48px" },
                    minWidth: { xs: "40px", sm: "44px", md: "48px" },
                    padding: { xs: '8px', sm: '10px', md: '12px' },
                    "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                    "&:active": { transform: 'scale(0.95)' }
                  }}
                >
                  <FlipCameraAndroidRoundedIcon sx={{ fontSize: { xs: 20, sm: 22, md: 24 } }} />
                </IconButton>
              )}

              {/* speaker - Toggle between normal and loud speaker (WhatsApp style) */}
              <IconButton 
                onClick={()=>{
                  setSpeakerMode(prev => prev === 'loud' ? 'normal' : 'loud');
                }} 
                aria-label={speakerMode === 'loud' ? 'Switch to normal speaker' : 'Switch to loud speaker'}
                sx={{ 
                  color:"#fff", 
                  flexShrink: 0,
                  bgcolor: speakerMode === 'loud' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                  width: { xs: "40px", sm: "44px", md: "48px" },
                  height: { xs: "40px", sm: "44px", md: "48px" },
                  minWidth: { xs: "40px", sm: "44px", md: "48px" },
                  padding: { xs: '8px', sm: '10px', md: '12px' },
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                  "&:active": { transform: 'scale(0.95)' }
                }}
              >
                {speakerMode === 'loud' ? <VolumeUpRoundedIcon sx={{ fontSize: { xs: 20, sm: 22, md: 24 } }} /> : <VolumeDownRoundedIcon sx={{ fontSize: { xs: 20, sm: 22, md: 24 } }} />}
              </IconButton>

              {/* share (video) */}
              {actualType === "video" && (
                <IconButton 
                  onClick={()=>{
                    setSharing(v=>!v);
                  }} 
                  aria-label={sharing ? "Stop sharing screen" : "Share screen"}
                  sx={{ 
                    color:"#fff", 
                    flexShrink: 0,
                    bgcolor: sharing ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                    width: { xs: "40px", sm: "44px", md: "48px" },
                    height: { xs: "40px", sm: "44px", md: "48px" },
                    minWidth: { xs: "40px", sm: "44px", md: "48px" },
                    padding: { xs: '8px', sm: '10px', md: '12px' },
                    "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                    "&:active": { transform: 'scale(0.95)' }
                  }}
                >
                  <ScreenShareRoundedIcon sx={{ fontSize: { xs: 20, sm: 22, md: 24 } }} />
                </IconButton>
              )}

              {/* captions */}
              <IconButton 
                onClick={()=>{
                  setCaptions(c=>!c);
                }} 
                aria-label={captions ? "Disable captions" : "Enable captions"}
                sx={{ 
                  color:"#fff", 
                  flexShrink: 0,
                  bgcolor: captions ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                  width: { xs: "40px", sm: "44px", md: "48px" },
                  height: { xs: "40px", sm: "44px", md: "48px" },
                  minWidth: { xs: "40px", sm: "44px", md: "48px" },
                  padding: { xs: '8px', sm: '10px', md: '12px' },
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                  "&:active": { transform: 'scale(0.95)' }
                }}
              >
                <ClosedCaptionRoundedIcon sx={{ fontSize: { xs: 20, sm: 22, md: 24 } }} />
              </IconButton>

              {/* open chat */}
              <IconButton 
                onClick={()=>{
                  onNavigate?.(`/conversation/${encodeURIComponent(actualRemote.name)}`);
                  onOpenChat?.();
                }} 
                aria-label="Open chat" 
                sx={{ 
                  color:"#fff", 
                  flexShrink: 0,
                  bgcolor: "rgba(255,255,255,0.1)",
                  width: { xs: "40px", sm: "44px", md: "48px" },
                  height: { xs: "40px", sm: "44px", md: "48px" },
                  minWidth: { xs: "40px", sm: "44px", md: "48px" },
                  padding: { xs: '8px', sm: '10px', md: '12px' },
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                  "&:active": { transform: 'scale(0.95)' }
                }}
              >
                <ChatBubbleOutlineRoundedIcon sx={{ fontSize: { xs: 20, sm: 22, md: 24 } }} />
              </IconButton>

              {/* network quality (static demo) */}
              <IconButton 
                aria-label="Network quality: Good"
                sx={{ 
                  color:"#fff", 
                  flexShrink: 0,
                  bgcolor: "rgba(255,255,255,0.1)",
                  width: { xs: "40px", sm: "44px", md: "48px" },
                  height: { xs: "40px", sm: "44px", md: "48px" },
                  minWidth: { xs: "40px", sm: "44px", md: "48px" },
                  padding: { xs: '8px', sm: '10px', md: '12px' },
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                  "&:active": { transform: 'scale(0.95)' }
                }}
              >
                <SignalCellularAltRoundedIcon sx={{ fontSize: { xs: 20, sm: 22, md: 24 } }} />
              </IconButton>

              {/* end call - Always visible and prominent - MUST end call */}
              <IconButton 
                onClick={() => {
                  if (isEnding) return; // Prevent double-click
                  setIsEnding(true);
                  
                  // End call immediately - clear all state
                  endCall(); // End call in global context first - this clears activeCall
                  setCallState(null); // Clear call state
                  setElapsed(0);
                  setMuted(false);
                  setCamOn(false);
                  setSharing(false);
                  setCaptions(false);
                  
                  // If this was a live session, notify that it ended
                  if (isLiveSession) {
                    // In a real app, you'd send a signal to end the live session
                    console.log('Live session ended');
                  }
                  
                  // Call onEnd callback
                  onEnd?.();
                  
                  // Navigate to the conversation/chat for this contact
                  const contact = contactName || actualRemote.name;
                  if (contact) {
                    onNavigate?.(`/conversation/${encodeURIComponent(contact)}`);
                  } else {
                    // Fallback: navigate back if no contact name
                    onNavigate?.(-1);
                  }
                }} 
                aria-label="End call" 
                sx={{ 
                  color:"#fff", 
                  bgcolor:"#e53935", 
                  "&:hover":{ bgcolor:"#c62828" },
                  "&:active":{ bgcolor:"#b71c1c", transform: 'scale(0.95)' },
                  width: { xs: '44px', sm: '52px', md: '56px' },
                  height: { xs: '44px', sm: '52px', md: '56px' },
                  minWidth: { xs: '44px', sm: '52px', md: '56px' },
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(229,57,53,0.4)'
                }}
              >
                <CallEndRoundedIcon sx={{ fontSize: { xs: 22, sm: 26, md: 28 } }} />
              </IconButton>
            </Box>
          </Box>
        </Box>

    </>
  );
}
