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
import { useTheme } from "../../context/ThemeContext";
import { useTheme as useMuiTheme } from "@mui/material/styles";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

/**
 * U10-30 — Theme (EV Colors) & Export/Delete & Tips
 */
export default function ThemeExportDeleteTips({ onBack }) {
  const { mode, setMode, accent, setAccent, accentColor, actualMode, isSystem } = useTheme();
  const muiTheme = useMuiTheme();
  const [snack, setSnack] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const exportData = () => setSnack('Preparing export…');
  const requestDelete = () => setConfirmOpen(true);
  const doDelete = () => { setConfirmOpen(false); setSnack('Account deletion requested'); };

  // Show current system preference when in system mode
  const systemInfo = isSystem ? ` (${actualMode === 'dark' ? 'Dark' : 'Light'})` : '';

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: 'background.paper' }}>
        <AppBar elevation={0} position="static" sx={{ bgcolor:'background.paper', color:'text.primary', borderBottom: `1px solid ${muiTheme.palette.divider}` }}>
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={onBack} aria-label="Back"><ArrowBackRoundedIcon /></IconButton>
            <Typography variant="h6" className="font-bold ml-1">Theme & Data</Typography>
          </Toolbar>
        </AppBar>

        <Box className="flex-1 p-3 space-y-3 no-scrollbar" sx={{ overflowY:'auto' }}>
          {/* Theme */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper' }}>
            <div className="flex items-center gap-2 mb-1">
              <Brightness4RoundedIcon sx={{ color: 'text.primary' }}/>
              <span className="font-semibold" style={{ color: muiTheme.palette.text.primary }}>Mode</span>
              {isSystem && <span className="text-xs ml-auto" style={{ color: muiTheme.palette.text.secondary }}>Following system{systemInfo}</span>}
            </div>
            <ToggleButtonGroup 
              color="primary" 
              exclusive 
              value={mode} 
              onChange={(e, val)=> {
                if (val) {
                  setMode(val);
                  setSnack(`Theme set to ${val === 'system' ? 'system' : val}`);
                }
              }}
              fullWidth
              sx={{ mb: 1 }}
            >
              <ToggleButton value="light" sx={{ textTransform: 'none' }}>Light</ToggleButton>
              <ToggleButton value="dark" sx={{ textTransform: 'none' }}>Dark</ToggleButton>
              <ToggleButton value="system" sx={{ textTransform: 'none' }}>System</ToggleButton>
            </ToggleButtonGroup>
            <Divider className="my-3" />
            <div className="flex items-center gap-2 mb-1"><PaletteRoundedIcon/><span className="font-semibold">Accent Color</span></div>
            <div className="flex items-center gap-2 flex-wrap">
              <Chip 
                clickable 
                onClick={()=>setAccent('green')} 
                label="EV Green" 
                sx={{ 
                  bgcolor: accent === 'green' ? '#03cd8c' : '#f2f2f2', 
                  color: accent === 'green' ? '#fff' : '#111',
                  border: accent === 'green' ? '2px solid #03cd8c' : '2px solid transparent',
                  '&:hover': { bgcolor: accent === 'green' ? '#02b37b' : '#e9e9e9' }
                }} 
              />
              <Chip 
                clickable 
                onClick={()=>setAccent('orange')} 
                label="EV Orange" 
                sx={{ 
                  bgcolor: accent === 'orange' ? '#f77f00' : '#f2f2f2', 
                  color: accent === 'orange' ? '#fff' : '#111',
                  border: accent === 'orange' ? '2px solid #f77f00' : '2px solid transparent',
                  '&:hover': { bgcolor: accent === 'orange' ? '#e06f00' : '#e9e9e9' }
                }} 
              />
              <Chip 
                clickable 
                onClick={()=>setAccent('grey')} 
                label="Medium Grey" 
                sx={{ 
                  bgcolor: accent === 'grey' ? '#a6a6a6' : '#f2f2f2', 
                  color: accent === 'grey' ? '#fff' : '#111',
                  border: accent === 'grey' ? '2px solid #a6a6a6' : '2px solid transparent',
                  '&:hover': { bgcolor: accent === 'grey' ? '#8f8f8f' : '#e9e9e9' }
                }} 
              />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
              <div className="rounded-xl h-16 flex items-center justify-center text-xs" style={{ background: muiTheme.palette.background.default, color: muiTheme.palette.text.secondary }}>Light</div>
              <div className="rounded-xl h-16 flex items-center justify-center text-xs text-white" style={{ background: accent==='orange'? '#f77f00' : accent==='green'? '#03cd8c' : '#a6a6a6' }}>Accent</div>
              <div className="rounded-xl h-16 flex items-center justify-center text-xs" style={{ background: muiTheme.palette.background.paper, border:`1px solid ${muiTheme.palette.divider}`, color: muiTheme.palette.text.secondary }}>Paper</div>
            </div>
          </Box>

          {/* Export */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2" style={{ color: muiTheme.palette.text.primary }}><FileDownloadRoundedIcon/><span className="font-semibold">Export my data</span></div>
              <Button onClick={exportData} variant="contained" sx={{ textTransform:'none' }}>Start export</Button>
            </div>
            <div className="text-xs mt-1" style={{ color: muiTheme.palette.text.secondary }}>We'll compile your messages, files, and settings and send a download link.</div>
          </Box>

          {/* Delete account */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper' }}>
            <div className="flex items-center gap-2 font-semibold" style={{ color: '#e53935' }}><DeleteForeverRoundedIcon/> Delete my account</div>
            <div className="text-xs mt-1" style={{ color: muiTheme.palette.text.secondary }}>This is permanent. Export your data before deleting.</div>
            <div className="mt-2"><Button onClick={requestDelete} variant="contained" sx={{ bgcolor:'#e53935', textTransform:'none', '&:hover':{ bgcolor:'#c62828' } }}>Request deletion</Button></div>
          </Box>

          {/* Tips */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper' }}>
            <div className="flex items-center gap-2 mb-1" style={{ color: muiTheme.palette.text.primary }}><TipsAndUpdatesRoundedIcon/><span className="font-semibold">Tips</span></div>
            <ul className="list-disc pl-5 text-sm" style={{ color: muiTheme.palette.text.primary }}>
              <li>Use **Quiet hours** to mute late‑night pings.</li>
              <li>Turn on **2FA** in Security for stronger protection.</li>
              <li>Try **high contrast** if you work outdoors a lot.</li>
            </ul>
          </Box>
        </Box>

        <Box className="px-3 pb-3">
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outlined" 
              onClick={onBack}
              sx={{ borderColor: accentColor, color: accentColor, textTransform:'none' }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={() => { 
                setSnack('Theme saved!'); 
                setTimeout(() => onBack?.(), 1000); 
              }}
              sx={{ textTransform:'none' }}
            >
              Save
            </Button>
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
          <Button onClick={()=>setConfirmOpen(false)} variant="outlined" sx={{ borderColor: accentColor, color: accentColor, textTransform:'none' }}>Cancel</Button>
          <Button disabled={confirmText!=="DELETE"} onClick={doDelete} variant="contained" sx={{ bgcolor:'#e53935', textTransform:'none', '&:hover':{ bgcolor:'#c62828' } }}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={1500} message={snack} onClose={()=>setSnack('')} />
    </>
  );
}
