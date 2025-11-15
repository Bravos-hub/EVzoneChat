import React, { useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Button,
  Chip,
  FormGroup,
  FormControlLabel,
  Switch,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Snackbar,
  Autocomplete
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

const PEOPLE = [
  { id:'u1', name:'Leslie Alexander', avatar:'https://i.pravatar.cc/100?img=5' },
  { id:'u2', name:'Etty Duke', avatar:'https://i.pravatar.cc/100?img=1' },
  { id:'u3', name:'Richards', avatar:'https://i.pravatar.cc/100?img=12' },
  { id:'u4', name:'Kayle', avatar:'https://i.pravatar.cc/100?img=11' },
  { id:'u5', name:'KB', avatar:'https://i.pravatar.cc/100?img=13' },
];

/**
 * U07-19 — Create/Join/Detail Meeting
 * Single screen with tabs: Create | Join | Detail
 */
export default function MeetingCreateJoinDetail({ onBack }) {
  const [tab, setTab] = useState(0);
  const [snack, setSnack] = useState('');

  // Create state
  const [title, setTitle] = useState('Weekly Sync');
  const [dt, setDt] = useState(''); // datetime-local string
  const [lobbyReq, setLobbyReq] = useState(true);
  const [hostAdmit, setHostAdmit] = useState(true);
  const [recPreset, setRecPreset] = useState(true);
  const [cohosts, setCohosts] = useState([]); // array of people

  // Join state
  const [joinCode, setJoinCode] = useState('');
  const [joinLink, setJoinLink] = useState('');

  // Detail state (demo)
  const info = useMemo(()=> ({
    title,
    code: 'evz-9k5f-311',
    link: 'https://evzone.app/j/evz-9k5f-311',
    datetime: dt || new Date().toISOString(),
    cohosts,
    lobbyReq,
    hostAdmit,
    recPreset,
  }), [title, dt, cohosts, lobbyReq, hostAdmit, recPreset]);

  const copy = async (text) => { try { await navigator.clipboard?.writeText(text); setSnack('Copied'); } catch { setSnack('Copy failed'); } };
  const share = async (payload) => {
    try { if (navigator.share) await navigator.share(payload); else await navigator.clipboard?.writeText(payload.url); setSnack(navigator.share ? 'Shared' : 'Link copied'); } catch {}
  };

  const saveMeeting = () => { setSnack('Meeting saved'); setTab(2); };
  const startNow = () => { setSnack('Starting meeting…'); };
  const join = () => { setSnack('Joining…'); };

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full mx-auto bg-white flex flex-col">
        <AppBar elevation={0} position="static" sx={{ bgcolor:'#fff', color:'#111', borderBottom:`1px solid ${EV.light}` }}>
          <Toolbar className="!min-h-[56px]" sx={{ px: { xs: 1.5, sm: 3 } }}>
            <IconButton onClick={onBack} aria-label="Back" sx={{ padding: { xs: '6px', sm: '8px' } }}>
              <ArrowBackRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <Typography variant="h6" className="font-bold" sx={{ fontSize: { xs: '16px', sm: '18px' }, ml: { xs: 0.5, sm: 1 } }}>Meetings</Typography>
          </Toolbar>
        </AppBar>

        <Tabs value={tab} onChange={(e,v)=>setTab(v)} textColor="inherit" TabIndicatorProps={{ style:{ background: EV.green } }} sx={{ '& .MuiTab-root': { fontSize: { xs: '13px', sm: '14px' }, minHeight: { xs: 44, sm: 48 }, px: { xs: 1.5, sm: 2 } } }}>
          <Tab label="Create"/>
          <Tab label="Join"/>
          <Tab label="Detail"/>
        </Tabs>

        {/* body */}
        <Box className="flex-1 no-scrollbar" sx={{ overflowY:'auto', p: { xs: 2, sm: 3 }, '& > * + *': { mt: { xs: 2, sm: 3 } } }}>
          {tab===0 && (
            <>
              <TextField fullWidth label="Title" value={title} onChange={(e)=>setTitle(e.target.value)} size="small" sx={{ '& .MuiInputBase-input': { fontSize: { xs: '14px', sm: '15px' } } }} />

              <TextField fullWidth label="Date & time" type="datetime-local" value={dt} onChange={(e)=>setDt(e.target.value)} InputLabelProps={{ shrink: true }} size="small" InputProps={{ startAdornment:(<InputAdornment position="start"><EventRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} /></InputAdornment>) }} sx={{ '& .MuiInputBase-input': { fontSize: { xs: '14px', sm: '15px' } } }} />

              <Autocomplete
                multiple
                options={PEOPLE}
                value={cohosts}
                onChange={(e, val)=>setCohosts(val)}
                getOptionLabel={(o)=>o.name}
                renderOption={(props, option)=> (
                  <li {...props} key={option.id} className="flex items-center gap-2">
                    <Avatar src={option.avatar} sx={{ width: 24, height: 24 }} /> {option.name}
                  </li>
                )}
                renderTags={(value, getTagProps)=> value.map((opt, i)=> (
                  <Chip {...getTagProps({ index:i })} key={opt.id} avatar={<Avatar src={opt.avatar}/>} label={opt.name} />
                ))}
                renderInput={(params)=> <TextField {...params} label="Co‑hosts" placeholder="Add people" />}
              />

              <Box className="rounded-2xl" sx={{ border:`1px solid ${EV.light}`, p: { xs: 2, sm: 3 } }}>
                <div className="flex items-center gap-2 mb-2"><SecurityRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} /><span className="font-semibold" style={{ fontSize: '14px' }}>Room policies</span></div>
                <FormGroup>
                  <FormControlLabel control={<Switch checked={lobbyReq} onChange={(e)=>setLobbyReq(e.target.checked)} />} label="Lobby required" />
                  <FormControlLabel control={<Switch checked={hostAdmit} onChange={(e)=>setHostAdmit(e.target.checked)} />} label="Host admit only" />
                  <FormControlLabel control={<Switch checked={recPreset} onChange={(e)=>setRecPreset(e.target.checked)} />} label="Recording preset on" />
                </FormGroup>
              </Box>

              <div className="grid grid-cols-2" style={{ gap: '8px' }}>
                <Button variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none', fontSize: { xs: '12px', sm: '14px' }, py: { xs: 0.75, sm: 1 } }} onClick={()=>{ setTitle(''); setDt(''); setCohosts([]); setLobbyReq(true); setHostAdmit(true); setRecPreset(true); }}>Reset</Button>
                <Button variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', fontSize: { xs: '12px', sm: '14px' }, py: { xs: 0.75, sm: 1 }, '&:hover':{ bgcolor:'#e06f00' } }} onClick={saveMeeting}>Save</Button>
              </div>
              <Button fullWidth variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', fontSize: { xs: '13px', sm: '15px' }, py: { xs: 1, sm: 1.25 }, '&:hover':{ bgcolor:'#e06f00' } }} onClick={startNow}>Start now</Button>
            </>
          )}

          {tab===1 && (
            <>
              <TextField fullWidth label="Join with code" value={joinCode} onChange={(e)=>setJoinCode(e.target.value)} placeholder="e.g., evz-xxxx-xxxx" size="small" sx={{ '& .MuiInputBase-input': { fontSize: { xs: '14px', sm: '15px' } } }} />
              <Divider><span style={{ fontSize: '12px', color: '#666' }}>or</span></Divider>
              <TextField fullWidth label="Join with link" value={joinLink} onChange={(e)=>setJoinLink(e.target.value)} placeholder="https://evzone.app/j/…" size="small" InputProps={{ startAdornment:(<InputAdornment position="start"><LinkRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} /></InputAdornment>) }} sx={{ '& .MuiInputBase-input': { fontSize: { xs: '14px', sm: '15px' } } }} />
              <Button fullWidth variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', fontSize: { xs: '13px', sm: '15px' }, py: { xs: 1, sm: 1.25 }, '&:hover':{ bgcolor:'#e06f00' } }} onClick={join}>Join</Button>
            </>
          )}

          {tab===2 && (
            <>
              <Box className="rounded-2xl" sx={{ border:`1px solid ${EV.light}`, p: { xs: 2, sm: 3 } }}>
                <div className="flex items-center gap-2 mb-1"><GroupAddRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} /><span className="font-semibold" style={{ fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{info.title}</span></div>
                <div style={{ fontSize: '13px', color: '#666' }}>{new Date(info.datetime).toLocaleString()}</div>
                <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>Code: <span className="font-mono">{info.code}</span></div>
                <div style={{ fontSize: '13px', color: '#666', wordBreak: 'break-all' }}>Link: {info.link}</div>
                <div className="mt-2 flex gap-2" style={{ gap: '8px', flexWrap: 'wrap' }}>
                  <Button startIcon={<ContentCopyRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} onClick={()=>copy(info.link)} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Copy</Button>
                  <Button startIcon={<ShareRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} onClick={()=>share({ title: info.title, url: info.link })} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 }, '&:hover':{ bgcolor:'#e06f00' } }}>Share</Button>
                </div>
              </Box>

              <Box className="rounded-2xl" sx={{ border:`1px solid ${EV.light}`, p: { xs: 2, sm: 3 } }}>
                <div className="font-semibold mb-1" style={{ fontSize: '14px' }}>Co‑hosts</div>
                {info.cohosts.length === 0 ? (
                  <div className="text-sm text-gray-600">None</div>
                ) : (
                  <List>
                    {info.cohosts.map(p => (
                      <ListItem key={p.id}>
                        <ListItemAvatar><Avatar src={p.avatar} /></ListItemAvatar>
                        <ListItemText primary={<span className="font-semibold">{p.name}</span>} />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>

              <Box className="rounded-2xl" sx={{ border:`1px solid ${EV.light}`, p: { xs: 2, sm: 3 } }}>
                <div className="font-semibold mb-1" style={{ fontSize: '14px' }}>Policies</div>
                <div className="flex flex-wrap" style={{ gap: '4px' }}>
                  <Chip size="small" label={info.lobbyReq ? 'Lobby on' : 'Lobby off'} sx={{ bgcolor: EV.light, fontSize: { xs: '10px', sm: '11px' }, height: { xs: 22, sm: 24 } }} />
                  <Chip size="small" label={info.hostAdmit ? 'Host admit only' : 'Any host can admit'} sx={{ bgcolor: EV.light, fontSize: { xs: '10px', sm: '11px' }, height: { xs: 22, sm: 24 } }} />
                  <Chip size="small" label={info.recPreset ? 'Recording preset on' : 'Recording off'} sx={{ bgcolor: EV.light, fontSize: { xs: '10px', sm: '11px' }, height: { xs: 22, sm: 24 } }} />
                </div>
              </Box>

              <div className="grid grid-cols-2" style={{ gap: '8px' }}>
                <Button variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none', fontSize: { xs: '12px', sm: '14px' }, py: { xs: 0.75, sm: 1 } }} onClick={()=>setTab(0)}>Edit</Button>
                <Button variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', fontSize: { xs: '12px', sm: '14px' }, py: { xs: 0.75, sm: 1 }, '&:hover':{ bgcolor:'#e06f00' } }} onClick={startNow}>Start meeting</Button>
              </div>
            </>
          )}
        </Box>
      </Box>

      <Snackbar open={!!snack} autoHideDuration={1500} message={snack} onClose={()=>setSnack('')} />
    </>
  );
}
