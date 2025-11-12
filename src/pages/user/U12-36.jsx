import React, { useEffect, useRef, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
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

      <Box className="w-full h-full max-w-sm mx-auto bg-white flex flex-col">
        <AppBar elevation={0} position="static" sx={{ bgcolor:'#fff', color:'#111', borderBottom:`1px solid ${EV.light}` }}>
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={onBack} aria-label="Back"><ArrowBackRoundedIcon /></IconButton>
            <Typography variant="h6" className="font-bold ml-1">Permission helpers</Typography>
          </Toolbar>
        </AppBar>

        {err && <Alert severity="warning" sx={{ borderRadius:0 }}>{err}</Alert>}

        <Box className="flex-1 p-3 space-y-3 no-scrollbar" sx={{ overflowY:'auto' }}>
          {/* Mic */}
          <Paper elevation={0} sx={{ border:`1px solid ${EV.light}`, borderRadius:2, p:2 }}>
            <div className="flex items-center gap-2 mb-1"><MicRoundedIcon/><span className="font-semibold">Microphone</span></div>
            <div className="text-sm text-gray-700 mb-2">Check OS/browser access. If blocked, enable “Microphone” in site settings.</div>
            <div className="flex gap-2">
              <Button onClick={testMic} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>Test mic</Button>
              {micOK && <Chip size="small" label="OK" sx={{ bgcolor: EV.green, color:'#fff' }} />}
            </div>
          </Paper>

          {/* Camera */}
          <Paper elevation={0} sx={{ border:`1px solid ${EV.light}`, borderRadius:2, p:2 }}>
            <div className="flex items-center gap-2 mb-1"><VideocamRoundedIcon/><span className="font-semibold">Camera</span></div>
            <div className="text-sm text-gray-700 mb-2">If the preview is black, another app may be using your camera.</div>
            <div className="flex gap-2 items-center">
              <Button onClick={testCam} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>Start preview</Button>
              <Button onClick={stopCam} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Stop</Button>
              {camOK && <Chip size="small" label="OK" sx={{ bgcolor: EV.green, color:'#fff' }} />}
            </div>
            <video ref={videoRef} className="w-full rounded-md mt-2" autoPlay playsInline muted />
          </Paper>

          {/* Notifications */}
          <Paper elevation={0} sx={{ border:`1px solid ${EV.light}`, borderRadius:2, p:2 }}>
            <div className="flex items-center gap-2 mb-1"><NotificationsActiveRoundedIcon/><span className="font-semibold">Notifications</span></div>
            <div className="text-sm text-gray-700 mb-2">On iOS, allow notifications in Settings → Safari/Browser → Notifications.</div>
            <div className="flex gap-2 items-center">
              <Button onClick={testNotif} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>Request permission</Button>
              {notifOK && <Chip size="small" label="OK" sx={{ bgcolor: EV.green, color:'#fff' }} />}
            </div>
          </Paper>
        </Box>

        <Box className="px-3 pb-3">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Close</Button>
            <Button variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>Done</Button>
          </div>
        </Box>
      </Box>
    </>
  );
}
