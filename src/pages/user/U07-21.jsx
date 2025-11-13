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
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={onBack} aria-label="Back"><ArrowBackRoundedIcon /></IconButton>
            <Typography variant="h6" className="font-bold ml-1">Call summary</Typography>
          </Toolbar>
        </AppBar>

        <Box className="p-3 space-y-3 flex-1 no-scrollbar" sx={{ overflowY:'auto' }}>
          {/* meta */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${EV.light}` }}>
            <div className="font-semibold">{meta.title}</div>
            <div className="text-sm text-gray-700">{meta.when} • {meta.type} • {meta.duration}</div>
            <div className="mt-1"><Chip size="small" label={meta.outcome} sx={{ bgcolor: EV.green, color:'#fff' }} /></div>
          </Box>

          {/* quality rating */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${EV.light}` }}>
            <div className="font-semibold mb-1">Rate call quality</div>
            <Rating value={rating} onChange={(e,val)=>setRating(val)} sx={{ color: EV.orange }} />
          </Box>

          {/* note */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${EV.light}` }}>
            <div className="font-semibold mb-1">Add a note</div>
            <TextField fullWidth multiline minRows={3} value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Notes, decisions, follow‑ups…" />
          </Box>

          {/* quick actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button startIcon={<MessageRoundedIcon/>} onClick={()=>act('Opening chat')} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Message</Button>
            <Button startIcon={<EventAvailableRoundedIcon/>} onClick={()=>act('Scheduling next meeting')} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Schedule next</Button>
            <Button startIcon={<NoteAltRoundedIcon/>} onClick={()=>act('Saving note')} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>Save note</Button>
            <Button startIcon={<BugReportRoundedIcon/>} onClick={()=>act('Reporting issue')} variant="contained" sx={{ bgcolor: '#e53935', textTransform:'none', '&:hover':{ bgcolor:'#c62828' } }}>Report issue</Button>
          </div>

          <Button fullWidth variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>View full meeting summary</Button>
        </Box>
      </Box>

      <Snackbar open={!!snack} autoHideDuration={1400} message={snack} onClose={()=>setSnack('')} />
    </>
  );
}
