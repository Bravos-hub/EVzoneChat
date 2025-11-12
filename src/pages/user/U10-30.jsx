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
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import Brightness4RoundedIcon from "@mui/icons-material/Brightness4Rounded";
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import TipsAndUpdatesRoundedIcon from "@mui/icons-material/TipsAndUpdatesRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

/**
 * U10-30 — Theme (EV Colors) & Export/Delete & Tips
 */
export default function ThemeExportDeleteTips({ onBack }) {
  const [mode, setMode] = useState('light');
  const [accent, setAccent] = useState('orange'); // orange | green | grey
  const [snack, setSnack] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const exportData = () => setSnack('Preparing export…');
  const requestDelete = () => setConfirmOpen(true);
  const doDelete = () => { setConfirmOpen(false); setSnack('Account deletion requested'); };

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full max-w-sm mx-auto bg-white flex flex-col">
        <AppBar elevation={0} position="static" sx={{ bgcolor:'#fff', color:'#111', borderBottom:`1px solid ${EV.light}` }}>
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={onBack} aria-label="Back"><ArrowBackRoundedIcon /></IconButton>
            <Typography variant="h6" className="font-bold ml-1">Theme & Data</Typography>
          </Toolbar>
        </AppBar>

        <Box className="flex-1 p-3 space-y-3 no-scrollbar" sx={{ overflowY:'auto' }}>
          {/* Theme */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${EV.light}` }}>
            <div className="flex items-center gap-2 mb-1"><Brightness4RoundedIcon/><span className="font-semibold">Mode</span></div>
            <ToggleButtonGroup color="primary" exclusive value={mode} onChange={(e, val)=> val && setMode(val)}>
              <ToggleButton value="light">Light</ToggleButton>
              <ToggleButton value="dark">Dark</ToggleButton>
              <ToggleButton value="system">System</ToggleButton>
            </ToggleButtonGroup>
            <Divider className="my-3" />
            <div className="flex items-center gap-2 mb-1"><PaletteRoundedIcon/><span className="font-semibold">Accent</span></div>
            <div className="flex items-center gap-2">
              <Chip clickable onClick={()=>setAccent('orange')} label="EV Orange" sx={{ bgcolor: '#f77f00', color:'#fff' }} />
              <Chip clickable onClick={()=>setAccent('green')} label="EV Green" sx={{ bgcolor: '#03cd8c', color:'#fff' }} />
              <Chip clickable onClick={()=>setAccent('grey')} label="Medium Grey" sx={{ bgcolor: '#a6a6a6', color:'#111' }} />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
              <div className="rounded-xl h-16" style={{ background: '#f2f2f2' }} />
              <div className="rounded-xl h-16" style={{ background: accent==='orange'? '#f77f00' : accent==='green'? '#03cd8c' : '#a6a6a6' }} />
              <div className="rounded-xl h-16" style={{ background: '#ffffff', border:'1px solid #eee' }} />
            </div>
          </Box>

          {/* Export */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${EV.light}` }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><FileDownloadRoundedIcon/><span className="font-semibold">Export my data</span></div>
              <Button onClick={exportData} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>Start export</Button>
            </div>
            <div className="text-xs text-gray-600 mt-1">We’ll compile your messages, files, and settings and send a download link.</div>
          </Box>

          {/* Delete account */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${EV.light}` }}>
            <div className="flex items-center gap-2 text-red-700 font-semibold"><DeleteForeverRoundedIcon/> Delete my account</div>
            <div className="text-xs text-gray-600 mt-1">This is permanent. Export your data before deleting.</div>
            <div className="mt-2"><Button onClick={requestDelete} variant="contained" sx={{ bgcolor:'#e53935', textTransform:'none', '&:hover':{ bgcolor:'#c62828' } }}>Request deletion</Button></div>
          </Box>

          {/* Tips */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${EV.light}` }}>
            <div className="flex items-center gap-2 mb-1"><TipsAndUpdatesRoundedIcon/><span className="font-semibold">Tips</span></div>
            <ul className="list-disc pl-5 text-sm text-gray-800">
              <li>Use **Quiet hours** to mute late‑night pings.</li>
              <li>Turn on **2FA** in Security for stronger protection.</li>
              <li>Try **high contrast** if you work outdoors a lot.</li>
            </ul>
          </Box>
        </Box>

        <Box className="px-3 pb-3">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Cancel</Button>
            <Button variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>Save</Button>
          </div>
        </Box>
      </Box>

      {/* Delete confirm */}
      <Dialog open={confirmOpen} onClose={()=>setConfirmOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Confirm deletion</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2">Type <strong>DELETE</strong> to confirm account deletion.</Typography>
          <TextField fullWidth size="small" value={confirmText} onChange={(e)=>setConfirmText(e.target.value)} sx={{ mt:1.5 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setConfirmOpen(false)} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Cancel</Button>
          <Button disabled={confirmText!=="DELETE"} onClick={doDelete} variant="contained" sx={{ bgcolor:'#e53935', textTransform:'none', '&:hover':{ bgcolor:'#c62828' } }}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={1500} message={snack} onClose={()=>setSnack('')} />
    </>
  );
}
