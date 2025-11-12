import React, { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  TextField,
  Chip,
  Button,
  FormGroup,
  FormControlLabel,
  Switch,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

const MODULES = ["Marketplace","Rides","School","Medical","Charging","Travel","Investments","Faith","Social","Workspace","Wallet","AI Bot"];

/**
 * U08-22 — Create Group/Channel
 * - Types: Open / Private / Announcement
 * - Posting mode: Auto-approve / Pre-approval / Admin-only
 * - Options: allow media, mentions, approval to join, list in directory
 */
export default function GroupChannelCreate({ onBack, onCreated }) {
  const [snack, setSnack] = useState("");

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [module, setModule] = useState("Marketplace");

  const [type, setType] = useState("Open"); // Open | Private | Announcement
  const [posting, setPosting] = useState("Auto-approve"); // Auto-approve | Pre-approval | Admin-only

  const [allowMedia, setAllowMedia] = useState(true);
  const [allowMentions, setAllowMentions] = useState(true);
  const [joinApproval, setJoinApproval] = useState(false);
  const [listDirectory, setListDirectory] = useState(true);

  // If announcement-only, enforce Admin-only posting
  useEffect(()=>{ if (type === 'Announcement') setPosting('Admin-only'); }, [type]);

  const disabled = !name.trim();

  const save = () => {
    const payload = { name, desc, module, type, posting, options:{ allowMedia, allowMentions, joinApproval, listDirectory } };
    setSnack('Group/Channel created');
    onCreated?.(payload);
  };

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full max-w-sm mx-auto bg-white flex flex-col">
        <AppBar elevation={0} position="static" sx={{ bgcolor:'#fff', color:'#111', borderBottom:`1px solid ${EV.light}` }}>
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={onBack} aria-label="Back"><ArrowBackRoundedIcon /></IconButton>
            <Typography variant="h6" className="font-bold ml-1">Create group/channel</Typography>
          </Toolbar>
        </AppBar>

        <Box className="p-3 space-y-3 flex-1 no-scrollbar" sx={{ overflowY:'auto' }}>
          <TextField fullWidth label="Name" value={name} onChange={(e)=>setName(e.target.value)} placeholder="e.g., Charging Crew — Kampala" />
          <TextField fullWidth label="Description" value={desc} onChange={(e)=>setDesc(e.target.value)} multiline minRows={2} placeholder="What is this group/channel about?" />

          {/* module */}
          <FormControl size="small" fullWidth>
            <InputLabel>Module</InputLabel>
            <Select label="Module" value={module} onChange={(e)=>setModule(e.target.value)}>
              {MODULES.map(m => (<MenuItem key={m} value={m}>{m}</MenuItem>))}
            </Select>
          </FormControl>

          {/* type */}
          <Box>
            <div className="text-sm font-semibold mb-1">Type</div>
            <div className="flex gap-2 flex-wrap">
              {['Open','Private','Announcement'].map(t => (
                <Chip key={t} label={t} onClick={()=>setType(t)} sx={{ bgcolor: type===t?EV.green:EV.light, color: type===t?'#fff':'#111', '&:hover':{ bgcolor: type===t?'#02b37b':'#e9e9e9' } }} />
              ))}
            </div>
          </Box>

          {/* posting mode */}
          <Box>
            <div className="text-sm font-semibold mb-1">Posting mode</div>
            <div className="flex gap-2 flex-wrap">
              {['Auto-approve','Pre-approval','Admin-only'].map(pm => (
                <Chip key={pm} label={pm} onClick={()=>setPosting(pm)} disabled={type==='Announcement' && pm!=='Admin-only'}
                      sx={{ bgcolor: posting===pm?EV.green:EV.light, color: posting===pm?'#fff':'#111', opacity: type==='Announcement' && pm!=='Admin-only'?0.5:1, '&:hover':{ bgcolor: posting===pm?'#02b37b':'#e9e9e9' } }} />
              ))}
            </div>
            {type==='Announcement' && (
              <div className="text-xs text-gray-600 mt-1 flex items-center gap-1"><InfoRoundedIcon sx={{ fontSize: 14 }} /> Announcement channels require Admin-only posting.</div>
            )}
          </Box>

          <Divider />

          {/* options */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${EV.light}` }}>
            <div className="text-sm font-semibold mb-1">Options</div>
            <FormGroup>
              <FormControlLabel control={<Switch checked={allowMedia} onChange={(e)=>setAllowMedia(e.target.checked)} />} label="Allow media & files" />
              <FormControlLabel control={<Switch checked={allowMentions} onChange={(e)=>setAllowMentions(e.target.checked)} />} label="Allow @mentions" />
              <FormControlLabel control={<Switch checked={joinApproval} onChange={(e)=>setJoinApproval(e.target.checked)} />} label="Require approval to join" />
              <FormControlLabel control={<Switch checked={listDirectory} onChange={(e)=>setListDirectory(e.target.checked)} />} label="List in directory (discoverable)" />
            </FormGroup>
          </Box>
        </Box>

        {/* footer */}
        <Box className="px-3 pb-3">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }} onClick={()=>{ setName(''); setDesc(''); setType('Open'); setPosting('Auto-approve'); setAllowMedia(true); setAllowMentions(true); setJoinApproval(false); setListDirectory(true); }}>Reset</Button>
            <Button disabled={disabled} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }} onClick={save}>Create</Button>
          </div>
        </Box>
      </Box>

      <Snackbar open={!!snack} autoHideDuration={1400} message={snack} onClose={()=>setSnack('')} />
    </>
  );
}
