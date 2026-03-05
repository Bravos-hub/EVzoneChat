import React from 'react';
import { useMemo, useState } from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { useTheme } from "../../context/ThemeContext";
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
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Chip,
  Button
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

const PEOPLE = [
  { id:'u1', name:'Etty Duke', avatar:'https://i.pravatar.cc/100?img=1' },
  { id:'u2', name:'Leslie Alexander', avatar:'https://i.pravatar.cc/100?img=5' },
];
const CHANNELS = [
  { id:'c1', name:'#announcements' },
  { id:'c2', name:'#charging-crew' },
];
const GROUPS = [
  { id:'g1', name:'Team Alpha', avatar:'https://i.pravatar.cc/100?img=15', members: 12 },
  { id:'g2', name:'Project Beta', avatar:'https://i.pravatar.cc/100?img=16', members: 8 },
];
const MESSAGES = [
  { id:'m1', who: PEOPLE[1], snippet:'Meet at 3 pm — bringing the PDF.', time:'Yesterday' },
  { id:'m2', who: PEOPLE[0], snippet:'Invoice sent. Please confirm.', time:'Tue' },
];
const THREAD = [
  { id:'t1', who: PEOPLE[1], text:'Perfect. Also, can you check the PDF I shared?', time:'07:34 PM' },
  { id:'t2', who: { id:'me', name:'You', avatar:'https://i.pravatar.cc/100?img=2' }, text:'Yes. I will send the meet link here.', time:'07:33 PM' },
  { id:'t3', who: PEOPLE[1], text:'Hi! Do we still meet at 3 pm?', time:'07:32 PM' },
];

function highlight(text, q, muiTheme){
  if(!q) return text;
  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")})`, 'gi'));
  const highlightColor = muiTheme?.palette?.mode === 'dark' ? '#ffd700' : '#fef08a';
  return parts.map((p,i)=> p.toLowerCase()===q.toLowerCase()? <mark key={i} style={{ backgroundColor: highlightColor, padding: '0 2px', borderRadius: '2px' }}>{p}</mark> : <span key={i}>{p}</span>);
}

export default function SearchGlobalInThread({ onBack, onOpenResult }) {
  const muiTheme = useMuiTheme();
  const { accentColor } = useTheme();
  const [tab, setTab] = useState(0); // 0 global, 1 in-thread
  const [q, setQ] = useState("");
  const [activeFilters, setActiveFilters] = useState(new Set(['people', 'channels', 'groups', 'messages']));

  const toggleFilter = (filterType) => {
    setActiveFilters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(filterType)) {
        newSet.delete(filterType);
      } else {
        newSet.add(filterType);
      }
      return newSet;
    });
  };

  const applyFilters = () => {
    // Filters are already applied in real-time via activeFilters state
    // This button can be used to reset or confirm, but for now it just applies immediately
  };

  const globalResults = useMemo(()=>{
    const s = q.trim().toLowerCase();
    const baseResults = {
      people: !s ? PEOPLE : PEOPLE.filter(p => p.name.toLowerCase().includes(s)),
      channels: !s ? CHANNELS : CHANNELS.filter(c => c.name.toLowerCase().includes(s)),
      groups: !s ? GROUPS : GROUPS.filter(g => g.name.toLowerCase().includes(s)),
      messages: !s ? MESSAGES : MESSAGES.filter(m => m.snippet.toLowerCase().includes(s)),
    };
    
    // Apply filters
    return {
      people: activeFilters.has('people') ? baseResults.people : [],
      channels: activeFilters.has('channels') ? baseResults.channels : [],
      groups: activeFilters.has('groups') ? baseResults.groups : [],
      messages: activeFilters.has('messages') ? baseResults.messages : [],
    };
  }, [q, activeFilters]);

  const threadResults = useMemo(()=>{
    const s = q.trim().toLowerCase();
    if(!s) return THREAD;
    return THREAD.filter(t => t.text.toLowerCase().includes(s));
  }, [q]);

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: 'transparent' }}>
        <AppBar elevation={0} position="static" sx={{ bgcolor: 'transparent', color:'text.primary', borderBottom:`1px solid ${muiTheme.palette.divider}` }}>
          <Toolbar className="!min-h-[56px]" sx={{ px: { xs: 1.5, sm: 3 } }}>
            <IconButton onClick={onBack} aria-label="Back" sx={{ color: 'text.primary', padding: { xs: '6px', sm: '8px' } }}>
              <ArrowBackRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <Typography variant="h6" className="font-bold" sx={{ color: 'text.primary', fontSize: { xs: '16px', sm: '18px' }, ml: { xs: 0.5, sm: 1 } }}>Search</Typography>
          </Toolbar>
        </AppBar>

        <Tabs value={tab} onChange={(e,v)=>setTab(v)} textColor="inherit" TabIndicatorProps={{ style:{ background: EV.green } }} sx={{ '& .MuiTab-root': { fontSize: { xs: '13px', sm: '14px' }, minHeight: { xs: 44, sm: 48 }, px: { xs: 1.5, sm: 2 } } }}>
          <Tab label="Global"/>
          <Tab label="In Thread"/>
        </Tabs>

        {/* Search input */}
        <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
          <TextField
            fullWidth size="small" value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search people, channels, groups, messages"
            InputProps={{ 
              startAdornment:(<InputAdornment position="start"><SearchRoundedIcon sx={{ color: 'text.secondary', fontSize: { xs: 18, sm: 20 } }} /></InputAdornment>) 
            }}
            sx={{
              '& .MuiInputBase-input': {
                color: 'text.primary',
                fontSize: { xs: '14px', sm: '15px' },
                py: { xs: 1.25, sm: 1.5 }
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'text.secondary',
                opacity: 1,
              },
            }}
          />
        </Box>

        {/* Results */}
        <Box className="flex-1 no-scrollbar" sx={{ overflowY:'auto' }}>
          {tab === 0 && (
            <>
              {/* People */}
              {activeFilters.has('people') && globalResults.people.length > 0 && (
                <>
                  <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
                    <Typography variant="caption" sx={{ fontSize: { xs: '10px', sm: '12px' }, color: 'text.secondary', textTransform: 'uppercase', fontWeight: 600 }}>People</Typography>
                  </Box>
                  <List>
                    {globalResults.people.map((p, idx)=> (
                  <React.Fragment key={p.id}>
                    <ListItem 
                      button 
                      onClick={()=>onOpenResult?.({ type:'person', id:p.id, name:p.name })}
                      sx={{
                        px: { xs: 2, sm: 3 },
                        py: { xs: 1, sm: 1.25 },
                        '& .MuiListItemText-primary': {
                          color: 'text.primary',
                          fontSize: { xs: '14px', sm: '15px' },
                        },
                      }}
                    >
                      <ListItemAvatar><Avatar src={p.avatar} sx={{ width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 } }} /></ListItemAvatar>
                      <ListItemText primary={<span className="font-semibold" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{highlight(p.name, q, muiTheme)}</span>} />
                    </ListItem>
                      {idx < globalResults.people.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                  </List>
                </>
              )}

              {/* Channels */}
              {activeFilters.has('channels') && globalResults.channels.length > 0 && (
                <>
                  <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
                    <Typography variant="caption" sx={{ fontSize: { xs: '10px', sm: '12px' }, color: 'text.secondary', textTransform: 'uppercase', fontWeight: 600 }}>Channels</Typography>
                  </Box>
                  <List>
                    {globalResults.channels.map((c, idx)=> (
                  <React.Fragment key={c.id}>
                    <ListItem 
                      button 
                      onClick={()=>onOpenResult?.({ type:'channel', id:c.id })}
                      sx={{
                        px: { xs: 2, sm: 3 },
                        py: { xs: 1, sm: 1.25 },
                        '& .MuiListItemText-primary': {
                          color: 'text.primary',
                          fontSize: { xs: '14px', sm: '15px' },
                        },
                      }}
                    >
                      <ListItemAvatar><Avatar sx={{ bgcolor: 'background.default', color: 'text.primary', width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 } }}>#</Avatar></ListItemAvatar>
                      <ListItemText primary={<span className="font-semibold" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{highlight(c.name, q, muiTheme)}</span>} />
                    </ListItem>
                      {idx < globalResults.channels.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                  </List>
                </>
              )}

              {/* Groups */}
              {activeFilters.has('groups') && globalResults.groups.length > 0 && (
                <>
                  <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
                    <Typography variant="caption" sx={{ fontSize: { xs: '10px', sm: '12px' }, color: 'text.secondary', textTransform: 'uppercase', fontWeight: 600 }}>Groups</Typography>
                  </Box>
                  <List>
                    {globalResults.groups.map((g, idx)=> (
                  <React.Fragment key={g.id}>
                    <ListItem 
                      button 
                      onClick={()=>onOpenResult?.({ type:'group', id:g.id, name:g.name })}
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
                      <ListItemAvatar><Avatar src={g.avatar} sx={{ width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 } }} /></ListItemAvatar>
                      <ListItemText 
                        primary={<span className="font-semibold" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{highlight(g.name, q, muiTheme)}</span>} 
                        secondary={<span>{g.members} members</span>}
                      />
                    </ListItem>
                      {idx < globalResults.groups.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                  </List>
                </>
              )}

              {/* Messages */}
              {activeFilters.has('messages') && globalResults.messages.length > 0 && (
                <>
                  <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
                    <Typography variant="caption" sx={{ fontSize: { xs: '10px', sm: '12px' }, color: 'text.secondary', textTransform: 'uppercase', fontWeight: 600 }}>Messages</Typography>
                  </Box>
                  <List>
                    {globalResults.messages.map((m, idx)=> (
                  <React.Fragment key={m.id}>
                    <ListItem 
                      button 
                      onClick={()=>onOpenResult?.({ type:'message', id:m.id })}
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
                      <ListItemAvatar><Avatar src={m.who.avatar} sx={{ width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 } }} /></ListItemAvatar>
                      <ListItemText 
                        primary={<span className="font-semibold" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{highlight(m.who.name, q, muiTheme)}</span>} 
                        secondary={<span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{highlight(m.snippet, q, muiTheme)}</span>} 
                      />
                      <Typography variant="caption" sx={{ fontSize: { xs: '10px', sm: '11px' }, color: 'text.secondary', ml: { xs: 1, sm: 2 }, flexShrink: 0 }}>{m.time}</Typography>
                    </ListItem>
                      {idx < globalResults.messages.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                  </List>
                </>
              )}
            </>
          )}

          {tab === 1 && (
            <List>
              {threadResults.map((t, idx)=> (
                <React.Fragment key={t.id}>
                  <ListItem 
                    button
                    onClick={()=>onOpenResult?.({ type:'thread', id:t.id })}
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
                    <ListItemAvatar><Avatar src={t.who.avatar} sx={{ width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 } }} /></ListItemAvatar>
                    <ListItemText 
                      primary={<span className="font-semibold" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.who.name}</span>} 
                      secondary={<span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{highlight(t.text, q, muiTheme)}</span>} 
                    />
                    <Typography variant="caption" sx={{ fontSize: { xs: '10px', sm: '11px' }, color: 'text.secondary', ml: { xs: 1, sm: 2 }, flexShrink: 0 }}>{t.time}</Typography>
                  </ListItem>
                  {idx < threadResults.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>

        {/* quick filters */}
        {tab===0 && (
          <Box sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 }, pt: { xs: 1.5, sm: 2 } }}>
            <div className="flex gap-2 flex-wrap" style={{ gap: '8px' }}>
              {['people','channels','groups','messages'].map(k => (
                <Chip 
                  key={k} 
                  label={`Filter: ${k}`} 
                  onClick={() => toggleFilter(k)}
                  sx={{ 
                    border:`1px solid ${accentColor}`, 
                    color: activeFilters.has(k) ? '#fff' : accentColor,
                    bgcolor: activeFilters.has(k) ? accentColor : 'transparent',
                    fontSize: { xs: '11px', sm: '12px' }, 
                    height: { xs: 24, sm: 28 },
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: activeFilters.has(k) ? accentColor : `${accentColor}20`,
                      opacity: 0.9
                    }
                  }} 
                  variant={activeFilters.has(k) ? "filled" : "outlined"} 
                />
              ))}
              <Button 
                variant="contained" 
                onClick={applyFilters}
                sx={{ 
                  bgcolor: accentColor, 
                  textTransform:'none', 
                  fontSize: { xs: '12px', sm: '13px' }, 
                  py: { xs: 0.5, sm: 0.75 }, 
                  '&:hover':{ bgcolor: accentColor, opacity: 0.9 } 
                }}
              >
                Apply
              </Button>
            </div>
          </Box>
        )}
      </Box>
    </>
  );
}
