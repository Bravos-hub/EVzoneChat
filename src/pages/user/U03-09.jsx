import React, { useMemo, useState } from "react";
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

  const globalResults = useMemo(()=>{
    const s = q.trim().toLowerCase();
    if(!s) return { people: PEOPLE, channels: CHANNELS, groups: GROUPS, messages: MESSAGES };
    return {
      people: PEOPLE.filter(p => p.name.toLowerCase().includes(s)),
      channels: CHANNELS.filter(c => c.name.toLowerCase().includes(s)),
      groups: GROUPS.filter(g => g.name.toLowerCase().includes(s)),
      messages: MESSAGES.filter(m => m.snippet.toLowerCase().includes(s)),
    };
  }, [q]);

  const threadResults = useMemo(()=>{
    const s = q.trim().toLowerCase();
    if(!s) return THREAD;
    return THREAD.filter(t => t.text.toLowerCase().includes(s));
  }, [q]);

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: 'background.paper' }}>
        <AppBar elevation={0} position="static" sx={{ bgcolor:'background.paper', color:'text.primary', borderBottom:`1px solid ${muiTheme.palette.divider}` }}>
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={onBack} aria-label="Back" sx={{ color: 'text.primary' }}><ArrowBackRoundedIcon /></IconButton>
            <Typography variant="h6" className="font-bold ml-1" sx={{ color: 'text.primary' }}>Search</Typography>
          </Toolbar>
        </AppBar>

        <Tabs value={tab} onChange={(e,v)=>setTab(v)} textColor="inherit" TabIndicatorProps={{ style:{ background: EV.green } }}>
          <Tab label="Global"/>
          <Tab label="In Thread"/>
        </Tabs>

        {/* Search input */}
        <Box className="px-3 py-2">
          <TextField
            fullWidth size="small" value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search people, channels, groups, messages"
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

        {/* Results */}
        <Box className="flex-1 no-scrollbar" sx={{ overflowY:'auto' }}>
          {tab === 0 && (
            <>
              {/* People */}
              <div className="px-3 py-2 text-xs" style={{ color: muiTheme.palette.text.secondary }}>People</div>
              <List>
                {globalResults.people.map((p, idx)=> (
                  <React.Fragment key={p.id}>
                    <ListItem 
                      button 
                      onClick={()=>onOpenResult?.({ type:'person', id:p.id })}
                      sx={{
                        '& .MuiListItemText-primary': {
                          color: 'text.primary',
                        },
                      }}
                    >
                      <ListItemAvatar><Avatar src={p.avatar} /></ListItemAvatar>
                      <ListItemText primary={<span className="font-semibold">{highlight(p.name, q, muiTheme)}</span>} />
                    </ListItem>
                    {idx < globalResults.people.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>

              {/* Channels */}
              <div className="px-3 py-2 text-xs" style={{ color: muiTheme.palette.text.secondary }}>Channels</div>
              <List>
                {globalResults.channels.map((c, idx)=> (
                  <React.Fragment key={c.id}>
                    <ListItem 
                      button 
                      onClick={()=>onOpenResult?.({ type:'channel', id:c.id })}
                      sx={{
                        '& .MuiListItemText-primary': {
                          color: 'text.primary',
                        },
                      }}
                    >
                      <ListItemAvatar><Avatar sx={{ bgcolor: 'background.default', color: 'text.primary' }}>#</Avatar></ListItemAvatar>
                      <ListItemText primary={<span className="font-semibold">{highlight(c.name, q, muiTheme)}</span>} />
                    </ListItem>
                    {idx < globalResults.channels.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>

              {/* Groups */}
              <div className="px-3 py-2 text-xs" style={{ color: muiTheme.palette.text.secondary }}>Groups</div>
              <List>
                {globalResults.groups.map((g, idx)=> (
                  <React.Fragment key={g.id}>
                    <ListItem 
                      button 
                      onClick={()=>onOpenResult?.({ type:'group', id:g.id })}
                      sx={{
                        '& .MuiListItemText-primary': {
                          color: 'text.primary',
                        },
                        '& .MuiListItemText-secondary': {
                          color: 'text.secondary',
                        },
                      }}
                    >
                      <ListItemAvatar><Avatar src={g.avatar} /></ListItemAvatar>
                      <ListItemText 
                        primary={<span className="font-semibold">{highlight(g.name, q, muiTheme)}</span>} 
                        secondary={<span className="text-[12px]">{g.members} members</span>}
                      />
                    </ListItem>
                    {idx < globalResults.groups.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>

              {/* Messages */}
              <div className="px-3 py-2 text-xs" style={{ color: muiTheme.palette.text.secondary }}>Messages</div>
              <List>
                {globalResults.messages.map((m, idx)=> (
                  <React.Fragment key={m.id}>
                    <ListItem 
                      button 
                      onClick={()=>onOpenResult?.({ type:'message', id:m.id })}
                      sx={{
                        '& .MuiListItemText-primary': {
                          color: 'text.primary',
                        },
                        '& .MuiListItemText-secondary': {
                          color: 'text.secondary',
                        },
                      }}
                    >
                      <ListItemAvatar><Avatar src={m.who.avatar} /></ListItemAvatar>
                      <ListItemText primary={<span className="font-semibold">{highlight(m.who.name, q, muiTheme)}</span>} secondary={<span className="text-[12px]">{highlight(m.snippet, q, muiTheme)}</span>} />
                      <span className="text-[11px] ml-2" style={{ color: muiTheme.palette.text.secondary }}>{m.time}</span>
                    </ListItem>
                    {idx < globalResults.messages.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </>
          )}

          {tab === 1 && (
            <List>
              {threadResults.map((t, idx)=> (
                <React.Fragment key={t.id}>
                  <ListItem
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: 'text.primary',
                      },
                      '& .MuiListItemText-secondary': {
                        color: 'text.secondary',
                      },
                    }}
                  >
                    <ListItemAvatar><Avatar src={t.who.avatar} /></ListItemAvatar>
                    <ListItemText primary={<span className="font-semibold">{t.who.name}</span>} secondary={<span className="text-[12px]">{highlight(t.text, q, muiTheme)}</span>} />
                    <span className="text-[11px] ml-2" style={{ color: muiTheme.palette.text.secondary }}>{t.time}</span>
                  </ListItem>
                  {idx < threadResults.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>

        {/* quick filters */}
        {tab===0 && (
          <Box className="px-3 pb-3 pt-2">
            <div className="flex gap-2 flex-wrap">
              {['people','channels','groups','messages'].map(k => (
                <Chip key={k} label={`Filter: ${k}`} sx={{ border:`1px solid ${accentColor}`, color: accentColor }} variant="outlined" />
              ))}
              <Button variant="contained" sx={{ bgcolor: accentColor, textTransform:'none', '&:hover':{ bgcolor: accentColor, opacity: 0.9 } }}>Apply</Button>
            </div>
          </Box>
        )}
      </Box>
    </>
  );
}
