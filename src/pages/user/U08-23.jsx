import React, { useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Chip,
  Divider,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  FormGroup,
  FormControlLabel,
  Switch,
  Snackbar
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

const DEMO_MEMBERS = [
  { id:'u1', name:'Leslie Alexander', role:'admin', avatar:'https://i.pravatar.cc/100?img=5' },
  { id:'u2', name:'Etty Duke', role:'moderator', avatar:'https://i.pravatar.cc/100?img=1' },
  { id:'u3', name:'Richards', role:'member', avatar:'https://i.pravatar.cc/100?img=12' },
  { id:'u4', name:'Kayle', role:'member', avatar:'https://i.pravatar.cc/100?img=11' },
];

/**
 * U08-23 — Group/Channel Details & Moderation
 * - Info, Guidelines, Pinned
 * - Members list (promote/demote/remove)
 * - Moderation controls (pre-approval, admin-only, banned words)
 */
export default function GroupChannelDetailsModeration({ onBack, onInvite }) {
  const [snack, setSnack] = useState('');
  const [members, setMembers] = useState(DEMO_MEMBERS);
  const [search, setSearch] = useState('');

  const [preApproval, setPreApproval] = useState(false);
  const [adminOnly, setAdminOnly] = useState(false);
  const [banned, setBanned] = useState('spam, scam');

  const filtered = useMemo(()=> members.filter(m => (m.name + ' ' + m.role).toLowerCase().includes(search.toLowerCase())), [members, search]);

  const promote = (id) => setMembers(ms => ms.map(m => m.id===id? { ...m, role: m.role==='member'? 'moderator' : 'admin' } : m));
  const demote = (id) => setMembers(ms => ms.map(m => m.id===id? { ...m, role: m.role==='admin'? 'moderator' : 'member' } : m));
  const remove = (id) => setMembers(ms => ms.filter(m => m.id!==id));

  const saveModeration = () => setSnack('Moderation settings saved');

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full max-w-sm mx-auto bg-white flex flex-col">
        <AppBar elevation={0} position="static" sx={{ bgcolor:'#fff', color:'#111', borderBottom:`1px solid ${EV.light}` }}>
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={onBack} aria-label="Back"><ArrowBackRoundedIcon /></IconButton>
            <Typography variant="h6" className="font-bold ml-1">Group details</Typography>
          </Toolbar>
        </AppBar>

        <Box className="p-3 space-y-3 flex-1 no-scrollbar" sx={{ overflowY:'auto' }}>
          {/* header info */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${EV.light}` }}>
            <div className="flex items-center gap-2">
              <Typography variant="subtitle1" className="font-semibold">Charging Crew — Kampala</Typography>
              <Chip size="small" label="Open" sx={{ bgcolor: EV.light }} />
              <Chip size="small" label={adminOnly? 'Admin-only' : (preApproval? 'Pre-approval' : 'Auto-approve')} sx={{ bgcolor: EV.light }} />
            </div>
            <div className="text-sm text-gray-700 mt-1">For technicians and riders to coordinate charging tasks around Kampala.</div>
          </Box>

          {/* guidelines */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${EV.light}` }}>
            <div className="font-semibold mb-1">Guidelines</div>
            <div className="text-sm text-gray-700 whitespace-pre-wrap">• Be respectful\n• Stay on topic\n• No personal info or external solicitations</div>
          </Box>

          {/* pinned */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${EV.light}` }}>
            <div className="flex items-center gap-2 mb-1"><PushPinRoundedIcon/><span className="font-semibold">Pinned</span></div>
            <div className="text-sm text-gray-700">Welcome post, Safety checklist, Shift schedule</div>
          </Box>

          {/* members */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${EV.light}` }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2"><ManageAccountsRoundedIcon/><span className="font-semibold">Members</span></div>
              <Button startIcon={<PersonAddAlt1RoundedIcon/>} onClick={onInvite} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>Invite</Button>
            </div>
            <TextField fullWidth size="small" placeholder="Search members" value={search} onChange={(e)=>setSearch(e.target.value)} />
            <List className="no-scrollbar" sx={{ maxHeight: 260, overflowY:'auto', mt:1 }}>
              {filtered.map(m => (
                <ListItem key={m.id} secondaryAction={
                  <div className="flex items-center gap-1">
                    {m.role!=='admin' && (
                      <Button size="small" onClick={()=>promote(m.id)} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Promote</Button>
                    )}
                    {m.role!=='member' && (
                      <Button size="small" onClick={()=>demote(m.id)} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Demote</Button>
                    )}
                    <Button size="small" onClick={()=>remove(m.id)} startIcon={<DeleteOutlineRoundedIcon/>} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Remove</Button>
                  </div>
                }>
                  <ListItemAvatar><Avatar src={m.avatar} /></ListItemAvatar>
                  <ListItemText primary={<span className="font-semibold">{m.name}</span>} secondary={m.role} />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* moderation controls */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${EV.light}` }}>
            <div className="font-semibold mb-1">Moderation</div>
            <FormGroup>
              <FormControlLabel control={<Switch checked={preApproval} onChange={(e)=>setPreApproval(e.target.checked)} />} label="Require pre‑approval for posts" />
              <FormControlLabel control={<Switch checked={adminOnly} onChange={(e)=>setAdminOnly(e.target.checked)} />} label="Admins only can post (announcement)" />
            </FormGroup>
            <TextField fullWidth size="small" label="Banned words (comma‑separated)" value={banned} onChange={(e)=>setBanned(e.target.value)} sx={{ mt:1 }} />
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }} onClick={()=>{ setPreApproval(false); setAdminOnly(false); setBanned(''); }}>Reset</Button>
              <Button variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }} onClick={saveModeration}>Save</Button>
            </div>
          </Box>
        </Box>
      </Box>

      <Snackbar open={!!snack} autoHideDuration={1400} message={snack} onClose={()=>setSnack('')} />
    </>
  );
}
