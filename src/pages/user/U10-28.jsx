import React, { useMemo, useState } from "react";
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

      <Box className="w-full h-full mx-auto bg-white flex flex-col">
        <AppBar elevation={0} position="static" sx={{ bgcolor:'#fff', color:'#111', borderBottom:`1px solid ${EV.light}` }}>
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={onBack} aria-label="Back"><ArrowBackRoundedIcon /></IconButton>
            <Typography variant="h6" className="font-bold ml-1">Security</Typography>
          </Toolbar>
        </AppBar>

        <Box className="flex-1 p-3 no-scrollbar" sx={{ overflowY:'auto' }}>
          {/* Sessions */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${EV.light}` }}>
            <div className="flex items-center gap-2 mb-1"><DevicesOtherRoundedIcon/><span className="font-semibold">Sessions & devices</span></div>
            <List className="no-scrollbar" sx={{ maxHeight: 260, overflowY:'auto' }}>
              {sessions.map(s => (
                <ListItem key={s.id} secondaryAction={
                  s.me ? (
                    <Chip size="small" label="This device" sx={{ bgcolor: EV.green, color:'#fff' }} />
                  ) : (
                    <Button startIcon={<LogoutRoundedIcon/>} size="small" onClick={()=>signOut(s.id)} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Sign out</Button>
                  )
                }>
                  <ListItemAvatar><Avatar src={s.avatar} /></ListItemAvatar>
                  <ListItemText primary={<span className="font-semibold">{s.device}</span>} secondary={`${s.location} • ${s.last}`} />
                </ListItem>
              ))}
            </List>
            <div className="mt-2 flex justify-end">
              <Button startIcon={<LogoutRoundedIcon/>} onClick={signOutOthers} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>Sign out others</Button>
            </div>
          </Box>

          {/* 2FA */}
          <Box className="rounded-2xl p-3 mt-3" sx={{ border:`1px solid ${EV.light}` }}>
            <div className="flex items-center gap-2 mb-1"><SecurityRoundedIcon/><span className="font-semibold">Two‑factor authentication (2FA)</span></div>
            <FormGroup>
              <FormControlLabel control={<Switch checked={twoFA} onChange={(e)=>setTwoFA(e.target.checked)} />} label="Enable 2FA (authenticator app)" />
            </FormGroup>
            <div className="mt-2 flex gap-2">
              <Button disabled={!twoFA} startIcon={<QrCode2RoundedIcon/>} onClick={()=>setQrOpen(true)} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>Setup</Button>
              <Button disabled={!twoFA} startIcon={<KeyRoundedIcon/>} onClick={()=>setCodesOpen(true)} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Backup codes</Button>
            </div>
          </Box>
        </Box>

        {/* Footer */}
        <Box className="px-3 pb-3">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Cancel</Button>
            <Button variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>Save</Button>
          </div>
        </Box>
      </Box>

      {/* QR dialog */}
      <Dialog open={qrOpen} onClose={()=>setQrOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Scan this QR in your authenticator app</DialogTitle>
        <DialogContent dividers>
          <Box className="grid place-items-center p-2"><img src={qrUrl} alt="2FA QR" width={220} height={220} /></Box>
          <Typography variant="body2" className="text-gray-700">Secret key: <strong>{secret}</strong></Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setQrOpen(false)} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>Done</Button>
        </DialogActions>
      </Dialog>

      {/* Backup codes dialog */}
      <Dialog open={codesOpen} onClose={()=>setCodesOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Backup codes</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" className="mb-1 text-gray-700">Store these one‑time codes in a safe place:</Typography>
          <Grid container spacing={1}>
            {Array.from({length:8}).map((_,i)=> (
              <Grid item xs={6} key={i}><Box className="font-mono text-sm p-1 rounded-md" sx={{ bgcolor: EV.light }}>{Math.random().toString(36).slice(2,8).toUpperCase()}</Box></Grid>
            ))}
          </Grid>
          <Divider className="my-2" />
          <TextField fullWidth size="small" label="Type CONFIRM to regenerate" value={codeConfirm} onChange={(e)=>setCodeConfirm(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setCodesOpen(false)} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Close</Button>
          <Button disabled={codeConfirm!=="CONFIRM"} onClick={()=>setSnack('New backup codes generated')} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>Regenerate</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={1500} message={snack} onClose={()=>setSnack('')} />
    </>
  );
}
