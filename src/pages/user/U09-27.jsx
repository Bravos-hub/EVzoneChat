import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Switch,
  Chip,
  Button,
  TextField,
  Snackbar
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

const MODULES = ["All modules","Marketplace","Rides","School","Medical","Charging","Travel","Investments","Faith","Social","Workspace","Wallet","AI Bot"];
const CHANNEL_OVERRIDES = [
  { id:'c1', label:'#announcements', mute:false },
  { id:'c2', label:'Charging Crew — Kampala', mute:false },
  { id:'c3', label:'Parents Group', mute:true },
];

/**
 * U09-27 — Notifications & Privacy (per module/channel)
 * Configure notifications per module, mentions, read receipts, last seen, quiet hours
 */
export default function NotificationsPrivacy({ onBack }) {
  const [module, setModule] = useState('All modules');
  const [push, setPush] = useState(true);
  const [inapp, setInapp] = useState(true);
  const [email, setEmail] = useState(false);
  const [mentions, setMentions] = useState(true);
  const [reactions, setReactions] = useState(false);
  const [readReceipts, setReadReceipts] = useState(true);
  const [lastSeen, setLastSeen] = useState(true);
  const [typing, setTyping] = useState(true);
  const [quietFrom, setQuietFrom] = useState('22:00');
  const [quietTo, setQuietTo] = useState('07:00');
  const [overrides, setOverrides] = useState(CHANNEL_OVERRIDES);
  const [snack, setSnack] = useState('');

  const save = () => setSnack('Notification & privacy settings saved');

  const toggleChannel = (id, key='mute') => setOverrides(ovs => ovs.map(o => o.id===id ? { ...o, [key]: !o[key] } : o));

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full mx-auto bg-white flex flex-col">
        <AppBar elevation={0} position="static" sx={{ bgcolor:'#fff', color:'#111', borderBottom:`1px solid ${EV.light}` }}>
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={onBack} aria-label="Back"><ArrowBackRoundedIcon /></IconButton>
            <Typography variant="h6" className="font-bold ml-1">Notifications & Privacy</Typography>
          </Toolbar>
        </AppBar>

        <Box className="flex-1 p-3 no-scrollbar" sx={{ overflowY:'auto' }}>
          {/* Module select */}
          <FormControl fullWidth size="small">
            <InputLabel>Module</InputLabel>
            <Select label="Module" value={module} onChange={(e)=>setModule(e.target.value)}>
              {MODULES.map(m => (<MenuItem key={m} value={m}>{m}</MenuItem>))}
            </Select>
          </FormControl>

          {/* Notifications */}
          <Box className="rounded-2xl p-3 mt-3" sx={{ border:`1px solid ${EV.light}` }}>
            <div className="text-sm font-semibold mb-1">Notifications</div>
            <FormGroup>
              <FormControlLabel control={<Switch checked={push} onChange={(e)=>setPush(e.target.checked)} />} label="Push notifications" />
              <FormControlLabel control={<Switch checked={inapp} onChange={(e)=>setInapp(e.target.checked)} />} label="In‑app banners" />
              <FormControlLabel control={<Switch checked={email} onChange={(e)=>setEmail(e.target.checked)} />} label="Email digests" />
              <FormControlLabel control={<Switch checked={mentions} onChange={(e)=>setMentions(e.target.checked)} />} label="Only when mentioned" />
              <FormControlLabel control={<Switch checked={reactions} onChange={(e)=>setReactions(e.target.checked)} />} label="Reactions & emoji" />
            </FormGroup>
          </Box>

          {/* Privacy */}
          <Box className="rounded-2xl p-3 mt-3" sx={{ border:`1px solid ${EV.light}` }}>
            <div className="text-sm font-semibold mb-1">Privacy</div>
            <FormGroup>
              <FormControlLabel control={<Switch checked={readReceipts} onChange={(e)=>setReadReceipts(e.target.checked)} />} label="Show read receipts" />
              <FormControlLabel control={<Switch checked={lastSeen} onChange={(e)=>setLastSeen(e.target.checked)} />} label="Show last seen" />
              <FormControlLabel control={<Switch checked={typing} onChange={(e)=>setTyping(e.target.checked)} />} label="Show typing indicator" />
            </FormGroup>
          </Box>

          {/* Quiet hours */}
          <Box className="rounded-2xl p-3 mt-3" sx={{ border:`1px solid ${EV.light}` }}>
            <div className="text-sm font-semibold mb-1">Quiet hours (Do not disturb)</div>
            <div className="grid grid-cols-2 gap-2">
              <TextField size="small" label="From" type="time" value={quietFrom} onChange={(e)=>setQuietFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
              <TextField size="small" label="To" type="time" value={quietTo} onChange={(e)=>setQuietTo(e.target.value)} InputLabelProps={{ shrink: true }} />
            </div>
            <div className="text-xs text-gray-600 mt-1">Applies to {module.toLowerCase()}.</div>
          </Box>

          {/* Channel overrides */}
          <Box className="rounded-2xl p-3 mt-3" sx={{ border:`1px solid ${EV.light}` }}>
            <div className="text-sm font-semibold mb-1">Channel overrides</div>
            <div className="flex gap-2 flex-wrap">
              {overrides.map(o => (
                <Chip key={o.id} label={`${o.label}${o.mute? ' • muted':''}`} onClick={()=>toggleChannel(o.id,'mute')} sx={{ bgcolor: o.mute? '#fdecea' : EV.light, color:'#111' }} />
              ))}
            </div>
          </Box>
        </Box>

        {/* Footer */}
        <Box className="px-3 pb-3">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Reset</Button>
            <Button onClick={save} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>Save</Button>
          </div>
        </Box>
      </Box>

      <Snackbar open={!!snack} autoHideDuration={1500} message={snack} onClose={()=>setSnack('')} />
    </>
  );
}
