import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Chip,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  Divider,
  Alert
} from "@mui/material";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import CallEndRoundedIcon from "@mui/icons-material/CallEndRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

const LOBBY = [
  { id:'w1', name:'Ada Guide', avatar:'https://i.pravatar.cc/100?img=22', note:'Travel • Guest' },
  { id:'w2', name:'John Driver', avatar:'https://i.pravatar.cc/100?img=16', note:'Rides • Staff' },
];

export default function HostControlsLobby({ onBack }) {
  const [locked, setLocked] = useState(false);
  const [waiting, setWaiting] = useState(LOBBY);
  // eslint-disable-next-line no-unused-vars
  const [mutedAll, setMutedAll] = useState(false);
  const [alert, setAlert] = useState('');

  const admit = (id) => { setWaiting(ws => ws.filter(w => w.id !== id)); setAlert('Participant admitted'); };
  const deny = (id) => { setWaiting(ws => ws.filter(w => w.id !== id)); setAlert('Participant denied'); };
  const endAll = () => { setAlert('Meeting ended for everyone'); };

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full mx-auto bg-white flex flex-col">
        <AppBar elevation={0} position="static" sx={{ bgcolor:'#fff', color:'#111', borderBottom:`1px solid ${EV.light}` }}>
          <Toolbar className="!min-h-[56px]" sx={{ px: { xs: 1.5, sm: 3 } }}>
            <IconButton onClick={onBack} aria-label="Back" sx={{ padding: { xs: '6px', sm: '8px' } }}>
              <ArrowBackRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <Typography variant="h6" className="font-bold" sx={{ fontSize: { xs: '16px', sm: '18px' }, ml: { xs: 0.5, sm: 1 } }}>Host Controls</Typography>
          </Toolbar>
        </AppBar>

        {alert && <Alert severity="success" onClose={()=>setAlert('')} sx={{ m: { xs: 2, sm: 3 } }}>{alert}</Alert>}

        <Box sx={{ p: { xs: 2, sm: 3 }, '& > * + *': { mt: { xs: 2, sm: 3 } } }}>
          {/* Top controls */}
          <div className="grid grid-cols-3" style={{ gap: '8px' }}>
            <Button startIcon={<VolumeOffRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none', fontSize: { xs: '11px', sm: '12px' }, py: { xs: 0.5, sm: 0.75 } }} onClick={()=>setMutedAll(true)}>Mute all</Button>
            <Button startIcon={locked ? <LockOpenRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} /> : <LockRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none', fontSize: { xs: '11px', sm: '12px' }, py: { xs: 0.5, sm: 0.75 } }} onClick={()=>setLocked(l=>!l)}>{locked? 'Unlock' : 'Lock'}</Button>
            <Button startIcon={<CallEndRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} variant="contained" sx={{ bgcolor:'#e53935', textTransform:'none', fontSize: { xs: '11px', sm: '12px' }, py: { xs: 0.5, sm: 0.75 }, '&:hover':{ bgcolor:'#c62828' } }} onClick={endAll}>End for all</Button>
          </div>

          <Divider />

          {/* Room policies */}
          <div className="grid grid-cols-2 gap-2">
            <FormControlLabel control={<Switch defaultChecked />} label="Lobby required" />
            <FormControlLabel control={<Switch defaultChecked />} label="Host admit only" />
            <FormControlLabel control={<Switch />} label="Mute on join" />
            <FormControlLabel control={<Switch />} label="Camera off on join" />
          </div>

          <Divider />

          {/* Lobby */}
          <div className="flex items-center justify-between">
            <div className="flex items-center" style={{ gap: '8px' }}><PeopleAltRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} /><span className="font-semibold" style={{ fontSize: '14px' }}>Lobby</span></div>
            <Chip size="small" label={waiting.length} sx={{ bgcolor: EV.light, fontSize: { xs: '11px', sm: '12px' }, height: { xs: 22, sm: 24 } }} />
          </div>
          <List className="no-scrollbar" sx={{ maxHeight: { xs: 280, sm: 340 }, overflowY:'auto', border:`1px solid ${EV.light}`, borderRadius: 2 }}>
            {waiting.length === 0 && (
              <Box sx={{ p: { xs: 3, sm: 4 }, fontSize: { xs: '12px', sm: '14px' }, color: 'text.secondary' }}>No one is waiting.</Box>
            )}
            {waiting.map(w => (
              <ListItem key={w.id} secondaryAction={
                <div className="flex items-center" style={{ gap: '8px', flexWrap: 'wrap' }}>
                  <Button size="small" onClick={()=>admit(w.id)} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', fontSize: { xs: '11px', sm: '12px' }, py: { xs: 0.25, sm: 0.5 }, '&:hover':{ bgcolor:'#e06f00' } }}>Admit</Button>
                  <Button size="small" onClick={()=>deny(w.id)} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none', fontSize: { xs: '11px', sm: '12px' }, py: { xs: 0.25, sm: 0.5 } }}>Deny</Button>
                </div>
              } sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1, sm: 1.25 } }}>
                <ListItemAvatar><Avatar src={w.avatar} sx={{ width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 } }} /></ListItemAvatar>
                <ListItemText 
                  primary={<span className="font-semibold" style={{ fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.name}</span>} 
                  secondary={<span style={{ fontSize: '12px' }}>{w.note}</span>} 
                />
              </ListItem>
            ))}
          </List>

          {/* Security note */}
          <Box className="rounded-2xl" sx={{ background: EV.light, p: { xs: 2, sm: 3 } }}>
            <div className="flex items-start" style={{ gap: '8px' }}>
              <SecurityRoundedIcon sx={{ color: EV.green, fontSize: { xs: 18, sm: 20 } }} />
              <div style={{ fontSize: '13px', color: '#666' }}>
                When the room is <strong>{locked? 'locked' : 'unlocked'}</strong>, only hosts/co‑hosts can admit people from the lobby. Recording and screen‑share follow your room policy.
              </div>
            </div>
          </Box>
        </Box>
      </Box>
    </>
  );
}
