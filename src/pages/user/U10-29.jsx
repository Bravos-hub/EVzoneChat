import React, { useState } from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
  Slider,
  Button,
  Divider,
  Snackbar
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

/**
 * U10-29 — Language & Translation / Accessibility / Data & Storage
 * One screen with three tabs
 */
export default function LTASettings({ onBack }) {
  const muiTheme = useMuiTheme();
  // const { actualMode } = useTheme();
  const [tab, setTab] = useState(0);
  const [snack, setSnack] = useState('');

  // Language & Translation
  const [uiLang, setUiLang] = useState('en');
  const [contentLangs, setContentLangs] = useState(['en']);
  const [autoTranslate, setAutoTranslate] = useState(true);

  // Accessibility
  const [fontScale, setFontScale] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [captionsDefault, setCaptionsDefault] = useState(false);

  // Data & Storage
  const [autoDownload, setAutoDownload] = useState(true);
  const [wifiOnly, setWifiOnly] = useState(true);
  const [cacheSize, setCacheSize] = useState(128);

  const save = () => setSnack('Settings saved');
  const clearCache = () => { setCacheSize(0); setSnack('Cache cleared'); };

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: 'background.default' }}>
        <AppBar elevation={0} position="static" sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom:`1px solid ${muiTheme.palette.divider}` }}>
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={onBack} aria-label="Back" sx={{ color: 'text.primary' }}><ArrowBackRoundedIcon /></IconButton>
            <Typography variant="h6" className="font-bold ml-1" sx={{ color: 'text.primary' }}>Language, Accessibility & Storage</Typography>
          </Toolbar>
        </AppBar>

        <Tabs value={tab} onChange={(e,v)=>setTab(v)} textColor="inherit" TabIndicatorProps={{ style:{ background: EV.green } }} sx={{ bgcolor: 'background.paper', borderBottom: `1px solid ${muiTheme.palette.divider}` }}>
          <Tab label="Language" sx={{ color: 'text.primary' }}/>
          <Tab label="Accessibility" sx={{ color: 'text.primary' }}/>
          <Tab label="Storage" sx={{ color: 'text.primary' }}/>
        </Tabs>

        <Box className="flex-1 p-3 space-y-3 no-scrollbar" sx={{ overflowY:'auto' }}>
          {tab===0 && (
            <>
              <FormControl fullWidth size="small">
                <InputLabel>App language</InputLabel>
                <Select label="App language" value={uiLang} onChange={(e)=>setUiLang(e.target.value)}>
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="fr">Français</MenuItem>
                  <MenuItem value="zh">中文</MenuItem>
                  <MenuItem value="sw">Swahili</MenuItem>
                </Select>
              </FormControl>

              <TextField fullWidth size="small" label="Content languages (comma‑separated)" value={contentLangs.join(', ')} onChange={(e)=>setContentLangs(e.target.value.split(',').map(s=>s.trim()).filter(Boolean))} helperText="Used for suggestions and search results" />

              <FormGroup>
                <FormControlLabel control={<Switch checked={autoTranslate} onChange={(e)=>setAutoTranslate(e.target.checked)} />} label={<span style={{ color: muiTheme.palette.text.primary }}>Auto‑translate incoming messages (when available)</span>} />
              </FormGroup>
            </>
          )}

          {tab===1 && (
            <>
              <div className="text-sm font-semibold" style={{ color: muiTheme.palette.text.primary }}>Text size</div>
              <Slider value={fontScale} onChange={(e,v)=>setFontScale(v)} valueLabelDisplay="auto" min={80} max={140} marks={[{value:80,label:'80%'},{value:100,label:'100%'},{value:140,label:'140%'}]} />
              <FormGroup>
                <FormControlLabel control={<Switch checked={highContrast} onChange={(e)=>setHighContrast(e.target.checked)} />} label={<span style={{ color: muiTheme.palette.text.primary }}>High contrast mode</span>} />
                <FormControlLabel control={<Switch checked={reduceMotion} onChange={(e)=>setReduceMotion(e.target.checked)} />} label={<span style={{ color: muiTheme.palette.text.primary }}>Reduce motion/animations</span>} />
                <FormControlLabel control={<Switch checked={captionsDefault} onChange={(e)=>setCaptionsDefault(e.target.checked)} />} label={<span style={{ color: muiTheme.palette.text.primary }}>Captions on by default in meetings</span>} />
              </FormGroup>
            </>
          )}

          {tab===2 && (
            <>
              <FormGroup>
                <FormControlLabel control={<Switch checked={autoDownload} onChange={(e)=>setAutoDownload(e.target.checked)} />} label={<span style={{ color: muiTheme.palette.text.primary }}>Auto‑download media</span>} />
                <FormControlLabel control={<Switch checked={wifiOnly} onChange={(e)=>setWifiOnly(e.target.checked)} />} label={<span style={{ color: muiTheme.palette.text.primary }}>Wi‑Fi only for downloads</span>} />
              </FormGroup>
              <Divider sx={{ borderColor: muiTheme.palette.divider }} />
              <div className="text-sm font-semibold" style={{ color: muiTheme.palette.text.primary }}>Cache</div>
              <div className="text-sm" style={{ color: muiTheme.palette.text.primary }}>App cache: <strong>{cacheSize} MB</strong></div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button variant="outlined" sx={{ textTransform:'none' }} onClick={()=>setCacheSize(cacheSize + 50)}>Simulate +50MB</Button>
                <Button variant="contained" sx={{ textTransform:'none' }} onClick={clearCache}>Clear cache</Button>
              </div>
            </>
          )}
        </Box>

        <Box className="px-3 pb-3">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outlined" sx={{ textTransform:'none' }}>Cancel</Button>
            <Button onClick={save} variant="contained" sx={{ textTransform:'none' }}>Save</Button>
          </div>
        </Box>
      </Box>

      <Snackbar open={!!snack} autoHideDuration={1500} message={snack} onClose={()=>setSnack('')} />
    </>
  );
}
