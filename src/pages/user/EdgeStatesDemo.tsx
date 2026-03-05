import { useEffect, useState } from "react";
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

      <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: 'transparent' }}>
        <AppBar elevation={0} position="static" sx={{ bgcolor: 'transparent', color:'text.primary', borderBottom:`1px solid ${muiTheme.palette.divider}` }}>
          <Toolbar className="!min-h-[56px]" sx={{ px: { xs: 1.5, sm: 3 } }}>
            <IconButton onClick={onBack} aria-label="Back" sx={{ color: 'text.primary', padding: { xs: '6px', sm: '8px' } }}>
              <ArrowBackRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <Typography variant="h6" className="font-bold" sx={{ color: 'text.primary', fontSize: { xs: '16px', sm: '18px' }, ml: { xs: 0.5, sm: 1 } }}>Edge states</Typography>
          </Toolbar>
        </AppBar>

        {/* banners */}
        {offline && (
          <Alert icon={<CloudOffRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />} severity="warning" sx={{ borderRadius:0, fontSize: { xs: '13px', sm: '14px' } }}>You are offline. Messages will be queued.</Alert>
        )}
        {reconnecting && (
          <Alert icon={<RestartAltRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />} severity="info" sx={{ borderRadius:0, fontSize: { xs: '13px', sm: '14px' } }}>Reconnecting…</Alert>
        )}

        <Box sx={{ p: { xs: 2, sm: 3 }, flex: 1, overflowY: 'auto' }} className="no-scrollbar">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.map(m => (
              <Paper key={m.id} variant="outlined" sx={{ p: { xs: 1.25, sm: 1.5 }, borderColor: 'divider', bgcolor: 'background.paper' }}>
                <div style={{ color: muiTheme.palette.text.secondary, fontSize: '12px' }}>{m.who} • {m.at}</div>
                <div style={{ color: muiTheme.palette.text.primary, fontSize: '14px', marginTop: '4px' }}>{m.text}</div>
                <div className="mt-1 flex items-center flex-wrap" style={{ gap: '8px', fontSize: '11px' }}>
                  {m.state==='sent' && <Chip size="small" label="Sent" sx={{ bgcolor: 'background.default', color: 'text.primary', fontSize: { xs: '10px', sm: '11px' }, height: { xs: 20, sm: 22 } }} />}
                  {m.state==='uploading' && <Chip size="small" icon={<AttachFileRoundedIcon sx={{ fontSize: { xs: 12, sm: 14 } }} />} label="Uploading…" sx={{ bgcolor: 'background.default', color: 'text.primary', fontSize: { xs: '10px', sm: '11px' }, height: { xs: 20, sm: 22 } }} />}
                  {m.state==='queued' && <Chip size="small" label="Queued (offline)" sx={{ bgcolor: 'background.default', color: 'text.primary', fontSize: { xs: '10px', sm: '11px' }, height: { xs: 20, sm: 22 } }} />}
                  {m.state==='error' && (
                    <>
                      <Chip size="small" label="Failed" sx={{ bgcolor: '#fdecea', color:'#b71c1c', fontSize: { xs: '10px', sm: '11px' }, height: { xs: 20, sm: 22 } }} />
                      <span style={{ color: '#b71c1c', fontSize: '11px' }}>{m.error}</span>
                      <Button onClick={()=>retryError(m.id)} size="small" variant="outlined" sx={{ textTransform:'none', fontSize: { xs: '11px', sm: '12px' }, py: { xs: 0.25, sm: 0.5 } }}>Retry</Button>
                    </>
                  )}
                </div>
              </Paper>
            ))}
          </div>
        </Box>

        <Box sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
          <div className="grid grid-cols-3" style={{ gap: '8px' }}>
            <Button onClick={toggleOffline} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>{offline? 'Go online' : 'Go offline'}</Button>
            <Button onClick={doReconnect} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 }, '&:hover':{ bgcolor:'#e06f00' } }}>Reconnect</Button>
            <Button onClick={()=>setMessages(ms => [...ms, { id:String(Date.now()), who:'You', text:'Queued message while offline', at:'10:34', state: offline? 'queued':'sent' }])} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Send test</Button>
          </div>
        </Box>
      </Box>
    </>
  );
}
