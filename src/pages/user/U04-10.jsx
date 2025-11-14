import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { useCall } from "../../context/CallContext";
import { useTheme } from "../../context/ThemeContext";
import {
  AppBar, Toolbar, IconButton, Box, Avatar, Button, Menu, MenuItem, ListItemIcon, ListItemText,
  List, ListItem, ListItemAvatar, ListItemText as ListItemTextComp, Divider, Chip, Typography
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
  onNavigate
}) {
  // Get call parameters from URL
  const callType = useMemo(() => {
    const params = new URLSearchParams(location?.search || '');
    return params.get('type') || type;
  }, [location, type]);

  const contactName = useMemo(() => {
    const params = new URLSearchParams(location?.search || '');
    return params.get('contact') || remote.name;
  }, [location, remote.name]);

  const callStateFromUrl = useMemo(() => {
    const params = new URLSearchParams(location?.search || '');
    return params.get('state') || state;
  }, [location, state]);

  const actualType = callType === 'voice' ? 'voice' : 'video';
  const actualRemote = { ...remote, name: contactName };

  // If no call params, show calls list instead
  const showCallList = useMemo(() => {
    const params = new URLSearchParams(location?.search || '');
    return !params.get('type') && !params.get('contact');
  }, [location]);

  // Calls list data
  const CALLS = [
    { id: 'c1', name: 'Leslie Alexander', avatar: 'https://i.pravatar.cc/100?img=5', type: 'video', time: '2:30 PM', duration: '14:22', status: 'completed', missed: false },
    { id: 'c2', name: 'Etty Duke', avatar: 'https://i.pravatar.cc/100?img=1', type: 'voice', time: 'Yesterday', duration: '5:10', status: 'completed', missed: false },
    { id: 'c3', name: 'Dr. Cohen', avatar: 'https://i.pravatar.cc/100?img=12', type: 'video', time: 'Mon', duration: '—', status: 'missed', missed: true },
    { id: 'c4', name: 'EVzone Support', avatar: 'https://i.pravatar.cc/100?img=8', type: 'voice', time: 'Last week', duration: '8:45', status: 'completed', missed: false },
    { id: 'c5', name: 'Team Meeting', avatar: 'https://i.pravatar.cc/100?img=15', type: 'conference', time: 'Today', duration: '32:15', status: 'completed', missed: false },
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

  // Call state management - auto-transition through dialing states
  const [callState, setCallState] = useState(callStateFromUrl);
  const [elapsed, setElapsed] = useState(0);
  
  // Update state when URL changes
  useEffect(() => {
    setCallState(callStateFromUrl);
  }, [callStateFromUrl]);
  
  // Sync call state with global call context
  useEffect(() => {
    if (callState && (callState === 'dialing' || callState === 'ringing' || callState === 'connecting' || callState === 'connected')) {
      startCall({
        type: actualType,
        contact: actualRemote.name,
        avatar: actualRemote.avatar,
        state: callState,
      });
    }
  }, [callState, actualType, actualRemote.name, actualRemote.avatar, startCall]);
  
  // Update global call state
  useEffect(() => {
    if (activeCall) {
      updateCallState(callState);
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
    switch (callState) {
      case "incoming": return "Incoming call…";
      case "dialing": return "Dialing…";
      case "ringing": return "Ringing…";
      case "connecting": return "Connecting…";
      case "reconnecting": return "Reconnecting…";
      case "connected": return (actualType === "voice" ? `Voice • ${hhmmss}` : `Video • ${hhmmss}`);
      default: return "";
    }
  }, [callState, actualType, hhmmss]);

  // If showing calls list, render list view (after all hooks)
  if (showCallList) {
    return (
      <>
        <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none`}</style>
        <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: 'background.default' }}>
          <AppBar elevation={0} position="static" sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom: `1px solid ${muiTheme.palette.divider}` }}>
            <Toolbar className="!min-h-[56px]">
              <Typography variant="h6" className="font-bold ml-1" sx={{ color: 'text.primary' }}>Calls</Typography>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton onClick={()=>onNavigate?.('/new-message')} aria-label="New call" sx={{ color: accentColor }}>
                <CallRoundedIcon />
              </IconButton>
            </Toolbar>
          </AppBar>

          <Box className="flex-1" sx={{ overflowY:'auto', '&::-webkit-scrollbar':{ display:'none' }, scrollbarWidth:'none', msOverflowStyle:'none' }}>
            <List>
              {CALLS.map((call, idx) => (
                <React.Fragment key={call.id}>
                  <ListItem 
                    button 
                    onClick={()=>onNavigate?.(`/call?type=${call.type}&contact=${encodeURIComponent(call.name)}&state=dialing`)}
                  >
                    <ListItemAvatar>
                      <Avatar src={call.avatar} />
                    </ListItemAvatar>
                    <ListItemTextComp
                      primary={
                        <div className="flex items-center gap-2">
                          <span className="font-semibold" style={{ color: muiTheme.palette.text.primary }}>{call.name}</span>
                          {call.missed && <Chip size="small" label="Missed" sx={{ bgcolor: '#e53935', color: '#fff', height: 18, fontSize: '10px' }} />}
                          <span className="text-xs ml-auto" style={{ color: muiTheme.palette.text.secondary }}>{call.time}</span>
                        </div>
                      }
                      secondary={
                        <div className="flex items-center gap-2 mt-0.5">
                          {call.type === 'video' ? (
                            <VideocamRoundedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          ) : call.type === 'conference' ? (
                            <GroupsRoundedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          ) : (
                            <CallRoundedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          )}
                          <span className="text-[12px]" style={{ color: muiTheme.palette.text.secondary }}>{call.duration}</span>
                        </div>
                      }
                    />
                  </ListItem>
                  {idx < CALLS.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        </Box>
      </>
    );
  }

  // Render call interface
  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none`}</style>

      {/* Call interface - Always dark background regardless of theme */}
      <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: '#000 !important', color: '#fff', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1300 }}>
        {/* Header */}
        <AppBar elevation={0} position="static" sx={{ bgcolor: "rgba(0,0,0,0.55) !important", color: "#fff" }}>
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={() => {
              // Don't end call, just navigate back - call banner will appear
              onBack?.();
            }} aria-label="Back" sx={{ color: "#fff" }}>
              <ArrowBackRoundedIcon />
            </IconButton>
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 600, fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {actualRemote.name}
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)", fontSize: '0.6875rem' }}>
                {status}
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton aria-label="More" onClick={(e)=>setMenuEl(e.currentTarget)} sx={{ color: "#fff" }}>
              <MoreVertRoundedIcon />
            </IconButton>
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
              width: '90vw', 
              maxWidth: "calc(100vw - 1rem)", 
              borderRadius: 2, 
              py: 0.5, 
              mx: "auto",
              bgcolor: 'background.paper',
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
          <MenuItem onClick={()=>{ 
            setMenuEl(null); 
            // Navigate to group call participants (for group calls)
            onNavigate?.('/group-call');
          }}>
            <ListItemIcon><PeopleAltRoundedIcon fontSize="small" sx={{ color: 'text.primary' }}/></ListItemIcon>
            <ListItemText primary="View participants" />
          </MenuItem>
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
                    width: '7rem',
                    height: '10rem',
                    top: `${pip.y}px`,
                    left: `${pip.x}px`,
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    cursor: 'move',
                    zIndex: 100,
                    userSelect: 'none',
                    touchAction: 'none'
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
                    width: '7rem',
                    height: '10rem',
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
                    touchAction: 'none'
                  }}
                  onMouseDown={onPipDown}
                  onTouchStart={onPipDown}
                  aria-label="Camera off - Drag to move"
                >
                  <Avatar src="https://i.pravatar.cc/100?img=20" sx={{ width: '4rem', height: '4rem' }} />
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
                      <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>
                        {actualRemote.name}
                      </Typography>
                      <Box className="px-4 py-2 rounded-full backdrop-blur" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.875rem', fontWeight: 500 }}>
                        {status}
                      </Box>
                      {callState === "ringing" && (
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>
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
                {callState !== "connected" && callState !== "incoming" ? (
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
                      <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>
                        {actualRemote.name}
                      </Typography>
                      <Box className="px-4 py-2 rounded-full backdrop-blur" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.875rem', fontWeight: 500 }}>
                        {status}
                      </Box>
                      {callState === "ringing" && (
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>
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
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>
                        {callState === "connected" ? `Connected • ${hhmmss}` : status}
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

        {/* Controls (glass) - Always visible at bottom */}
        <Box className="fixed inset-x-0 bottom-0 z-10 flex justify-center" sx={{ pb: "env(safe-area-inset-bottom)" }}>
          <Box className="w-full px-3 pb-3">
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              bgcolor: 'rgba(255,255,255,0.1)', 
              borderRadius: 2, 
              px: 3, 
              py: 2, 
              backdropFilter: 'blur(12px)',
              gap: 1,
              flexWrap: 'wrap'
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
                  bgcolor: muted ? 'rgba(255,255,255,0.2)' : 'transparent'
                }}
              >
                {muted ? <MicOffRoundedIcon/> : <MicNoneRoundedIcon/>}
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
                    bgcolor: !camOn ? 'rgba(255,255,255,0.2)' : 'transparent'
                  }}
                >
                  {camOn ? <VideocamRoundedIcon/> : <VideocamOffRoundedIcon/>}
                </IconButton>
              )}

              {/* flip camera (video) */}
              {actualType === "video" && (
                <IconButton 
                  onClick={()=>{
                    alert('Camera flipped');
                  }} 
                  aria-label="Flip camera" 
                  sx={{ color:"#fff", flexShrink: 0 }}
                >
                  <FlipCameraAndroidRoundedIcon/>
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
                  bgcolor: speakerMode === 'loud' ? 'rgba(255,255,255,0.2)' : 'transparent'
                }}
              >
                {speakerMode === 'loud' ? <VolumeUpRoundedIcon/> : <VolumeDownRoundedIcon/>}
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
                    bgcolor: sharing ? 'rgba(255,255,255,0.2)' : 'transparent'
                  }}
                >
                  <ScreenShareRoundedIcon/>
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
                  bgcolor: captions ? 'rgba(255,255,255,0.2)' : 'transparent'
                }}
              >
                <ClosedCaptionRoundedIcon/>
              </IconButton>

              {/* open chat */}
              <IconButton 
                onClick={()=>{
                  onNavigate?.(`/conversation/${encodeURIComponent(actualRemote.name)}`);
                  onOpenChat?.();
                }} 
                aria-label="Open chat" 
                sx={{ color:"#fff", flexShrink: 0 }}
              >
                <ChatBubbleOutlineRoundedIcon/>
              </IconButton>

              {/* network quality (static demo) */}
              <IconButton 
                aria-label="Network quality: Good"
                sx={{ color:"#fff", flexShrink: 0 }}
              >
                <SignalCellularAltRoundedIcon/>
              </IconButton>

              {/* end call - Always visible and prominent - MUST end call */}
              <IconButton 
                onClick={() => {
                  // End call immediately
                  endCall(); // End call in global context first
                  setCallState("dialing"); // Reset state
                  setElapsed(0);
                  onEnd?.(); // Call onEnd callback
                  // Navigate back after a brief delay to ensure state is cleared
                  setTimeout(() => {
                    onNavigate?.(-1);
                  }, 100);
                }} 
                aria-label="End call" 
                sx={{ 
                  color:"#fff", 
                  bgcolor:"#e53935", 
                  "&:hover":{ bgcolor:"#c62828" },
                  "&:active":{ bgcolor:"#b71c1c", transform: 'scale(0.95)' },
                  width: '3rem',
                  height: '3rem',
                  flexShrink: 0,
                  transition: 'all 0.2s ease'
                }}
              >
                <CallEndRoundedIcon sx={{ fontSize: 24 }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
