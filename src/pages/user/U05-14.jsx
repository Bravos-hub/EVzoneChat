import React, { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ClosedCaptionRoundedIcon from "@mui/icons-material/ClosedCaptionRounded";
import FiberManualRecordRoundedIcon from "@mui/icons-material/FiberManualRecordRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

/**
 * U05-14 — Captions & Recording (Consent Flow)
 * - Toggle captions with language select
 * - Recording start requires consent; shows red REC banner; stop ends
 */
export default function CaptionsRecording({ onBack }) {
  const [captions, setCaptions] = useState(false);
  const [lang, setLang] = useState('en');
  const [recording, setRecording] = useState(false);
  const [consentOpen, setConsentOpen] = useState(false);
  const [sample, setSample] = useState('');

  const samples = useMemo(()=> ({
    en: ['welcome everyone', 'starting in five minutes', 'questions are open'],
    fr: ['bienvenue à tous', 'début dans cinq minutes', 'questions ouvertes'],
    zh: ['欢迎大家', '五分钟后开始', '可以提问了'],
    sw: ['karibuni nyote', 'tunaanza baada ya dakika tano', 'maswali yako wazi'],
  }), []);

  useEffect(()=>{
    if (!captions) { setSample(''); return; }
    let i = 0;
    const id = setInterval(()=> { setSample(samples[lang][i % samples[lang].length]); i++; }, 2000);
    return ()=> clearInterval(id);
  }, [captions, lang, samples]);

  const startRecording = () => setConsentOpen(true);
  const confirmRecording = () => { setConsentOpen(false); setRecording(true); };
  const stopRecording = () => setRecording(false);

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full mx-auto bg-black text-white flex flex-col">
        <AppBar elevation={0} position="static" sx={{ bgcolor:'rgba(0,0,0,0.55)', color:'#fff' }}>
          <Toolbar className="!min-h-[56px]" sx={{ px: { xs: 1.5, sm: 3 } }}>
            <IconButton onClick={onBack} aria-label="Back" sx={{ color:'#fff', padding: { xs: '6px', sm: '8px' } }}>
              <ArrowBackRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <Typography variant="h6" className="font-bold" sx={{ fontSize: { xs: '16px', sm: '18px' } }}>Captions & Recording</Typography>
          </Toolbar>
        </AppBar>

        {/* Video placeholder */}
        <Box className="flex-1 relative">
          <video className="absolute inset-0 w-full h-full object-cover" muted loop autoPlay playsInline>
            <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" type="video/webm" />
          </video>

          {/* captions overlay */}
          {captions && (
            <div className="absolute inset-x-3 bottom-20 bg-black/65 text-white rounded-xl px-3 py-1.5 text-sm">
              <ClosedCaptionRoundedIcon sx={{ fontSize: 16, verticalAlign:'middle', mr: 0.5 }} /> {sample}
            </div>
          )}

          {/* recording banner */}
          {recording && (
            <div className="absolute inset-x-3 top-3 bg-red-600/90 text-white rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1">
              <FiberManualRecordRoundedIcon sx={{ fontSize: 12 }} /> Recording. Participants are notified.
            </div>
          )}
        </Box>

        {/* Controls */}
        <Box className="fixed inset-x-0 bottom-0 z-10 flex justify-center" sx={{ pb: 'env(safe-area-inset-bottom)' }}>
          <Box className="w-full mx-auto" sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
            <div className="bg-white/10 rounded-2xl backdrop-blur text-white" style={{ padding: '8px 12px' }}>
              <div className="grid grid-cols-2" style={{ gap: '8px' }}>
                <FormControl size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { color:'#fff' }, '& .MuiSvgIcon-root': { color:'#fff' } }}>
                  <InputLabel sx={{ color:'#fff', fontSize: { xs: '12px', sm: '14px' } }}>Captions</InputLabel>
                  <Select label="Captions" value={lang} onChange={(e)=>setLang(e.target.value)} disabled={!captions} sx={{ color:'#fff', fontSize: { xs: '12px', sm: '14px' } }}>
                    <MenuItem value="en" sx={{ fontSize: { xs: '12px', sm: '14px' } }}>English</MenuItem>
                    <MenuItem value="fr" sx={{ fontSize: { xs: '12px', sm: '14px' } }}>Français</MenuItem>
                    <MenuItem value="zh" sx={{ fontSize: { xs: '12px', sm: '14px' } }}>中文</MenuItem>
                    <MenuItem value="sw" sx={{ fontSize: { xs: '12px', sm: '14px' } }}>Swahili</MenuItem>
                  </Select>
                </FormControl>
                <Button onClick={()=>setCaptions(c=>!c)} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none', fontSize: { xs: '11px', sm: '12px' }, py: { xs: 0.5, sm: 0.75 } }}>{captions? 'Hide captions' : 'Show captions'}</Button>
                {!recording ? (
                  <Button onClick={startRecording} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', fontSize: { xs: '11px', sm: '12px' }, py: { xs: 0.5, sm: 0.75 }, '&:hover':{ bgcolor:'#e06f00' } }}>Start recording</Button>
                ) : (
                  <Button onClick={stopRecording} variant="contained" sx={{ bgcolor:'#e53935', textTransform:'none', fontSize: { xs: '11px', sm: '12px' }, py: { xs: 0.5, sm: 0.75 }, '&:hover':{ bgcolor:'#c62828' } }}>Stop recording</Button>
                )}
                <div />
              </div>
            </div>
          </Box>
        </Box>
      </Box>

      {/* Consent dialog */}
      <Dialog open={consentOpen} onClose={()=>setConsentOpen(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { m: { xs: 2, sm: 3 } } }}>
        <DialogTitle sx={{ fontSize: { xs: '16px', sm: '18px' }, px: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 3 } }}>Recording consent</DialogTitle>
        <DialogContent dividers sx={{ px: { xs: 2, sm: 3 } }}>
          <Alert severity="info" sx={{ mb: 1, fontSize: { xs: '12px', sm: '14px' } }}>Starting a recording will notify all participants and show a banner in the meeting.</Alert>
          <Typography variant="body2" sx={{ fontSize: { xs: '12px', sm: '14px' } }}>By continuing, you confirm that you have obtained necessary permissions and agree to EVzone policies.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
          <Button onClick={()=>setConsentOpen(false)} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none', fontSize: { xs: '12px', sm: '14px' }, py: { xs: 0.5, sm: 0.75 } }}>Cancel</Button>
          <Button onClick={confirmRecording} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', fontSize: { xs: '12px', sm: '14px' }, py: { xs: 0.5, sm: 0.75 }, '&:hover':{ bgcolor:'#e06f00' } }}>Confirm & start</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
