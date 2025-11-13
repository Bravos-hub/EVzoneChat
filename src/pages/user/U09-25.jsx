import React, { useRef, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Button,
  Chip,
  TextField,
  Switch,
  FormControlLabel,
  Snackbar
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

/**
 * U09-25 — Profile (Self) & Presence
 * Avatar edit, name/handle, bio, presence (online/away/DND/custom), share status across modules
 */
export default function ProfileSelfPresence({ onBack, initial = { name:'Ronald Isabirye', handle:'@ronald', bio:'Founder & CEO, EVzone', avatar:'https://i.pravatar.cc/160?img=20', presence:'online', custom:'' } }) {
  const [name, setName] = useState(initial.name);
  const [handle, setHandle] = useState(initial.handle);
  const [bio, setBio] = useState(initial.bio);
  const [avatar, setAvatar] = useState(initial.avatar);
  const [presence, setPresence] = useState(initial.presence); // online | away | dnd | custom
  const [custom, setCustom] = useState(initial.custom);
  const [share, setShare] = useState(true);
  const [snack, setSnack] = useState('');
  const fileRef = useRef(null);

  const pickPhoto = () => fileRef.current?.click();
  const onPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatar(url);
  };

  const save = () => { setSnack('Profile saved'); };

  const statuses = [
    { key:'online', label:'Online' },
    { key:'away', label:'Away' },
    { key:'dnd', label:'Do not disturb' },
    { key:'custom', label:'Custom' },
  ];

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
      .presence-dot{position:absolute;right:6px;bottom:6px;width:14px;height:14px;border-radius:9999px;border:2px solid #fff}`}</style>

      <Box className="w-full h-full mx-auto bg-white flex flex-col">
        <AppBar elevation={0} position="static" sx={{ bgcolor:'#fff', color:'#111', borderBottom:`1px solid ${EV.light}` }}>
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={onBack} aria-label="Back"><ArrowBackRoundedIcon /></IconButton>
            <Typography variant="h6" className="font-bold ml-1">My profile</Typography>
          </Toolbar>
        </AppBar>

        <Box className="flex-1 no-scrollbar" sx={{ overflowY:'auto' }}>
          <Box className="px-4 pt-4">
            {/* Avatar + edit */}
            <div className="relative inline-block">
              <Avatar src={avatar} sx={{ width: 96, height: 96 }} />
              <span className="presence-dot" style={{ background: presence==='online'? EV.green : presence==='away'? '#f0ad4e' : presence==='dnd'? '#e53935' : EV.grey }} />
              <Button onClick={pickPhoto} size="small" startIcon={<EditRoundedIcon/>} variant="outlined" sx={{ position:'absolute', left: 110, top: 30, borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Change</Button>
              <input ref={fileRef} type="file" accept="image/*" onChange={onPhoto} hidden />
            </div>

            {/* Name/handle/bio */}
            <Box className="mt-3 space-y-2">
              <TextField fullWidth label="Name" value={name} onChange={(e)=>setName(e.target.value)} />
              <TextField fullWidth label="Handle" value={handle} onChange={(e)=>setHandle(e.target.value)} helperText="Public username" />
              <TextField fullWidth multiline minRows={3} label="Bio" value={bio} onChange={(e)=>setBio(e.target.value)} />
            </Box>

            {/* Presence */}
            <Box className="mt-4">
              <div className="text-sm font-semibold mb-1">Presence</div>
              <div className="flex gap-2 flex-wrap">
                {statuses.map(s => (
                  <Chip key={s.key} label={s.label} onClick={()=>setPresence(s.key)} sx={{ bgcolor: presence===s.key? EV.green: EV.light, color: presence===s.key? '#fff':'#111', '&:hover':{ bgcolor: presence===s.key? '#02b37b':'#e9e9e9' } }} />
                ))}
              </div>
              {presence==='custom' && (
                <TextField fullWidth size="small" label="Custom status" value={custom} onChange={(e)=>setCustom(e.target.value)} sx={{ mt: 1 }} />
              )}
              <FormControlLabel control={<Switch checked={share} onChange={(e)=>setShare(e.target.checked)} />} label="Share my status across modules" sx={{ mt: 1 }} />
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Box className="px-4 pb-4 pt-2 border-t" sx={{ borderColor: EV.light }}>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Cancel</Button>
            <Button onClick={save} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>Save</Button>
          </div>
        </Box>
      </Box>

      <Snackbar open={!!snack} autoHideDuration={1500} message={snack} onClose={()=>setSnack('')} />
    </>
  );
}
