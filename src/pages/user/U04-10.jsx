import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
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
import CallEndRoundedIcon from "@mui/icons-material/CallEndRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import ClosedCaptionRoundedIcon from "@mui/icons-material/ClosedCaptionRounded";
import SignalCellularAltRoundedIcon from "@mui/icons-material/SignalCellularAltRounded";

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
  ];

  // All hooks must be called before any conditional returns
  const muiTheme = useMuiTheme();
  // Toggles (uncontrolled defaults)
  const [muted, setMuted] = useState(false);
  const [camOn, setCamOn] = useState(actualType === "video");
  // eslint-disable-next-line no-unused-vars
  const [speaker, setSpeaker] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [sharing, setSharing] = useState(flags.share);
  const [captions, setCaptions] = useState(flags.captions);
  const [menuEl, setMenuEl] = useState(null);

  // Timer for connected
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (state !== "connected") return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [state]);
  const hhmmss = useMemo(
    () => `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`,
    [elapsed]
  );

  // PiP drag (video)
  const pipRef = useRef(null);
  const [pip, setPip] = useState({ x: 12, y: 12 });
  const drag = useRef({ active: false, sx: 0, sy: 0, ox: 0, oy: 0, t0: 0, taps: 0 });
  const onPipDown = (e) => {
    const t = ("touches" in e ? e.touches?.[0] : e);
    drag.current = { active: true, sx: t.clientX, sy: t.clientY, ox: pip.x, oy: pip.y, t0: Date.now(), taps: drag.current.taps };
  };
  const onPipMove = (e) => {
    if (!drag.current.active) return;
    const t = ("touches" in e ? e.touches?.[0] : e);
    const container = pipRef.current?.parentElement;
    const containerWidth = container?.offsetWidth || window.innerWidth;
    const containerHeight = container?.offsetHeight || window.innerHeight;
    const pipWidth = 112; // w-28 = 7rem = 112px
    const pipHeight = 160; // h-40 = 10rem = 160px
    setPip({ x: Math.max(12, Math.min(containerWidth - pipWidth - 12, drag.current.ox + (t.clientX - drag.current.sx))),
             y: Math.max(12, Math.min(containerHeight - pipHeight - 12, drag.current.oy + (t.clientY - drag.current.sy))) });
  };
  const onPipUp = (e) => {
    if (!drag.current.active) return;
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

  // Derived label
  const status = useMemo(() => {
    switch (state) {
      case "incoming": return "Incoming call…";
      case "dialing": return "Dialing…";
      case "ringing": return "Ringing…";
      case "connecting": return "Connecting…";
      case "reconnecting": return "Reconnecting…";
      case "connected": return (actualType === "voice" ? `Voice • ${hhmmss}` : `Video • ${hhmmss}`);
      default: return "";
    }
  }, [state, actualType, hhmmss]);

  // If showing calls list, render list view (after all hooks)
  if (showCallList) {
    return (
      <>
        <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none`}</style>
        <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: 'background.paper' }}>
          <AppBar elevation={0} position="static" sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom: `1px solid ${muiTheme.palette.divider}` }}>
            <Toolbar className="!min-h-[56px]">
              <Typography variant="h6" className="font-bold ml-1">Calls</Typography>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton onClick={()=>onNavigate?.('/new-message')} aria-label="New call" sx={{ color: EV.orange }}>
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
                    onClick={()=>onNavigate?.(`/call?type=${call.type}&contact=${encodeURIComponent(call.name)}`)}
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
                          {call.type === 'video' ? <VideocamRoundedIcon sx={{ fontSize: 14, color: 'text.secondary' }} /> : <CallRoundedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />}
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

      <Box className="w-full h-full mx-auto bg-black text-white flex flex-col">
        {/* Header */}
        <AppBar elevation={0} position="static" sx={{ bgcolor: "rgba(0,0,0,0.55)", color: "#fff" }}>
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={onBack} aria-label="Back" sx={{ color: "#fff" }}>
              <ArrowBackRoundedIcon />
            </IconButton>
            <div className="flex flex-col">
              <span className="font-semibold -mb-0.5" style={{ whiteSpace: "nowrap" }}>{actualRemote.name}</span>
              <span className="text-[11px] opacity-80">{status}</span>
            </div>
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
          <MenuItem onClick={()=>{ setMenuEl(null); setCaptions(c=>!c); }}>
            <ListItemIcon><ClosedCaptionRoundedIcon fontSize="small"/></ListItemIcon>
            <ListItemText primary={captions? "Disable captions" : "Enable captions"} />
          </MenuItem>
          <MenuItem onClick={()=>{ setMenuEl(null); onOpenChat?.(); }}>
            <ListItemIcon><ChatBubbleOutlineRoundedIcon fontSize="small"/></ListItemIcon>
            <ListItemText primary="Open chat" />
          </MenuItem>
          <MenuItem onClick={()=>{ setMenuEl(null); onReport?.(); }}>
            <ListItemIcon><SignalCellularAltRoundedIcon fontSize="small"/></ListItemIcon>
            <ListItemText primary="Report quality" />
          </MenuItem>
          <MenuItem onClick={()=>{ setMenuEl(null); onHelp?.(); }}>
            <ListItemIcon><ArrowBackRoundedIcon fontSize="small"/></ListItemIcon>
            <ListItemText primary="Help" />
          </MenuItem>
        </Menu>

        {/* Body */}
        <Box className="flex-1 relative">
          {actualType === "video" ? (
            <>
              {/* Remote feed (placeholder) */}
              <Box className="absolute inset-0 bg-black grid place-items-center">
                <video className="w-full h-full object-cover" muted loop autoPlay playsInline>
                  <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" type="video/webm" />
                </video>
              </Box>

              {/* Local preview (PiP) */}
              <div
                ref={pipRef}
                className="absolute w-28 h-40 rounded-xl overflow-hidden shadow-lg border"
                style={{ bottom: pip.y, right: pip.x, borderColor: "rgba(255,255,255,0.2)" }}
                onMouseDown={onPipDown} onMouseMove={onPipMove} onMouseUp={onPipUp}
                onTouchStart={onPipDown} onTouchMove={onPipMove} onTouchEnd={onPipUp}
                aria-label="Local preview"
              >
                <video className="w-full h-full object-cover" muted loop autoPlay playsInline>
                  <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" type="video/webm" />
                </video>
              </div>

              {/* Dialing/connecting overlays */}
              {state !== "connected" && (
                <div className="absolute inset-0 grid place-items-center">
                  <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-sm">{status}</div>
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <div className="flex flex-col items-center gap-2">
                <Avatar src={actualRemote.avatar} sx={{ width: '6.5rem', height: '6.5rem' }} />
                <div className="text-sm opacity-80">{state === "connected" ? `Connected • ${hhmmss}` : status}</div>
              </div>
            </div>
          )}

          {/* Incoming sheet */}
          {state === "incoming" && (
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

        {/* Controls (glass) */}
        <Box className="fixed inset-x-0 bottom-0 z-10 flex justify-center" sx={{ pb: "env(safe-area-inset-bottom)" }}>
          <Box className="w-full px-3 pb-3">
            <div className="flex items-center justify-between bg-white/10 rounded-2xl px-3 py-2 backdrop-blur">
              {/* mic */}
              <IconButton onClick={()=>setMuted(m=>!m)} aria-label="Mute" sx={{ color:"#fff" }}>
                {muted ? <MicOffRoundedIcon/> : <MicNoneRoundedIcon/>}
              </IconButton>

              {/* camera (video) */}
              {actualType === "video" && (
                <IconButton onClick={()=>setCamOn(c=>!c)} aria-label="Camera" sx={{ color:"#fff" }}>
                  {camOn ? <VideocamRoundedIcon/> : <VideocamOffRoundedIcon/>}
                </IconButton>
              )}

              {/* flip camera (video) */}
              {actualType === "video" && (
                <IconButton onClick={()=>{/* flip camera */}} aria-label="Flip camera" sx={{ color:"#fff" }}>
                  <FlipCameraAndroidRoundedIcon/>
                </IconButton>
              )}

              {/* speaker (voice) */}
              <IconButton onClick={()=>setSpeaker(s=>!s)} aria-label="Speaker" sx={{ color:"#fff" }}>
                <VolumeUpRoundedIcon/>
              </IconButton>

              {/* share (video) */}
              {actualType === "video" && (
                <IconButton onClick={()=>setSharing(v=>!v)} aria-label="Share screen" sx={{ color:"#fff" }}>
                  <ScreenShareRoundedIcon/>
                </IconButton>
              )}

              {/* captions */}
              <IconButton onClick={()=>setCaptions(c=>!c)} aria-label="Captions" sx={{ color:"#fff" }}>
                <ClosedCaptionRoundedIcon/>
              </IconButton>

              {/* open chat */}
              <IconButton onClick={()=>onOpenChat?.()} aria-label="Chat" sx={{ color:"#fff" }}>
                <ChatBubbleOutlineRoundedIcon/>
              </IconButton>

              {/* network quality (static demo) */}
              <IconButton aria-label="Network quality" sx={{ color:"#fff" }}>
                <SignalCellularAltRoundedIcon/>
              </IconButton>

              {/* end call */}
              <IconButton onClick={onEnd} aria-label="End call" sx={{ color:"#fff", bgcolor:"#e53935", "&:hover":{ bgcolor:"#c62828" } }}>
                <CallEndRoundedIcon/>
              </IconButton>
            </div>
          </Box>
        </Box>
      </Box>
    </>
  );
}
