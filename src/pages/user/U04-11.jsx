import React, { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
  Button,
  Drawer,
  Badge,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  Snackbar
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import MicNoneRoundedIcon from "@mui/icons-material/MicNoneRounded";
import MicOffRoundedIcon from "@mui/icons-material/MicOffRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import VideocamOffRoundedIcon from "@mui/icons-material/VideocamOffRounded";
import ScreenShareRoundedIcon from "@mui/icons-material/ScreenShareRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import PanToolAltRoundedIcon from "@mui/icons-material/PanToolAltRounded";
import CallEndRoundedIcon from "@mui/icons-material/CallEndRounded";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import RecordVoiceOverRoundedIcon from "@mui/icons-material/RecordVoiceOverRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

const DEMO = [
  { id:'u1', name:'Ayo', avatar:'https://i.pravatar.cc/100?img=10', video:true, muted:false, active:true, role:'host' },
  { id:'u2', name:'Mina', avatar:'https://i.pravatar.cc/100?img=11', video:true, muted:true, active:false, role:'cohost' },
  { id:'u3', name:'Riya', avatar:'https://i.pravatar.cc/100?img=12', video:true, muted:false, active:true, role:'member' },
  { id:'u4', name:'Ken', avatar:'https://i.pravatar.cc/100?img=13', video:false, muted:true, active:false, role:'member' }
];

export default function GroupCallPro({ onBack, isHost = true }) {
  const [people, setPeople] = useState(DEMO);
  const [openParticipants, setOpenParticipants] = useState(false);
  const [menuEl, setMenuEl] = useState(null);
  const [layout, setLayout] = useState('grid'); // 'grid' | 'speaker'
  const [selfMuted, setSelfMuted] = useState(false);
  const [selfCamOn, setSelfCamOn] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [snack, setSnack] = useState('');

  // header menu helpers (fix for closeHeaderMenu not defined)
  const openHeaderMenu = (e) => setMenuEl(e.currentTarget);
  const closeHeaderMenu = () => setMenuEl(null);

  const host = useMemo(() => people.find(p => p.role === 'host') || people[0], [people]);
  const activeCount = useMemo(() => people.filter(p => p.active).length, [people]);

  const toggleMute = () => setSelfMuted(m => !m);
  const toggleCam = () => setSelfCamOn(c => !c);
  const toggleHand = () => setHandRaised(h => !h);
  const toggleSharing = () => setSharing(s => !s);

  const remove = (id) => setPeople(ps => ps.filter(p => p.id !== id));
  const muteAll = () => setPeople(ps => ps.map(p => ({ ...p, muted: true })));

  useEffect(() => {
    if (snack) {
      const t = setTimeout(() => setSnack(''), 1400);
      return () => clearTimeout(t);
    }
  }, [snack]);

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none`}</style>

      <Box className="w-full h-full max-w-[390px] mx-auto bg-black text-white flex flex-col">
        {/* Header */}
        <AppBar elevation={0} position="fixed" sx={{ bgcolor:'rgba(0,0,0,0.55)' }}>
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={onBack} aria-label="Back" sx={{ color:'#fff' }}><ArrowBackRoundedIcon /></IconButton>
            <Box className="flex items-center gap-2">
              <Avatar src={host.avatar} sx={{ width:32, height:32 }} />
              <div className="flex flex-col">
                <span className="font-semibold">{host.name}</span>
                <span className="text-[11px] opacity-80">{activeCount} active speakers</span>
              </div>
            </Box>
            <Box sx={{ flexGrow:1 }} />
            <Chip size="small" icon={<PeopleAltRoundedIcon/>} label={people.length} sx={{ bgcolor:'rgba(255,255,255,0.12)', color:'#fff', mr:1 }} onClick={()=>setOpenParticipants(true)} />
            <IconButton onClick={openHeaderMenu} aria-label="More" sx={{ color:'#fff' }}><MoreVertRoundedIcon/></IconButton>
          </Toolbar>
        </AppBar>

        {/* Grid/Speaker area */}
        <Box className="flex-1 pt-[56px] pb-[88px]">
          {layout === 'grid' ? (
            <Box className="grid grid-cols-2 gap-2 p-2">
              {people.map(p => (
                <div key={p.id} className={`relative rounded-xl overflow-hidden bg-black border ${p.active? 'ring-2':'border-white/10'}`} style={p.active? { boxShadow:`0 0 0 3px ${EV.green} inset` }: undefined}>
                  <img src={`https://images.unsplash.com/photo-1526178611301-1e3f6dc1f1ae?q=80&w=600&auto=format&fit=crop`} alt="feed" className="w-full h-40 object-cover" />
                  {!p.video && (
                    <div className="absolute inset-0 grid place-items-center bg-black/60"><Avatar src={p.avatar} sx={{ width: 56, height: 56 }} /></div>
                  )}
                  <div className="absolute left-2 bottom-2 right-2 flex items-center gap-1 text-white">
                    <Avatar src={p.avatar} sx={{ width: 20, height: 20 }} />
                    <span className="text-[11px] truncate">{p.name}</span>
                    {p.muted && <MicOffRoundedIcon sx={{ fontSize: 14 }} />}
                    {!p.video && <VideocamOffRoundedIcon sx={{ fontSize: 14 }} />}
                    {p.role!=='member' && <Chip size="small" label={p.role} sx={{ height: 18, bgcolor: EV.orange, color:'#fff', ml:'auto' }} />}
                  </div>
                </div>
              ))}
            </Box>
          ) : (
            <Box className="h-full grid grid-rows-6 gap-2 p-2">
              <div className="row-span-4 relative rounded-xl overflow-hidden border" style={{ borderColor:'rgba(255,255,255,0.12)' }}>
                <img src={`https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?q=80&w=1200&auto=format&fit=crop`} alt="speaker" className="w-full h-full object-cover" />
                <div className="absolute left-3 bottom-3 right-3 flex items-center gap-2 text-white">
                  <Avatar src={host.avatar} sx={{ width: 24, height: 24 }} />
                  <span className="text-sm font-semibold truncate">{host.name} (speaker)</span>
                </div>
              </div>
              <div className="row-span-2 grid grid-cols-3 gap-2">
                {people.filter(p=>p.id!==host.id).map(p => (
                  <div key={p.id} className="relative rounded-xl overflow-hidden border" style={{ borderColor:'rgba(255,255,255,0.12)' }}>
                    <img src={`https://images.unsplash.com/photo-1520975940462-39b5d35c6b35?q=80&w=600&auto=format&fit=crop`} alt="viewer" className="w-full h-full object-cover" />
                    <div className="absolute left-2 bottom-2 right-2 flex items-center gap-1 text-white">
                      <Avatar src={p.avatar} sx={{ width: 20, height: 20 }} />
                      <span className="text-[11px] truncate">{p.name}</span>
                      {p.muted && <MicOffRoundedIcon sx={{ fontSize: 14 }} />}
                      {!p.video && <VideocamOffRoundedIcon sx={{ fontSize: 14 }} />}
                    </div>
                  </div>
                ))}
              </div>
            </Box>
          )}
        </Box>

        {/* Bottom controls */}
        <Box className="fixed inset-x-0 bottom-0 z-10 flex justify-center" sx={{ pb: 'env(safe-area-inset-bottom)' }}>
          <Box className="w-full max-w-[390px] px-3 pb-3">
            <div className="flex items-center justify-between bg-white/10 rounded-2xl px-3 py-2 backdrop-blur">
              <Tooltip title={selfMuted? 'Unmute' : 'Mute'}>
                <IconButton onClick={toggleMute} aria-label="mute" sx={{ color:'#fff' }}>
                  {selfMuted? <MicOffRoundedIcon/> : <MicNoneRoundedIcon/>}
                </IconButton>
              </Tooltip>
              <Tooltip title={selfCamOn? 'Turn camera off' : 'Turn camera on'}>
                <IconButton onClick={toggleCam} aria-label="camera" sx={{ color:'#fff' }}>
                  {selfCamOn? <VideocamRoundedIcon/> : <VideocamOffRoundedIcon/>}
                </IconButton>
              </Tooltip>
              <Tooltip title={handRaised? 'Lower hand' : 'Raise hand'}>
                <IconButton onClick={toggleHand} aria-label="hand" sx={{ color:'#fff' }}>
                  <PanToolAltRoundedIcon/>
                </IconButton>
              </Tooltip>
              <Tooltip title={sharing? 'Stop sharing' : 'Share screen'}>
                <IconButton onClick={toggleSharing} aria-label="share" sx={{ color:'#fff' }}>
                  <ScreenShareRoundedIcon/>
                </IconButton>
              </Tooltip>
              <Tooltip title="Participants">
                <IconButton onClick={()=>setOpenParticipants(true)} aria-label="participants" sx={{ color:'#fff' }}>
                  <Badge color="error" badgeContent={people.length}>
                    <PeopleAltRoundedIcon/>
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Open chat">
                <IconButton aria-label="chat" sx={{ color:'#fff' }}>
                  <ChatBubbleOutlineRoundedIcon/>
                </IconButton>
              </Tooltip>
              <Tooltip title="Leave">
                <IconButton aria-label="leave" sx={{ bgcolor:'#e53935', '&:hover':{ bgcolor:'#c62828' }, color:'#fff' }}>
                  <CallEndRoundedIcon/>
                </IconButton>
              </Tooltip>
            </div>
          </Box>
        </Box>

        {/* Header Menu */}
        <Menu
          anchorEl={menuEl}
          open={Boolean(menuEl)}
          onClose={closeHeaderMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{ sx:{ width: 360, maxWidth: 'calc(100vw - 16px)', borderRadius:2 } }}
        >
          <MenuItem onClick={()=>{ closeHeaderMenu(); setSnack('Recording started'); }}>
            <ListItemIcon><RecordVoiceOverRoundedIcon/></ListItemIcon>
            Start Recording
          </MenuItem>
          <MenuItem onClick={()=>{ closeHeaderMenu(); setSnack('Invite link copied'); }}>
            <ListItemIcon><QrCode2RoundedIcon/></ListItemIcon>
            Copy Invite Link
          </MenuItem>
          <MenuItem onClick={()=>{ closeHeaderMenu(); setLayout(l => l==='grid' ? 'speaker' : 'grid'); }}>
            <ListItemIcon><GridViewRoundedIcon/></ListItemIcon>
            Switch Layout
          </MenuItem>
          <MenuItem onClick={()=>{ closeHeaderMenu(); muteAll(); }}>
            <ListItemIcon><MicOffRoundedIcon/></ListItemIcon>
            Mute All
          </MenuItem>
          <MenuItem onClick={()=>{ closeHeaderMenu(); }}>
            <ListItemIcon><SettingsRoundedIcon/></ListItemIcon>
            Call Settings
          </MenuItem>
          <MenuItem onClick={()=>{ closeHeaderMenu(); }}>
            <ListItemIcon><ShieldRoundedIcon/></ListItemIcon>
            Lock Meeting
          </MenuItem>
          <Divider/>
          <MenuItem onClick={()=>{ closeHeaderMenu(); }}>
            <ListItemIcon><HelpOutlineRoundedIcon/></ListItemIcon>
            Help
          </MenuItem>
        </Menu>

        {/* Participants Drawer */}
        <Drawer anchor="bottom" open={openParticipants} onClose={()=>setOpenParticipants(false)}
          PaperProps={{ sx:{ borderTopLeftRadius:16, borderTopRightRadius:16 } }}>
          <Box className="p-3" sx={{ maxWidth:390, mx:'auto' }}>
            <div className="w-10 h-1 rounded-full bg-gray-300 mx-auto mb-2"/>
            <div className="flex items-center justify-between mb-2">
              <Typography variant="subtitle1" className="font-semibold">Participants</Typography>
              <Chip size="small" label={people.length} sx={{ bgcolor: EV.light }} />
            </div>
            <TextField
              size="small"
              fullWidth
              placeholder="Search people…"
              InputProps={{ startAdornment:<InputAdornment position="start">@</InputAdornment> }}
              onChange={(e)=>{
                const q = e.target.value.toLowerCase();
                setPeople(q? DEMO.filter(p=>p.name.toLowerCase().includes(q)) : DEMO);
              }}
              sx={{ mb:1.5 }}
            />
            <ToggleButtonGroup exclusive value={layout} onChange={(_,v)=> v && setLayout(v)} sx={{ mb:1 }}>
              <ToggleButton value="grid">Grid</ToggleButton>
              <ToggleButton value="speaker">Speaker</ToggleButton>
            </ToggleButtonGroup>

            <List className="no-scrollbar" sx={{ maxHeight: 360, overflowY:'auto' }}>
              {people.map(p => (
                <ListItem key={p.id} secondaryAction={
                  <div className="flex items-center gap-1">
                    <Button size="small" variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }} startIcon={<PersonAddAlt1RoundedIcon/>}>Invite</Button>
                    {p.role!=='host' && (
                      <Button size="small" variant="outlined" onClick={()=>remove(p.id)} sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }} startIcon={<RemoveCircleOutlineRoundedIcon/>}>Remove</Button>
                    )}
                  </div>
                }>
                  <ListItemAvatar><Avatar src={p.avatar} /></ListItemAvatar>
                  <ListItemText
                    primary={<span className="font-semibold">{p.name}</span>}
                    secondary={`${p.role}${p.muted?' • muted':''}${!p.video?' • video off':''}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* Footer Snackbar */}
        <Snackbar open={!!snack} message={snack} onClose={()=>setSnack('')} autoHideDuration={1400} />
      </Box>
    </>
  );
}

/*
  ===== Tests (React Testing Library) — minimal sanity =====

  import React from 'react';
  import { render, screen, fireEvent } from '@testing-library/react';
  import GroupCallPro from './GroupCallPro';

  test('renders host name and participants chip', () => {
    render(<GroupCallPro/>);
    expect(screen.getByText(/Ayo/)).toBeInTheDocument();
    expect(screen.getByText(/Participants/)).toBeInTheDocument();
  });
*/
