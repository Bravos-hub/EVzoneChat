import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Chip,
  Divider, // eslint-disable-line no-unused-vars
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Paper
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import SummarizeRoundedIcon from "@mui/icons-material/SummarizeRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

/**
 * U07-20 — Meeting Summary
 * Sections: Recording, Transcript, AI Summary, Highlights timeline
 */
export default function MeetingSummary({ onBack, meta = { title:'Weekly Sync', duration:'42:18', participants:12, date: new Date().toLocaleString() } }) {
  const [snack, setSnack] = useState('');
  const [ai, setAi] = useState(null);

  const download = (what) => setSnack(`Downloading ${what}…`);
  const generateAi = () => setTimeout(()=> setAi({
    summary: 'We aligned on sprint goals, confirmed delivery timelines, and captured two risks around API rate limits and vendor timelines.',
    actions: ['Alice to prepare API limit test plan', 'Bob to confirm vendor delivery D‑3', 'Team to update roadmap by Friday'],
  }), 600);

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full max-w-sm mx-auto bg-white flex flex-col">
        <AppBar elevation={0} position="static" sx={{ bgcolor:'#fff', color:'#111', borderBottom:`1px solid ${EV.light}` }}>
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={onBack} aria-label="Back"><ArrowBackRoundedIcon /></IconButton>
            <Typography variant="h6" className="font-bold ml-1">Meeting summary</Typography>
          </Toolbar>
        </AppBar>

        <Box className="p-3 space-y-3 flex-1 no-scrollbar" sx={{ overflowY:'auto' }}>
          {/* meta */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${EV.light}` }}>
            <div className="font-semibold">{meta.title}</div>
            <div className="text-sm text-gray-700">{meta.date} • {meta.duration} • {meta.participants} participants</div>
          </Box>

          {/* recording */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${EV.light}` }}>
            <div className="flex items-center justify-between">
              <div className="font-semibold">Recording</div>
              <Button startIcon={<DownloadRoundedIcon/>} onClick={()=>download('recording')} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>Download</Button>
            </div>
            <video className="w-full rounded-lg mt-2" controls>
              <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" type="video/webm" />
            </video>
          </Box>

          {/* transcript */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${EV.light}` }}>
            <div className="flex items-center justify-between">
              <div className="font-semibold">Transcript</div>
              <Button startIcon={<ReceiptLongRoundedIcon/>} onClick={()=>download('transcript')} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Download</Button>
            </div>
            <Paper variant="outlined" sx={{ p:1.5, mt:1, borderColor: EV.light }}>
              <div className="text-sm text-gray-800 whitespace-pre-wrap">[07:03] Alice: We need to test API limits…{"\n"}[07:06] Bob: Vendor says D‑3 is feasible…{"\n"}[07:10] You: OK, let’s capture risks…</div>
            </Paper>
          </Box>

          {/* AI summary */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${EV.light}` }}>
            <div className="flex items-center justify-between">
              <div className="font-semibold">AI summary</div>
              {!ai ? (
                <Button startIcon={<SummarizeRoundedIcon/>} onClick={generateAi} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>Generate</Button>
              ) : (
                <Chip size="small" label="Generated" sx={{ bgcolor: EV.green, color:'#fff' }} />
              )}
            </div>
            {ai && (
              <>
                <div className="text-sm text-gray-800 mt-2">{ai.summary}</div>
                <div className="text-sm font-semibold mt-2">Action items</div>
                <List>
                  {ai.actions.map((a,i)=> (
                    <ListItem key={i}><ListItemText primary={<span className="text-sm">• {a}</span>} /></ListItem>
                  ))}
                </List>
              </>
            )}
          </Box>

          {/* highlights timeline */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${EV.light}` }}>
            <div className="flex items-center gap-2 mb-1"><InsightsRoundedIcon/><span className="font-semibold">Highlights</span></div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Button variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Risk discussion 07:10</Button>
              <Button variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Roadmap update 07:25</Button>
            </div>
          </Box>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Share summary</Button>
            <Button variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>Back to meetings</Button>
          </div>
        </Box>
      </Box>

      <Snackbar open={!!snack} autoHideDuration={1400} message={snack} onClose={()=>setSnack('')} />
    </>
  );
}
