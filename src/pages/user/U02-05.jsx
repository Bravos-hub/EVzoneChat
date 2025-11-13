import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { useTheme } from "../../context/ThemeContext";
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
import StopRoundedIcon from "@mui/icons-material/StopRounded";
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
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import ContactsRoundedIcon from "@mui/icons-material/ContactsRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import ForwardRoundedIcon from "@mui/icons-material/ForwardRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SelectAllRoundedIcon from "@mui/icons-material/SelectAllRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import VideoLibraryRoundedIcon from "@mui/icons-material/VideoLibraryRounded";
import PollRoundedIcon from "@mui/icons-material/PollRounded";
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ReportRoundedIcon from "@mui/icons-material/ReportRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };
const lighten = (hex, a=0.12) => `rgba(${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)},${a})`;

const DEMO = [
  { id: 'm1', author: { id:'u2', name:'Leslie Alexander', avatar:'https://i.pravatar.cc/100?img=5' }, text: 'Hi! Do we still meet at 3 pm?', time: '07:32 PM', mine: false, read: true },
  { id: 'm2', author: { id:'me', name:'You', avatar:'https://i.pravatar.cc/100?img=2' }, text: 'Yes. I will send the Zoom link here.', time: '07:33 PM', mine: true, read: true },
  { id: 'm3', author: { id:'u2', name:'Leslie Alexander', avatar:'https://i.pravatar.cc/100?img=5' }, text: 'Perfect. Also, can you check the PDF I shared?', time: '07:34 PM', mine: false, read: false }
];

function Bubble({ msg, onQuote, onAction, scrollTo, onSelect, isSelected }){
  const muiTheme = useMuiTheme();
  const { isDark } = useTheme();
  const [menuEl, setMenuEl] = useState(null);
  const [reactEl, setReactEl] = useState(null);
  const [reactFullEl, setReactFullEl] = useState(null);
  const [translated, setTranslated] = useState(null);
  const [pinned, setPinned] = useState(false);
  const [starred, setStarred] = useState(false);
  const [recalled, setRecalled] = useState(false);
  const [reactions, setReactions] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const start = useRef({ x:0, y:0, active:false, moved:false });
  const longPressTimer = useRef(null);

  const isMine = msg.mine;
  const bg = isMine ? lighten(EV.green,0.18) : muiTheme.palette.background.paper;
  const br = isMine ? `1px solid ${lighten(EV.green,0.28)}` : `1px solid ${muiTheme.palette.divider}`;
  const tx = isMine ? (isDark ? '#a8f5d4' : '#0b3d2f') : muiTheme.palette.text.primary;
  const isVoiceMessage = msg.audioUrl || msg.text?.includes('🎤');
  const selected = isSelected || false;

  const onTouchStart = (e)=>{ 
    const t=e.touches?.[0]; 
    if(!t) return; 
    start.current={x:t.clientX,y:t.clientY,active:true,moved:false}; 
    // Long press detection
    longPressTimer.current = setTimeout(() => {
      if (!start.current.moved) {
        onSelect?.(msg.id, true);
        start.current.active = false;
      }
    }, 500);
  };
  const onTouchMove = (e)=>{ 
    if(!start.current.active) return; 
    const t=e.touches?.[0]; 
    if(!t) return; 
    const dx=t.clientX-start.current.x; 
    const dy=t.clientY-start.current.y; 
    if(Math.abs(dx)>22 || Math.abs(dy)>18) {
      start.current.moved=true;
      if(longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
    }
  };
  const onTouchEnd = ()=>{ 
    if(longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if(start.current.moved) onQuote?.(msg); 
    start.current.active=false; 
    start.current.moved=false; 
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.text);
    setMenuEl(null);
  };

  return (
    <div id={`msg-${msg.id}`} className={`w-full flex ${isMine? 'justify-end':'justify-start'}`}>
      <div className="max-w-[78%]">
        <div className="flex items-end gap-2 mb-1">
          {!isMine && <Avatar src={msg.author.avatar} sx={{ width: '1.75rem', height: '1.75rem' }} />}
            <Paper 
            elevation={0} 
            onContextMenu={(e)=>{e.preventDefault(); setMenuEl(e.currentTarget);}} 
            onClick={(e)=>{ if(selected) { onSelect?.(msg.id, false); } else { setMenuEl(e.currentTarget); } }}
            onTouchStart={onTouchStart} 
            onTouchMove={onTouchMove} 
            onTouchEnd={onTouchEnd} 
            sx={{ 
              p:1.25, 
              px:1.5, 
              bgcolor: selected ? lighten(EV.orange, 0.25) : bg, 
              border: selected ? `2px solid ${EV.orange}` : br, 
              borderRadius:2,
              cursor: 'pointer'
            }}
          >
            {!recalled ? (
              <>
                {msg.forwarded && (
                  <Box sx={{ borderLeft:`3px solid ${EV.orange}`, pl:1, mb:0.5, color: 'text.secondary' }} className="text-[11.5px]">
                    Forwarded from {msg.originalAuthor || 'Unknown'}
                  </Box>
                )}
                {msg.replyTo && (
                  <Box role="button" onClick={()=>scrollTo?.(msg.replyTo.id)} sx={{ borderLeft:`3px solid ${EV.orange}`, pl:1, mb:0.5, cursor:'pointer', color: 'text.secondary' }} className="text-[11.5px] truncate">
                    Replying to: {msg.replyTo.text.slice(0,64)}{msg.replyTo.text.length>64?'…':''}
                  </Box>
                )}
                {isVoiceMessage && msg.audioUrl ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                    <IconButton 
                      size="small" 
                      onClick={() => {
                        if (audioRef.current) {
                          if (isPlaying) {
                            audioRef.current.pause();
                            setIsPlaying(false);
                          } else {
                            audioRef.current.play();
                            setIsPlaying(true);
                          }
                        }
                      }}
                      sx={{ 
                        bgcolor: EV.orange, 
                        color: '#fff',
                        '&:hover': { bgcolor: '#e06f00' },
                        width: '2rem',
                        height: '2rem'
                      }}
                    >
                      {isPlaying ? <StopRoundedIcon sx={{ fontSize: 18 }} /> : <MicRoundedIcon sx={{ fontSize: 18 }} />}
                    </IconButton>
                    <audio 
                      ref={audioRef}
                      src={msg.audioUrl}
                      onEnded={() => setIsPlaying(false)}
                      onPause={() => setIsPlaying(false)}
                      style={{ display: 'none' }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <div className="text-[12px] font-semibold" style={{ color: tx }}>{msg.text}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: muiTheme.palette.text.secondary }}>Tap to play</div>
                    </Box>
                  </Box>
                ) : (
                  <div className="text-[13.5px] whitespace-pre-wrap" style={{ color:tx }}>{msg.text}</div>
                )}
                {translated && <div className="text-[12px] mt-1" style={{ color: muiTheme.palette.text.secondary }}>{translated}</div>}
                <div className="flex items-center gap-1 mt-1 justify-end">
                  <span className="text-[11px]" style={{ color: muiTheme.palette.text.secondary }}>{msg.time}</span>
                  {isMine && (<DoneAllRoundedIcon sx={{ fontSize:14, color: msg.read? EV.green : EV.grey }} />)}
                </div>
              </>
            ) : (
              <div className="text-[12px] italic" style={{ color: muiTheme.palette.text.secondary }}>You recalled this message</div>
            )}
          </Paper>
        </div>
        {reactions.length>0 && (
          <div className={`flex gap-1 ${isMine? 'justify-end':'pl-9'} mb-2`}>{reactions.map(r=>(<span key={r} className="text-base">{r}</span>))}</div>
        )}
      </div>

      {/* message menu - WhatsApp-style ordering */}
      <Menu 
        anchorEl={menuEl} 
        open={Boolean(menuEl)} 
        onClose={()=>setMenuEl(null)} 
        PaperProps={{ 
          sx:{ 
            width: '90vw', 
            maxWidth: 'calc(100vw - 1rem)', 
            borderRadius: 2, 
            py: 0.5,
            bgcolor: 'background.paper',
            '& .MuiMenuItem-root': {
              color: 'text.primary',
            }
          } 
        }}
      >
        <MenuItem onClick={()=>{ handleCopy(); }}>
          <ListItemIcon><ContentCopyRoundedIcon fontSize="small"/></ListItemIcon>
          <ListItemText primary="Copy" />
        </MenuItem>
        <MenuItem onClick={()=>{ onAction?.('forward', msg); setMenuEl(null); }}>
          <ListItemIcon><ForwardRoundedIcon fontSize="small"/></ListItemIcon>
          <ListItemText primary="Forward" />
        </MenuItem>
        <MenuItem onClick={()=>{ setStarred(!starred); onAction?.(starred? 'unstar':'star', msg); setMenuEl(null); }}>
          <ListItemIcon><StarRoundedIcon fontSize="small" sx={{ color: starred ? EV.orange : 'inherit' }}/></ListItemIcon>
          <ListItemText primary={starred ? 'Unstar' : 'Star'} />
        </MenuItem>
        {isMine && !recalled && (
          <MenuItem onClick={()=>{ onAction?.('edit', msg); setMenuEl(null); }}>
            <ListItemIcon><EditRoundedIcon fontSize="small"/></ListItemIcon>
            <ListItemText primary="Edit" />
          </MenuItem>
        )}
        <MenuItem onClick={()=>{ onSelect?.(msg.id, true); setMenuEl(null); }}>
          <ListItemIcon><SelectAllRoundedIcon fontSize="small"/></ListItemIcon>
          <ListItemText primary="Select" />
        </MenuItem>
        <MenuItem onClick={()=>{ onAction?.('forward', msg); setMenuEl(null); }}>
          <ListItemIcon><ForwardRoundedIcon fontSize="small"/></ListItemIcon>
          <ListItemText primary="Forward" />
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={(e)=>{ setReactEl(e.currentTarget); setMenuEl(null); }}>
          <ListItemIcon><InsertEmoticonRoundedIcon fontSize="small"/></ListItemIcon>
          <ListItemText primary="React" />
        </MenuItem>
        <MenuItem onClick={()=>{ onQuote?.(msg); setMenuEl(null); }}>
          <ListItemIcon><ReplyRoundedIcon fontSize="small"/></ListItemIcon>
          <ListItemText primary="Reply" />
        </MenuItem>
        <MenuItem onClick={()=>{ setTranslated(translated? null : `Translated: ${msg.text}`); setMenuEl(null); }}>
          <ListItemIcon><TranslateRoundedIcon fontSize="small"/></ListItemIcon>
          <ListItemText primary={translated? 'Hide translation':'Translate'} />
        </MenuItem>
        <MenuItem onClick={()=>{ setPinned(!pinned); onAction?.(pinned? 'unpin':'pin', msg); setMenuEl(null); }}>
          <ListItemIcon><PushPinRoundedIcon fontSize="small"/></ListItemIcon>
          <ListItemText primary={pinned? 'Unpin':'Pin message'} />
        </MenuItem>
        {isMine && !recalled && (
          <MenuItem onClick={()=>{ onAction?.('recall', msg); setRecalled(true); setMenuEl(null); }}>
            <ListItemIcon><DeleteRoundedIcon fontSize="small"/></ListItemIcon>
            <ListItemText primary="Delete for everyone" />
          </MenuItem>
        )}
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={()=>{ onAction?.('report', msg); setMenuEl(null); }}>
          <ListItemIcon><ReportRoundedIcon fontSize="small"/></ListItemIcon>
          <ListItemText primary="Report" />
        </MenuItem>
        <MenuItem onClick={()=>{ onAction?.('delete', msg); setMenuEl(null); }}>
          <ListItemIcon><DeleteRoundedIcon fontSize="small"/></ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
      </Menu>

      {/* Reactions quick bar + full library */}
      <Popover 
        open={Boolean(reactEl)} 
        anchorEl={reactEl} 
        onClose={()=>setReactEl(null)} 
        anchorOrigin={{ vertical:'top', horizontal:'center' }} 
        transformOrigin={{ vertical:'bottom', horizontal:'center' }}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.15)'
          }
        }}
      >
        <Box className="p-1 px-2 flex gap-1 items-center">
          {['👍','❤️','😂','😮','😢','🙏','🔥','🎉','💯','👏'].map(em => (
            <Button key={em} onClick={()=>{ setReactions(p=>[...p, em]); setReactEl(null); }} sx={{ minWidth:32, minHeight:32, fontSize:18, '&:hover': { bgcolor: 'action.hover' } }}>{em}</Button>
          ))}
          <Button onClick={(e)=>setReactFullEl(e.currentTarget)} sx={{ minWidth:32, minHeight:32, fontSize:18, color:EV.orange }}>+</Button>
        </Box>
      </Popover>
      <Popover 
        open={Boolean(reactFullEl)} 
        anchorEl={reactFullEl} 
        onClose={()=>setReactFullEl(null)} 
        anchorOrigin={{ vertical:'top', horizontal:'center' }} 
        transformOrigin={{ vertical:'bottom', horizontal:'center' }}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            maxWidth: '85vw',
            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.15)'
          }
        }}
      >
        <Box className="p-2 grid grid-cols-8 gap-1">
          {["😀","😁","😂","🤣","😊","😍","😘","😜","🤪","🤝","👍","👎","👏","🙌","🔥","🎉","💯","💡","✅","❗","😮","😢","🙏","😴","🤔","😇","🤩","🥳","🤯","😡","😱","🤗","🫶"].map(em => (
            <Button key={em} onClick={()=>{ setReactions(p=>[...p, em]); setReactFullEl(null); }} sx={{ minWidth:28, minHeight:28, fontSize:18, '&:hover': { bgcolor: 'action.hover' } }}>{em}</Button>
          ))}
        </Box>
      </Popover>
    </div>
  );
}

export default function ConversationWAHeader({ onBack, kind='1:1', moduleLabel='Marketplace', onNavigate, location }){
  const muiTheme = useMuiTheme();
  const { isDark } = useTheme();
  const [messages, setMessages] = useState(DEMO);
  const [replyTo, setReplyTo] = useState(null);
  const [draft, setDraft] = useState('');
  const [menuEl, setMenuEl] = useState(null);
  const [emojiEl, setEmojiEl] = useState(null);
  const [attachEl, setAttachEl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [muted, setMuted] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState(new Set());
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const listRef = useRef(null);

  // Check if this is a group chat from URL params
  const isGroupChat = useMemo(() => {
    const params = new URLSearchParams(location?.search || '');
    return params.get('group') === 'true' || kind === 'group';
  }, [location, kind]);

  // Store messages to forward (from previous conversation)
  const [messagesToForward, setMessagesToForward] = useState([]);

  // Handle forwarded messages when arriving at conversation
  useEffect(() => {
    const params = new URLSearchParams(location?.search || '');
    const forwardParam = params.get('forward');
    if (forwardParam && messagesToForward.length === 0) {
      // Get message IDs to forward
      const msgIds = forwardParam.split(',');
      
      // In a real app, you would fetch these messages from a message store/API
      // For demo, we'll create placeholder forwarded messages
      if (msgIds.length > 0) {
        const ts = new Date();
        const forwardedMsgs = msgIds.map((msgId, idx) => ({
          id: 'fwd-' + Date.now() + '-' + idx,
          author: { id:'me', name:'You', avatar:'https://i.pravatar.cc/100?img=2' },
          text: `Forwarded message (ID: ${msgId})`,
          time: ts.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }),
          mine: true,
          read: false,
          forwarded: true,
          originalAuthor: 'Previous conversation'
        }));
        
        setMessages(prev => [...prev, ...forwardedMsgs]);
        
        // Scroll to bottom after forwarding
        requestAnimationFrame(()=>{ const el=listRef.current; if(el) el.scrollTop = el.scrollHeight; });
      }
      
      // Clear the forward parameter from URL after handling
      const newParams = new URLSearchParams(params);
      newParams.delete('forward');
      const newSearch = newParams.toString();
      onNavigate?.(`${location.pathname}${newSearch ? '?' + newSearch : ''}`, { replace: true });
    }
  }, [location, onNavigate, messagesToForward.length]);

  // Update kind if it's a group chat
  const chatKind = useMemo(() => {
    if (isGroupChat) return 'group';
    return kind;
  }, [isGroupChat, kind]);

  const openHeaderMenu = (e)=> setMenuEl(e.currentTarget);
  const closeHeaderMenu = ()=> setMenuEl(null);

  const title = useMemo(()=> chatKind==='group'? 'Group Chat' : (chatKind==='channel'? '#announcements' : 'Leslie Alexander'), [chatKind]);
  const avatar = useMemo(()=> chatKind==='1:1'? 'https://i.pravatar.cc/100?img=5' : 'https://i.pravatar.cc/100?img=15', [chatKind]);
  const meta = useMemo(()=> chatKind==='channel'? 'Announcement channel' : (chatKind==='group'? 'Group' : 'Online'), [chatKind]);

  useEffect(()=>{ const el=listRef.current; if(el) el.scrollTop = el.scrollHeight; }, [draft, messages.length]);

  const scrollToMsg = (id)=>{
    const el = document.getElementById(`msg-${id}`);
    if(el){ el.scrollIntoView({ behavior:'smooth', block:'center' }); }
  };

  // eslint-disable-next-line no-unused-vars
  const handleQuote = (msg)=> setReplyTo(msg);
  const handleAction = (type, msg)=>{
    if(type==='delete') setMessages(prev=> prev.filter(m=> m.id!==msg.id));
    if(type==='forward') {
      // Forward single message - navigate to contact picker
      onNavigate?.(`/new-message?forward=${msg.id}`);
    }
    if(type==='pin' || type==='unpin' || type==='report' || type==='recall') {/* stub for now */}
  };

  // Message selection handler
  const handleSelectMessage = (msgId, add) => {
    setSelectedMessages(prev => {
      const next = new Set(prev);
      if (add) {
        next.add(msgId);
      } else {
        next.delete(msgId);
      }
      return next;
    });
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedMessages(new Set());
  };

  // Handle bulk actions for selected messages
  const handleBulkAction = (action) => {
    const selected = Array.from(selectedMessages);
    if (selected.length === 0) return;

    switch(action) {
      case 'delete':
        if (window.confirm(`Delete ${selected.length} message(s)?`)) {
          setMessages(prev => prev.filter(m => !selectedMessages.has(m.id)));
          clearSelection();
        }
        break;
      case 'forward':
        // Forward selected messages - store them and navigate to contact picker
        const msgIds = selected.join(',');
        const msgsToForward = messages.filter(m => selectedMessages.has(m.id));
        // Store messages to forward (in real app, this would be in a global store)
        // For now, we'll pass them via URL params
        onNavigate?.(`/new-message?forward=${msgIds}`);
        clearSelection();
        break;
      case 'copy':
        // Copy all selected messages text
        const texts = messages
          .filter(m => selectedMessages.has(m.id))
          .map(m => `${m.author.name}: ${m.text}`)
          .join('\n');
        navigator.clipboard.writeText(texts);
        alert('Messages copied to clipboard');
        clearSelection();
        break;
      case 'translate':
        // Translate selected messages (demo)
        alert(`Translating ${selected.length} message(s)...`);
        clearSelection();
        break;
      default:
        break;
    }
  };

  const send = ()=>{
    if(!draft.trim() && !isRecording) return;
    const ts = new Date();
    const newMsg = { id:'m'+Date.now(), author:{ id:'me', name:'You', avatar:'https://i.pravatar.cc/100?img=2' }, text:draft, time: ts.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }), mine:true, read:false, replyTo: replyTo? { id: replyTo.id, text: replyTo.text } : undefined };
    setMessages(prev=> [...prev, newMsg]);
    setDraft(''); setReplyTo(null);
    requestAnimationFrame(()=>{ const el=listRef.current; if(el) el.scrollTop = el.scrollHeight; });
  };

  // Emoji picker handler
  const insertEmoji = (emoji) => {
    setDraft(prev => prev + emoji);
    setEmojiEl(null);
  };

  // Attachment handlers
  const handleAttachOption = (option) => {
    setAttachEl(null);
    switch(option) {
      case 'photos':
        imageInputRef.current?.click();
        break;
      case 'videos':
        videoInputRef.current?.click();
        break;
      case 'camera':
        cameraInputRef.current?.click();
        break;
      case 'document':
        fileInputRef.current?.click();
        break;
      case 'audio':
        audioInputRef.current?.click();
        break;
      case 'location':
        alert('Location sharing - Coming soon');
        break;
      case 'contact':
        alert('Contact sharing - Coming soon');
        break;
      case 'poll':
        alert('Poll creation - Coming soon');
        break;
      default:
        break;
    }
  };

  // Voice recording handlers with MediaRecorder API
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const duration = recordingTime;
        
        // Create voice message
        const ts = new Date();
        const newMsg = { 
          id:'m'+Date.now(), 
          author:{ id:'me', name:'You', avatar:'https://i.pravatar.cc/100?img=2' }, 
          text: `🎤 Voice message (${Math.floor(duration/60)}:${String(duration%60).padStart(2,'0')})`, 
          time: ts.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }), 
          mine:true, 
          read:false,
          audioUrl,
          audioBlob
        };
        setMessages(prev=> [...prev, newMsg]);
        requestAnimationFrame(()=>{ const el=listRef.current; if(el) el.scrollTop = el.scrollHeight; });
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Microphone access denied. Please enable microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if(recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    // Stop stream if still active
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setRecordingTime(0);
  };

  // File handlers
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if(file) {
      const ts = new Date();
      const newMsg = { 
        id:'m'+Date.now(), 
        author:{ id:'me', name:'You', avatar:'https://i.pravatar.cc/100?img=2' }, 
        text: `📄 ${file.name}`, 
        time: ts.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }), 
        mine:true, 
        read:false 
      };
      setMessages(prev=> [...prev, newMsg]);
      requestAnimationFrame(()=>{ const el=listRef.current; if(el) el.scrollTop = el.scrollHeight; });
    }
    e.target.value = ''; // Reset input
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if(file) {
      const ts = new Date();
      const newMsg = { 
        id:'m'+Date.now(), 
        author:{ id:'me', name:'You', avatar:'https://i.pravatar.cc/100?img=2' }, 
        text: `🖼️ ${file.name}`, 
        time: ts.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }), 
        mine:true, 
        read:false 
      };
      setMessages(prev=> [...prev, newMsg]);
      requestAnimationFrame(()=>{ const el=listRef.current; if(el) el.scrollTop = el.scrollHeight; });
    }
    e.target.value = '';
  };

  const handleCameraCapture = (e) => {
    const file = e.target.files?.[0];
    if(file) {
      const ts = new Date();
      const newMsg = { 
        id:'m'+Date.now(), 
        author:{ id:'me', name:'You', avatar:'https://i.pravatar.cc/100?img=2' }, 
        text: `📷 Photo`, 
        time: ts.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }), 
        mine:true, 
        read:false 
      };
      setMessages(prev=> [...prev, newMsg]);
      requestAnimationFrame(()=>{ const el=listRef.current; if(el) el.scrollTop = el.scrollHeight; });
    }
    e.target.value = '';
  };

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none`}</style>
      <Box sx={{ 
        width: '100%', 
        height: '100%', 
        mx: 'auto', 
        bgcolor: 'background.paper', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* Selection Mode Header - Shows when messages are selected */}
        {selectedMessages.size > 0 && (
          <AppBar 
            elevation={0} 
            position="fixed" 
            sx={{ 
              bgcolor: 'background.paper', 
              color: 'text.primary', 
              borderBottom: `1px solid ${muiTheme.palette.divider}`,
              top: '3.5rem',
              width: '100%',
              zIndex: 1101,
              boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <Toolbar className="!min-h-[56px] !px-3">
              <IconButton 
                aria-label="Cancel selection" 
                onClick={clearSelection}
                sx={{ mr: 1, color: 'text.primary' }}
              >
                <ArrowBackRoundedIcon/>
              </IconButton>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  flexGrow: 1,
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'text.primary'
                }}
              >
                {selectedMessages.size} selected
              </Typography>
              <IconButton 
                aria-label="More actions" 
                onClick={(e) => setMenuEl(e.currentTarget)}
                sx={{ color: 'text.primary' }}
              >
                <MoreVertRoundedIcon/>
              </IconButton>
            </Toolbar>
          </AppBar>
        )}

        {/* Header - Fixed at top */}
        {selectedMessages.size === 0 && (
          <AppBar 
            elevation={0} 
            position="fixed" 
            sx={{ 
              bgcolor: 'background.paper', 
              color: 'text.primary', 
              borderBottom: `1px solid ${muiTheme.palette.divider}`,
              top: '3.5rem', // Below main shell header
              width: '100%',
              zIndex: 1100,
              boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <Toolbar className="!min-h-[56px] !px-3" sx={{ position: 'relative' }}>
              <IconButton 
                aria-label="Back" 
                onClick={onBack}
                sx={{ mr: 1, color: 'text.primary' }}
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
                    lineHeight: 1.2,
                    color: 'text.primary'
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
                      color: muiTheme.palette.text.secondary
                    }}
                  >
                    {meta}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ position:'absolute', top: 8, right: 4, display:'flex', gap: 0.5 }}>
                <IconButton 
                  aria-label="Video call" 
                  size="small" 
                  sx={{ color: 'text.secondary' }}
                  onClick={()=>{
                    // Navigate to call page with video type and contact name
                    onNavigate?.(`/call?type=video&contact=${encodeURIComponent(title)}&state=dialing`);
                  }}
                >
                  <VideocamRoundedIcon fontSize="small"/>
                </IconButton>
                <IconButton 
                  aria-label="Voice call" 
                  size="small" 
                  sx={{ color: 'text.secondary' }}
                  onClick={()=>{
                    // Navigate to call page with voice type and contact name
                    onNavigate?.(`/call?type=voice&contact=${encodeURIComponent(title)}&state=dialing`);
                  }}
                >
                  <CallRoundedIcon fontSize="small"/>
                </IconButton>
                <IconButton aria-label="More" onClick={openHeaderMenu} size="small" sx={{ color: 'text.secondary' }}>
                  <MoreVertRoundedIcon fontSize="small"/>
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>
        )}

        {/* Selection Mode Menu - Shows Delete, Forward, Copy, Translate */}
        <Menu
          anchorEl={menuEl}
          open={Boolean(menuEl) && selectedMessages.size > 0}
          onClose={() => setMenuEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{ 
            sx:{ 
              width: '90vw', 
              maxWidth: 'calc(100vw - 1rem)', 
              mx: 'auto', 
              borderRadius: 2, 
              py: 0.5,
              bgcolor: 'background.paper',
              '& .MuiMenuItem-root': {
                color: 'text.primary',
              }
            } 
          }}
        >
          <MenuItem onClick={()=>{ handleBulkAction('copy'); setMenuEl(null); }}>
            <ListItemIcon><ContentCopyRoundedIcon fontSize="small"/></ListItemIcon>
            <ListItemText primary="Copy" />
          </MenuItem>
          <MenuItem onClick={()=>{ handleBulkAction('forward'); setMenuEl(null); }}>
            <ListItemIcon><ForwardRoundedIcon fontSize="small"/></ListItemIcon>
            <ListItemText primary="Forward" />
          </MenuItem>
          <MenuItem onClick={()=>{ handleBulkAction('translate'); setMenuEl(null); }}>
            <ListItemIcon><TranslateRoundedIcon fontSize="small"/></ListItemIcon>
            <ListItemText primary="Translate" />
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem onClick={()=>{ handleBulkAction('delete'); setMenuEl(null); }} sx={{ color: '#e53935' }}>
            <ListItemIcon><DeleteRoundedIcon fontSize="small" sx={{ color: '#e53935' }}/></ListItemIcon>
            <ListItemText primary="Delete" />
          </MenuItem>
        </Menu>

        {/* Header 3-dots menu (mobile-sized) - Only shows when no messages selected */}
        <Menu
          anchorEl={menuEl}
          open={Boolean(menuEl) && selectedMessages.size === 0}
          onClose={closeHeaderMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{ 
            sx:{ 
              width: '90vw', 
              maxWidth: 'calc(100vw - 1rem)', 
              mx: 'auto', 
              borderRadius: 2, 
              py: 0.5,
              bgcolor: 'background.paper',
              '& .MuiMenuItem-root': {
                color: 'text.primary',
              }
            } 
          }}
        >
          <MenuItem onClick={()=>{ 
            closeHeaderMenu(); 
            if (chatKind === 'group') {
              onNavigate?.('/profile?group=true');
            } else {
              // Navigate to contact's profile, not user's own profile
              const contactName = title !== 'Leslie Alexander' ? title : 'Leslie Alexander';
              onNavigate?.(`/profile?contact=${encodeURIComponent(contactName)}`);
            }
          }}>
            <ListItemIcon><InfoOutlinedIcon fontSize="small"/></ListItemIcon>
            <ListItemText primary={chatKind === 'group' ? "View group info" : "View contact info"} />
          </MenuItem>
          <MenuItem onClick={()=>{ closeHeaderMenu(); setMuted(!muted); alert(muted ? 'Notifications enabled' : 'Notifications muted'); }}>
            <ListItemIcon><NotificationsOffRoundedIcon fontSize="small"/></ListItemIcon>
            <ListItemText primary={muted ? "Unmute notifications" : "Mute notifications"} />
          </MenuItem>
          <MenuItem onClick={()=>{ closeHeaderMenu(); alert('Wallpaper settings - Coming soon'); }}>
            <ListItemIcon><WallpaperRoundedIcon fontSize="small"/></ListItemIcon>
            <ListItemText primary="Wallpaper" />
          </MenuItem>
          <MenuItem onClick={()=>{ closeHeaderMenu(); onNavigate?.('/search'); }}>
            <ListItemIcon><StarBorderRoundedIcon fontSize="small"/></ListItemIcon>
            <ListItemText primary="Starred messages" />
          </MenuItem>
          <Divider sx={{ my:0.5 }}/>
          <MenuItem onClick={()=>{ closeHeaderMenu(); alert('Chat exported'); }}>
            <ListItemIcon><IosShareRoundedIcon fontSize="small"/></ListItemIcon>
            <ListItemText primary="Export chat" />
          </MenuItem>
          <MenuItem onClick={()=>{ closeHeaderMenu(); if(window.confirm('Clear all messages in this chat?')) { setMessages([]); } }}>
            <ListItemIcon><DeleteSweepRoundedIcon fontSize="small"/></ListItemIcon>
            <ListItemText primary="Clear chat" />
          </MenuItem>
          {chatKind === '1:1' && (
            <MenuItem onClick={()=>{ closeHeaderMenu(); if(window.confirm('Block this contact?')) { alert('Contact blocked'); } }}>
              <ListItemIcon><BlockRoundedIcon fontSize="small"/></ListItemIcon>
              <ListItemText primary="Block" />
            </MenuItem>
          )}
          <MenuItem onClick={()=>{ closeHeaderMenu(); onNavigate?.('/safety'); }}>
            <ListItemIcon><DescriptionRoundedIcon fontSize="small"/></ListItemIcon>
            <ListItemText primary="Report" />
          </MenuItem>
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
            bgcolor: 'background.default'
          }}
        >
          <div className="space-y-3" style={{ paddingTop: 8, paddingBottom: 8 }}>
            {messages.map(m=> (
              <Bubble 
                key={m.id} 
                msg={m} 
                onQuote={(mm)=>setReplyTo(mm)} 
                onAction={handleAction} 
                scrollTo={scrollToMsg}
                onSelect={handleSelectMessage}
                isSelected={selectedMessages.has(m.id)}
              />
            ))}
          </div>
        </Box>

        {/* Composer - fixed above bottom nav */}
        <Box 
          sx={{ 
            borderTop: `1px solid ${muiTheme.palette.divider}`,
            bgcolor: 'background.paper',
            px: 2,
            py: 1.5,
            position: 'fixed',
            bottom: '5.5rem', // Above bottom nav
            left: 0,
            right: 0,
            width: '100%',
            mx: 'auto',
            zIndex: 1200,
            boxShadow: isDark ? '0 -2px 8px rgba(0,0,0,0.3)' : '0 -2px 8px rgba(0,0,0,0.04)'
          }}
        >
          {replyTo && (
            <Box className="mb-1 px-2 py-1 rounded-md" sx={{ bgcolor: 'background.default', border:`1px solid ${muiTheme.palette.divider}` }}>
              <div className="text-[11.5px]" style={{ color: muiTheme.palette.text.secondary }}>Replying to: {replyTo.text.slice(0,72)}{replyTo.text.length>72?'…':''}</div>
            </Box>
          )}
          <Box className="flex items-end gap-1.5">
            {/* Emoji picker button */}
            <IconButton 
              aria-label="Emoji" 
              onClick={(e)=>setEmojiEl(emojiEl ? null : e.currentTarget)}
              sx={{ color: emojiEl ? EV.orange : 'text.secondary' }}
            >
              <InsertEmoticonRoundedIcon/>
            </IconButton>
            
            {/* Attachment menu button (WhatsApp-style + icon) */}
            <IconButton 
              aria-label="Attach" 
              onClick={(e)=>setAttachEl(attachEl ? null : e.currentTarget)}
              sx={{ color: attachEl ? EV.orange : 'text.secondary' }}
            >
              {attachEl ? <AddRoundedIcon sx={{ transform: 'rotate(45deg)' }} /> : <AttachFileRoundedIcon/>}
            </IconButton>
            
            {/* Hidden file inputs */}
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".pdf,.doc,.docx,.txt" onChange={handleFileSelect} />
            <input type="file" ref={imageInputRef} style={{ display: 'none' }} accept="image/*" multiple onChange={handleImageSelect} />
            <input type="file" ref={videoInputRef} style={{ display: 'none' }} accept="video/*" multiple onChange={handleImageSelect} />
            <input type="file" ref={cameraInputRef} style={{ display: 'none' }} accept="image/*" capture="environment" onChange={handleCameraCapture} />
            <input type="file" ref={audioInputRef} style={{ display: 'none' }} accept="audio/*" onChange={handleFileSelect} />
            
            <TextField
              fullWidth 
              size="small" 
              placeholder={isRecording ? `Recording... ${Math.floor(recordingTime/60)}:${String(recordingTime%60).padStart(2,'0')}` : "Type a message"}
              value={draft}
              onChange={(e)=>setDraft(e.target.value)}
              onFocus={()=>{ const el=listRef.current; if(el) el.scrollTop = el.scrollHeight; }}
              onKeyDown={(e)=>{ if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              multiline 
              minRows={1} 
              maxRows={6}
              disabled={isRecording}
              InputProps={{ sx:{ bgcolor: 'background.paper' } }}
              sx={{
                '& .MuiInputBase-input': {
                  color: 'text.primary',
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'text.secondary',
                  opacity: 1,
                },
              }}
            />
            
            {draft.trim().length>0 ? (
              <IconButton aria-label="Send" sx={{ color: EV.orange }} onClick={send}>
                <SendRoundedIcon/>
              </IconButton>
            ) : (
              <IconButton 
                aria-label="Record" 
                sx={{ color: isRecording ? '#e53935' : EV.orange }}
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
              >
                {isRecording ? <StopRoundedIcon/> : <MicRoundedIcon/>}
              </IconButton>
            )}
          </Box>
        </Box>

        {/* WhatsApp-style Attachment Menu */}
        <Popover
          open={Boolean(attachEl)}
          anchorEl={attachEl}
          onClose={()=>setAttachEl(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          PaperProps={{ 
            sx:{ 
              borderRadius: 3, 
              p: 1.5, 
              minWidth: 200,
              bgcolor: 'background.paper',
              boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.15)'
            } 
          }}
        >
          <Box className="grid grid-cols-3 gap-3">
            {[
              { icon: <ImageRoundedIcon sx={{ fontSize: 28 }} />, label: 'Photos', action: 'photos' },
              { icon: <VideoLibraryRoundedIcon sx={{ fontSize: 28 }} />, label: 'Videos', action: 'videos' },
              { icon: <CameraAltRoundedIcon sx={{ fontSize: 28 }} />, label: 'Camera', action: 'camera' },
              { icon: <DescriptionRoundedIcon sx={{ fontSize: 28 }} />, label: 'Document', action: 'document' },
              { icon: <ContactsRoundedIcon sx={{ fontSize: 28 }} />, label: 'Contact', action: 'contact' },
              { icon: <PollRoundedIcon sx={{ fontSize: 28 }} />, label: 'Poll', action: 'poll' },
              { icon: <LocationOnRoundedIcon sx={{ fontSize: 28 }} />, label: 'Location', action: 'location' },
              { icon: <MusicNoteRoundedIcon sx={{ fontSize: 28 }} />, label: 'Audio', action: 'audio' },
            ].map((item) => (
              <Box
                key={item.action}
                onClick={()=>handleAttachOption(item.action)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                  p: 1.5,
                  borderRadius: 2,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                  transition: 'background-color 0.2s'
                }}
              >
                <Box sx={{ color: EV.green }}>{item.icon}</Box>
                <Typography variant="caption" sx={{ fontSize: '11px', textAlign: 'center', color: 'text.secondary' }}>
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Popover>

        {/* Emoji Picker */}
        <Popover
          open={Boolean(emojiEl)}
          anchorEl={emojiEl}
          onClose={()=>setEmojiEl(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          PaperProps={{ 
            sx:{ 
              borderRadius: 3, 
              p: 1.5, 
              maxWidth: '85vw',
              bgcolor: 'background.paper',
              boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.15)'
            } 
          }}
        >
          <Box className="grid grid-cols-8 gap-1" sx={{ maxHeight: '40vh', overflowY: 'auto' }}>
            {["😀","😁","😂","🤣","😊","😍","😘","😜","🤪","🤝","👍","👎","👏","🙌","🔥","🎉","💯","💡","✅","❗","😮","😢","🙏","😴","🤔","😇","🤩","🥳","🤯","😡","😱","🤗","🫶","❤️","💔","💋","🌹","🎁","🎂","🎈","🎊","🎉","🏆","⭐","🌟","✨","💫","🌈","☀️","🌙","⭐","🌟"].map(em => (
              <Button 
                key={em} 
                onClick={()=>insertEmoji(em)} 
                sx={{ 
                  minWidth: 36, 
                  minHeight: 36, 
                  fontSize: 20,
                  p: 0.5,
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                {em}
              </Button>
            ))}
          </Box>
        </Popover>
      </Box>
    </>
  );
}
