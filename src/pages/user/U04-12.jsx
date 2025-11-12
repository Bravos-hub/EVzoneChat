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
  const [mutedAll, setMutedAll] = useState(false);
  const [alert, setAlert] = useState('');

  const admit = (id) => { setWaiting(ws => ws.filter(w => w.id !== id)); setAlert('Participant admitted'); };
  const deny = (id) => { setWaiting(ws => ws.filter(w => w.id !== id)); setAlert('Participant denied'); };
  const endAll = () => { setAlert('Meeting ended for everyone'); };

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full max-w-sm mx-auto bg-white flex flex-col">
        <AppBar elevation={0} position="static" sx={{ bgcolor:'#fff', color:'#111', borderBottom:`1px solid ${EV.light}` }}>
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={onBack} aria-label="Back"><ArrowBackRoundedIcon /></IconButton>
            <Typography variant="h6" className="font-bold ml-1">Host Controls</Typography>
          </Toolbar>
        </AppBar>

        {alert && <Alert severity="success" onClose={()=>setAlert('')} className="m-3">{alert}</Alert>}

        <Box className="p-3 space-y-3">
          {/* Top controls */}
          <div className="grid grid-cols-3 gap-2">
            <Button startIcon={<VolumeOffRoundedIcon/>} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }} onClick={()=>setMutedAll(true)}>Mute all</Button>
            <Button startIcon={locked ? <LockOpenRoundedIcon/> : <LockRoundedIcon/>} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }} onClick={()=>setLocked(l=>!l)}>{locked? 'Unlock' : 'Lock'}</Button>
            <Button startIcon={<CallEndRoundedIcon/>} variant="contained" sx={{ bgcolor:'#e53935', textTransform:'none', '&:hover':{ bgcolor:'#c62828' } }} onClick={endAll}>End for all</Button>
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
            <div className="flex items-center gap-2"><PeopleAltRoundedIcon /><span className="font-semibold">Lobby</span></div>
            <Chip size="small" label={waiting.length} sx={{ bgcolor: EV.light }} />
          </div>
          <List className="no-scrollbar" sx={{ maxHeight: 340, overflowY:'auto', border:`1px solid ${EV.light}`, borderRadius: 2 }}>
            {waiting.length === 0 && (
              <Box className="p-4 text-sm text-gray-500">No one is waiting.</Box>
            )}
            {waiting.map(w => (
              <ListItem key={w.id} secondaryAction={
                <div className="flex items-center gap-2">
                  <Button size="small" onClick={()=>admit(w.id)} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>Admit</Button>
                  <Button size="small" onClick={()=>deny(w.id)} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Deny</Button>
                </div>
              }>
                <ListItemAvatar><Avatar src={w.avatar} /></ListItemAvatar>
                <ListItemText primary={<span className="font-semibold">{w.name}</span>} secondary={w.note} />
              </ListItem>
            ))}
          </List>

          {/* Security note */}
          <Box className="rounded-2xl p-3" sx={{ background: EV.light }}>
            <div className="flex items-start gap-2">
              <SecurityRoundedIcon sx={{ color: EV.green }} />
              <div className="text-sm text-gray-700">
                When the room is <strong>{locked? 'locked' : 'unlocked'}</strong>, only hosts/co‑hosts can admit people from the lobby. Recording and screen‑share follow your room policy.
              </div>
            </div>
          </Box>
        </Box>
      </Box>
    </>
  );
}
