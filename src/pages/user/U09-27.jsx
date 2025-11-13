import React, { useState } from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { useTheme } from "../../context/ThemeContext";
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
  const muiTheme = useMuiTheme();
  const { actualMode } = useTheme();
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

      <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: 'background.default' }}>
        <AppBar elevation={0} position="static" sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom:`1px solid ${muiTheme.palette.divider}` }}>
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={onBack} aria-label="Back" sx={{ color: 'text.primary' }}><ArrowBackRoundedIcon /></IconButton>
            <Typography variant="h6" className="font-bold ml-1" sx={{ color: 'text.primary' }}>Notifications & Privacy</Typography>
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
          <Box className="rounded-2xl p-3 mt-3" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: muiTheme.palette.text.primary }}>Notifications</div>
            <FormGroup>
              <FormControlLabel control={<Switch checked={push} onChange={(e)=>setPush(e.target.checked)} />} label={<span style={{ color: muiTheme.palette.text.primary }}>Push notifications</span>} />
              <FormControlLabel control={<Switch checked={inapp} onChange={(e)=>setInapp(e.target.checked)} />} label={<span style={{ color: muiTheme.palette.text.primary }}>In‑app banners</span>} />
              <FormControlLabel control={<Switch checked={email} onChange={(e)=>setEmail(e.target.checked)} />} label={<span style={{ color: muiTheme.palette.text.primary }}>Email digests</span>} />
              <FormControlLabel control={<Switch checked={mentions} onChange={(e)=>setMentions(e.target.checked)} />} label={<span style={{ color: muiTheme.palette.text.primary }}>Only when mentioned</span>} />
              <FormControlLabel control={<Switch checked={reactions} onChange={(e)=>setReactions(e.target.checked)} />} label={<span style={{ color: muiTheme.palette.text.primary }}>Reactions & emoji</span>} />
            </FormGroup>
          </Box>

          {/* Privacy */}
          <Box className="rounded-2xl p-3 mt-3" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: muiTheme.palette.text.primary }}>Privacy</div>
            <FormGroup>
              <FormControlLabel control={<Switch checked={readReceipts} onChange={(e)=>setReadReceipts(e.target.checked)} />} label={<span style={{ color: muiTheme.palette.text.primary }}>Show read receipts</span>} />
              <FormControlLabel control={<Switch checked={lastSeen} onChange={(e)=>setLastSeen(e.target.checked)} />} label={<span style={{ color: muiTheme.palette.text.primary }}>Show last seen</span>} />
              <FormControlLabel control={<Switch checked={typing} onChange={(e)=>setTyping(e.target.checked)} />} label={<span style={{ color: muiTheme.palette.text.primary }}>Show typing indicator</span>} />
            </FormGroup>
          </Box>

          {/* Quiet hours */}
          <Box className="rounded-2xl p-3 mt-3" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: muiTheme.palette.text.primary }}>Quiet hours (Do not disturb)</div>
            <div className="grid grid-cols-2 gap-2">
              <TextField size="small" label="From" type="time" value={quietFrom} onChange={(e)=>setQuietFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
              <TextField size="small" label="To" type="time" value={quietTo} onChange={(e)=>setQuietTo(e.target.value)} InputLabelProps={{ shrink: true }} />
            </div>
            <div className="text-xs mt-1" style={{ color: muiTheme.palette.text.secondary }}>Applies to {module.toLowerCase()}.</div>
          </Box>

          {/* Channel overrides */}
          <Box className="rounded-2xl p-3 mt-3" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: muiTheme.palette.text.primary }}>Channel overrides</div>
            <div className="flex gap-2 flex-wrap">
              {overrides.map(o => (
                <Chip key={o.id} label={`${o.label}${o.mute? ' • muted':''}`} onClick={()=>toggleChannel(o.id,'mute')} sx={{ bgcolor: o.mute? '#fdecea' : 'background.default', color: 'text.primary' }} />
              ))}
            </div>
          </Box>
        </Box>

        {/* Footer */}
        <Box className="px-3 pb-3">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outlined" sx={{ textTransform:'none' }}>Reset</Button>
            <Button onClick={save} variant="contained" sx={{ textTransform:'none' }}>Save</Button>
          </div>
        </Box>
      </Box>

      <Snackbar open={!!snack} autoHideDuration={1500} message={snack} onClose={()=>setSnack('')} />
    </>
  );
}
