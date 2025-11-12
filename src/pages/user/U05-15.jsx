import React, { useEffect, useMemo, useState } from "react";
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

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

const INITIAL_PARTICIPANTS = [
  { id:'u1', name:'Leslie Alexander', avatar:'https://i.pravatar.cc/100?img=5', room:null },
  { id:'u2', name:'Etty Duke', avatar:'https://i.pravatar.cc/100?img=1', room:null },
  { id:'u3', name:'Richards', avatar:'https://i.pravatar.cc/100?img=12', room:null },
  { id:'u4', name:'Kayle', avatar:'https://i.pravatar.cc/100?img=11', room:null },
  { id:'u5', name:'KB', avatar:'https://i.pravatar.cc/100?img=13', room:null },
];

export default function BreakoutRoomsManager({ onBack }) {
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

      <Box className="w-full h-full max-w-sm mx-auto bg-white flex flex-col">
        <AppBar elevation={0} position="static" sx={{ bgcolor:'#fff', color:'#111', borderBottom:`1px solid ${EV.light}` }}>
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={onBack} aria-label="Back"><ArrowBackRoundedIcon /></IconButton>
            <Typography variant="h6" className="font-bold ml-1">Breakout Rooms</Typography>
          </Toolbar>
        </AppBar>

        {notice && <Alert severity="info" onClose={()=>setNotice('')} className="m-3">{notice}</Alert>}

        <Box className="p-3 space-y-3">
          {/* room controls */}
          <div className="grid grid-cols-3 gap-2">
            <Button startIcon={<GroupAddRoundedIcon/>} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }} onClick={()=>setRooms(rs => [...rs, { id:`r${rs.length+1}`, name:`Room ${rs.length+1}`, open:false }])}>Add room</Button>
            <Button startIcon={<ShuffleRoundedIcon/>} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }} onClick={randomize}>Randomize</Button>
            {!rooms.some(r=>r.open) ? (
              <Button variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }} onClick={openAll}>Open all</Button>
            ) : (
              <Button variant="contained" sx={{ bgcolor:'#e53935', textTransform:'none', '&:hover':{ bgcolor:'#c62828' } }} onClick={closeAll}>Close all</Button>
            )}
          </div>

          <Divider />

          {/* timer + broadcast */}
          <div className="grid grid-cols-3 gap-2 items-end">
            <TextField label="Timer (min)" type="number" size="small" value={timerMin} onChange={(e)=>setTimerMin(parseInt(e.target.value||'0',10))} />
            {!remaining ? (
              <Button startIcon={<TimelapseRoundedIcon/>} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }} onClick={startTimer}>Start</Button>
            ) : (
              <Button startIcon={<TimelapseRoundedIcon/>} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }} onClick={stopTimer}>Stop</Button>
            )}
            <div className="text-right text-sm text-gray-600">{remaining != null ? `${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}` : '—:—'}</div>
          </div>

          <div className="grid grid-cols-3 gap-2 items-end">
            <TextField label="Broadcast message" size="small" value={broadcast} onChange={(e)=>setBroadcast(e.target.value)} />
            <div />
            <Button startIcon={<CampaignRoundedIcon/>} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }} onClick={sendBroadcast}>Broadcast</Button>
          </div>

          <Divider />

          {/* Unassigned */}
          <div className="flex items-center justify-between">
            <Typography variant="subtitle2" className="font-semibold">Unassigned</Typography>
            <Chip size="small" label={groups.unassigned.length} sx={{ bgcolor: EV.light }} />
          </div>
          <List className="no-scrollbar" sx={{ maxHeight: 160, overflowY:'auto', border:`1px solid ${EV.light}`, borderRadius: 2 }}>
            {groups.unassigned.map(p => (
              <ListItem key={p.id} secondaryAction={
                <FormControl size="small" sx={{ minWidth: 110 }}>
                  <InputLabel>Assign</InputLabel>
                  <Select label="Assign" value={p.room || ''} onChange={(e)=>assign(p.id, e.target.value)}>
                    <MenuItem value=""><em>None</em></MenuItem>
                    {rooms.map(r => (<MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>))}
                  </Select>
                </FormControl>
              }>
                <ListItemAvatar><Avatar src={p.avatar} /></ListItemAvatar>
                <ListItemText primary={<span className="font-semibold">{p.name}</span>} secondary="Tap assign to move" />
              </ListItem>
            ))}
          </List>

          {/* Rooms */}
          {rooms.map(r => (
            <Box key={r.id} className="mt-2">
              <div className="flex items-center justify-between">
                <Typography variant="subtitle2" className="font-semibold">{r.name} {r.open ? '• Open' : '• Closed'}</Typography>
                <Chip size="small" label={(groups.byRoom[r.id] || []).length} sx={{ bgcolor: EV.light }} />
              </div>
              <List className="no-scrollbar" sx={{ maxHeight: 160, overflowY:'auto', border:`1px solid ${EV.light}`, borderRadius: 2 }}>
                {(groups.byRoom[r.id] || []).map(p => (
                  <ListItem key={p.id} secondaryAction={
                    <FormControl size="small" sx={{ minWidth: 110 }}>
                      <InputLabel>Move to</InputLabel>
                      <Select label="Move to" value={p.room} onChange={(e)=>move(p.id, e.target.value)}>
                        {rooms.map(rr => (<MenuItem key={rr.id} value={rr.id}>{rr.name}</MenuItem>))}
                        <MenuItem value="">Unassigned</MenuItem>
                      </Select>
                    </FormControl>
                  }>
                    <ListItemAvatar><Avatar src={p.avatar} /></ListItemAvatar>
                    <ListItemText primary={<span className="font-semibold">{p.name}</span>} secondary={`In ${r.name}`} />
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
