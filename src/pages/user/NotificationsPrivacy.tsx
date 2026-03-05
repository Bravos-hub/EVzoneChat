import { useState } from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { useTheme } from "../../context/ThemeContext";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Switch,
  Chip,
  Button,
  TextField,
  Snackbar
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

const MODULES = ["All modules","Marketplace","Rides","School","Medical","Charging","Travel","Investments","Faith","Social","Workspace","Wallet","AI Bot"];
const CHANNEL_OVERRIDES = [
  { id:'c1', label:'#announcements', mute:false },
  { id:'c2', label:'Charging Crew — Kampala', mute:false },
  { id:'c3', label:'Parents Group', mute:true },
];

/**
 * U09-27 — Notifications & Privacy (per module/channel)
 * Configure notifications per module, mentions, read receipts, last seen, quiet hours
 */
export default function NotificationsPrivacy({ onBack }) {
  const muiTheme = useMuiTheme();
  const { accent, isDark } = useTheme();
  const accentColor = accent === 'orange' ? EV.orange : accent === 'green' ? EV.green : EV.grey;
  const [module, setModule] = useState('All modules');
  const [push, setPush] = useState(true);
  const [inapp, setInapp] = useState(true);
  const [email, setEmail] = useState(false);
  const [mentions, setMentions] = useState(true);
  const [reactions, setReactions] = useState(false);
  const [readReceipts, setReadReceipts] = useState(true);
  const [lastSeen, setLastSeen] = useState(true);
  const [typing, setTyping] = useState(true);
  const [quietFrom, setQuietFrom] = useState('22:00');
  const [quietTo, setQuietTo] = useState('07:00');
  const [overrides, setOverrides] = useState(CHANNEL_OVERRIDES);
  const [snack, setSnack] = useState('');

  const save = () => setSnack('Notification & privacy settings saved');

  const toggleChannel = (id, key='mute') => setOverrides(ovs => ovs.map(o => o.id===id ? { ...o, [key]: !o[key] } : o));

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: 'transparent' }}>
        <AppBar elevation={0} position="static" sx={{ bgcolor: 'transparent', color: 'text.primary', borderBottom:`1px solid ${muiTheme.palette.divider}` }}>
          <Toolbar className="!min-h-[56px]" sx={{ px: { xs: 1.5, sm: 3 } }}>
            <IconButton onClick={onBack} aria-label="Back" sx={{ color: 'text.primary', padding: { xs: '6px', sm: '8px' } }}>
              <ArrowBackRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <Typography variant="h6" className="font-bold" sx={{ color: 'text.primary', fontSize: { xs: '16px', sm: '18px' }, ml: { xs: 0.5, sm: 1 }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Notifications & Privacy</Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 2, sm: 3 }, flex: 1, overflowY: 'auto' }} className="no-scrollbar">
          {/* Module select */}
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: { xs: '13px', sm: '14px' }, color: 'text.secondary' }}>Module</InputLabel>
            <Select 
              label="Module" 
              value={module} 
              onChange={(e)=>setModule(e.target.value)} 
              sx={{ 
                fontSize: { xs: '13px', sm: '14px' },
                color: 'text.primary',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'divider'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: accentColor
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: accentColor
                }
              }}
            >
              {MODULES.map(m => (
                <MenuItem 
                  key={m} 
                  value={m} 
                  sx={{ 
                    fontSize: { xs: '13px', sm: '14px' },
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'
                    }
                  }}
                >
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Notifications */}
          <Box className="rounded-2xl" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper', p: { xs: 2, sm: 3 }, mt: { xs: 2, sm: 3 } }}>
            <Typography variant="subtitle2" sx={{ color: 'text.primary', fontSize: { xs: '14px', sm: '15px' }, fontWeight: 600, mb: 1.5 }}>
              Notifications
            </Typography>
            <FormGroup>
              <FormControlLabel 
                control={
                  <Switch 
                    checked={push} 
                    onChange={(e)=>setPush(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: accentColor
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: accentColor
                      }
                    }}
                  />
                } 
                label={<Typography sx={{ color: 'text.primary', fontSize: { xs: '13px', sm: '14px' } }}>Push notifications</Typography>} 
              />
              <FormControlLabel 
                control={
                  <Switch 
                    checked={inapp} 
                    onChange={(e)=>setInapp(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: accentColor
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: accentColor
                      }
                    }}
                  />
                } 
                label={<Typography sx={{ color: 'text.primary', fontSize: { xs: '13px', sm: '14px' } }}>In‑app banners</Typography>} 
              />
              <FormControlLabel 
                control={
                  <Switch 
                    checked={email} 
                    onChange={(e)=>setEmail(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: accentColor
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: accentColor
                      }
                    }}
                  />
                } 
                label={<Typography sx={{ color: 'text.primary', fontSize: { xs: '13px', sm: '14px' } }}>Email digests</Typography>} 
              />
              <FormControlLabel 
                control={
                  <Switch 
                    checked={mentions} 
                    onChange={(e)=>setMentions(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: accentColor
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: accentColor
                      }
                    }}
                  />
                } 
                label={<Typography sx={{ color: 'text.primary', fontSize: { xs: '13px', sm: '14px' } }}>Only when mentioned</Typography>} 
              />
              <FormControlLabel 
                control={
                  <Switch 
                    checked={reactions} 
                    onChange={(e)=>setReactions(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: accentColor
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: accentColor
                      }
                    }}
                  />
                } 
                label={<Typography sx={{ color: 'text.primary', fontSize: { xs: '13px', sm: '14px' } }}>Reactions & emoji</Typography>} 
              />
            </FormGroup>
          </Box>

          {/* Privacy */}
          <Box className="rounded-2xl" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper', p: { xs: 2, sm: 3 }, mt: { xs: 2, sm: 3 } }}>
            <Typography variant="subtitle2" sx={{ color: 'text.primary', fontSize: { xs: '14px', sm: '15px' }, fontWeight: 600, mb: 1.5 }}>
              Privacy
            </Typography>
            <FormGroup>
              <FormControlLabel 
                control={
                  <Switch 
                    checked={readReceipts} 
                    onChange={(e)=>setReadReceipts(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: accentColor
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: accentColor
                      }
                    }}
                  />
                } 
                label={<Typography sx={{ color: 'text.primary', fontSize: { xs: '13px', sm: '14px' } }}>Show read receipts</Typography>} 
              />
              <FormControlLabel 
                control={
                  <Switch 
                    checked={lastSeen} 
                    onChange={(e)=>setLastSeen(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: accentColor
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: accentColor
                      }
                    }}
                  />
                } 
                label={<Typography sx={{ color: 'text.primary', fontSize: { xs: '13px', sm: '14px' } }}>Show last seen</Typography>} 
              />
              <FormControlLabel 
                control={
                  <Switch 
                    checked={typing} 
                    onChange={(e)=>setTyping(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: accentColor
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: accentColor
                      }
                    }}
                  />
                } 
                label={<Typography sx={{ color: 'text.primary', fontSize: { xs: '13px', sm: '14px' } }}>Show typing indicator</Typography>} 
              />
            </FormGroup>
          </Box>

          {/* Quiet hours */}
          <Box className="rounded-2xl" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper', p: { xs: 2, sm: 3 }, mt: { xs: 2, sm: 3 } }}>
            <Typography variant="subtitle2" sx={{ color: 'text.primary', fontSize: { xs: '14px', sm: '15px' }, fontWeight: 600, mb: 1.5 }}>
              Quiet hours (Do not disturb)
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 1, sm: 1.5 }, mb: 1.5 }}>
              <TextField 
                size="small" 
                label="From" 
                type="time" 
                value={quietFrom} 
                onChange={(e)=>setQuietFrom(e.target.value)} 
                InputLabelProps={{ shrink: true }} 
                sx={{ 
                  '& .MuiInputBase-input': { 
                    fontSize: { xs: '13px', sm: '14px' },
                    color: 'text.primary'
                  },
                  '& .MuiInputLabel-root': {
                    color: 'text.secondary',
                    fontSize: { xs: '13px', sm: '14px' }
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'divider'
                    },
                    '&:hover fieldset': {
                      borderColor: accentColor
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: accentColor
                    }
                  }
                }} 
              />
              <TextField 
                size="small" 
                label="To" 
                type="time" 
                value={quietTo} 
                onChange={(e)=>setQuietTo(e.target.value)} 
                InputLabelProps={{ shrink: true }} 
                sx={{ 
                  '& .MuiInputBase-input': { 
                    fontSize: { xs: '13px', sm: '14px' },
                    color: 'text.primary'
                  },
                  '& .MuiInputLabel-root': {
                    color: 'text.secondary',
                    fontSize: { xs: '13px', sm: '14px' }
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'divider'
                    },
                    '&:hover fieldset': {
                      borderColor: accentColor
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: accentColor
                    }
                  }
                }} 
              />
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '11px', sm: '12px' }, display: 'block', mt: 1 }}>
              Applies to {module.toLowerCase()}.
            </Typography>
          </Box>

          {/* Channel overrides */}
          <Box className="rounded-2xl" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper', p: { xs: 2, sm: 3 }, mt: { xs: 2, sm: 3 } }}>
            <Typography variant="subtitle2" sx={{ color: 'text.primary', fontSize: { xs: '14px', sm: '15px' }, fontWeight: 600, mb: 1.5 }}>
              Channel overrides
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1, sm: 1.5 } }}>
              {overrides.map(o => (
                <Chip 
                  key={o.id} 
                  label={`${o.label}${o.mute? ' • muted':''}`} 
                  onClick={()=>toggleChannel(o.id,'mute')} 
                  sx={{ 
                    bgcolor: o.mute ? (isDark ? 'rgba(211, 47, 47, 0.2)' : 'rgba(211, 47, 47, 0.1)') : (isDark ? 'rgba(255,255,255,0.1)' : EV.light), 
                    color: o.mute ? (isDark ? '#ff6b6b' : '#d32f2f') : 'text.primary',
                    border: o.mute ? `1px solid ${isDark ? 'rgba(211, 47, 47, 0.4)' : 'rgba(211, 47, 47, 0.3)'}` : `1px solid ${muiTheme.palette.divider}`,
                    fontSize: { xs: '11px', sm: '12px' }, 
                    height: { xs: 28, sm: 32 },
                    px: { xs: 1, sm: 1.5 },
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: o.mute ? (isDark ? 'rgba(211, 47, 47, 0.3)' : 'rgba(211, 47, 47, 0.15)') : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)'),
                      transform: 'translateY(-1px)'
                    }
                  }} 
                />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 }, pt: { xs: 1.5, sm: 2 }, borderTop: `1px solid ${muiTheme.palette.divider}`, bgcolor: 'transparent' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: { xs: 1, sm: 1.5 } }}>
            <Button 
              variant="outlined" 
              onClick={() => {
                setPush(true);
                setInapp(true);
                setEmail(false);
                setMentions(true);
                setReactions(false);
                setReadReceipts(true);
                setLastSeen(true);
                setTyping(true);
                setQuietFrom('22:00');
                setQuietTo('07:00');
                setOverrides(CHANNEL_OVERRIDES);
                setSnack('Settings reset to defaults');
              }}
              sx={{ 
                textTransform:'none', 
                fontSize: { xs: '13px', sm: '14px' }, 
                py: { xs: 0.75, sm: 1 },
                borderColor: 'text.secondary',
                color: 'text.primary',
                '&:hover': {
                  borderColor: accentColor,
                  bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'
                }
              }}
            >
              Reset
            </Button>
            <Button 
              onClick={save} 
              variant="contained" 
              sx={{ 
                textTransform:'none', 
                fontSize: { xs: '13px', sm: '14px' }, 
                py: { xs: 0.75, sm: 1 },
                bgcolor: accentColor,
                color: '#fff',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: accent === 'green' ? '#02b87a' : accent === 'orange' ? '#e06f00' : '#8a8a8a',
                  boxShadow: 2
                }
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Box>

      <Snackbar 
        open={!!snack} 
        autoHideDuration={3000} 
        message={snack} 
        onClose={()=>setSnack('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            bgcolor: 'background.paper',
            color: 'text.primary',
            border: `1px solid ${muiTheme.palette.divider}`,
            fontSize: { xs: '13px', sm: '14px' }
          }
        }}
      />
    </>
  );
}
