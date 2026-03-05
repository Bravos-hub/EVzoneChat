import { useState, useEffect, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useCall } from "../../context/CallContext";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider
} from "@mui/material";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import MicOffRoundedIcon from "@mui/icons-material/MicOffRounded";
import MicNoneRoundedIcon from "@mui/icons-material/MicNoneRounded";
import VideocamOffRoundedIcon from "@mui/icons-material/VideocamOffRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import CallEndRoundedIcon from "@mui/icons-material/CallEndRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import SignalCellularAltRoundedIcon from "@mui/icons-material/SignalCellularAltRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

// Extended demo data to simulate many participants (like Zoom)
const DEMO = [
  { id:'u1', name:'Eduardo', avatar:'https://i.pravatar.cc/100?img=10', video:true, muted:false, active:true, role:'host' },
  { id:'u2', name:'Kayle', avatar:'https://i.pravatar.cc/100?img=11', video:true, muted:true, active:false, role:'cohost' },
  { id:'u3', name:'Richards', avatar:'https://i.pravatar.cc/100?img=12', video:true, muted:false, active:true, role:'member' },
  { id:'u4', name:'KB', avatar:'https://i.pravatar.cc/100?img=13', video:false, muted:true, active:false, role:'member' },
  { id:'u5', name:'Samira', avatar:'https://i.pravatar.cc/100?img=14', video:true, muted:false, active:false, role:'member' },
  { id:'u6', name:'Chen', avatar:'https://i.pravatar.cc/100?img=15', video:true, muted:true, active:false, role:'member' },
  { id:'u7', name:'Diana', avatar:'https://i.pravatar.cc/100?img=16', video:false, muted:false, active:false, role:'member' },
  { id:'u8', name:'Miguel', avatar:'https://i.pravatar.cc/100?img=17', video:true, muted:false, active:false, role:'member' },
  { id:'u9', name:'Fatima', avatar:'https://i.pravatar.cc/100?img=18', video:true, muted:true, active:false, role:'member' },
  { id:'u10', name:'Omar', avatar:'https://i.pravatar.cc/100?img=19', video:false, muted:false, active:false, role:'member' },
  { id:'u11', name:'VD', avatar:'https://i.pravatar.cc/100?img=20', video:true, muted:false, active:false, role:'member' },
  { id:'u12', name:'Alex', avatar:'https://i.pravatar.cc/100?img=21', video:true, muted:true, active:false, role:'member' },
  { id:'u13', name:'Sarah', avatar:'https://i.pravatar.cc/100?img=22', video:false, muted:false, active:false, role:'member' },
  { id:'u14', name:'Mike', avatar:'https://i.pravatar.cc/100?img=23', video:true, muted:false, active:false, role:'member' },
];

/**
 * U04-11 — Group Call Participants Panel
 * Mobile-first group video call interface with participants management
 */
export default function GroupCallParticipants({ onBack, onNavigate, onEnd, location, layoutMode = 'mobile' }) {
  const { accentColor } = useTheme();
  const { endCall, activeCall } = useCall();
  const isDesktopLayout = layoutMode === 'desktop';
  const [open, setOpen] = useState(false);
  const [people, setPeople] = useState(DEMO);
  const [menuEl, setMenuEl] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const [videoOn, setVideoOn] = useState(true);

  // Close participants view when call ends
  useEffect(() => {
    if (!activeCall) {
      setOpen(false);
    }
  }, [activeCall]);

  // Get call type from URL
  const callType = useMemo(() => {
    const params = new URLSearchParams(location?.search || '');
    return params.get('type') || 'video';
  }, [location]);

  // Get contact/group name from URL
  const contactName = useMemo(() => {
    const params = new URLSearchParams(location?.search || '');
    return params.get('contact') || 'Group Chat';
  }, [location]);

  const isVideoCall = callType === 'video';

  // Timer for call duration
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Zoom-like layout: Separate active speakers/hosts from others
  const { spotlightParticipants, otherParticipants, remainingCount } = useMemo(() => {
    // Get active speakers (active: true) and hosts/cohosts first - prioritize active speakers
    const activeSpeakers = people.filter(p => p.active);
    const hostsCohosts = people.filter(p => (p.role === 'host' || p.role === 'cohost') && !p.active);
    
    // Combine: active speakers first, then hosts/cohosts
    const active = [...activeSpeakers, ...hostsCohosts];
    
    // Get others (members who are not active)
    const others = people.filter(p => !p.active && p.role === 'member');
    
    // Show up to 4 in spotlight (like Zoom)
    const spotlight = active.slice(0, 4);
    // Show up to 8 others in smaller tiles
    const othersVisible = others.slice(0, 8);
    // Calculate remaining count (all people minus what's visible)
    const totalVisible = spotlight.length + othersVisible.length;
    const remaining = Math.max(0, people.length - totalVisible);
    
    return {
      spotlightParticipants: spotlight,
      otherParticipants: othersVisible,
      remainingCount: remaining
    };
  }, [people]);

  // Format time as MM:SS
  const timeString = useMemo(() => {
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, [elapsed]);

  const promote = (id) => setPeople(ps => ps.map(p => p.id===id ? { ...p, role:'cohost' } : p));
  const remove = (id) => setPeople(ps => ps.filter(p => p.id!==id));


  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box
        className="w-full h-full bg-black flex flex-col"
        sx={{
          width: '100%',
          height: '100%',
          minHeight: 0,
          maxWidth: isDesktopLayout ? 'none' : '24rem',
          mx: isDesktopLayout ? 0 : 'auto',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <AppBar elevation={0} position="static" sx={{ bgcolor:'rgba(0,0,0,0.55)', color:'#fff' }}>
          <Toolbar className="!min-h-[56px]" sx={{ px: { xs: 1.5, sm: 3 } }}>
            <IconButton onClick={() => {
              onBack?.();
            }} aria-label="Back" sx={{ color:'#fff', padding: { xs: '6px', sm: '8px' } }}>
              <ArrowBackRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <Box sx={{ flex: 1, minWidth: 0, ml: 1 }}>
              <Typography variant="h6" className="font-bold" sx={{ fontSize: { xs: '16px', sm: '18px' }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {isVideoCall ? 'Group Call' : 'Group Call'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: { xs: '11px', sm: '12px' } }}>
                {isVideoCall ? 'Video' : 'Voice'} • {timeString}
              </Typography>
            </Box>
            <IconButton 
              aria-label="More options" 
              onClick={(e) => setMenuEl(e.currentTarget)} 
              sx={{ color:'#fff', padding: { xs: '6px', sm: '8px' }, mr: { xs: 0.5, sm: 1 } }}
            >
              <MoreVertRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <IconButton aria-label="Participants" onClick={()=>setOpen(true)} sx={{ color:'#fff', padding: { xs: '6px', sm: '8px' } }}>
              <PeopleAltRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Menu */}
        <Menu
          anchorEl={menuEl}
          open={Boolean(menuEl)}
          onClose={() => setMenuEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              width: { xs: '90vw', sm: 280 },
              maxWidth: "calc(100vw - 16px)",
              borderRadius: 2,
              py: 0.5,
              bgcolor: 'background.paper',
              '& .MuiMenuItem-root': {
                color: 'text.primary',
              }
            }
          }}
        >
          <MenuItem
            onClick={() => {
              setMenuEl(null);
              onNavigate?.('/conversation/new');
            }}
          >
            <ListItemIcon>
              <ChatBubbleOutlineRoundedIcon fontSize="small" sx={{ color: 'text.primary' }} />
            </ListItemIcon>
            <ListItemText primary="Open call chat" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              setMenuEl(null);
              alert('Quality report submitted. Thank you for your feedback!');
            }}
          >
            <ListItemIcon>
              <SignalCellularAltRoundedIcon fontSize="small" sx={{ color: 'text.primary' }} />
            </ListItemIcon>
            <ListItemText primary="Report call quality" />
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem
            onClick={() => {
              setMenuEl(null);
              onNavigate?.('/help');
            }}
          >
            <ListItemIcon>
              <HelpOutlineRoundedIcon fontSize="small" sx={{ color: 'text.primary' }} />
            </ListItemIcon>
            <ListItemText primary="Help" />
          </MenuItem>
        </Menu>

        {/* Main content area - Side by side layout when participants view is open */}
        <Box 
          className="flex-1 flex"
          sx={{ 
            overflow: 'hidden',
            position: 'relative',
            flexDirection: isDesktopLayout ? 'row' : { xs: 'column', sm: 'row' }
          }}
        >
          {/* Video Grid Area - Zoom-like layout */}
          <Box
            sx={{ 
              position: 'relative',
              width: open ? { xs: '100%', sm: '60%', md: '65%' } : '100%',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              pb: isDesktopLayout ? '112px' : { xs: '90px', sm: '100px' }, // Space for controls
              borderRight: open ? { xs: 'none', sm: '1px solid rgba(255,255,255,0.1)' } : 'none',
              transition: 'width 0.3s ease'
            }}
          >

            <Box 
              className="flex-1" 
              onClick={(e) => {
                if (open) {
                  e.stopPropagation();
                  setOpen(false);
                }
              }}
              sx={{ 
                overflowY: 'auto',
                '&::-webkit-scrollbar': { display: 'none' },
                scrollbarWidth: 'none',
                minHeight: 0
              }}
            >
              {/* Spotlight Participants - Larger tiles (like Zoom) */}
              {spotlightParticipants.length > 0 && (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: spotlightParticipants.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                      sm: spotlightParticipants.length <= 2 ? 'repeat(2, 1fr)' : 
                          spotlightParticipants.length === 3 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
                      md: spotlightParticipants.length <= 2 ? 'repeat(2, 1fr)' : 
                          spotlightParticipants.length === 3 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)'
                    },
                    gap: { xs: 1, sm: 1.5, md: 2 },
                    p: { xs: 1.5, sm: 2, md: 2.5 },
                    pt: { xs: 1.5, sm: 2, md: 2.5 }
                  }}
                >
                  {spotlightParticipants.map((p) => (
                    <Box 
                      key={p.id} 
                      className={`relative rounded-xl overflow-hidden bg-black border ${p.active ? 'ring-2' : ''}`} 
                      sx={{ 
                        borderColor: 'rgba(255,255,255,0.15)', 
                        boxShadow: p.active ? `0 0 0 2px ${accentColor}` : undefined,
                        aspectRatio: '16/9',
                        minHeight: { xs: '140px', sm: '180px', md: '220px' },
                        width: '100%'
                      }}
                    >
              <img src={`https://images.unsplash.com/photo-1526178611301-1e3f6dc1f1ae?q=80&w=600&auto=format&fit=crop`} alt="feed" className="w-full h-full object-cover" />
              {!p.video && (
                <div className="absolute inset-0 grid place-items-center bg-black/60">
                          <Avatar src={p.avatar} sx={{ width: 64, height: 64 }} />
                </div>
              )}
              <div className="absolute left-2 bottom-2 right-2 flex items-center text-white" style={{ gap: '4px' }}>
                        <Avatar src={p.avatar} sx={{ width: { xs: 20, sm: 24 }, height: { xs: 20, sm: 24 } }} />
                        <span className="truncate" style={{ fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, fontWeight: 500 }}>{p.name}</span>
                        {p.muted && <MicOffRoundedIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />}
                        {!p.video && <VideocamOffRoundedIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />}
                        {p.role !== 'member' && (
                          <Chip 
                            size="small" 
                            label={p.role} 
                            sx={{ 
                              height: { xs: 18, sm: 20 }, 
                              fontSize: { xs: '9px', sm: '10px' }, 
                              bgcolor: accentColor, 
                              color: '#fff', 
                              ml: 'auto',
                              textTransform: 'capitalize'
                            }} 
                          />
                        )}
                      </div>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Other Participants - Smaller tiles (like Zoom) */}
              {otherParticipants.length > 0 && (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: 'repeat(3, 1fr)',
                      sm: 'repeat(4, 1fr)',
                      md: 'repeat(5, 1fr)',
                      lg: 'repeat(6, 1fr)'
                    },
                    gap: { xs: 0.75, sm: 1, md: 1.25 },
                    px: { xs: 1.5, sm: 2, md: 2.5 },
                    pb: remainingCount > 0 ? { xs: 1, sm: 1.5 } : { xs: 1.5, sm: 2 }
                  }}
                >
                  {otherParticipants.map((p) => (
                    <Box 
                      key={p.id} 
                      className="relative rounded-lg overflow-hidden bg-black border" 
                      sx={{ 
                        borderColor: 'rgba(255,255,255,0.15)', 
                        aspectRatio: '16/9',
                        minHeight: { xs: '80px', sm: '100px', md: '120px' },
                        width: '100%'
                      }}
                    >
                      <img src={`https://images.unsplash.com/photo-1526178611301-1e3f6dc1f1ae?q=80&w=600&auto=format&fit=crop`} alt="feed" className="w-full h-full object-cover" />
                      {!p.video && (
                        <div className="absolute inset-0 grid place-items-center bg-black/60">
                          <Avatar src={p.avatar} sx={{ width: 32, height: 32 }} />
              </div>
                      )}
                      <div className="absolute left-1 bottom-1 right-1 flex items-center text-white" style={{ gap: '2px' }}>
                        <Avatar src={p.avatar} sx={{ width: 14, height: 14 }} />
                        <span className="truncate" style={{ fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{p.name}</span>
                        {p.muted && <MicOffRoundedIcon sx={{ fontSize: 10 }} />}
                        {!p.video && <VideocamOffRoundedIcon sx={{ fontSize: 10 }} />}
            </div>
                    </Box>
          ))}
                </Box>
              )}

              {/* "+X more" indicator (like Zoom) */}
              {remainingCount > 0 && (
                <Box
                  sx={{
                    px: { xs: 1.5, sm: 2, md: 2.5 },
                    pb: { xs: 1.5, sm: 2 }
                  }}
                >
                  <Box
                    className="relative rounded-lg overflow-hidden bg-black/40 border border-white/20 flex items-center justify-center"
                    sx={{
                      aspectRatio: '16/9',
                      minHeight: { xs: '80px', sm: '100px', md: '120px' },
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' }
                    }}
                    onClick={() => setOpen(true)}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#fff',
                        fontSize: { xs: '18px', sm: '24px', md: '28px' },
                        fontWeight: 600
                      }}
                    >
                      +{remainingCount}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: { xs: '10px', sm: '11px' }
                      }}
                    >
                      more
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
        </Box>

          {/* Participants List - Shows when participants button is clicked */}
          {open && (
            <Box 
              sx={{ 
                flex: 1,
                display: { xs: open ? 'flex' : 'none', sm: 'flex' },
                flexDirection: 'column',
                bgcolor: 'rgba(0,0,0,0.95)',
                overflow: 'hidden',
                minWidth: 0,
                zIndex: 10,
                width: { xs: '100%', sm: '40%', md: '35%' },
                position: { xs: 'absolute', sm: 'relative' },
                top: { xs: 0, sm: 'auto' },
                left: { xs: 0, sm: 'auto' },
                right: { xs: 0, sm: 'auto' },
                bottom: { xs: '90px', sm: 'auto' },
                height: { xs: 'calc(100% - 90px)', sm: '100%' },
                pb: { xs: '90px', sm: 0 } // Space for bottom controls on mobile
              }}
            >
              <Box sx={{ 
                p: { xs: 2, sm: 3 },
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Typography variant="subtitle1" className="font-semibold" sx={{ fontSize: { xs: '15px', sm: '16px' }, color: '#fff' }}>
                  Participants
                </Typography>
                <Chip 
                  size="small" 
                  label={people.length} 
                  sx={{ 
                    bgcolor: EV.light, 
                    fontSize: { xs: '11px', sm: '12px' }, 
                    height: { xs: 22, sm: 24 },
                    color: '#000'
                  }} 
                />
              </Box>
              <List 
                className="no-scrollbar" 
                sx={{ 
                  flex: 1,
                  overflowY: 'auto',
                  p: 0,
                  '&::-webkit-scrollbar': { display: 'none' },
                  scrollbarWidth: 'none'
                }}
              >
              {people.map((p)=> (
                  <ListItem 
                    key={p.id} 
                    secondaryAction={
                  <div className="flex items-center" style={{ gap: '4px', flexWrap: 'wrap' }}>
                    {p.role==='member' && (
                          <Button 
                            size="small" 
                            onClick={()=>promote(p.id)} 
                            startIcon={<StarRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} 
                            variant="outlined" 
                            sx={{ 
                              borderColor: accentColor, 
                              color: accentColor, 
                              textTransform:'none', 
                              fontSize: { xs: '11px', sm: '12px' }, 
                              py: { xs: 0.25, sm: 0.5 } 
                            }}
                          >
                            Promote
                          </Button>
                    )}
                        <Button 
                          size="small" 
                          onClick={()=>remove(p.id)} 
                          startIcon={<RemoveCircleOutlineRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} 
                          variant="outlined" 
                          sx={{ 
                            borderColor: accentColor, 
                            color: accentColor, 
                            textTransform:'none', 
                            fontSize: { xs: '11px', sm: '12px' }, 
                            py: { xs: 0.25, sm: 0.5 } 
                          }}
                        >
                          Remove
                        </Button>
                  </div>
                    } 
                    sx={{ 
                      px: { xs: 2, sm: 3 }, 
                      py: { xs: 1, sm: 1.25 },
                      borderBottom: '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={p.avatar} sx={{ width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 } }} />
                    </ListItemAvatar>
                  <ListItemText 
                      primary={
                        <span className="font-semibold" style={{ fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#fff' }}>
                          {p.name}
                        </span>
                      } 
                      secondary={
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                          {p.role}{p.muted?' • muted':''}{!p.video?' • video off':''}
                        </span>
                      } 
                  />
                </ListItem>
              ))}
            </List>
          </Box>
          )}
        </Box>

        {/* Call Controls Bar - Fixed at bottom (like Zoom) */}
        <Box
          sx={{
            position: isDesktopLayout ? 'absolute' : 'fixed',
            bottom: isDesktopLayout ? 12 : 0,
            left: isDesktopLayout ? '50%' : 0,
            right: isDesktopLayout ? 'auto' : 0,
            transform: isDesktopLayout ? 'translateX(-50%)' : 'none',
            width: isDesktopLayout ? 'calc(100% - 24px)' : '100%',
            maxWidth: isDesktopLayout ? '920px' : 'none',
            zIndex: isDesktopLayout ? 20 : 1000,
            px: { xs: 2, sm: 3 },
            py: { xs: 1.5, sm: 2 },
            display: 'flex',
            justifyContent: 'center',
            bgcolor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            pb: isDesktopLayout ? { xs: 1.5, sm: 2 } : { xs: `calc(1.5rem + env(safe-area-inset-bottom))`, sm: `calc(2rem + env(safe-area-inset-bottom))` },
            borderRadius: isDesktopLayout ? 3 : 0
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(0,0,0,0.85)",
              borderRadius: 3,
              px: { xs: 1.5, sm: 2 },
              py: { xs: 1, sm: 1.5 },
              backdropFilter: "blur(20px)",
              gap: { xs: 0.75, sm: 1 },
              flexWrap: "nowrap",
              overflowX: 'auto',
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.7)',
              border: '1px solid rgba(255,255,255,0.1)',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {/* Mute/Unmute */}
            <IconButton
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? "Unmute microphone" : "Mute microphone"}
              sx={{
                color: "#fff",
                flexShrink: 0,
                bgcolor: muted ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)",
                width: { xs: "44px", sm: "48px" },
                height: { xs: "44px", sm: "48px" },
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" }
              }}
            >
              {muted ? <MicOffRoundedIcon sx={{ fontSize: { xs: 22, sm: 24 } }} /> : <MicNoneRoundedIcon sx={{ fontSize: { xs: 22, sm: 24 } }} />}
            </IconButton>

            {/* Video On/Off */}
            <IconButton
              onClick={() => setVideoOn((v) => !v)}
              aria-label={videoOn ? "Turn camera off" : "Turn camera on"}
              sx={{
                color: "#fff",
                flexShrink: 0,
                bgcolor: !videoOn ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)",
                width: { xs: "44px", sm: "48px" },
                height: { xs: "44px", sm: "48px" },
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" }
              }}
            >
              {videoOn ? <VideocamRoundedIcon sx={{ fontSize: { xs: 22, sm: 24 } }} /> : <VideocamOffRoundedIcon sx={{ fontSize: { xs: 22, sm: 24 } }} />}
            </IconButton>

            {/* Speaker */}
            <IconButton
              aria-label="Speaker"
              sx={{ 
                color: "#fff", 
                flexShrink: 0,
                bgcolor: "rgba(255,255,255,0.1)",
                width: { xs: "44px", sm: "48px" },
                height: { xs: "44px", sm: "48px" },
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" }
              }}
            >
              <VolumeUpRoundedIcon sx={{ fontSize: { xs: 22, sm: 24 } }} />
            </IconButton>

            {/* Chat */}
            <IconButton
              onClick={() => {
                onNavigate?.("/conversation/new");
              }}
              aria-label="Open chat"
              sx={{ 
                color: "#fff", 
                flexShrink: 0,
                bgcolor: "rgba(255,255,255,0.1)",
                width: { xs: "44px", sm: "48px" },
                height: { xs: "44px", sm: "48px" },
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" }
              }}
            >
              <ChatBubbleOutlineRoundedIcon sx={{ fontSize: { xs: 22, sm: 24 } }} />
            </IconButton>

            {/* End Call - Prominent */}
            <IconButton
              onClick={() => {
                // Close participants view first
                setOpen(false);
                // End call in global context
                endCall();
                // Call onEnd callback
                onEnd?.();
                // Navigate to the conversation/chat for this group
                const contact = contactName || 'Group Chat';
                onNavigate?.(`/conversation/${encodeURIComponent(contact)}`);
              }}
              aria-label="End call"
              sx={{
                color: "#fff",
                bgcolor: "#e53935",
                "&:hover": { bgcolor: "#c62828" },
                "&:active": { bgcolor: "#b71c1c", transform: "scale(0.95)" },
                width: { xs: "48px", sm: "56px" },
                height: { xs: "48px", sm: "56px" },
                flexShrink: 0,
                transition: "all 0.2s ease",
                boxShadow: '0 2px 8px rgba(229,57,53,0.4)'
              }}
            >
              <CallEndRoundedIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </>
  );
}
