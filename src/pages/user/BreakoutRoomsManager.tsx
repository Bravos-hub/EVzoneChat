import { useEffect, useMemo, useState } from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Chip,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import TimelapseRoundedIcon from "@mui/icons-material/TimelapseRounded";
import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";

// const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

const INITIAL_PARTICIPANTS = [
  { id:'u1', name:'Leslie Alexander', avatar:'https://i.pravatar.cc/100?img=5', room:null },
  { id:'u2', name:'Etty Duke', avatar:'https://i.pravatar.cc/100?img=1', room:null },
  { id:'u3', name:'Richards', avatar:'https://i.pravatar.cc/100?img=12', room:null },
  { id:'u4', name:'Kayle', avatar:'https://i.pravatar.cc/100?img=11', room:null },
  { id:'u5', name:'KB', avatar:'https://i.pravatar.cc/100?img=13', room:null },
];

export default function BreakoutRoomsManager({ onBack }) {
  const muiTheme = useMuiTheme();
  const [rooms, setRooms] = useState([{ id:'r1', name:'Room 1', open:false }, { id:'r2', name:'Room 2', open:false }]);
  const [people, setPeople] = useState(INITIAL_PARTICIPANTS);
  const [timerMin, setTimerMin] = useState(10);
  const [remaining, setRemaining] = useState(null); // seconds
  const [broadcast, setBroadcast] = useState('');
  const [notice, setNotice] = useState('');

  // timer
  useEffect(()=>{
    if (remaining == null) return;
    if (remaining <= 0) { setNotice('Breakout timer ended'); setRemaining(null); return; }
    const id = setInterval(()=> setRemaining(s => (s ?? 0) - 1), 1000);
    return ()=> clearInterval(id);
  }, [remaining]);

  const openAll = () => setRooms(rs => rs.map(r => ({ ...r, open:true })));
  const closeAll = () => setRooms(rs => rs.map(r => ({ ...r, open:false })));
  const startTimer = () => setRemaining(timerMin * 60);
  const stopTimer = () => setRemaining(null);

  const assign = (userId, roomId) => setPeople(ps => ps.map(p => p.id===userId ? { ...p, room: roomId } : p));
  const move = (userId, roomId) => assign(userId, roomId);
  // eslint-disable-next-line no-unused-vars
  const unassign = (userId) => assign(userId, null);

  const randomize = () => {
    const rs = rooms.map(r=>r.id);
    setPeople(ps => ps.map((p, i) => ({ ...p, room: rs[i % rs.length] })));
  };

  const sendBroadcast = () => { if (!broadcast.trim()) return; setNotice(`Broadcast sent: ${broadcast.trim()}`); setBroadcast(''); };

  const groups = useMemo(()=> ({
    unassigned: people.filter(p => !p.room),
    byRoom: rooms.reduce((acc, r) => ({ ...acc, [r.id]: people.filter(p => p.room === r.id) }), {})
  }), [people, rooms]);

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: 'transparent' }}>
        <AppBar elevation={0} position="static" sx={{ bgcolor: 'transparent', color:'text.primary', borderBottom:`1px solid ${muiTheme.palette.divider}` }}>
          <Toolbar className="!min-h-[56px]" sx={{ px: { xs: 1.5, sm: 3 } }}>
            <IconButton onClick={onBack} aria-label="Back" sx={{ color: 'text.primary', padding: { xs: '6px', sm: '8px' } }}>
              <ArrowBackRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <Typography variant="h6" className="font-bold" sx={{ color: 'text.primary', fontSize: { xs: '16px', sm: '18px' }, ml: { xs: 0.5, sm: 1 } }}>Breakout Rooms</Typography>
          </Toolbar>
        </AppBar>

        {notice && <Alert severity="info" onClose={()=>setNotice('')} sx={{ m: { xs: 2, sm: 3 } }}>{notice}</Alert>}

        <Box sx={{ p: { xs: 2, sm: 3 }, '& > * + *': { mt: { xs: 2, sm: 3 } } }}>
          {/* room controls */}
          <div className="grid grid-cols-3" style={{ gap: '8px' }}>
            <Button startIcon={<GroupAddRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} variant="outlined" sx={{ textTransform:'none', fontSize: { xs: '11px', sm: '12px' }, py: { xs: 0.5, sm: 0.75 } }} onClick={()=>setRooms(rs => [...rs, { id:`r${rs.length+1}`, name:`Room ${rs.length+1}`, open:false }])}>Add room</Button>
            <Button startIcon={<ShuffleRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} variant="outlined" sx={{ textTransform:'none', fontSize: { xs: '11px', sm: '12px' }, py: { xs: 0.5, sm: 0.75 } }} onClick={randomize}>Randomize</Button>
            {!rooms.some(r=>r.open) ? (
              <Button variant="contained" sx={{ textTransform:'none', fontSize: { xs: '11px', sm: '12px' }, py: { xs: 0.5, sm: 0.75 } }} onClick={openAll}>Open all</Button>
            ) : (
              <Button variant="contained" sx={{ bgcolor:'#e53935', textTransform:'none', fontSize: { xs: '11px', sm: '12px' }, py: { xs: 0.5, sm: 0.75 }, '&:hover':{ bgcolor:'#c62828' } }} onClick={closeAll}>Close all</Button>
            )}
          </div>

          <Divider />

          {/* timer + broadcast */}
          <div className="grid grid-cols-3 items-end" style={{ gap: '8px' }}>
            <TextField 
              label="Timer (min)" 
              type="number" 
              size="small" 
              value={timerMin} 
              onChange={(e)=>setTimerMin(parseInt(e.target.value||'0',10))}
              sx={{
                '& .MuiInputBase-input': {
                  color: 'text.primary',
                  fontSize: { xs: '13px', sm: '14px' },
                },
              }}
            />
            {!remaining ? (
              <Button startIcon={<TimelapseRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} variant="outlined" sx={{ textTransform:'none', fontSize: { xs: '11px', sm: '12px' }, py: { xs: 0.5, sm: 0.75 } }} onClick={startTimer}>Start</Button>
            ) : (
              <Button startIcon={<TimelapseRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} variant="outlined" sx={{ textTransform:'none', fontSize: { xs: '11px', sm: '12px' }, py: { xs: 0.5, sm: 0.75 } }} onClick={stopTimer}>Stop</Button>
            )}
            <div className="text-right" style={{ color: muiTheme.palette.text.secondary, fontSize: '13px' }}>{remaining != null ? `${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}` : '—:—'}</div>
          </div>

          <div className="grid grid-cols-3 items-end" style={{ gap: '8px' }}>
            <TextField 
              label="Broadcast message" 
              size="small" 
              value={broadcast} 
              onChange={(e)=>setBroadcast(e.target.value)}
              sx={{
                '& .MuiInputBase-input': {
                  color: 'text.primary',
                  fontSize: { xs: '13px', sm: '14px' },
                },
              }}
            />
            <div />
            <Button startIcon={<CampaignRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} variant="contained" sx={{ textTransform:'none', fontSize: { xs: '11px', sm: '12px' }, py: { xs: 0.5, sm: 0.75 } }} onClick={sendBroadcast}>Broadcast</Button>
          </div>

          <Divider />

          {/* Unassigned */}
          <div className="flex items-center justify-between">
            <Typography variant="subtitle2" className="font-semibold" sx={{ color: 'text.primary', fontSize: { xs: '13px', sm: '14px' } }}>Unassigned</Typography>
            <Chip size="small" label={groups.unassigned.length} sx={{ bgcolor: 'background.default', color: 'text.primary', fontSize: { xs: '11px', sm: '12px' }, height: { xs: 22, sm: 24 } }} />
          </div>
          <List className="no-scrollbar" sx={{ maxHeight: { xs: 140, sm: 160 }, overflowY:'auto', border:`1px solid ${muiTheme.palette.divider}`, borderRadius: 2, bgcolor: 'background.paper' }}>
            {groups.unassigned.map(p => (
              <ListItem key={p.id} secondaryAction={
                <FormControl size="small" sx={{ minWidth: { xs: 90, sm: 110 } }}>
                  <InputLabel sx={{ fontSize: { xs: '12px', sm: '14px' } }}>Assign</InputLabel>
                  <Select label="Assign" value={p.room || ''} onChange={(e)=>assign(p.id, e.target.value)} sx={{ fontSize: { xs: '12px', sm: '14px' } }}>
                    <MenuItem value="" sx={{ fontSize: { xs: '12px', sm: '14px' } }}><em>None</em></MenuItem>
                    {rooms.map(r => (<MenuItem key={r.id} value={r.id} sx={{ fontSize: { xs: '12px', sm: '14px' } }}>{r.name}</MenuItem>))}
                  </Select>
                </FormControl>
              } sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1, sm: 1.25 } }}>
                <ListItemAvatar><Avatar src={p.avatar} sx={{ width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 } }} /></ListItemAvatar>
                <ListItemText 
                  primary={<span className="font-semibold" style={{ fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>} 
                  secondary={<span style={{ fontSize: '12px' }}>Tap assign to move</span>} 
                />
              </ListItem>
            ))}
          </List>

          {/* Rooms */}
          {rooms.map(r => (
            <Box key={r.id} sx={{ mt: { xs: 1.5, sm: 2 } }}>
              <div className="flex items-center justify-between">
                <Typography variant="subtitle2" className="font-semibold" sx={{ color: 'text.primary', fontSize: { xs: '13px', sm: '14px' }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name} {r.open ? '• Open' : '• Closed'}</Typography>
                <Chip size="small" label={(groups.byRoom[r.id] || []).length} sx={{ bgcolor: 'background.default', color: 'text.primary', fontSize: { xs: '11px', sm: '12px' }, height: { xs: 22, sm: 24 } }} />
              </div>
              <List className="no-scrollbar" sx={{ maxHeight: { xs: 140, sm: 160 }, overflowY:'auto', border:`1px solid ${muiTheme.palette.divider}`, borderRadius: 2, bgcolor: 'background.paper' }}>
                {(groups.byRoom[r.id] || []).map(p => (
                  <ListItem 
                    key={p.id} 
                    secondaryAction={
                      <FormControl size="small" sx={{ minWidth: { xs: 90, sm: 110 } }}>
                        <InputLabel sx={{ fontSize: { xs: '12px', sm: '14px' } }}>Move to</InputLabel>
                        <Select label="Move to" value={p.room} onChange={(e)=>move(p.id, e.target.value)} sx={{ fontSize: { xs: '12px', sm: '14px' } }}>
                          {rooms.map(rr => (<MenuItem key={rr.id} value={rr.id} sx={{ fontSize: { xs: '12px', sm: '14px' } }}>{rr.name}</MenuItem>))}
                          <MenuItem value="" sx={{ fontSize: { xs: '12px', sm: '14px' } }}>Unassigned</MenuItem>
                        </Select>
                      </FormControl>
                    }
                    sx={{
                      px: { xs: 2, sm: 3 },
                      py: { xs: 1, sm: 1.25 },
                      '& .MuiListItemText-primary': {
                        color: 'text.primary',
                        fontSize: { xs: '14px', sm: '15px' },
                      },
                      '& .MuiListItemText-secondary': {
                        color: 'text.secondary',
                        fontSize: { xs: '11px', sm: '12px' },
                      },
                    }}
                  >
                    <ListItemAvatar><Avatar src={p.avatar} sx={{ width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 } }} /></ListItemAvatar>
                    <ListItemText 
                      primary={<span className="font-semibold" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>} 
                      secondary={<span>{`In ${r.name}`}</span>} 
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}
