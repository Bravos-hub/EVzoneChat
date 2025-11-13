import React, { useMemo, useState, useEffect } from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { useLocation } from "react-router-dom";
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
  const muiTheme = useMuiTheme();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]); // ids
  const [forwardingMessages, setForwardingMessages] = useState(null);

  const filtered = useMemo(() => {
    const s = query.trim().toLowerCase();
    if (!s) return PEOPLE;
    return PEOPLE.filter(p => (p.name + ' ' + p.role).toLowerCase().includes(s));
  }, [query]);

  const toggle = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // Check if we're forwarding messages
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const forwardParam = params.get('forward');
    if (forwardParam) {
      setForwardingMessages(forwardParam.split(','));
    }
  }, [location.search]);

  const chips = selected.map(id => PEOPLE.find(p => p.id === id)).filter(Boolean);

  const handleStart = () => {
    if (selected.length === 0) return;
    
    // If forwarding messages, pass them along
    if (forwardingMessages) {
      onStart?.(selected, forwardingMessages);
    } else {
      onStart?.(selected);
    }
  };

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: 'background.paper' }}>
        <AppBar elevation={0} position="static" sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom: `1px solid ${muiTheme.palette.divider}` }}>
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={onClose} aria-label="Close"><CloseRoundedIcon /></IconButton>
            <Typography variant="h6" className="font-bold ml-1">New Message</Typography>
          </Toolbar>
        </AppBar>

        {/* To: chips + search */}
        <Box className="px-3 pt-3">
          <div className="text-xs mb-1" style={{ color: muiTheme.palette.text.secondary }}>To:</div>
          <div className="flex gap-2 flex-wrap mb-2">
            {chips.map((c) => (
              <Chip key={c.id} avatar={<Avatar src={c.avatar} />} label={c.name} onDelete={() => toggle(c.id)} sx={{ bgcolor: 'background.default', color: 'text.primary' }} />
            ))}
          </div>
          <TextField
            fullWidth size="small" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search people & groups"
            InputProps={{ 
              startAdornment:(<InputAdornment position="start"><SearchRoundedIcon sx={{ color: 'text.secondary' }} /></InputAdornment>) 
            }}
            sx={{
              '& .MuiInputBase-input': {
                color: 'text.primary',
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'text.secondary',
                opacity: 1,
              },
            }}
          />
        </Box>

        {/* list */}
        <Box className="flex-1 mt-2" sx={{ overflowY:'auto', '&::-webkit-scrollbar':{ display:'none' }, scrollbarWidth:'none', msOverflowStyle:'none' }}>
          <List>
            {filtered.map((p, idx) => (
              <React.Fragment key={p.id}>
                <ListItem 
                  button 
                  onClick={()=>toggle(p.id)}
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: 'text.primary',
                    },
                    '& .MuiListItemText-secondary': {
                      color: 'text.secondary',
                    },
                  }}
                >
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
          <Button 
            fullWidth 
            disabled={selected.length===0} 
            onClick={handleStart} 
            variant="contained" 
            size="large" 
            sx={{ textTransform:'none' }}
          >
            {forwardingMessages ? 'Forward' : 'Start chat'}{selected.length>0?` (${selected.length})`:''}
          </Button>
        </Box>
      </Box>
    </>
  );
}
