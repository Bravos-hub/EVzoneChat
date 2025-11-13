import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Chip,
  TextField,
  Paper,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog, // eslint-disable-line no-unused-vars
  DialogTitle, // eslint-disable-line no-unused-vars
  DialogContent, // eslint-disable-line no-unused-vars
  DialogActions, // eslint-disable-line no-unused-vars
  Button,
  Popover,
  List, // eslint-disable-line no-unused-vars
  ListItemButton, // eslint-disable-line no-unused-vars
  Divider
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import StopRoundedIcon from "@mui/icons-material/StopRounded"; // eslint-disable-line no-unused-vars
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import InsertEmoticonRoundedIcon from "@mui/icons-material/InsertEmoticonRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import NotificationsOffRoundedIcon from "@mui/icons-material/NotificationsOffRounded";
import WallpaperRoundedIcon from "@mui/icons-material/WallpaperRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import IosShareRoundedIcon from "@mui/icons-material/IosShareRounded";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import InsertPhotoRoundedIcon from "@mui/icons-material/InsertPhotoRounded"; // eslint-disable-line no-unused-vars
import HeadphonesRoundedIcon from "@mui/icons-material/HeadphonesRounded"; // eslint-disable-line no-unused-vars
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded"; // eslint-disable-line no-unused-vars
import ContactsRoundedIcon from "@mui/icons-material/ContactsRounded"; // eslint-disable-line no-unused-vars
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded"; // eslint-disable-line no-unused-vars
import PollRoundedIcon from "@mui/icons-material/PollRounded"; // eslint-disable-line no-unused-vars
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded"; // eslint-disable-line no-unused-vars

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };
const lighten = (hex, a=0.12) => `rgba(${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)},${a})`;

const DEMO = [
  { id: 'm1', author: { id:'u2', name:'Leslie Alexander', avatar:'https://i.pravatar.cc/100?img=5' }, text: 'Hi! Do we still meet at 3 pm?', time: '07:32 PM', mine: false, read: true },
  { id: 'm2', author: { id:'me', name:'You', avatar:'https://i.pravatar.cc/100?img=2' }, text: 'Yes. I will send the Zoom link here.', time: '07:33 PM', mine: true, read: true },
  { id: 'm3', author: { id:'u2', name:'Leslie Alexander', avatar:'https://i.pravatar.cc/100?img=5' }, text: 'Perfect. Also, can you check the PDF I shared?', time: '07:34 PM', mine: false, read: false }
];

function Bubble({ msg, onQuote, onAction, scrollTo }){
  const [menuEl, setMenuEl] = useState(null);
  const [reactEl, setReactEl] = useState(null);
  const [reactFullEl, setReactFullEl] = useState(null);
  const [translated, setTranslated] = useState(null);
  const [pinned, setPinned] = useState(false);
  const [recalled, setRecalled] = useState(false);
  const [reactions, setReactions] = useState([]);
  const start = useRef({ x:0, y:0, active:false, moved:false });

  const isMine = msg.mine;
  const bg = isMine ? lighten(EV.green,0.18) : '#fff';
  const br = isMine ? `1px solid ${lighten(EV.green,0.28)}` : `1px solid ${EV.light}`;
  const tx = isMine ? '#0b3d2f' : '#111';

  const onTouchStart = (e)=>{ const t=e.touches?.[0]; if(!t) return; start.current={x:t.clientX,y:t.clientY,active:true,moved:false}; };
  const onTouchMove = (e)=>{ if(!start.current.active) return; const t=e.touches?.[0]; if(!t) return; const dx=t.clientX-start.current.x; const dy=t.clientY-start.current.y; if(Math.abs(dx)>22 && Math.abs(dy)<18) start.current.moved=true; };
  const onTouchEnd = ()=>{ if(start.current.moved) onQuote?.(msg); start.current.active=false; start.current.moved=false; };

  return (
    <div id={`msg-${msg.id}`} className={`w-full flex ${isMine? 'justify-end':'justify-start'}`}>
      <div className="max-w-[78%]">
        <div className="flex items-end gap-2 mb-1">
          {!isMine && <Avatar src={msg.author.avatar} sx={{ width: '1.75rem', height: '1.75rem' }} />}
          <Paper elevation={0} onContextMenu={(e)=>{e.preventDefault(); setMenuEl(e.currentTarget);}} onClick={(e)=>setMenuEl(e.currentTarget)} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} sx={{ p:1.25, px:1.5, bgcolor:bg, border:br, borderRadius:2 }}>
            {!recalled ? (
              <>
                {msg.replyTo && (
                  <Box role="button" onClick={()=>scrollTo?.(msg.replyTo.id)} sx={{ borderLeft:`3px solid ${EV.orange}`, pl:1, mb:0.5, cursor:'pointer' }} className="text-[11.5px] text-gray-600 truncate">
                    Replying to: {msg.replyTo.text.slice(0,64)}{msg.replyTo.text.length>64?'…':''}
                  </Box>
                )}
                <div className="text-[13.5px] whitespace-pre-wrap" style={{ color:tx }}>{msg.text}</div>
                {translated && <div className="text-[12px] text-gray-600 mt-1">{translated}</div>}
                <div className="flex items-center gap-1 mt-1 justify-end">
                  <span className="text-[11px] text-gray-500">{msg.time}</span>
                  {isMine && (<DoneAllRoundedIcon sx={{ fontSize:14, color: msg.read? EV.green : EV.grey }} />)}
                </div>
              </>
            ) : (
              <div className="text-[12px] italic text-gray-500">You recalled this message</div>
            )}
          </Paper>
        </div>
        {reactions.length>0 && (
          <div className={`flex gap-1 ${isMine? 'justify-end':'pl-9'} mb-2`}>{reactions.map(r=>(<span key={r} className="text-base">{r}</span>))}</div>
        )}
      </div>

      {/* message menu */}
      <Menu anchorEl={menuEl} open={Boolean(menuEl)} onClose={()=>setMenuEl(null)}>
        <MenuItem onClick={(e)=>{ setReactEl(e.currentTarget); setMenuEl(null); }}><ListItemText>React</ListItemText></MenuItem>
        <MenuItem onClick={()=>{ onQuote?.(msg); setMenuEl(null); }}><ListItemText>Quote / Reply</ListItemText></MenuItem>
        <MenuItem onClick={()=>{ setTranslated(translated? null : `Translated: ${msg.text}`); setMenuEl(null); }}><ListItemText>{translated? 'Hide translation':'Translate'}</ListItemText></MenuItem>
        <MenuItem onClick={()=>{ setPinned(!pinned); onAction?.(pinned? 'unpin':'pin', msg); setMenuEl(null); }}><ListItemText>{pinned? 'Unpin':'Pin message'}</ListItemText></MenuItem>
        {isMine && !recalled && (<MenuItem onClick={()=>{ onAction?.('recall', msg); setRecalled(true); setMenuEl(null); }}><ListItemText>Recall message</ListItemText></MenuItem>)}
        <MenuItem onClick={()=>{ onAction?.('report', msg); setMenuEl(null); }}><ListItemText>Report</ListItemText></MenuItem>
        <MenuItem onClick={()=>{ onAction?.('delete', msg); setMenuEl(null); }}><ListItemText>Delete</ListItemText></MenuItem>
      </Menu>

      {/* Reactions quick bar + full library */}
      <Popover open={Boolean(reactEl)} anchorEl={reactEl} onClose={()=>setReactEl(null)} anchorOrigin={{ vertical:'top', horizontal:'center' }} transformOrigin={{ vertical:'bottom', horizontal:'center' }}>
        <Box className="p-1 px-2 flex gap-1 items-center">
          {['👍','❤️','😂','😮','😢','🙏','🔥','🎉','💯','👏'].map(em => (
            <Button key={em} onClick={()=>{ setReactions(p=>[...p, em]); setReactEl(null); }} sx={{ minWidth:32, minHeight:32, fontSize:18 }}>{em}</Button>
          ))}
          <Button onClick={(e)=>setReactFullEl(e.currentTarget)} sx={{ minWidth:32, minHeight:32, fontSize:18, color:EV.orange }}>+</Button>
        </Box>
      </Popover>
      <Popover open={Boolean(reactFullEl)} anchorEl={reactFullEl} onClose={()=>setReactFullEl(null)} anchorOrigin={{ vertical:'top', horizontal:'center' }} transformOrigin={{ vertical:'bottom', horizontal:'center' }}>
        <Box className="p-2 grid grid-cols-8 gap-1" sx={{ maxWidth: '85vw' }}>
          {["😀","😁","😂","🤣","😊","😍","😘","😜","🤪","🤝","👍","👎","👏","🙌","🔥","🎉","💯","💡","✅","❗","😮","😢","🙏","😴","🤔","😇","🤩","🥳","🤯","😡","😱","🤗","🫶"].map(em => (
            <Button key={em} onClick={()=>{ setReactions(p=>[...p, em]); setReactFullEl(null); }} sx={{ minWidth:28, minHeight:28, fontSize:18 }}>{em}</Button>
          ))}
        </Box>
      </Popover>
    </div>
  );
}

export default function ConversationWAHeader({ onBack, kind='1:1', moduleLabel='Marketplace' }){
  const [messages, setMessages] = useState(DEMO);
  const [replyTo, setReplyTo] = useState(null);
  const [draft, setDraft] = useState('');
  const [menuEl, setMenuEl] = useState(null);
  const [emojiEl, setEmojiEl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const listRef = useRef(null);

  const openHeaderMenu = (e)=> setMenuEl(e.currentTarget);
  const closeHeaderMenu = ()=> setMenuEl(null);

  const title = useMemo(()=> kind==='group'? 'Charging Crew — Kampala' : (kind==='channel'? '#announcements' : 'Leslie Alexander'), [kind]);
  const avatar = useMemo(()=> kind==='1:1'? 'https://i.pravatar.cc/100?img=5' : 'https://i.pravatar.cc/100?img=15', [kind]);
  const meta = useMemo(()=> kind==='channel'? 'Announcement channel' : (kind==='group'? '12 members' : 'Online'), [kind]);

  useEffect(()=>{ const el=listRef.current; if(el) el.scrollTop = el.scrollHeight; }, [draft, messages.length]);

  const scrollToMsg = (id)=>{
    const el = document.getElementById(`msg-${id}`);
    if(el){ el.scrollIntoView({ behavior:'smooth', block:'center' }); }
  };

  // eslint-disable-next-line no-unused-vars
  const handleQuote = (msg)=> setReplyTo(msg);
  const handleAction = (type, msg)=>{
    if(type==='delete') setMessages(prev=> prev.filter(m=> m.id!==msg.id));
    if(type==='pin' || type==='unpin' || type==='report' || type==='recall') {/* stub for now */}
  };

  const send = ()=>{
    if(!draft.trim()) return;
    const ts = new Date();
    const newMsg = { id:'m'+Date.now(), author:{ id:'me', name:'You', avatar:'https://i.pravatar.cc/100?img=2' }, text:draft, time: ts.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }), mine:true, read:false, replyTo: replyTo? { id: replyTo.id, text: replyTo.text } : undefined };
    setMessages(prev=> [...prev, newMsg]);
    setDraft(''); setReplyTo(null);
    requestAnimationFrame(()=>{ const el=listRef.current; if(el) el.scrollTop = el.scrollHeight; });
  };

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none`}</style>
      <Box sx={{ 
        width: '100%', 
        height: '100%', 
        mx: 'auto', 
        bgcolor: '#fff', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* Header - Fixed at top */}
        <AppBar 
          elevation={0} 
          position="fixed" 
          sx={{ 
            bgcolor:'#fff', 
            color:'#111', 
            borderBottom:`1px solid ${EV.light}`,
            top: '3.5rem', // Below main shell header
            width: '100%',
            zIndex: 1100,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <Toolbar className="!min-h-[56px] !px-3" sx={{ position: 'relative' }}>
            <IconButton 
              aria-label="Back" 
              onClick={onBack}
              sx={{ mr: 1 }}
            >
              <ArrowBackRoundedIcon/>
            </IconButton>
            <Avatar 
              src={avatar} 
              sx={{ 
                width: '2.25rem', 
                height: '2.25rem', 
                mr: 1.5,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }} 
            />
            <Box sx={{ minWidth: 0, flexGrow: 1, pr: 12 }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  whiteSpace:'nowrap',
                  fontSize: '15px',
                  fontWeight: 600,
                  lineHeight: 1.2
                }}
              >
                {title}
              </Typography>
              <Box sx={{ display:'flex', alignItems:'center', gap:0.75, minWidth:0, mt: 0.25 }}>
                <Chip 
                  size="small" 
                  label={moduleLabel} 
                  sx={{ 
                    borderColor: EV.green, 
                    color:'#0f5132', 
                    bgcolor: lighten(EV.green,0.12), 
                    border:`1px solid ${lighten(EV.green,0.28)}`,
                    height: 20,
                    fontSize: '10px',
                    fontWeight: 600
                  }} 
                />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: '11px',
                    color: '#666'
                  }}
                >
                  {meta}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ position:'absolute', top: 8, right: 4, display:'flex', gap: 0.5 }}>
              <IconButton aria-label="Video" size="small" sx={{ color: '#666' }}>
                <VideocamRoundedIcon fontSize="small"/>
              </IconButton>
              <IconButton aria-label="Call" size="small" sx={{ color: '#666' }}>
                <CallRoundedIcon fontSize="small"/>
              </IconButton>
              <IconButton aria-label="More" onClick={openHeaderMenu} size="small" sx={{ color: '#666' }}>
                <MoreVertRoundedIcon fontSize="small"/>
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Header 3-dots menu (mobile-sized) */}
        <Menu
          anchorEl={menuEl}
          open={Boolean(menuEl)}
          onClose={closeHeaderMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{ sx:{ width: '90vw', maxWidth: 'calc(100vw - 1rem)', mx: 'auto', borderRadius: 2, py: 0.5 } }}
        >
          <MenuItem onClick={closeHeaderMenu}><ListItemIcon><InfoOutlinedIcon fontSize="small"/></ListItemIcon><ListItemText primary="View contact / group info"/></MenuItem>
          <MenuItem onClick={closeHeaderMenu}><ListItemIcon><NotificationsOffRoundedIcon fontSize="small"/></ListItemIcon><ListItemText primary="Mute notifications"/></MenuItem>
          <MenuItem onClick={closeHeaderMenu}><ListItemIcon><WallpaperRoundedIcon fontSize="small"/></ListItemIcon><ListItemText primary="Wallpaper"/></MenuItem>
          <MenuItem onClick={closeHeaderMenu}><ListItemIcon><StarBorderRoundedIcon fontSize="small"/></ListItemIcon><ListItemText primary="Starred messages"/></MenuItem>
          <Divider sx={{ my:0.5 }}/>
          <MenuItem onClick={closeHeaderMenu}><ListItemIcon><IosShareRoundedIcon fontSize="small"/></ListItemIcon><ListItemText primary="Export chat"/></MenuItem>
          <MenuItem onClick={closeHeaderMenu}><ListItemIcon><DeleteSweepRoundedIcon fontSize="small"/></ListItemIcon><ListItemText primary="Clear chat"/></MenuItem>
          <MenuItem onClick={closeHeaderMenu}><ListItemIcon><BlockRoundedIcon fontSize="small"/></ListItemIcon><ListItemText primary="Block"/></MenuItem>
          <MenuItem onClick={closeHeaderMenu}><ListItemIcon><DescriptionRoundedIcon fontSize="small"/></ListItemIcon><ListItemText primary="Report"/></MenuItem>
        </Menu>

        {/* Messages - with proper spacing from top header and bottom composer + bottom nav */}
        <Box 
          ref={listRef} 
          className="flex-1 no-scrollbar" 
          sx={{ 
            overflowY:'auto', 
            pt: '7rem', // shell header + conversation header
            pb: '11.25rem', // Space for composer + bottom nav + padding
            px: 3,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#fafafa'
          }}
        >
          <div className="space-y-3" style={{ paddingTop: 8, paddingBottom: 8 }}>
            {messages.map(m=> (
              <Bubble key={m.id} msg={m} onQuote={(mm)=>setReplyTo(mm)} onAction={handleAction} scrollTo={scrollToMsg} />
            ))}
          </div>
        </Box>

        {/* Composer - fixed above bottom nav */}
        <Box 
          sx={{ 
            borderTop: `1px solid ${EV.light}`,
            bgcolor: '#fff',
            px: 2,
            py: 1.5,
            position: 'fixed',
            bottom: '5.5rem', // Above bottom nav
            left: 0,
            right: 0,
            width: '100%',
            mx: 'auto',
            zIndex: 1200,
            boxShadow: '0 -2px 8px rgba(0,0,0,0.04)'
          }}
        >
          {replyTo && (
            <Box className="mb-1 px-2 py-1 rounded-md" sx={{ bgcolor: EV.light, border:`1px solid ${EV.light}` }}>
              <div className="text-[11.5px] text-gray-600">Replying to: {replyTo.text.slice(0,72)}{replyTo.text.length>72?'…':''}</div>
            </Box>
          )}
          <Box className="flex items-end gap-1.5">
            <IconButton aria-label="Emoji"><InsertEmoticonRoundedIcon/></IconButton>
            <IconButton aria-label="Attach"><AttachFileRoundedIcon/></IconButton>
            <TextField
              fullWidth size="small" placeholder="Type a message"
              value={draft}
              onChange={(e)=>setDraft(e.target.value)}
              onFocus={()=>{ const el=listRef.current; if(el) el.scrollTop = el.scrollHeight; }}
              multiline minRows={1} maxRows={6}
              InputProps={{ sx:{ bgcolor:'#fff' } }}
            />
            <IconButton aria-label="Camera"><CameraAltRoundedIcon/></IconButton>
            {draft.trim().length>0 ? (
              <IconButton aria-label="Send" sx={{ color: EV.orange }} onClick={send}><SendRoundedIcon/></IconButton>
            ) : (
              <IconButton aria-label="Record" sx={{ color: EV.orange }}><MicRoundedIcon/></IconButton>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}
