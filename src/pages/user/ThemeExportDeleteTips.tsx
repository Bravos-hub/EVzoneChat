import { useState } from "react";
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

// const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

/**
 * U10-30 — Theme (EV Colors) & Export/Delete & Tips
 */
export default function ThemeExportDeleteTips({ onBack, layoutMode = 'mobile' }) {
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

      <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: 'transparent' }}>
        <AppBar elevation={0} position="static" sx={{ bgcolor: 'transparent', color:'text.primary', borderBottom: `1px solid ${muiTheme.palette.divider}` }}>
          <Toolbar className="!min-h-[56px]" sx={{ px: { xs: 1.5, sm: 3 } }}>
            <IconButton onClick={onBack} aria-label="Back" sx={{ padding: { xs: '6px', sm: '8px' } }}>
              <ArrowBackRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <Typography variant="h6" className="font-bold" sx={{ fontSize: { xs: '16px', sm: '18px' }, ml: { xs: 0.5, sm: 1 } }}>Theme & Data</Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 2, sm: 3 }, flex: 1, overflowY: 'auto' }} className="no-scrollbar">
          {/* Theme */}
          <Box className="rounded-2xl" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper', p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
            <div className="flex items-center mb-1" style={{ gap: '8px' }}>
              <Brightness4RoundedIcon sx={{ color: 'text.primary', fontSize: { xs: 18, sm: 20 } }} />
              <span className="font-semibold" style={{ color: muiTheme.palette.text.primary, fontSize: '15px' }}>Mode</span>
              {isSystem && <span className="ml-auto" style={{ color: muiTheme.palette.text.secondary, fontSize: '12px' }}>Following system{systemInfo}</span>}
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
              <ToggleButton value="light" sx={{ textTransform: 'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.5, sm: 0.75 } }}>Light</ToggleButton>
              <ToggleButton value="dark" sx={{ textTransform: 'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.5, sm: 0.75 } }}>Dark</ToggleButton>
              <ToggleButton value="system" sx={{ textTransform: 'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.5, sm: 0.75 } }}>System</ToggleButton>
            </ToggleButtonGroup>
            <Divider className="my-3" />
            <div className="flex items-center mb-1" style={{ gap: '8px' }}>
              <PaletteRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              <span className="font-semibold" style={{ fontSize: '15px' }}>Accent Color</span>
            </div>
            <div className="flex flex-wrap" style={{ gap: '8px' }}>
              <Chip 
                clickable 
                onClick={()=>setAccent('green')} 
                label="EV Green" 
                sx={{ 
                  bgcolor: accent === 'green' ? '#03cd8c' : '#f2f2f2', 
                  color: accent === 'green' ? '#fff' : '#111',
                  border: accent === 'green' ? '2px solid #03cd8c' : '2px solid transparent',
                  fontSize: { xs: '12px', sm: '13px' },
                  height: { xs: 32, sm: 36 },
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
                  fontSize: { xs: '12px', sm: '13px' },
                  height: { xs: 32, sm: 36 },
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
                  fontSize: { xs: '12px', sm: '13px' },
                  height: { xs: 32, sm: 36 },
                  '&:hover': { bgcolor: accent === 'grey' ? '#8f8f8f' : '#e9e9e9' }
                }} 
              />
            </div>
            <div className="mt-3 grid grid-cols-3" style={{ gap: '8px' }}>
              <div className="rounded-xl flex items-center justify-center" style={{ background: muiTheme.palette.background.default, color: muiTheme.palette.text.secondary, height: '64px', fontSize: '12px' }}>Light</div>
              <div className="rounded-xl flex items-center justify-center text-white" style={{ background: accent==='orange'? '#f77f00' : accent==='green'? '#03cd8c' : '#a6a6a6', height: '64px', fontSize: '12px' }}>Accent</div>
              <div className="rounded-xl flex items-center justify-center" style={{ background: muiTheme.palette.background.paper, border:`1px solid ${muiTheme.palette.divider}`, color: muiTheme.palette.text.secondary, height: '64px', fontSize: '12px' }}>Paper</div>
            </div>
          </Box>

          {/* Export */}
          <Box className="rounded-2xl" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper', p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
            <div className="flex items-center justify-between flex-wrap" style={{ gap: '8px' }}>
              <div className="flex items-center" style={{ gap: '8px', color: muiTheme.palette.text.primary }}>
                <FileDownloadRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                <span className="font-semibold" style={{ fontSize: '15px' }}>Export my data</span>
              </div>
              <Button onClick={exportData} variant="contained" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Start export</Button>
            </div>
            <div style={{ color: muiTheme.palette.text.secondary, fontSize: '12px', marginTop: '8px' }}>We'll compile your messages, files, and settings and send a download link.</div>
          </Box>

          {/* Delete account */}
          <Box className="rounded-2xl" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper', p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
            <div className="flex items-center" style={{ gap: '8px', color: '#e53935' }}>
              <DeleteForeverRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              <span className="font-semibold" style={{ fontSize: '15px' }}>Delete my account</span>
            </div>
            <div style={{ color: muiTheme.palette.text.secondary, fontSize: '12px', marginTop: '8px' }}>This is permanent. Export your data before deleting.</div>
            <div style={{ marginTop: '8px' }}>
              <Button onClick={requestDelete} variant="contained" sx={{ bgcolor:'#e53935', textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 }, '&:hover':{ bgcolor:'#c62828' } }}>Request deletion</Button>
            </div>
          </Box>

          {/* Tips */}
          <Box className="rounded-2xl" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper', p: { xs: 2, sm: 3 } }}>
            <div className="flex items-center mb-1" style={{ gap: '8px', color: muiTheme.palette.text.primary }}>
              <TipsAndUpdatesRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              <span className="font-semibold" style={{ fontSize: '15px' }}>Tips</span>
            </div>
            <ul className="list-disc pl-5" style={{ color: muiTheme.palette.text.primary, fontSize: '13px' }}>
              <li>Use **Quiet hours** to mute late‑night pings.</li>
              <li>Turn on **2FA** in Security for stronger protection.</li>
              <li>Try **high contrast** if you work outdoors a lot.</li>
            </ul>
          </Box>
        </Box>

        <Box sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
          <div className="grid grid-cols-2" style={{ gap: '8px' }}>
            <Button 
              variant="outlined" 
              onClick={onBack}
              sx={{ borderColor: accentColor, color: accentColor, textTransform:'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.75, sm: 1 } }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={() => { 
                setSnack('Theme saved!'); 
                setTimeout(() => onBack?.(), 1000); 
              }}
              sx={{ textTransform:'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.75, sm: 1 } }}
            >
              Save
            </Button>
          </div>
        </Box>
      </Box>

      {/* Delete confirm */}
      <Dialog open={confirmOpen} onClose={()=>setConfirmOpen(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { m: { xs: 2, sm: 3 } } }}>
        <DialogTitle sx={{ fontSize: { xs: '16px', sm: '18px' }, px: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 3 } }}>Confirm deletion</DialogTitle>
        <DialogContent dividers sx={{ px: { xs: 2, sm: 3 } }}>
          <Typography variant="body2" sx={{ fontSize: { xs: '13px', sm: '14px' } }}>Type <strong>DELETE</strong> to confirm account deletion.</Typography>
          <TextField fullWidth size="small" value={confirmText} onChange={(e)=>setConfirmText(e.target.value)} sx={{ mt:1.5, '& .MuiInputBase-input': { fontSize: { xs: '13px', sm: '14px' } } }} />
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
          <Button onClick={()=>setConfirmOpen(false)} variant="outlined" sx={{ borderColor: accentColor, color: accentColor, textTransform:'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.5, sm: 0.75 } }}>Cancel</Button>
          <Button disabled={confirmText!=="DELETE"} onClick={doDelete} variant="contained" sx={{ bgcolor:'#e53935', textTransform:'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.5, sm: 0.75 }, '&:hover':{ bgcolor:'#c62828' } }}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={1500} message={snack} onClose={()=>setSnack('')} />
    </>
  );
}

