import { useState } from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Chip,
  Divider, // eslint-disable-line no-unused-vars
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

// const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

/**
 * U06-18 — Meeting Info & End Options
 * Shows link, agenda, participants count; actions: copy/share; leave vs end for all (confirmations)
 */
export default function MeetingInfoEnd({ onBack, info = { title:'Weekly Sync', code:'evz-9k5f-311', link:'https://evzone.app/j/evz-9k5f-311', agenda:'1) Standup\n2) Roadmap\n3) Q&A', participants: 12, policies:['Lobby on','Recording on consent','Admins can monitor'] } }) {
  const muiTheme = useMuiTheme();
  // const { actualMode } = useTheme();
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

      <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: 'background.default' }}>
        <AppBar elevation={0} position="static" sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom:`1px solid ${muiTheme.palette.divider}` }}>
          <Toolbar className="!min-h-[56px]" sx={{ px: { xs: 1.5, sm: 3 } }}>
            <IconButton onClick={onBack} aria-label="Back" sx={{ color: 'text.primary', padding: { xs: '6px', sm: '8px' } }}>
              <ArrowBackRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <Typography variant="h6" className="font-bold" sx={{ color: 'text.primary', fontSize: { xs: '16px', sm: '18px' }, ml: { xs: 0.5, sm: 1 } }}>Meeting info</Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 2, sm: 3 }, '& > * + *': { mt: { xs: 2, sm: 3 } }, flex: 1, overflowY: 'auto' }} className="no-scrollbar">
          {/* Link */}
          <Box className="rounded-2xl" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper', p: { xs: 2, sm: 3 } }}>
            <div className="flex items-center mb-1" style={{ gap: '8px', color: muiTheme.palette.text.primary }}>
              <LinkRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              <span className="font-semibold" style={{ fontSize: '14px' }}>Link</span>
            </div>
            <div className="break-all" style={{ color: muiTheme.palette.text.primary, fontSize: '13px' }}>{info.link}</div>
            <div className="mt-2 flex" style={{ gap: '8px' }}>
              <Button startIcon={<ContentCopyRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} onClick={copy} variant="outlined" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Copy</Button>
              <Button startIcon={<ShareRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} onClick={share} variant="contained" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Share</Button>
            </div>
          </Box>

          {/* Agenda */}
          <Box className="rounded-2xl" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper', p: { xs: 2, sm: 3 } }}>
            <div className="flex items-center mb-1" style={{ gap: '8px', color: muiTheme.palette.text.primary }}>
              <EventNoteRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              <span className="font-semibold" style={{ fontSize: '14px' }}>Agenda</span>
            </div>
            <pre className="whitespace-pre-wrap" style={{ color: muiTheme.palette.text.primary, fontSize: '13px' }}>{info.agenda}</pre>
          </Box>

          {/* Policies */}
          <Box className="rounded-2xl" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper', p: { xs: 2, sm: 3 } }}>
            <div className="flex items-center mb-1" style={{ gap: '8px', color: muiTheme.palette.text.primary }}>
              <InfoRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              <span className="font-semibold" style={{ fontSize: '14px' }}>Policies</span>
              <Chip size="small" label="module‑specific" sx={{ bgcolor: 'background.default', color: 'text.primary', fontSize: { xs: '10px', sm: '11px' }, height: { xs: 20, sm: 22 } }} />
            </div>
            <ul className="list-disc pl-5" style={{ color: muiTheme.palette.text.primary, fontSize: '13px' }}>
              {info.policies.map((p, i)=>(<li key={i}>{p}</li>))}
            </ul>
          </Box>

          {/* Participants */}
          <div className="flex items-center" style={{ gap: '8px', color: muiTheme.palette.text.primary, fontSize: '13px' }}>
            <span className="font-semibold">Participants:</span>
            <Chip size="small" label={info.participants} sx={{ bgcolor: 'background.default', color: 'text.primary', fontSize: { xs: '11px', sm: '12px' }, height: { xs: 22, sm: 24 } }} />
          </div>
        </Box>

        {/* Footer */}
        <Box sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
          <div className="grid grid-cols-2" style={{ gap: '8px' }}>
            <Button variant="outlined" sx={{ textTransform:'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.75, sm: 1 } }}>Leave meeting</Button>
            <Button onClick={()=>setConfirmEnd(true)} variant="contained" sx={{ bgcolor:'#e53935', textTransform:'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.75, sm: 1 }, '&:hover':{ bgcolor:'#c62828' } }}>End for all</Button>
          </div>
        </Box>
      </Box>

      {/* Confirm end for all */}
      <Dialog open={confirmEnd} onClose={()=>setConfirmEnd(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { m: { xs: 2, sm: 3 } } }}>
        <DialogTitle sx={{ fontSize: { xs: '16px', sm: '18px' }, px: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 3 } }}>End meeting for everyone?</DialogTitle>
        <DialogContent dividers sx={{ px: { xs: 2, sm: 3 } }}>
          <Typography variant="body2" sx={{ fontSize: { xs: '13px', sm: '14px' } }}>This will disconnect all participants and close the room.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
          <Button onClick={()=>setConfirmEnd(false)} variant="outlined" sx={{ textTransform:'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.5, sm: 0.75 } }}>Cancel</Button>
          <Button onClick={()=>setConfirmEnd(false)} variant="contained" sx={{ bgcolor:'#e53935', textTransform:'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.5, sm: 0.75 }, '&:hover':{ bgcolor:'#c62828' } }}>End now</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={1500} message={snack} onClose={()=>setSnack('')} />
    </>
  );
}
