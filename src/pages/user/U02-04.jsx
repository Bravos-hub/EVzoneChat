import React, { useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Checkbox,
  Divider,
  Button
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

const PEOPLE = [
  { id: 'u1', name: 'Etty Duke', role: 'Rides • Driver', avatar: 'https://i.pravatar.cc/100?img=1' },
  { id: 'u2', name: 'Leslie Alexander', role: 'School • Tutor', avatar: 'https://i.pravatar.cc/100?img=5' },
  { id: 'u3', name: 'EVzone Support', role: 'Marketplace • Support', avatar: 'https://i.pravatar.cc/100?img=8' },
  { id: 'u4', name: 'Dr. Cohen', role: 'Medical • Doctor', avatar: 'https://i.pravatar.cc/100?img=12' },
  { id: 'g1', name: 'Charging Crew — Kampala', role: 'Charging • Group', avatar: 'https://i.pravatar.cc/100?img=15' },
  { id: 'g2', name: 'Workspace Team A', role: 'Workspace • Channel', avatar: 'https://i.pravatar.cc/100?img=17' },
];

export default function NewMessagePicker({ onClose, onStart }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]); // ids

  const filtered = useMemo(() => {
    const s = query.trim().toLowerCase();
    if (!s) return PEOPLE;
    return PEOPLE.filter(p => (p.name + ' ' + p.role).toLowerCase().includes(s));
  }, [query]);

  const toggle = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const chips = selected.map(id => PEOPLE.find(p => p.id === id)).filter(Boolean);

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full max-w-sm mx-auto bg-white flex flex-col">
        <AppBar elevation={0} position="static" sx={{ bgcolor:'#fff', color:'#111', borderBottom:`1px solid ${EV.light}` }}>
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={onClose} aria-label="Close"><CloseRoundedIcon /></IconButton>
            <Typography variant="h6" className="font-bold ml-1">New Message</Typography>
          </Toolbar>
        </AppBar>

        {/* To: chips + search */}
        <Box className="px-3 pt-3">
          <div className="text-xs text-gray-600 mb-1">To:</div>
          <div className="flex gap-2 flex-wrap mb-2">
            {chips.map((c) => (
              <Chip key={c.id} avatar={<Avatar src={c.avatar} />} label={c.name} onDelete={() => toggle(c.id)} sx={{ bgcolor: EV.light }} />
            ))}
          </div>
          <TextField
            fullWidth size="small" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search people & groups"
            InputProps={{ startAdornment:(<InputAdornment position="start"><SearchRoundedIcon /></InputAdornment>) }}
          />
        </Box>

        {/* list */}
        <Box className="flex-1 mt-2" sx={{ overflowY:'auto', '&::-webkit-scrollbar':{ display:'none' }, scrollbarWidth:'none', msOverflowStyle:'none' }}>
          <List>
            {filtered.map((p, idx) => (
              <React.Fragment key={p.id}>
                <ListItem button onClick={()=>toggle(p.id)}>
                  <ListItemAvatar><Avatar src={p.avatar} /></ListItemAvatar>
                  <ListItemText primary={<span className="font-semibold">{p.name}</span>} secondary={p.role} />
                  <Checkbox edge="end" checked={selected.includes(p.id)} sx={{ color: EV.orange, '&.Mui-checked': { color: EV.orange } }} />
                </ListItem>
                {idx < filtered.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Box>

        {/* action bar */}
        <Box className="p-3">
          <Button fullWidth disabled={selected.length===0} onClick={()=>onStart?.(selected)} variant="contained" size="large" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover': { bgcolor: '#e06f00' } }}>
            Start chat{selected.length>0?` (${selected.length})`:''}
          </Button>
        </Box>
      </Box>
    </>
  );
}
