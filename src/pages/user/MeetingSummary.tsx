import { useState } from "react";
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

      <Box className="w-full h-full mx-auto bg-white flex flex-col">
        <AppBar elevation={0} position="static" sx={{ bgcolor:'#fff', color:'#111', borderBottom:`1px solid ${EV.light}` }}>
          <Toolbar className="!min-h-[56px]" sx={{ px: { xs: 1.5, sm: 3 } }}>
            <IconButton onClick={onBack} aria-label="Back" sx={{ padding: { xs: '6px', sm: '8px' } }}>
              <ArrowBackRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <Typography variant="h6" className="font-bold" sx={{ fontSize: { xs: '16px', sm: '18px' }, ml: { xs: 0.5, sm: 1 } }}>Meeting summary</Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 2, sm: 3 }, '& > * + *': { mt: { xs: 2, sm: 3 } }, flex: 1, overflowY: 'auto' }} className="no-scrollbar">
          {/* meta */}
          <Box className="rounded-2xl" sx={{ border:`1px solid ${EV.light}`, p: { xs: 2, sm: 3 } }}>
            <div className="font-semibold" style={{ fontSize: '15px' }}>{meta.title}</div>
            <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>{meta.date} • {meta.duration} • {meta.participants} participants</div>
          </Box>

          {/* recording */}
          <Box className="rounded-2xl" sx={{ border:`1px solid ${EV.light}`, p: { xs: 2, sm: 3 } }}>
            <div className="flex items-center justify-between">
              <div className="font-semibold" style={{ fontSize: '15px' }}>Recording</div>
              <Button startIcon={<DownloadRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} onClick={()=>download('recording')} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 }, '&:hover':{ bgcolor:'#e06f00' } }}>Download</Button>
            </div>
            <video className="w-full rounded-lg" style={{ marginTop: '8px' }} controls>
              <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" type="video/webm" />
            </video>
          </Box>

          {/* transcript */}
          <Box className="rounded-2xl" sx={{ border:`1px solid ${EV.light}`, p: { xs: 2, sm: 3 } }}>
            <div className="flex items-center justify-between">
              <div className="font-semibold" style={{ fontSize: '15px' }}>Transcript</div>
              <Button startIcon={<ReceiptLongRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} onClick={()=>download('transcript')} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Download</Button>
            </div>
            <Paper variant="outlined" sx={{ p: { xs: 1.25, sm: 1.5 }, mt: 1, borderColor: EV.light }}>
              <div className="whitespace-pre-wrap" style={{ fontSize: '13px', color: '#333' }}>[07:03] Alice: We need to test API limits…{"\n"}[07:06] Bob: Vendor says D‑3 is feasible…{"\n"}[07:10] You: OK, let's capture risks…</div>
            </Paper>
          </Box>

          {/* AI summary */}
          <Box className="rounded-2xl" sx={{ border:`1px solid ${EV.light}`, p: { xs: 2, sm: 3 } }}>
            <div className="flex items-center justify-between">
              <div className="font-semibold" style={{ fontSize: '15px' }}>AI summary</div>
              {!ai ? (
                <Button startIcon={<SummarizeRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} onClick={generateAi} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 }, '&:hover':{ bgcolor:'#e06f00' } }}>Generate</Button>
              ) : (
                <Chip size="small" label="Generated" sx={{ bgcolor: EV.green, color:'#fff', fontSize: { xs: '11px', sm: '12px' }, height: { xs: 22, sm: 24 } }} />
              )}
            </div>
            {ai && (
              <>
                <div style={{ fontSize: '13px', color: '#333', marginTop: '8px' }}>{ai.summary}</div>
                <div className="font-semibold" style={{ fontSize: '14px', marginTop: '8px' }}>Action items</div>
                <List>
                  {ai.actions.map((a,i)=> (
                    <ListItem key={i} sx={{ px: { xs: 1, sm: 2 }, py: { xs: 0.5, sm: 0.75 } }}>
                      <ListItemText primary={<span style={{ fontSize: '13px' }}>• {a}</span>} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </Box>

          {/* highlights timeline */}
          <Box className="rounded-2xl" sx={{ border:`1px solid ${EV.light}`, p: { xs: 2, sm: 3 } }}>
            <div className="flex items-center mb-1" style={{ gap: '8px' }}>
              <InsightsRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              <span className="font-semibold" style={{ fontSize: '15px' }}>Highlights</span>
            </div>
            <div className="grid grid-cols-2" style={{ gap: '8px' }}>
              <Button variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none', fontSize: { xs: '11px', sm: '12px' }, py: { xs: 0.5, sm: 0.75 } }}>Risk discussion 07:10</Button>
              <Button variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none', fontSize: { xs: '11px', sm: '12px' }, py: { xs: 0.5, sm: 0.75 } }}>Roadmap update 07:25</Button>
            </div>
          </Box>

          <div className="grid grid-cols-2" style={{ gap: '8px' }}>
            <Button variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.75, sm: 1 } }}>Share summary</Button>
            <Button variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.75, sm: 1 }, '&:hover':{ bgcolor:'#e06f00' } }}>Back to meetings</Button>
          </div>
        </Box>
      </Box>

      <Snackbar open={!!snack} autoHideDuration={1400} message={snack} onClose={()=>setSnack('')} />
    </>
  );
}
