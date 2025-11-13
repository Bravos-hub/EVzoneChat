import React, { useMemo, useState } from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Chip,
  Divider, // eslint-disable-line no-unused-vars
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

// const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

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
  const muiTheme = useMuiTheme();
  // const { actualMode } = useTheme();
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

      <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: 'background.default' }}>
        <AppBar elevation={0} position="static" sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom:`1px solid ${muiTheme.palette.divider}` }}>
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={onBack} aria-label="Back" sx={{ color: 'text.primary' }}><ArrowBackRoundedIcon /></IconButton>
            <Typography variant="h6" className="font-bold ml-1" sx={{ color: 'text.primary' }}>Group details</Typography>
          </Toolbar>
        </AppBar>

        <Box className="p-3 space-y-3 flex-1 no-scrollbar" sx={{ overflowY:'auto' }}>
          {/* header info */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper' }}>
            <div className="flex items-center gap-2">
              <Typography variant="subtitle1" className="font-semibold" sx={{ color: 'text.primary' }}>Charging Crew — Kampala</Typography>
              <Chip size="small" label="Open" sx={{ bgcolor: 'background.default', color: 'text.primary' }} />
              <Chip size="small" label={adminOnly? 'Admin-only' : (preApproval? 'Pre-approval' : 'Auto-approve')} sx={{ bgcolor: 'background.default', color: 'text.primary' }} />
            </div>
            <div className="text-sm mt-1" style={{ color: muiTheme.palette.text.primary }}>For technicians and riders to coordinate charging tasks around Kampala.</div>
          </Box>

          {/* guidelines */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper' }}>
            <div className="font-semibold mb-1" style={{ color: muiTheme.palette.text.primary }}>Guidelines</div>
            <div className="text-sm whitespace-pre-wrap" style={{ color: muiTheme.palette.text.primary }}>• Be respectful\n• Stay on topic\n• No personal info or external solicitations</div>
          </Box>

          {/* pinned */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper' }}>
            <div className="flex items-center gap-2 mb-1" style={{ color: muiTheme.palette.text.primary }}><PushPinRoundedIcon/><span className="font-semibold">Pinned</span></div>
            <div className="text-sm" style={{ color: muiTheme.palette.text.primary }}>Welcome post, Safety checklist, Shift schedule</div>
          </Box>

          {/* members */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2" style={{ color: muiTheme.palette.text.primary }}><ManageAccountsRoundedIcon/><span className="font-semibold">Members</span></div>
              <Button startIcon={<PersonAddAlt1RoundedIcon/>} onClick={onInvite} variant="contained" sx={{ textTransform:'none' }}>Invite</Button>
            </div>
            <TextField fullWidth size="small" placeholder="Search members" value={search} onChange={(e)=>setSearch(e.target.value)} />
            <List className="no-scrollbar" sx={{ maxHeight: 260, overflowY:'auto', mt:1, border: `1px solid ${muiTheme.palette.divider}`, borderRadius: 2, bgcolor: 'background.paper' }}>
              {filtered.map(m => (
                <ListItem key={m.id} secondaryAction={
                  <div className="flex items-center gap-1">
                    {m.role!=='admin' && (
                      <Button size="small" onClick={()=>promote(m.id)} variant="outlined" sx={{ textTransform:'none' }}>Promote</Button>
                    )}
                    {m.role!=='member' && (
                      <Button size="small" onClick={()=>demote(m.id)} variant="outlined" sx={{ textTransform:'none' }}>Demote</Button>
                    )}
                    <Button size="small" onClick={()=>remove(m.id)} startIcon={<DeleteOutlineRoundedIcon/>} variant="outlined" sx={{ textTransform:'none' }}>Remove</Button>
                  </div>
                }>
                  <ListItemAvatar><Avatar src={m.avatar} /></ListItemAvatar>
                  <ListItemText 
                    primary={<span className="font-semibold" style={{ color: muiTheme.palette.text.primary }}>{m.name}</span>} 
                    secondary={<span style={{ color: muiTheme.palette.text.secondary }}>{m.role}</span>} 
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* moderation controls */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper' }}>
            <div className="font-semibold mb-1" style={{ color: muiTheme.palette.text.primary }}>Moderation</div>
            <FormGroup>
              <FormControlLabel control={<Switch checked={preApproval} onChange={(e)=>setPreApproval(e.target.checked)} />} label={<span style={{ color: muiTheme.palette.text.primary }}>Require pre‑approval for posts</span>} />
              <FormControlLabel control={<Switch checked={adminOnly} onChange={(e)=>setAdminOnly(e.target.checked)} />} label={<span style={{ color: muiTheme.palette.text.primary }}>Admins only can post (announcement)</span>} />
            </FormGroup>
            <TextField fullWidth size="small" label="Banned words (comma‑separated)" value={banned} onChange={(e)=>setBanned(e.target.value)} sx={{ mt:1 }} />
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button variant="outlined" sx={{ textTransform:'none' }} onClick={()=>{ setPreApproval(false); setAdminOnly(false); setBanned(''); }}>Reset</Button>
              <Button variant="contained" sx={{ textTransform:'none' }} onClick={saveModeration}>Save</Button>
            </div>
          </Box>
        </Box>
      </Box>

      <Snackbar open={!!snack} autoHideDuration={1400} message={snack} onClose={()=>setSnack('')} />
    </>
  );
}
