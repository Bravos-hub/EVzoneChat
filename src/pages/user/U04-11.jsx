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
          <Toolbar className="!min-h-[56px]" sx={{ px: { xs: 1.5, sm: 3 } }}>
            <IconButton onClick={onBack} aria-label="Back" sx={{ color:'#fff', padding: { xs: '6px', sm: '8px' } }}>
              <ArrowBackRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <Typography variant="h6" className="font-bold" sx={{ fontSize: { xs: '16px', sm: '18px' } }}>Group Call</Typography>
            <Box sx={{ flexGrow:1 }} />
            <IconButton aria-label="Participants" onClick={()=>setOpen(true)} sx={{ color:'#fff', padding: { xs: '6px', sm: '8px' } }}>
              <PeopleAltRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* grid area */}
        <Box className="flex-1 grid grid-cols-2" sx={{ gap: { xs: 1, sm: 1.5, md: 2 }, p: { xs: 1, sm: 1.5, md: 2 } }}>
          {people.map((p)=> (
            <div key={p.id} className={`relative rounded-xl overflow-hidden bg-black border ${p.active? 'ring-2': ''}`} style={{ borderColor:'rgba(255,255,255,0.15)', boxShadow: p.active? `0 0 0 2px ${accentColor}`: undefined }}>
              <img src={`https://images.unsplash.com/photo-1526178611301-1e3f6dc1f1ae?q=80&w=600&auto=format&fit=crop`} alt="feed" className="w-full h-full object-cover" />
              {!p.video && (
                <div className="absolute inset-0 grid place-items-center bg-black/60">
                  <Avatar src={p.avatar} sx={{ width: 56, height: 56 }} />
                </div>
              )}
              <div className="absolute left-2 bottom-2 right-2 flex items-center text-white" style={{ gap: '4px' }}>
                <Avatar src={p.avatar} sx={{ width: { xs: 18, sm: 20 }, height: { xs: 18, sm: 20 } }} />
                <span className="truncate" style={{ fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{p.name}</span>
                {p.muted && <MicOffRoundedIcon sx={{ fontSize: { xs: 12, sm: 14 } }} />}
                {!p.video && <VideocamOffRoundedIcon sx={{ fontSize: { xs: 12, sm: 14 } }} />}
                {p.role!=='member' && <Chip size="small" label={p.role} sx={{ height: { xs: 16, sm: 18 }, fontSize: { xs: '9px', sm: '10px' }, bgcolor: accentColor, color:'#fff', ml: 'auto' }} />}
              </div>
            </div>
          ))}
        </Box>

        {/* participants drawer */}
        <Drawer anchor="bottom" open={open} onClose={()=>setOpen(false)} PaperProps={{ sx:{ borderTopLeftRadius:16, borderTopRightRadius:16 } }}>
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <div className="w-12 h-1 rounded-full mx-auto mb-2" style={{ background: EV.light }} />
            <div className="flex items-center justify-between mb-2">
              <Typography variant="subtitle1" className="font-semibold" sx={{ fontSize: { xs: '15px', sm: '16px' } }}>Participants</Typography>
              <Chip size="small" label={people.length} sx={{ bgcolor: EV.light, fontSize: { xs: '11px', sm: '12px' }, height: { xs: 22, sm: 24 } }} />
            </div>
            <List className="no-scrollbar" sx={{ maxHeight: { xs: 300, sm: 360 }, overflowY:'auto' }}>
              {people.map((p)=> (
                <ListItem key={p.id} secondaryAction={
                  <div className="flex items-center" style={{ gap: '4px', flexWrap: 'wrap' }}>
                    {p.role==='member' && (
                      <Button size="small" onClick={()=>promote(p.id)} startIcon={<StarRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} variant="outlined" sx={{ borderColor: accentColor, color: accentColor, textTransform:'none', fontSize: { xs: '11px', sm: '12px' }, py: { xs: 0.25, sm: 0.5 } }}>Promote</Button>
                    )}
                    <Button size="small" onClick={()=>remove(p.id)} startIcon={<RemoveCircleOutlineRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} variant="outlined" sx={{ borderColor: accentColor, color: accentColor, textTransform:'none', fontSize: { xs: '11px', sm: '12px' }, py: { xs: 0.25, sm: 0.5 } }}>Remove</Button>
                  </div>
                } sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1, sm: 1.25 } }}>
                  <ListItemAvatar><Avatar src={p.avatar} sx={{ width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 } }} /></ListItemAvatar>
                  <ListItemText 
                    primary={<span className="font-semibold" style={{ fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>} 
                    secondary={<span style={{ fontSize: '12px' }}>{p.role}{p.muted?' • muted':''}{!p.video?' • video off':''}</span>} 
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Box>
    </>
  );
}
