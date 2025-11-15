import React, { useEffect, useRef, useState, useMemo } from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Avatar,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  InputAdornment,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  Snackbar
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import ScreenShareRoundedIcon from "@mui/icons-material/ScreenShareRounded";
import StopScreenShareRoundedIcon from "@mui/icons-material/StopScreenShareRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import PauseCircleOutlineRoundedIcon from "@mui/icons-material/PauseCircleOutlineRounded";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import ClosedCaptionRoundedIcon from "@mui/icons-material/ClosedCaptionRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

/**
 * U05-13 — Screenshare + In‑meeting Chat (pro, mobile)
 * - Start/stop screen share (getDisplayMedia)
 * - Pause/resume by disabling the video track
 * - Switch source (stop then prompt again)
 * - Right-side chat drawer with sticky composer
 * - Mobile-sized header menu, safe‑area insets, 390px frame
 */
export default function ScreenshareWithChatPro({ onBack, remote = { name:'Group Call' } }) {
  const muiTheme = useMuiTheme();
  const [sharing, setSharing] = useState(false);
  const [paused, setPaused] = useState(false);
  const [captions, setCaptions] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [menuEl, setMenuEl] = useState(null);
  const [messages, setMessages] = useState([
    { id: 'm1', who: { name:'Leslie', avatar:'https://i.pravatar.cc/100?img=5' }, text:'We are starting screen share now', time:'07:41' },
  ]);
  const [text, setText] = useState("");
  const [snack, setSnack] = useState("");
  const [err, setErr] = useState("");

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const videoTrackRef = useRef(null);

  const status = useMemo(() => {
    if (!sharing) return 'Not sharing';
    if (paused) return 'Paused';
    return 'Sharing screen';
  }, [sharing, paused]);

  const startShare = async () => {
    setErr("");
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        setErr('Screen share not supported on this device');
        return;
      }
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      streamRef.current = stream;
      const [vTrack] = stream.getVideoTracks();
      videoTrackRef.current = vTrack || null;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setSharing(true);
      setPaused(false);
      if (vTrack) vTrack.addEventListener('ended', handleUserEnded);
    } catch (e) {
      setErr('Failed to start screen share');
    }
  };

  const stopShare = () => {
    const s = streamRef.current;
    if (s) {
      s.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    videoTrackRef.current = null;
    setSharing(false);
    setPaused(false);
    setSnack('Screen share stopped');
  };

  const pauseResume = () => {
    const vt = videoTrackRef.current;
    if (!vt) return;
    vt.enabled = !vt.enabled;
    setPaused(vt.enabled === false);
  };

  const switchSource = async () => {
    stopShare();
    await startShare();
    setSnack('Source switched');
  };

  const handleUserEnded = () => {
    stopShare();
  };

  const send = () => {
    const t = text.trim();
    if (!t) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `m${Date.now()}`,
        who: { name: 'You', avatar: 'https://i.pravatar.cc/100?img=2' },
        text: t,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setText("");
  };

  useEffect(() => {
    if (!snack) return;
    const to = setTimeout(() => setSnack(""), 1400);
    return () => clearTimeout(to);
  }, [snack]);

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full mx-auto bg-black text-white flex flex-col">
        {/* Header */}
        <AppBar elevation={0} position="fixed" sx={{ bgcolor: 'rgba(0,0,0,0.55)' }}>
          <Toolbar className="!min-h-[56px]" sx={{ px: { xs: 1.5, sm: 3 } }}>
            <IconButton onClick={onBack} aria-label="Back" sx={{ color: '#fff', padding: { xs: '6px', sm: '8px' } }}>
              <ArrowBackRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <div className="flex flex-col" style={{ minWidth: 0, flex: 1 }}>
              <span className="font-semibold" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '14px' }}>{remote.name}</span>
              <span style={{ fontSize: '11px', opacity: 0.8 }}>{status}{captions ? ' • Captions on' : ''}</span>
            </div>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton aria-label="Chat" onClick={() => setChatOpen(true)} sx={{ color: '#fff', padding: { xs: '6px', sm: '8px' } }}>
              <ChatRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <IconButton aria-label="More" onClick={(e) => setMenuEl(e.currentTarget)} sx={{ color: '#fff', padding: { xs: '6px', sm: '8px' } }}>
              <MoreVertRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Body */}
        <Box className="flex-1 pt-[56px] pb-[88px] relative">
          {sharing ? (
            <>
              <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-contain" />
              {paused && (
                <div className="absolute inset-0 grid place-items-center">
                  <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-sm">Paused</div>
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center opacity-90">
                <div className="text-sm mb-3">Tap to start sharing your screen</div>
                <Button onClick={startShare} variant="contained" sx={{ bgcolor: EV.orange, textTransform: 'none', '&:hover': { bgcolor: '#e06f00' } }} startIcon={<ScreenShareRoundedIcon />}>Start share</Button>
                {err && <div className="mt-3 text-xs text-red-300">{err}</div>}
              </div>
            </div>
          )}
        </Box>

        {/* Bottom controls */}
        <Box className="fixed inset-x-0 bottom-0 z-10 flex justify-center" sx={{ pb: 'env(safe-area-inset-bottom)' }}>
          <Box className="w-full" sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
            <div className="flex items-center justify-between bg-white/10 rounded-2xl backdrop-blur" style={{ padding: '8px 12px', gap: '8px', flexWrap: 'wrap' }}>
              {!sharing ? (
                <Button onClick={startShare} startIcon={<ScreenShareRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform: 'none', fontSize: { xs: '12px', sm: '14px' }, py: { xs: 0.5, sm: 0.75 } }}>Start share</Button>
              ) : (
                <>
                  <Button onClick={pauseResume} startIcon={paused ? <PlayCircleOutlineRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} /> : <PauseCircleOutlineRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />} variant="outlined" sx={{ borderColor: '#fff', color: '#fff', textTransform: 'none', fontSize: { xs: '12px', sm: '14px' }, py: { xs: 0.5, sm: 0.75 } }}>{paused ? 'Resume' : 'Pause'}</Button>
                  <Button onClick={switchSource} startIcon={<SwapHorizRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />} variant="outlined" sx={{ borderColor: '#fff', color: '#fff', textTransform: 'none', fontSize: { xs: '12px', sm: '14px' }, py: { xs: 0.5, sm: 0.75 } }}>Switch source</Button>
                  <Button onClick={stopShare} startIcon={<StopScreenShareRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />} variant="contained" sx={{ bgcolor: '#e53935', textTransform: 'none', fontSize: { xs: '12px', sm: '14px' }, py: { xs: 0.5, sm: 0.75 }, '&:hover': { bgcolor: '#c62828' } }}>Stop share</Button>
                </>
              )}
            </div>
          </Box>
        </Box>
      </Box>

      {/* Header overflow menu (mobile-sized) */}
      <Menu
        anchorEl={menuEl}
        open={Boolean(menuEl)}
        onClose={() => setMenuEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { 
            width: '90vw', 
            maxWidth: 'calc(100vw - 1rem)', 
            borderRadius: 2, 
            py: 0.5, 
            mx: 'auto',
            bgcolor: 'background.paper',
            '& .MuiMenuItem-root': {
              color: 'text.primary',
            }
          }
        }}
      >
        <MenuItem onClick={() => { setMenuEl(null); setCaptions(c => !c); }}>
          <ListItemIcon><ClosedCaptionRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary={captions ? 'Disable captions' : 'Enable captions'} />
        </MenuItem>
        <MenuItem onClick={() => { setMenuEl(null); setChatOpen(true); }}>
          <ListItemIcon><ChatRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Open chat" />
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={() => { setMenuEl(null); setSnack('Help opened'); }}>
          <ListItemIcon><HelpOutlineRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Help" />
        </MenuItem>
      </Menu>

      {/* Chat drawer */}
      <Drawer anchor="right" open={chatOpen} onClose={() => setChatOpen(false)}
        PaperProps={{ sx: { width: '86vw', maxWidth: '90vw' } }}
      >
        <Box className="h-full flex flex-col" sx={{ bgcolor: 'background.paper' }}>
          <Box className="px-3 py-2 border-b" sx={{ borderColor: 'divider' }}>
            <div className="flex items-center gap-2">
              <Avatar src="https://i.pravatar.cc/100?img=5" />
              <div className="flex-1">
                <div className="font-semibold" style={{ color: muiTheme.palette.text.primary }}>In‑meeting chat</div>
                <div className="text-[11px]" style={{ color: muiTheme.palette.text.secondary }}>Only participants can see messages</div>
              </div>
              <IconButton onClick={() => setChatOpen(false)} sx={{ color: 'text.primary' }}><ArrowBackRoundedIcon /></IconButton>
            </div>
          </Box>
          <Box className="flex-1 p-3 no-scrollbar" sx={{ overflowY: 'auto' }}>
            <List>
              {messages.map((m, idx) => (
                <React.Fragment key={m.id}>
                  <ListItem 
                    alignItems="flex-start"
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: 'text.primary',
                      },
                      '& .MuiListItemText-secondary': {
                        color: 'text.secondary',
                      },
                    }}
                  >
                    <ListItemAvatar><Avatar src={m.who.avatar} /></ListItemAvatar>
                    <ListItemText
                      primary={<span className="font-semibold">{m.who.name}</span>}
                      secondary={<span className="text-[12px]">{m.text}</span>}
                    />
                    <span className="text-[11px] ml-2" style={{ color: muiTheme.palette.text.secondary }}>{m.time}</span>
                  </ListItem>
                  {idx < messages.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Box>
          {/* composer sticky */}
          <Box className="border-t" sx={{ borderColor: 'divider' }}>
            <Box className="p-2 flex items-end gap-1">
              <TextField
                fullWidth
                size="small"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    color: 'text.primary',
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'text.secondary',
                    opacity: 1,
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label="Send" onClick={send} sx={{ textTransform: 'none' }}>
                        <SendRoundedIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Box>
          </Box>
        </Box>
      </Drawer>

      <Snackbar open={!!snack} message={snack} onClose={() => setSnack('')} autoHideDuration={1400} />
    </>
  );
}

/*
  ===== Tests (React Testing Library) — quick sanity =====

  import React from 'react';
  import { render, screen, fireEvent } from '@testing-library/react';
  import ScreenshareWithChatPro from './ScreenshareWithChatPro';

  test('renders header and status', () => {
    render(<ScreenshareWithChatPro />);
    expect(screen.getByText(/Group Call/i)).toBeInTheDocument();
    expect(screen.getByText(/Not sharing/i)).toBeInTheDocument();
  });

  test('opens menu', () => {
    render(<ScreenshareWithChatPro />);
    fireEvent.click(screen.getByLabelText(/More/i));
    expect(screen.getByText(/Enable captions/i)).toBeInTheDocument();
  });
*/
