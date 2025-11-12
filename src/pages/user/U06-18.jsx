import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

/**
 * U06-18 — Meeting Info & End Options
 * Shows link, agenda, participants count; actions: copy/share; leave vs end for all (confirmations)
 */
export default function MeetingInfoEnd({ onBack, info = { title:'Weekly Sync', code:'evz-9k5f-311', link:'https://evzone.app/j/evz-9k5f-311', agenda:'1) Standup\n2) Roadmap\n3) Q&A', participants: 12, policies:['Lobby on','Recording on consent','Admins can monitor'] } }) {
  const [snack, setSnack] = useState('');
  const [confirmEnd, setConfirmEnd] = useState(false);

  const copy = async () => {
    try { await navigator.clipboard?.writeText(info.link); setSnack('Link copied'); } catch { setSnack('Copy failed'); }
  };
  const share = async () => {
    try {
      if (navigator.share) { await navigator.share({ title: info.title, url: info.link }); }
      else { await navigator.clipboard?.writeText(info.link); setSnack('Link copied'); }
    } catch {}
  };

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full max-w-sm mx-auto bg-white flex flex-col">
        <AppBar elevation={0} position="static" sx={{ bgcolor:'#fff', color:'#111', borderBottom:`1px solid ${EV.light}` }}>
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={onBack} aria-label="Back"><ArrowBackRoundedIcon /></IconButton>
            <Typography variant="h6" className="font-bold ml-1">Meeting info</Typography>
          </Toolbar>
        </AppBar>

        <Box className="p-3 space-y-3 flex-1 no-scrollbar" sx={{ overflowY:'auto' }}>
          {/* Link */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${EV.light}` }}>
            <div className="flex items-center gap-2 mb-1"><LinkRoundedIcon /><span className="font-semibold">Link</span></div>
            <div className="text-sm break-all text-gray-700">{info.link}</div>
            <div className="mt-2 flex gap-2">
              <Button startIcon={<ContentCopyRoundedIcon/>} onClick={copy} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Copy</Button>
              <Button startIcon={<ShareRoundedIcon/>} onClick={share} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>Share</Button>
            </div>
          </Box>

          {/* Agenda */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${EV.light}` }}>
            <div className="flex items-center gap-2 mb-1"><EventNoteRoundedIcon /><span className="font-semibold">Agenda</span></div>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">{info.agenda}</pre>
          </Box>

          {/* Policies */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${EV.light}` }}>
            <div className="flex items-center gap-2 mb-1"><InfoRoundedIcon /><span className="font-semibold">Policies</span><Chip size="small" label="module‑specific" sx={{ bgcolor: EV.light }} /></div>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {info.policies.map((p, i)=>(<li key={i}>{p}</li>))}
            </ul>
          </Box>

          {/* Participants */}
          <div className="flex items-center gap-2 text-sm text-gray-700"><span className="font-semibold">Participants:</span> <Chip size="small" label={info.participants} sx={{ bgcolor: EV.light }} /></div>
        </Box>

        {/* Footer */}
        <Box className="px-3 pb-3">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Leave meeting</Button>
            <Button onClick={()=>setConfirmEnd(true)} variant="contained" sx={{ bgcolor:'#e53935', textTransform:'none', '&:hover':{ bgcolor:'#c62828' } }}>End for all</Button>
          </div>
        </Box>
      </Box>

      {/* Confirm end for all */}
      <Dialog open={confirmEnd} onClose={()=>setConfirmEnd(false)} fullWidth maxWidth="xs">
        <DialogTitle>End meeting for everyone?</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2">This will disconnect all participants and close the room.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setConfirmEnd(false)} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Cancel</Button>
          <Button onClick={()=>setConfirmEnd(false)} variant="contained" sx={{ bgcolor:'#e53935', textTransform:'none', '&:hover':{ bgcolor:'#c62828' } }}>End now</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={1500} message={snack} onClose={()=>setSnack('')} />
    </>
  );
}
