import React, { useEffect, useState } from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Alert,
  Paper,
  Button,
  Chip
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CloudOffRoundedIcon from "@mui/icons-material/CloudOffRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

/**
 * U12-35 — Edge States
 * Demo banners and message states for offline/queued, reconnecting, and attachment errors.
 */
export default function EdgeStatesDemo({ onBack }) {
  const muiTheme = useMuiTheme();
  const [offline, setOffline] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [messages, setMessages] = useState([
    { id:'1', who:'Leslie', text:'Can you see the invoice?', at:'10:30', state:'sent' },
    { id:'2', who:'You', text:'Uploading doc.pdf…', at:'10:31', state:'uploading' },
    { id:'3', who:'You', text:'Let me send the 80MB video', at:'10:31', state:'error', error:'Attachment too large (limit 25MB)' },
  ]);

  // simulate reconnecting timer
  useEffect(()=>{
    let id; if (reconnecting) { id = setTimeout(()=>{ setReconnecting(false); setOffline(false); }, 2500); } return ()=> clearTimeout(id);
  }, [reconnecting]);

  const toggleOffline = () => { setOffline(o=>!o); if (!offline) setReconnecting(false); };
  const doReconnect = () => { setReconnecting(true); };
  const retryError = (id) => setMessages(ms => ms.map(m => m.id===id ? { ...m, state:'queued', error: undefined } : m));

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: 'background.paper' }}>
        <AppBar elevation={0} position="static" sx={{ bgcolor:'background.paper', color:'text.primary', borderBottom:`1px solid ${muiTheme.palette.divider}` }}>
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={onBack} aria-label="Back" sx={{ color: 'text.primary' }}><ArrowBackRoundedIcon /></IconButton>
            <Typography variant="h6" className="font-bold ml-1" sx={{ color: 'text.primary' }}>Edge states</Typography>
          </Toolbar>
        </AppBar>

        {/* banners */}
        {offline && (
          <Alert icon={<CloudOffRoundedIcon/>} severity="warning" sx={{ borderRadius:0 }}>You are offline. Messages will be queued.</Alert>
        )}
        {reconnecting && (
          <Alert icon={<RestartAltRoundedIcon/>} severity="info" sx={{ borderRadius:0 }}>Reconnecting…</Alert>
        )}

        <Box className="flex-1 p-3 no-scrollbar" sx={{ overflowY:'auto' }}>
          <div className="space-y-2">
            {messages.map(m => (
              <Paper key={m.id} variant="outlined" sx={{ p:1.25, borderColor: 'divider', bgcolor: 'background.paper' }}>
                <div className="text-[12px]" style={{ color: muiTheme.palette.text.secondary }}>{m.who} • {m.at}</div>
                <div className="text-[14px]" style={{ color: muiTheme.palette.text.primary }}>{m.text}</div>
                <div className="mt-1 text-[11px] flex items-center gap-2">
                  {m.state==='sent' && <Chip size="small" label="Sent" sx={{ bgcolor: 'background.default', color: 'text.primary' }} />}
                  {m.state==='uploading' && <Chip size="small" icon={<AttachFileRoundedIcon sx={{ fontSize:14 }} />} label="Uploading…" sx={{ bgcolor: 'background.default', color: 'text.primary' }} />}
                  {m.state==='queued' && <Chip size="small" label="Queued (offline)" sx={{ bgcolor: 'background.default', color: 'text.primary' }} />}
                  {m.state==='error' && (
                    <>
                      <Chip size="small" label="Failed" sx={{ bgcolor: '#fdecea', color:'#b71c1c' }} />
                      <span style={{ color: '#b71c1c' }}>{m.error}</span>
                      <Button onClick={()=>retryError(m.id)} size="small" variant="outlined" sx={{ textTransform:'none' }}>Retry</Button>
                    </>
                  )}
                </div>
              </Paper>
            ))}
          </div>
        </Box>

        <Box className="px-3 pb-3">
          <div className="grid grid-cols-3 gap-2">
            <Button onClick={toggleOffline} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>{offline? 'Go online' : 'Go offline'}</Button>
            <Button onClick={doReconnect} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>Reconnect</Button>
            <Button onClick={()=>setMessages(ms => [...ms, { id:String(Date.now()), who:'You', text:'Queued message while offline', at:'10:34', state: offline? 'queued':'sent' }])} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Send test</Button>
          </div>
        </Box>
      </Box>
    </>
  );
}
