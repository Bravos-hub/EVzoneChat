import { useEffect, useMemo, useRef, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Divider,
  Snackbar
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded"; // eslint-disable-line no-unused-vars
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

/**
 * U06-17 — Device & Network Settings
 * Camera/Mic/Speaker selectors, mic level test, play test sound, network health.
 */
export default function DeviceNetworkSettings({ onBack }) {
  const [cams, setCams] = useState([]);
  const [mics, setMics] = useState([]);
  const [outs, setOuts] = useState([]);
  const [cam, setCam] = useState('');
  const [mic, setMic] = useState('');
  const [out, setOut] = useState('');

  const [testingMic, setTestingMic] = useState(false);
  const [level, setLevel] = useState(0);
  const levelTimer = useRef(null);

  // eslint-disable-next-line no-unused-vars
  const [latency, setLatency] = useState(42);
  // eslint-disable-next-line no-unused-vars
  const [jitter, setJitter] = useState(8);
  // eslint-disable-next-line no-unused-vars
  const [loss, setLoss] = useState(0);
  const [snack, setSnack] = useState('');

  useEffect(()=>{
    (async ()=>{
      try {
        if (!navigator.mediaDevices?.enumerateDevices) throw new Error('No enumerateDevices');
        const list = await navigator.mediaDevices.enumerateDevices();
        setCams(list.filter(d => d.kind === 'videoinput'));
        setMics(list.filter(d => d.kind === 'audioinput'));
        setOuts(list.filter(d => d.kind === 'audiooutput'));
      } catch (e) {
        // fallback demo
        setCams([{ deviceId:'cam1', label:'Front Camera' }, { deviceId:'cam2', label:'Back Camera' }]);
        setMics([{ deviceId:'mic1', label:'Built‑in Mic' }, { deviceId:'mic2', label:'USB Mic' }]);
        setOuts([{ deviceId:'spk1', label:'Phone Speaker' }, { deviceId:'spk2', label:'Bluetooth Headset' }]);
      }
    })();
  }, []);

  useEffect(()=>{
    return ()=> clearInterval(levelTimer.current);
  }, []);

  const startMicTest = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('no gum');
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {}
    setTestingMic(true);
    clearInterval(levelTimer.current);
    levelTimer.current = setInterval(()=> setLevel(Math.floor(10 + Math.random()*90)), 120);
  };
  const stopMicTest = () => { setTestingMic(false); clearInterval(levelTimer.current); setLevel(0); };

  const playTest = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 880; // A5
      o.connect(g); g.connect(ctx.destination);
      o.start();
      setTimeout(()=>{ o.stop(); ctx.close(); }, 300);
    } catch{}
    setSnack('Playing test tone');
  };

  const quality = useMemo(()=>{
    if (loss > 5 || latency > 200) return { label:'Poor', color:'#e53935' };
    if (loss > 1 || latency > 120 || jitter > 30) return { label:'OK', color:'#fb8c00' };
    return { label:'Good', color:EV.green };
  }, [latency, jitter, loss]);

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full mx-auto bg-white flex flex-col">
        <AppBar elevation={0} position="static" sx={{ bgcolor:'#fff', color:'#111', borderBottom:`1px solid ${EV.light}` }}>
          <Toolbar className="!min-h-[56px]" sx={{ px: { xs: 1.5, sm: 3 } }}>
            <IconButton onClick={onBack} aria-label="Back" sx={{ padding: { xs: '6px', sm: '8px' } }}>
              <ArrowBackRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <Typography variant="h6" className="font-bold" sx={{ fontSize: { xs: '16px', sm: '18px' }, ml: { xs: 0.5, sm: 1 } }}>Device & Network</Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 2, sm: 3 }, '& > * + *': { mt: { xs: 2, sm: 3 } }, flex: 1, overflowY: 'auto' }} className="no-scrollbar">
          {/* selectors */}
          <div className="grid grid-cols-1" style={{ gap: '8px' }}>
            <FormControl size="small" fullWidth>
              <InputLabel sx={{ fontSize: { xs: '13px', sm: '14px' } }}><VideocamRoundedIcon sx={{ fontSize: { xs: 14, sm: 16 }, mr: 0.5 }} /> Camera</InputLabel>
              <Select label="Camera" value={cam} onChange={(e)=>setCam(e.target.value)} sx={{ fontSize: { xs: '13px', sm: '14px' } }}>
                {cams.map((d, i)=>(<MenuItem key={d.deviceId||i} value={d.deviceId||String(i)} sx={{ fontSize: { xs: '13px', sm: '14px' } }}>{d.label || `Camera ${i+1}`}</MenuItem>))}
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel sx={{ fontSize: { xs: '13px', sm: '14px' } }}><MicRoundedIcon sx={{ fontSize: { xs: 14, sm: 16 }, mr: 0.5 }} /> Microphone</InputLabel>
              <Select label="Microphone" value={mic} onChange={(e)=>setMic(e.target.value)} sx={{ fontSize: { xs: '13px', sm: '14px' } }}>
                {mics.map((d, i)=>(<MenuItem key={d.deviceId||i} value={d.deviceId||String(i)} sx={{ fontSize: { xs: '13px', sm: '14px' } }}>{d.label || `Microphone ${i+1}`}</MenuItem>))}
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel sx={{ fontSize: { xs: '13px', sm: '14px' } }}><VolumeUpRoundedIcon sx={{ fontSize: { xs: 14, sm: 16 }, mr: 0.5 }} /> Speakers</InputLabel>
              <Select label="Speakers" value={out} onChange={(e)=>setOut(e.target.value)} sx={{ fontSize: { xs: '13px', sm: '14px' } }}>
                {outs.map((d, i)=>(<MenuItem key={d.deviceId||i} value={d.deviceId||String(i)} sx={{ fontSize: { xs: '13px', sm: '14px' } }}>{d.label || `Speakers ${i+1}`}</MenuItem>))}
              </Select>
            </FormControl>
          </div>

          {/* mic test */}
          <Divider />
          <div className="flex items-center justify-between">
            <div className="font-semibold" style={{ fontSize: '14px' }}>Mic test</div>
            {!testingMic ? (
              <Button onClick={startMicTest} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Start</Button>
            ) : (
              <Button onClick={stopMicTest} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 }, '&:hover':{ bgcolor:'#e06f00' } }}>Stop</Button>
            )}
          </div>
          <LinearProgress variant="determinate" value={level} sx={{ height: { xs: 8, sm: 10 }, borderRadius: 5 }} />

          {/* speaker test */}
          <div className="flex items-center justify-between">
            <div className="font-semibold" style={{ fontSize: '14px' }}>Speaker test</div>
            <Button onClick={playTest} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 }, '&:hover':{ bgcolor:'#e06f00' } }}>Play test sound</Button>
          </div>

          {/* network */}
          <Divider />
          <div className="font-semibold" style={{ fontSize: '14px' }}>Network quality</div>
          <div className="grid grid-cols-3" style={{ gap: '8px', fontSize: '13px' }}>
            <div>Latency: <strong>{latency} ms</strong></div>
            <div>Jitter: <strong>{jitter} ms</strong></div>
            <div>Loss: <strong>{loss}%</strong></div>
          </div>
          <div className="h-2 w-full rounded-full" style={{ background: EV.light }}>
            <div className="h-2 rounded-full" style={{ width: quality.label==='Good'? '100%' : quality.label==='OK'? '66%' : '33%', background: quality.color }} />
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>Status: <span style={{ color: quality.color, fontWeight: 700 }}>{quality.label}</span></div>
        </Box>

        {/* footer actions */}
        <Box sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
          <div className="grid grid-cols-2" style={{ gap: '8px' }}>
            <Button variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.75, sm: 1 } }}>Cancel</Button>
            <Button variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.75, sm: 1 }, '&:hover':{ bgcolor:'#e06f00' } }}>Save</Button>
          </div>
        </Box>
      </Box>

      <Snackbar open={!!snack} autoHideDuration={1600} message={snack} onClose={()=>setSnack('')} />
    </>
  );
}
