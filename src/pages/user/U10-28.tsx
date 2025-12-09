import { useMemo, useState } from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { useTheme } from "../../context/ThemeContext";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  FormGroup,
  FormControlLabel,
  Switch,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import DevicesOtherRoundedIcon from "@mui/icons-material/DevicesOtherRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import KeyRoundedIcon from "@mui/icons-material/KeyRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

const SESSIONS = [
  { id:'s0', me:true, device:'Windows • Chrome', location:'Kampala, UG', last:'Now', avatar:'https://i.pravatar.cc/100?img=20' },
  { id:'s1', me:false, device:'Android • EVzone App', location:'Entebbe, UG', last:'2h ago', avatar:'https://i.pravatar.cc/100?img=11' },
  { id:'s2', me:false, device:'iPhone • Safari', location:'Wuxi, CN', last:'Yesterday', avatar:'https://i.pravatar.cc/100?img=12' },
];

/**
 * U10-28 — Security (Sessions & Devices + 2FA)
 */
export default function SecuritySessionsDevices({ onBack }) {
  const muiTheme = useMuiTheme();
  const { accentColor } = useTheme();
  const [snack, setSnack] = useState('');
  const [sessions, setSessions] = useState(SESSIONS);
  const [twoFA, setTwoFA] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [codesOpen, setCodesOpen] = useState(false);
  const [codeConfirm, setCodeConfirm] = useState('');
  const secret = 'EVZ‑' + Math.random().toString(36).slice(2, 8).toUpperCase();
  const qrUrl = useMemo(()=> `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=otpauth://totp/EVzone:${encodeURIComponent('user@evzone.app')}?secret=${secret}&issuer=EVzone`, [secret]);

  const signOut = (id) => { setSessions(ss => ss.filter(s => s.id!==id)); setSnack('Signed out'); };
  const signOutOthers = () => { setSessions(ss => ss.filter(s => s.me)); setSnack('Signed out of other sessions'); };

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: 'background.default' }}>
        <AppBar elevation={0} position="static" sx={{ bgcolor:'background.paper', color:'text.primary', borderBottom:`1px solid ${muiTheme.palette.divider}` }}>
          <Toolbar className="!min-h-[56px]" sx={{ px: { xs: 1.5, sm: 3 } }}>
            <IconButton onClick={onBack} aria-label="Back" sx={{ color: 'text.primary', padding: { xs: '6px', sm: '8px' } }}>
              <ArrowBackRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <Typography variant="h6" className="font-bold" sx={{ color: 'text.primary', fontSize: { xs: '16px', sm: '18px' }, ml: { xs: 0.5, sm: 1 } }}>Security</Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 2, sm: 3 }, flex: 1, overflowY: 'auto' }} className="no-scrollbar">
          {/* Sessions */}
          <Box className="rounded-2xl" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper', p: { xs: 2, sm: 3 } }}>
            <div className="flex items-center mb-1" style={{ gap: '8px' }}>
              <DevicesOtherRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              <span className="font-semibold" style={{ fontSize: '15px' }}>Sessions & devices</span>
            </div>
            <List className="no-scrollbar" sx={{ maxHeight: { xs: 240, sm: 260 }, overflowY:'auto' }}>
              {sessions.map(s => (
                <ListItem key={s.id} secondaryAction={
                  s.me ? (
                    <Chip size="small" label="This device" sx={{ bgcolor: EV.green, color:'#fff', fontSize: { xs: '11px', sm: '12px' }, height: { xs: 22, sm: 24 } }} />
                  ) : (
                    <Button startIcon={<LogoutRoundedIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />} size="small" onClick={()=>signOut(s.id)} variant="outlined" sx={{ borderColor: accentColor, color: accentColor, textTransform:'none', fontSize: { xs: '11px', sm: '12px' }, py: { xs: 0.25, sm: 0.5 } }}>Sign out</Button>
                  )
                } sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1, sm: 1.25 } }}>
                  <ListItemAvatar><Avatar src={s.avatar} sx={{ width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 } }} /></ListItemAvatar>
                  <ListItemText 
                    primary={<span className="font-semibold" style={{ fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.device}</span>} 
                    secondary={<span style={{ fontSize: '12px' }}>{s.location} • {s.last}</span>} 
                  />
                </ListItem>
              ))}
            </List>
            <div className="mt-2 flex justify-end">
              <Button startIcon={<LogoutRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} onClick={signOutOthers} variant="contained" sx={{ bgcolor: accentColor, textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 }, '&:hover':{ bgcolor: accentColor, opacity: 0.9 } }}>Sign out others</Button>
            </div>
          </Box>

          {/* 2FA */}
          <Box className="rounded-2xl" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper', p: { xs: 2, sm: 3 }, mt: { xs: 2, sm: 3 } }}>
            <div className="flex items-center mb-1" style={{ gap: '8px' }}>
              <SecurityRoundedIcon sx={{ color: 'text.primary', fontSize: { xs: 18, sm: 20 } }} />
              <span className="font-semibold" style={{ color: muiTheme.palette.text.primary, fontSize: '15px' }}>Two‑factor authentication (2FA)</span>
            </div>
            <FormGroup>
              <FormControlLabel control={<Switch checked={twoFA} onChange={(e)=>setTwoFA(e.target.checked)} />} label={<span style={{ color: 'text.primary', fontSize: '14px' }}>Enable 2FA (authenticator app)</span>} />
            </FormGroup>
            <div className="mt-2 flex" style={{ gap: '8px' }}>
              <Button disabled={!twoFA} startIcon={<QrCode2RoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} onClick={()=>setQrOpen(true)} variant="contained" sx={{ bgcolor: accentColor, textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 }, '&:hover':{ bgcolor: accentColor, opacity: 0.9 } }}>Setup</Button>
              <Button disabled={!twoFA} startIcon={<KeyRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} onClick={()=>setCodesOpen(true)} variant="outlined" sx={{ borderColor: accentColor, color: accentColor, textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Backup codes</Button>
            </div>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
          <div className="grid grid-cols-2" style={{ gap: '8px' }}>
            <Button variant="outlined" sx={{ borderColor: accentColor, color: accentColor, textTransform:'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.75, sm: 1 } }}>Cancel</Button>
            <Button variant="contained" sx={{ bgcolor: accentColor, textTransform:'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.75, sm: 1 }, '&:hover':{ bgcolor: accentColor, opacity: 0.9 } }}>Save</Button>
          </div>
        </Box>
      </Box>

      {/* QR dialog */}
      <Dialog open={qrOpen} onClose={()=>setQrOpen(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { bgcolor: 'background.paper', m: { xs: 2, sm: 3 } } }}>
        <DialogTitle sx={{ color: 'text.primary', fontSize: { xs: '16px', sm: '18px' }, px: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 3 } }}>Scan this QR in your authenticator app</DialogTitle>
        <DialogContent dividers sx={{ bgcolor: 'background.paper', px: { xs: 2, sm: 3 } }}>
          <Box className="grid place-items-center" sx={{ p: { xs: 1.5, sm: 2 } }}>
            <img src={qrUrl} alt="2FA QR" width={220} height={220} style={{ maxWidth: '100%', height: 'auto' }} />
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: { xs: '13px', sm: '14px' } }}>Secret key: <strong style={{ color: 'text.primary' }}>{secret}</strong></Typography>
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
          <Button onClick={()=>setQrOpen(false)} variant="contained" sx={{ bgcolor: accentColor, textTransform:'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.5, sm: 0.75 }, '&:hover':{ bgcolor: accentColor, opacity: 0.9 } }}>Done</Button>
        </DialogActions>
      </Dialog>

      {/* Backup codes dialog */}
      <Dialog open={codesOpen} onClose={()=>setCodesOpen(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { bgcolor: 'background.paper', m: { xs: 2, sm: 3 } } }}>
        <DialogTitle sx={{ color: 'text.primary', fontSize: { xs: '16px', sm: '18px' }, px: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 3 } }}>Backup codes</DialogTitle>
        <DialogContent dividers sx={{ bgcolor: 'background.paper', px: { xs: 2, sm: 3 } }}>
          <Typography variant="body2" className="mb-1" sx={{ color: 'text.secondary', fontSize: { xs: '13px', sm: '14px' } }}>Store these one‑time codes in a safe place:</Typography>
          <Grid container spacing={1}>
            {Array.from({length:8}).map((_,i)=> (
              <Grid item xs={6} key={i}>
                <Box className="font-mono rounded-md" sx={{ bgcolor: 'background.default', color: 'text.primary', p: 1, fontSize: { xs: '12px', sm: '13px' } }}>{Math.random().toString(36).slice(2,8).toUpperCase()}</Box>
              </Grid>
            ))}
          </Grid>
          <Divider className="my-2" sx={{ borderColor: muiTheme.palette.divider }} />
          <TextField fullWidth size="small" label="Type CONFIRM to regenerate" value={codeConfirm} onChange={(e)=>setCodeConfirm(e.target.value)} sx={{ '& .MuiInputBase-input': { color: 'text.primary', fontSize: { xs: '13px', sm: '14px' } } }} />
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
          <Button onClick={()=>setCodesOpen(false)} variant="outlined" sx={{ borderColor: accentColor, color: accentColor, textTransform:'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.5, sm: 0.75 } }}>Close</Button>
          <Button disabled={codeConfirm!=="CONFIRM"} onClick={()=>setSnack('New backup codes generated')} variant="contained" sx={{ bgcolor: accentColor, textTransform:'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.5, sm: 0.75 }, '&:hover':{ bgcolor: accentColor, opacity: 0.9 } }}>Regenerate</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={1500} message={snack} onClose={()=>setSnack('')} />
    </>
  );
}
