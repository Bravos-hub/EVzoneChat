import { useState } from "react";
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
  Snackbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import BrushRoundedIcon from "@mui/icons-material/BrushRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

/**
 * U10-29 — Language & Translation / Accessibility / Data & Storage
 * One screen with three tabs
 */
export default function LTASettings({ onBack, onNavigate, layoutMode = 'mobile' }) {
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

      <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: 'transparent' }}>
        <AppBar elevation={0} position="static" sx={{ bgcolor: 'transparent', color: 'text.primary', borderBottom:`1px solid ${muiTheme.palette.divider}` }}>
          <Toolbar className="!min-h-[56px]" sx={{ px: { xs: 1.5, sm: 3 } }}>
            <IconButton onClick={onBack} aria-label="Back" sx={{ color: 'text.primary', padding: { xs: '6px', sm: '8px' } }}>
              <ArrowBackRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <Typography variant="h6" className="font-bold" sx={{ color: 'text.primary', fontSize: { xs: '16px', sm: '18px' }, ml: { xs: 0.5, sm: 1 }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Settings</Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 2, sm: 3 }, flex: 1, overflowY: 'auto' }} className="no-scrollbar">
          {/* Settings navigation links */}
          <Box className="rounded-2xl" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper', mb: { xs: 2, sm: 2 } }}>
            <List sx={{ py: 0 }}>
              <ListItem 
                button 
                onClick={() => onNavigate?.('/theme')}
                sx={{ borderRadius: '8px 8px 0 0', px: { xs: 2, sm: 3 }, py: { xs: 1, sm: 1.25 } }}
              >
                <ListItemIcon>
                  <BrushRoundedIcon sx={{ color: 'text.primary', fontSize: { xs: 20, sm: 24 } }} />
                </ListItemIcon>
                <ListItemText 
                  primary={<span style={{ fontSize: '15px' }}>Theme</span>} 
                  secondary={<span style={{ fontSize: '13px' }}>Light · Dark · System</span>} 
                  sx={{ color: 'text.primary' }} 
                />
                <ChevronRightRoundedIcon sx={{ color: 'text.secondary', fontSize: { xs: 18, sm: 20 } }} />
              </ListItem>
              <Divider />
              <ListItem 
                button 
                onClick={() => onNavigate?.('/security')}
                sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1, sm: 1.25 } }}
              >
                <ListItemIcon>
                  <SecurityRoundedIcon sx={{ color: 'text.primary', fontSize: { xs: 20, sm: 24 } }} />
                </ListItemIcon>
                <ListItemText 
                  primary={<span style={{ fontSize: '15px' }}>Security</span>} 
                  secondary={<span style={{ fontSize: '13px' }}>Sessions & 2FA</span>} 
                  sx={{ color: 'text.primary' }} 
                />
                <ChevronRightRoundedIcon sx={{ color: 'text.secondary', fontSize: { xs: 18, sm: 20 } }} />
              </ListItem>
              <Divider />
              <ListItem 
                button 
                onClick={() => onNavigate?.('/profile')}
                sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1, sm: 1.25 } }}
              >
                <ListItemIcon>
                  <PersonRoundedIcon sx={{ color: 'text.primary', fontSize: { xs: 20, sm: 24 } }} />
                </ListItemIcon>
                <ListItemText 
                  primary={<span style={{ fontSize: '15px' }}>Profile</span>} 
                  secondary={<span style={{ fontSize: '13px' }}>Edit your profile</span>} 
                  sx={{ color: 'text.primary' }} 
                />
                <ChevronRightRoundedIcon sx={{ color: 'text.secondary', fontSize: { xs: 18, sm: 20 } }} />
              </ListItem>
              <Divider />
              <ListItem 
                button 
                onClick={() => onNavigate?.('/meetings/book')}
                sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1, sm: 1.25 } }}
              >
                <ListItemIcon>
                  <EventAvailableRoundedIcon sx={{ color: 'text.primary', fontSize: { xs: 20, sm: 24 } }} />
                </ListItemIcon>
                <ListItemText 
                  primary={<span style={{ fontSize: '15px' }}>Schedule meeting</span>} 
                  secondary={<span style={{ fontSize: '13px' }}>Create a new meeting</span>} 
                  sx={{ color: 'text.primary' }} 
                />
                <ChevronRightRoundedIcon sx={{ color: 'text.secondary', fontSize: { xs: 18, sm: 20 } }} />
              </ListItem>
              <Divider />
              <ListItem 
                button 
                onClick={() => onNavigate?.('/meetings')}
                sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1, sm: 1.25 } }}
              >
                <ListItemIcon>
                  <EventAvailableRoundedIcon sx={{ color: 'text.primary', opacity: 0.7, fontSize: { xs: 20, sm: 24 } }} />
                </ListItemIcon>
                <ListItemText 
                  primary={<span style={{ fontSize: '15px' }}>My meetings</span>} 
                  secondary={<span style={{ fontSize: '13px' }}>View all meetings</span>} 
                  sx={{ color: 'text.primary' }} 
                />
                <ChevronRightRoundedIcon sx={{ color: 'text.secondary', fontSize: { xs: 18, sm: 20 } }} />
              </ListItem>
              <Divider />
              <ListItem 
                button 
                onClick={() => onNavigate?.('/media')}
                sx={{ borderRadius: '0 0 8px 8px', px: { xs: 2, sm: 3 }, py: { xs: 1, sm: 1.25 } }}
              >
                <ListItemIcon>
                  <ImageRoundedIcon sx={{ color: 'text.primary', fontSize: { xs: 20, sm: 24 } }} />
                </ListItemIcon>
                <ListItemText 
                  primary={<span style={{ fontSize: '15px' }}>Media</span>} 
                  secondary={<span style={{ fontSize: '13px' }}>Photos, videos & files</span>} 
                  sx={{ color: 'text.primary' }} 
                />
                <ChevronRightRoundedIcon sx={{ color: 'text.secondary', fontSize: { xs: 18, sm: 20 } }} />
              </ListItem>
            </List>
          </Box>

          {/* Language, Accessibility & Storage Tabs */}
          <Tabs 
            value={tab} 
            onChange={(e,v)=>setTab(v)} 
            textColor="inherit" 
            TabIndicatorProps={{ style:{ background: EV.green } }} 
            sx={{ 
              bgcolor: 'background.paper', 
              border: `1px solid ${muiTheme.palette.divider}`,
              borderRadius: '8px',
              mb: { xs: 2, sm: 2 },
              '& .MuiTabs-flexContainer': {
                px: { xs: 1, sm: 2 }
              }
            }}
          >
            <Tab 
              label="LANGUAGE" 
              sx={{ 
                color: 'text.primary', 
                fontSize: { xs: '12px', sm: '13px' }, 
                minHeight: { xs: 44, sm: 48 },
                textTransform: 'uppercase',
                fontWeight: tab === 0 ? 600 : 500
              }}
            />
            <Tab 
              label="ACCESSIBILITY" 
              sx={{ 
                color: 'text.primary', 
                fontSize: { xs: '12px', sm: '13px' }, 
                minHeight: { xs: 44, sm: 48 },
                textTransform: 'uppercase',
                fontWeight: tab === 1 ? 600 : 500
              }}
            />
            <Tab 
              label="STORAGE" 
              sx={{ 
                color: 'text.primary', 
                fontSize: { xs: '12px', sm: '13px' }, 
                minHeight: { xs: 44, sm: 48 },
                textTransform: 'uppercase',
                fontWeight: tab === 2 ? 600 : 500
              }}
            />
          </Tabs>

          {tab===0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ fontSize: { xs: '13px', sm: '14px' } }}>App language</InputLabel>
                <Select label="App language" value={uiLang} onChange={(e)=>setUiLang(e.target.value)} sx={{ fontSize: { xs: '13px', sm: '14px' } }}>
                  <MenuItem value="en" sx={{ fontSize: { xs: '13px', sm: '14px' } }}>English</MenuItem>
                  <MenuItem value="fr" sx={{ fontSize: { xs: '13px', sm: '14px' } }}>Français</MenuItem>
                  <MenuItem value="zh" sx={{ fontSize: { xs: '13px', sm: '14px' } }}>中文</MenuItem>
                  <MenuItem value="sw" sx={{ fontSize: { xs: '13px', sm: '14px' } }}>Swahili</MenuItem>
                </Select>
              </FormControl>

              <TextField fullWidth size="small" label="Content languages (comma‑separated)" value={contentLangs.join(', ')} onChange={(e)=>setContentLangs(e.target.value.split(',').map(s=>s.trim()).filter(Boolean))} helperText="Used for suggestions and search results" sx={{ '& .MuiInputBase-input': { fontSize: { xs: '13px', sm: '14px' } }, '& .MuiFormHelperText-root': { fontSize: { xs: '11px', sm: '12px' } } }} />

              <FormGroup>
                <FormControlLabel control={<Switch checked={autoTranslate} onChange={(e)=>setAutoTranslate(e.target.checked)} />} label={<span style={{ color: muiTheme.palette.text.primary, fontSize: '14px' }}>Auto‑translate incoming messages (when available)</span>} />
              </FormGroup>
            </Box>
          )}

          {tab===1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div className="font-semibold" style={{ color: muiTheme.palette.text.primary, fontSize: '14px' }}>Text size</div>
              <Slider value={fontScale} onChange={(e,v)=>setFontScale(Array.isArray(v) ? v[0] : v)} valueLabelDisplay="auto" min={80} max={140} marks={[{value:80,label:'80%'},{value:100,label:'100%'},{value:140,label:'140%'}]} sx={{ mt: 1, mb: 2 }} />
              <FormGroup>
                <FormControlLabel control={<Switch checked={highContrast} onChange={(e)=>setHighContrast(e.target.checked)} />} label={<span style={{ color: muiTheme.palette.text.primary, fontSize: '14px' }}>High contrast mode</span>} />
                <FormControlLabel control={<Switch checked={reduceMotion} onChange={(e)=>setReduceMotion(e.target.checked)} />} label={<span style={{ color: muiTheme.palette.text.primary, fontSize: '14px' }}>Reduce motion/animations</span>} />
                <FormControlLabel control={<Switch checked={captionsDefault} onChange={(e)=>setCaptionsDefault(e.target.checked)} />} label={<span style={{ color: muiTheme.palette.text.primary, fontSize: '14px' }}>Captions on by default in meetings</span>} />
              </FormGroup>
            </Box>
          )}

          {tab===2 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormGroup>
                <FormControlLabel control={<Switch checked={autoDownload} onChange={(e)=>setAutoDownload(e.target.checked)} />} label={<span style={{ color: muiTheme.palette.text.primary, fontSize: '14px' }}>Auto‑download media</span>} />
                <FormControlLabel control={<Switch checked={wifiOnly} onChange={(e)=>setWifiOnly(e.target.checked)} />} label={<span style={{ color: muiTheme.palette.text.primary, fontSize: '14px' }}>Wi‑Fi only for downloads</span>} />
              </FormGroup>
              <Divider sx={{ borderColor: muiTheme.palette.divider, my: { xs: 1, sm: 1 } }} />
              <div className="font-semibold" style={{ color: muiTheme.palette.text.primary, fontSize: '14px' }}>Cache</div>
              <div style={{ color: muiTheme.palette.text.primary, fontSize: '13px', marginTop: '4px' }}>App cache: <strong>{cacheSize} MB</strong></div>
              <div className="grid grid-cols-2 mt-2" style={{ gap: '8px' }}>
                <Button variant="outlined" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }} onClick={()=>setCacheSize(cacheSize + 50)}>Simulate +50MB</Button>
                <Button variant="contained" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }} onClick={clearCache}>Clear cache</Button>
              </div>
            </Box>
          )}
        </Box>

        <Box sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
          <div className="grid grid-cols-2" style={{ gap: '8px' }}>
            <Button variant="outlined" sx={{ textTransform:'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.75, sm: 1 } }}>Cancel</Button>
            <Button onClick={save} variant="contained" sx={{ textTransform:'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.75, sm: 1 } }}>Save</Button>
          </div>
        </Box>
      </Box>

      <Snackbar open={!!snack} autoHideDuration={1500} message={snack} onClose={()=>setSnack('')} />
    </>
  );
}

