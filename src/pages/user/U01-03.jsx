import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Badge,
  TextField,
  InputAdornment,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Paper,
  Button
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import AddCommentRoundedIcon from "@mui/icons-material/AddCommentRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

// demo data
const DEMO = [
  { id: 'c1', name: 'Etty Duke', avatar: 'https://i.pravatar.cc/100?img=1', module: 'Rides', last: 'I am near the pickup now', time: '10:30 AM', unread: 2, typing: true },
  { id: 'c2', name: 'Leslie Alexander', avatar: 'https://i.pravatar.cc/100?img=5', module: 'School', last: "Newton's laws PDF attached", time: 'Yesterday', unread: 0, typing: false },
  { id: 'c3', name: 'EVzone Support', avatar: 'https://i.pravatar.cc/100?img=8', module: 'Marketplace', last: 'Invoice sent. Please confirm.', time: 'Tue', unread: 1, typing: false },
  { id: 'c4', name: 'Dr. Cohen', avatar: 'https://i.pravatar.cc/100?img=12', module: 'Medical', last: 'See you at 3 pm via video', time: 'Mon', unread: 0, typing: false },
];

const LIVE_DEMO = [
  { id: 'ride_123', module: 'Rides', title: 'Kampala → Entebbe', subtitle: 'ETA 22 min', host: 'John Driver', startedAt: '7m', cta: 'Resume' },
  { id: 'lesson_45', module: 'School', title: 'Mathematics', subtitle: "Newton's Laws of Motion", host: 'Leslie Alexander', startedAt: '12m', cta: 'Join' },
  { id: 'tour_88', module: 'Travel', title: 'Evening Old Town Tour', subtitle: 'Live Q&A ongoing', host: 'Ada Guide', startedAt: '3m', cta: 'Join' },
];

const MODULES = ["All","Rides","Marketplace","School","Medical","Charging","Travel","Investments","Faith","Social","Workspace","Wallet","AI Bot"];

/**
 * U01-03 Unified Inbox
 * Includes: Live Now carousel (no visible scrollbars), wrapped module chips (no horizontal scroll), search, conversation list.
 */
export default function UnifiedInbox({ items = DEMO, lives = LIVE_DEMO, onOpen, onRefresh, onNew, onLiveOpen, onModuleChange }) {
  const [q, setQ] = useState("");
  const [module, setModule] = useState("All");

  // filter logic
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter((it) => {
      const matchQ = !s || [it.name, it.module, it.last].join(" ").toLowerCase().includes(s);
      const matchM = module === 'All' || it.module === module;
      return matchQ && matchM;
    });
  }, [q, items, module]);

  // carousel helpers
  const wrapRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const slideW = '72vw'; // responsive width

  // eslint-disable-next-line no-unused-vars
  const scrollTo = (i) => {
    const el = wrapRef.current; if (!el) return;
    const clamped = Math.max(0, Math.min(i, lives.length - 1));
    const slideWidth = el.offsetWidth * 0.72; // 72% of container width
    el.scrollTo({ left: clamped * (slideWidth + 12), behavior: 'smooth' });
  };

  useEffect(() => {
    const el = wrapRef.current; if (!el) return;
    const onScroll = () => { 
      const slideWidth = el.offsetWidth * 0.72; // 72% of container width
      const i = Math.round(el.scrollLeft / (slideWidth + 12)); 
      setIdx(i); 
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const Dot = ({ active }) => (
    <span className={`inline-block h-1.5 w-5 rounded-full ${active ? 'opacity-100' : 'opacity-40'}`} style={{ background: EV.green }} />
  );

  return (
    <>
      {/* Hide scrollbars globally for this component */}
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box sx={{ 
        width: '100%', 
        mx: 'auto', 
        bgcolor: '#fff', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column'
      }}>
        {/* Header */}
        <AppBar 
          elevation={0} 
          position="static" 
          sx={{ 
            bgcolor: '#fff', 
            color: '#111', 
            borderBottom: `1px solid ${EV.light}`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          <Toolbar className="!min-h-[56px] !px-3">
            <Typography 
              variant="h6" 
              sx={{ 
                fontSize: '18px',
                fontWeight: 700,
                color: '#111'
              }}
            >
              Messages
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton 
              aria-label="Refresh" 
              onClick={onRefresh}
              sx={{ color: '#666', mr: 0.5 }}
            >
              <RefreshRoundedIcon />
            </IconButton>
            <IconButton 
              aria-label="New message" 
              onClick={onNew}
              sx={{ color: '#666' }}
            >
              <AddCommentRoundedIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Search */}
        <Box sx={{ p: 2, pb: 2.5 }}>
          <TextField
            fullWidth 
            size="small" 
            value={q} 
            onChange={(e)=>setQ(e.target.value)} 
            placeholder="Search people, channels, messages"
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: '#f5f5f5',
                borderRadius: 2,
                '&:hover': {
                  bgcolor: '#eeeeee'
                },
                '&.Mui-focused': {
                  bgcolor: '#fff',
                  boxShadow: '0 0 0 2px rgba(3, 205, 140, 0.1)'
                }
              }
            }}
            InputProps={{ 
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ color: '#999', fontSize: 20 }} />
                </InputAdornment>
              ) 
            }}
          />
        </Box>

        {/* Live Now Carousel (no visible scrollbars, pure mobile swipe — no arrows) */}
        {lives && lives.length > 0 && (
          <Box className="px-3 pb-2 relative">
            <div
              ref={wrapRef}
              className="flex gap-3 pr-3 no-scrollbar"
              style={{ overflowX:'auto', scrollSnapType:'x mandatory', WebkitOverflowScrolling:'touch' }}
            >
              {lives.map((s) => (
                <Paper
                  key={s.id}
                  onClick={()=>onLiveOpen?.(s)}
                  elevation={0}
                  className="shrink-0 rounded-2xl p-3"
                  style={{ width: slideW, minWidth: '85vw', scrollSnapAlign:'start', border:`1px solid ${EV.light}` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Chip size="small" label="LIVE" sx={{ bgcolor: EV.orange, color:'#fff', height:22, borderRadius:1 }} />
                    <Chip size="small" label={s.module} sx={{ bgcolor: EV.light }} />
                    <span className="text-xs text-gray-500 ml-auto">{s.startedAt}</span>
                  </div>
                  <div className="text-sm font-semibold truncate">{s.title}</div>
                  <div className="text-xs text-gray-600 truncate">{s.subtitle}</div>
                  <div className="text-[11px] text-gray-500 mt-1">Host: {s.host}</div>
                  <Button variant="contained" size="small" sx={{ mt: 1.5, bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>{s.cta || 'Open'}</Button>
                </Paper>
              ))}
            </div>
            <Box className="flex items-center justify-center gap-1 mt-2">
              {lives.map((_, i)=>(<Dot key={i} active={i===idx} />))}
            </Box>
          </Box>
        )}

        {/* Module chips (wrapped, no horizontal scroll) */}
        <Box className="px-3 pt-1 pb-2">
          <div className="flex gap-2 flex-wrap">
            {MODULES.map((m)=> (
              <Chip
                key={m}
                label={m}
                onClick={()=>{ setModule(m); onModuleChange?.(m); }}
                sx={{
                  bgcolor: module===m?EV.green:EV.light,
                  color: module===m?'#fff':'#111',
                  '&:hover':{ bgcolor: module===m?'#e06f00':'#e9e9e9' }
                }}
              />
            ))}
          </div>
        </Box>

        {/* Conversation list */}
        <Box className="flex-1" sx={{ overflowY:'auto', '&::-webkit-scrollbar':{ display:'none' }, scrollbarWidth:'none', msOverflowStyle:'none' }}>
          <List>
            {filtered.map((c, idx) => (
              <React.Fragment key={c.id}>
                <ListItem button onClick={() => onOpen?.(c)} alignItems="flex-start">
                  <ListItemAvatar>
                    <Badge color="success" invisible={!c.unread} badgeContent={c.unread} overlap="circular">
                      <Avatar src={c.avatar || `https://i.pravatar.cc/100?u=${c.id}`} sx={{ bgcolor: EV.light, color: '#222' }} />
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<div className="flex items-center gap-2"><span className="font-semibold truncate">{c.name}</span><Chip size="small" label={c.module} sx={{ bgcolor: EV.light }} /><span className="text-xs text-gray-500 ml-auto">{c.time}</span></div>}
                    secondary={<div className="flex items-center gap-2 mt-1">{c.typing ? (<span className="text-[12px]" style={{ color: EV.green }}>typing…</span>) : (<span className="text-[12px] text-gray-600 truncate">{c.last}</span>)}</div>}
                  />
                </ListItem>
                {idx < filtered.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
            {filtered.length === 0 && (<Box className="px-4 py-10 text-center text-gray-500">No conversations match your search.</Box>)}
          </List>
        </Box>

        <Box className="h-3" />
      </Box>
    </>
  );
}
