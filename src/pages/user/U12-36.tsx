import { useEffect, useRef, useState } from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Paper,
  Button,
  Alert,
  Chip
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

/**
 * U12-36 — Permission Helpers
 * Quick tests & troubleshooting for mic, camera, notifications
 */
export default function PermissionHelpers({ onBack }) {
  const muiTheme = useMuiTheme();
  const [micOK, setMicOK] = useState(false);
  const [camOK, setCamOK] = useState(false);
  const [notifOK, setNotifOK] = useState(false);
  const [err, setErr] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const testMic = async () => {
    setErr('');
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Microphone not supported');
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicOK(true); s.getTracks().forEach(t=>t.stop());
    } catch(e) { setErr(e.message || 'Mic test failed'); setMicOK(false); }
  };

  const testCam = async () => {
    setErr('');
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera not supported');
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = s; setCamOK(true);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch(e) { setErr(e.message || 'Camera test failed'); setCamOK(false); }
  };

  const stopCam = () => { const s = streamRef.current; if (s) s.getTracks().forEach(t=>t.stop()); streamRef.current=null; if (videoRef.current) videoRef.current.srcObject=null; };

  const testNotif = async () => {
    setErr('');
    try {
      if (typeof Notification === 'undefined') throw new Error('Notifications not supported');
      const res = await Notification.requestPermission();
      setNotifOK(res === 'granted');
      if (res !== 'granted') throw new Error('Permission denied');
    } catch(e) { setErr(e.message || 'Notification test failed'); setNotifOK(false); }
  };

  useEffect(()=> () => stopCam(), []);

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: 'background.paper' }}>
        <AppBar elevation={0} position="static" sx={{ bgcolor:'background.paper', color:'text.primary', borderBottom:`1px solid ${muiTheme.palette.divider}` }}>
          <Toolbar className="!min-h-[56px]" sx={{ px: { xs: 1.5, sm: 3 } }}>
            <IconButton onClick={onBack} aria-label="Back" sx={{ color: 'text.primary', padding: { xs: '6px', sm: '8px' } }}>
              <ArrowBackRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <Typography variant="h6" className="font-bold" sx={{ color: 'text.primary', fontSize: { xs: '16px', sm: '18px' }, ml: { xs: 0.5, sm: 1 } }}>Permission helpers</Typography>
          </Toolbar>
        </AppBar>

        {err && <Alert severity="warning" sx={{ borderRadius:0, fontSize: { xs: '13px', sm: '14px' } }}>{err}</Alert>}

        <Box sx={{ p: { xs: 2, sm: 3 }, flex: 1, overflowY: 'auto' }} className="no-scrollbar">
          {/* Mic */}
          <Paper elevation={0} sx={{ border:`1px solid ${muiTheme.palette.divider}`, borderRadius:2, p: { xs: 2, sm: 2.5 }, bgcolor: 'background.paper', mb: { xs: 2, sm: 3 } }}>
            <div className="flex items-center mb-1" style={{ gap: '8px', color: muiTheme.palette.text.primary }}>
              <MicRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              <span className="font-semibold" style={{ fontSize: '15px' }}>Microphone</span>
            </div>
            <div style={{ color: muiTheme.palette.text.secondary, fontSize: '13px', marginBottom: '8px' }}>Check OS/browser access. If blocked, enable "Microphone" in site settings.</div>
            <div className="flex" style={{ gap: '8px' }}>
              <Button onClick={testMic} variant="contained" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Test mic</Button>
              {micOK && <Chip size="small" label="OK" sx={{ bgcolor: EV.green, color:'#fff', fontSize: { xs: '11px', sm: '12px' }, height: { xs: 22, sm: 24 } }} />}
            </div>
          </Paper>

          {/* Camera */}
          <Paper elevation={0} sx={{ border:`1px solid ${muiTheme.palette.divider}`, borderRadius:2, p: { xs: 2, sm: 2.5 }, bgcolor: 'background.paper', mb: { xs: 2, sm: 3 } }}>
            <div className="flex items-center mb-1" style={{ gap: '8px', color: muiTheme.palette.text.primary }}>
              <VideocamRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              <span className="font-semibold" style={{ fontSize: '15px' }}>Camera</span>
            </div>
            <div style={{ color: muiTheme.palette.text.secondary, fontSize: '13px', marginBottom: '8px' }}>If the preview is black, another app may be using your camera.</div>
            <div className="flex items-center" style={{ gap: '8px' }}>
              <Button onClick={testCam} variant="contained" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Start preview</Button>
              <Button onClick={stopCam} variant="outlined" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Stop</Button>
              {camOK && <Chip size="small" label="OK" sx={{ bgcolor: EV.green, color:'#fff', fontSize: { xs: '11px', sm: '12px' }, height: { xs: 22, sm: 24 } }} />}
            </div>
            <video ref={videoRef} className="w-full rounded-md mt-2" autoPlay playsInline muted style={{ maxWidth: '100%' }} />
          </Paper>

          {/* Notifications */}
          <Paper elevation={0} sx={{ border:`1px solid ${muiTheme.palette.divider}`, borderRadius:2, p: { xs: 2, sm: 2.5 }, bgcolor: 'background.paper' }}>
            <div className="flex items-center mb-1" style={{ gap: '8px', color: muiTheme.palette.text.primary }}>
              <NotificationsActiveRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              <span className="font-semibold" style={{ fontSize: '15px' }}>Notifications</span>
            </div>
            <div style={{ color: muiTheme.palette.text.secondary, fontSize: '13px', marginBottom: '8px' }}>On iOS, allow notifications in Settings → Safari/Browser → Notifications.</div>
            <div className="flex items-center" style={{ gap: '8px' }}>
              <Button onClick={testNotif} variant="contained" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Request permission</Button>
              {notifOK && <Chip size="small" label="OK" sx={{ bgcolor: EV.green, color:'#fff', fontSize: { xs: '11px', sm: '12px' }, height: { xs: 22, sm: 24 } }} />}
            </div>
          </Paper>
        </Box>

        <Box sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
          <div className="grid grid-cols-2" style={{ gap: '8px' }}>
            <Button variant="outlined" sx={{ textTransform:'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.75, sm: 1 } }}>Close</Button>
            <Button variant="contained" sx={{ textTransform:'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.75, sm: 1 } }}>Done</Button>
          </div>
        </Box>
      </Box>
    </>
  );
}
