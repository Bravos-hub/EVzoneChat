import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Chip,
  Rating,
  TextField,
  Snackbar
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import NoteAltRoundedIcon from "@mui/icons-material/NoteAltRounded";
import BugReportRoundedIcon from "@mui/icons-material/BugReportRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

/**
 * U07-21 — Call Summary
 * After call ends: show duration, outcome, quality rating, quick actions
 */
export default function CallSummary({ onBack, meta = { title:'Leslie Alexander', when: new Date().toLocaleString(), duration:'14:22', type:'Video', outcome:'Completed' } }) {
  const [snack, setSnack] = useState('');
  const [rating, setRating] = useState(4);
  const [note, setNote] = useState('');

  const act = (what) => setSnack(`${what}…`);

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full mx-auto bg-white flex flex-col">
        <AppBar elevation={0} position="static" sx={{ bgcolor:'#fff', color:'#111', borderBottom:`1px solid ${EV.light}` }}>
          <Toolbar className="!min-h-[56px]" sx={{ px: { xs: 1.5, sm: 3 } }}>
            <IconButton onClick={onBack} aria-label="Back" sx={{ padding: { xs: '6px', sm: '8px' } }}>
              <ArrowBackRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <Typography variant="h6" className="font-bold" sx={{ fontSize: { xs: '16px', sm: '18px' }, ml: { xs: 0.5, sm: 1 } }}>Call summary</Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 2, sm: 3 }, '& > * + *': { mt: { xs: 2, sm: 3 } }, flex: 1, overflowY: 'auto' }} className="no-scrollbar">
          {/* meta */}
          <Box className="rounded-2xl" sx={{ border:`1px solid ${EV.light}`, p: { xs: 2, sm: 3 } }}>
            <div className="font-semibold" style={{ fontSize: '15px' }}>{meta.title}</div>
            <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>{meta.when} • {meta.type} • {meta.duration}</div>
            <div style={{ marginTop: '8px' }}>
              <Chip size="small" label={meta.outcome} sx={{ bgcolor: EV.green, color:'#fff', fontSize: { xs: '11px', sm: '12px' }, height: { xs: 22, sm: 24 } }} />
            </div>
          </Box>

          {/* quality rating */}
          <Box className="rounded-2xl" sx={{ border:`1px solid ${EV.light}`, p: { xs: 2, sm: 3 } }}>
            <div className="font-semibold mb-1" style={{ fontSize: '15px' }}>Rate call quality</div>
            <Rating value={rating} onChange={(e,val)=>setRating(val)} sx={{ color: EV.orange, fontSize: { xs: '28px', sm: '32px' } }} />
          </Box>

          {/* note */}
          <Box className="rounded-2xl" sx={{ border:`1px solid ${EV.light}`, p: { xs: 2, sm: 3 } }}>
            <div className="font-semibold mb-1" style={{ fontSize: '15px' }}>Add a note</div>
            <TextField fullWidth multiline minRows={3} value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Notes, decisions, follow‑ups…" sx={{ '& .MuiInputBase-input': { fontSize: { xs: '13px', sm: '14px' } } }} />
          </Box>

          {/* quick actions */}
          <div className="grid grid-cols-2" style={{ gap: '8px' }}>
            <Button startIcon={<MessageRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} onClick={()=>act('Opening chat')} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Message</Button>
            <Button startIcon={<EventAvailableRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} onClick={()=>act('Scheduling next meeting')} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Schedule next</Button>
            <Button startIcon={<NoteAltRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} onClick={()=>act('Saving note')} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 }, '&:hover':{ bgcolor:'#e06f00' } }}>Save note</Button>
            <Button startIcon={<BugReportRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} onClick={()=>act('Reporting issue')} variant="contained" sx={{ bgcolor: '#e53935', textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 }, '&:hover':{ bgcolor:'#c62828' } }}>Report issue</Button>
          </div>

          <Button fullWidth variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.75, sm: 1 }, '&:hover':{ bgcolor:'#e06f00' } }}>View full meeting summary</Button>
        </Box>
      </Box>

      <Snackbar open={!!snack} autoHideDuration={1400} message={snack} onClose={()=>setSnack('')} />
    </>
  );
}
