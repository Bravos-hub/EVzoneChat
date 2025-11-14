import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button
} from "@mui/material";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import MicOffRoundedIcon from "@mui/icons-material/MicOffRounded";
import VideocamOffRoundedIcon from "@mui/icons-material/VideocamOffRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

const DEMO = [
  { id:'u1', name:'Eduardo', avatar:'https://i.pravatar.cc/100?img=10', video:true, muted:false, active:true, role:'host' },
  { id:'u2', name:'Kayle', avatar:'https://i.pravatar.cc/100?img=11', video:true, muted:true, active:false, role:'cohost' },
  { id:'u3', name:'Richards', avatar:'https://i.pravatar.cc/100?img=12', video:true, muted:false, active:true, role:'member' },
  { id:'u4', name:'KB', avatar:'https://i.pravatar.cc/100?img=13', video:false, muted:true, active:false, role:'member' },
];

/**
 * U04-11 — Group Call Participants Panel
 * Mobile-first group video call interface with participants management
 */
export default function GroupCallParticipants({ onBack }) {
  const { accentColor } = useTheme();
  const [open, setOpen] = useState(false);
  const [people, setPeople] = useState(DEMO);

  const promote = (id) => setPeople(ps => ps.map(p => p.id===id ? { ...p, role:'cohost' } : p));
  const remove = (id) => setPeople(ps => ps.filter(p => p.id!==id));

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full max-w-sm mx-auto bg-black flex flex-col">
        <AppBar elevation={0} position="static" sx={{ bgcolor:'rgba(0,0,0,0.55)', color:'#fff' }}>
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={onBack} aria-label="Back" sx={{ color:'#fff' }}><ArrowBackRoundedIcon /></IconButton>
            <Typography variant="h6" className="font-bold">Group Call</Typography>
            <Box sx={{ flexGrow:1 }} />
            <IconButton aria-label="Participants" onClick={()=>setOpen(true)} sx={{ color:'#fff' }}><PeopleAltRoundedIcon /></IconButton>
          </Toolbar>
        </AppBar>

        {/* grid area */}
        <Box className="flex-1 grid grid-cols-2 gap-2 p-2">
          {people.map((p)=> (
            <div key={p.id} className={`relative rounded-xl overflow-hidden bg-black border ${p.active? 'ring-2': ''}`} style={{ borderColor:'rgba(255,255,255,0.15)', boxShadow: p.active? `0 0 0 2px ${accentColor}`: undefined }}>
              <img src={`https://images.unsplash.com/photo-1526178611301-1e3f6dc1f1ae?q=80&w=600&auto=format&fit=crop`} alt="feed" className="w-full h-full object-cover" />
              {!p.video && (
                <div className="absolute inset-0 grid place-items-center bg-black/60">
                  <Avatar src={p.avatar} sx={{ width: 56, height: 56 }} />
                </div>
              )}
              <div className="absolute left-2 bottom-2 right-2 flex items-center gap-1 text-white">
                <Avatar src={p.avatar} sx={{ width: 20, height: 20 }} />
                <span className="text-[11px] truncate">{p.name}</span>
                {p.muted && <MicOffRoundedIcon sx={{ fontSize: 14 }} />}
                {!p.video && <VideocamOffRoundedIcon sx={{ fontSize: 14 }} />}
                {p.role!=='member' && <Chip size="small" label={p.role} sx={{ height: 18, bgcolor: accentColor, color:'#fff', ml: 'auto' }} />}
              </div>
            </div>
          ))}
        </Box>

        {/* participants drawer */}
        <Drawer anchor="bottom" open={open} onClose={()=>setOpen(false)} PaperProps={{ sx:{ borderTopLeftRadius:16, borderTopRightRadius:16 } }}>
          <Box className="p-3">
            <div className="w-12 h-1 rounded-full mx-auto mb-2" style={{ background: EV.light }} />
            <div className="flex items-center justify-between mb-2">
              <Typography variant="subtitle1" className="font-semibold">Participants</Typography>
              <Chip size="small" label={people.length} sx={{ bgcolor: EV.light }} />
            </div>
            <List className="no-scrollbar" sx={{ maxHeight: 360, overflowY:'auto' }}>
              {people.map((p)=> (
                <ListItem key={p.id} secondaryAction={
                  <div className="flex items-center gap-1">
                    {p.role==='member' && (
                      <Button size="small" onClick={()=>promote(p.id)} startIcon={<StarRoundedIcon/>} variant="outlined" sx={{ borderColor: accentColor, color: accentColor, textTransform:'none' }}>Promote</Button>
                    )}
                    <Button size="small" onClick={()=>remove(p.id)} startIcon={<RemoveCircleOutlineRoundedIcon/>} variant="outlined" sx={{ borderColor: accentColor, color: accentColor, textTransform:'none' }}>Remove</Button>
                  </div>
                }>
                  <ListItemAvatar><Avatar src={p.avatar} /></ListItemAvatar>
                  <ListItemText primary={<span className="font-semibold">{p.name}</span>} secondary={`${p.role}${p.muted?' • muted':''}${!p.video?' • video off':''}`} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Box>
    </>
  );
}
