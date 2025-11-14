import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { useTheme } from "../../context/ThemeContext";
import AudioPlayer from "../../components/AudioPlayer";
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
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
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
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import ForwardRoundedIcon from "@mui/icons-material/ForwardRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SelectAllRoundedIcon from "@mui/icons-material/SelectAllRounded";
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ReportRoundedIcon from "@mui/icons-material/ReportRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };
const lighten = (hex, a=0.12) => `rgba(${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)},${a})`;

const DEMO = [
  { id: 'm1', author: { id:'u2', name:'Leslie Alexander', avatar:'https://i.pravatar.cc/100?img=5' }, text: 'Hi! Do we still meet at 3 pm?', time: '07:32 PM', mine: false, read: true },
  { id: 'm2', author: { id:'me', name:'You', avatar:'https://i.pravatar.cc/100?img=2' }, text: 'Yes. I will send the Zoom link here.', time: '07:33 PM', mine: true, read: true },
  { id: 'm3', author: { id:'u2', name:'Leslie Alexander', avatar:'https://i.pravatar.cc/100?img=5' }, text: 'Perfect. Also, can you check the PDF I shared?', time: '07:34 PM', mine: false, read: false }
];

function Bubble({ msg, onQuote, onAction, scrollTo, onSelect, isSelected, isSelectionMode }){
  const muiTheme = useMuiTheme();
  const { isDark, accent } = useTheme();
  const [menuEl, setMenuEl] = useState(null);
  const [reactEl, setReactEl] = useState(null);
  const [reactFullEl, setReactFullEl] = useState(null);
  const [translated, setTranslated] = useState(null);
  const [pinned, setPinned] = useState(false);
  const [starred, setStarred] = useState(false);
  const [recalled, setRecalled] = useState(false);
  const [reactions, setReactions] = useState([]);
  const start = useRef({ x:0, y:0, active:false, moved:false });
  const longPressTimer = useRef(null);

  // Get theme accent color
  const accentColor = accent === 'orange' ? EV.orange : accent === 'green' ? EV.green : EV.grey;

  const isMine = msg.mine;
  // Outgoing messages: Dark blue background with white text (per design spec)
  // Incoming messages: Light blue/gray background with dark text (per design spec)
  const bg = isMine ? accentColor : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)');
  const br = isMine ? `1px solid ${accentColor}` : `1px solid ${muiTheme.palette.divider}`;
  const tx = isMine ? '#fff' : muiTheme.palette.text.primary; // White text for outgoing, dark text for incoming
  const isVoiceMessage = msg.audioUrl || msg.text?.includes('🎤');
  const isVideoMessage = msg.videoUrl || msg.text?.includes('🎥') || msg.fileName?.match(/\.(mp4|webm|mov|avi)$/i);
  const isImageMessage = msg.imageUrl || msg.text?.includes('🖼️') || msg.text?.includes('📷');
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
            onClick={(e)=>{
              // If in selection mode, toggle selection on click
              if (isSelectionMode) {
                onSelect?.(msg.id, !selected);
              } else if (selected) {
                // If message is selected but not in selection mode, deselect it
                onSelect?.(msg.id, false);
              } else {
                // Normal click - show menu
                setMenuEl(e.currentTarget);
              }
            }}
            onTouchStart={onTouchStart} 
            onTouchMove={onTouchMove} 
            onTouchEnd={onTouchEnd} 
            sx={{ 
              p:1.25, 
              px:1.5, 
              bgcolor: selected ? (isMine ? lighten(accentColor, 0.3) : lighten(accentColor, 0.25)) : bg, 
              border: selected ? `2px solid ${accentColor}` : br, 
              borderRadius:2,
              cursor: 'pointer'
            }}
          >
            {!recalled ? (
              <>
                {msg.forwarded && (
                  <Box sx={{ borderLeft:`3px solid ${accentColor}`, pl:1, mb:0.5, color: 'text.secondary' }} className="text-[11.5px]">
                    Forwarded from {msg.originalAuthor || 'Unknown'}
                  </Box>
                )}
                {msg.replyTo && (
                  <Box role="button" onClick={()=>scrollTo?.(msg.replyTo.id)} sx={{ borderLeft:`3px solid ${accentColor}`, pl:1, mb:0.5, cursor:'pointer', color: 'text.secondary' }} className="text-[11.5px] truncate">
                    Replying to: {msg.replyTo.text.slice(0,64)}{msg.replyTo.text.length>64?'…':''}
                  </Box>
                )}
                {isVoiceMessage && msg.audioUrl ? (
                  <AudioPlayer
                    audioUrl={msg.audioUrl}
                    text={msg.text}
                    accentColor={accentColor}
                    textColor={tx}
                    isMine={isMine}
                  />
                ) : isVideoMessage && msg.videoUrl ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%' }}>
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        borderRadius: 1,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        bgcolor: '#000',
                        '&:hover': {
                          opacity: 0.9,
                        },
                      }}
                      onClick={() => {
                        // Open video in new tab/window for full view
                        window.open(msg.videoUrl, '_blank');
                      }}
                    >
                      <video
                        src={msg.videoUrl}
                        style={{
                          width: '100%',
                          maxHeight: '300px',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                        preload="metadata"
                      />
                      {/* Play icon overlay */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          bgcolor: 'rgba(0, 0, 0, 0.6)',
                          borderRadius: '50%',
                          width: 56,
                          height: 56,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          pointerEvents: 'none',
                        }}
                      >
                        <PlayArrowRoundedIcon sx={{ fontSize: 32, color: '#fff' }} />
                      </Box>
                    </Box>
                    {msg.text && (
                      <Typography variant="caption" sx={{ fontSize: '11px', color: muiTheme.palette.text.secondary }}>
                        {msg.text}
                      </Typography>
                    )}
                  </Box>
                ) : isImageMessage && msg.imageUrl ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%' }}>
                    <Box
                      component="img"
                      src={msg.imageUrl}
                      alt={msg.fileName || 'Shared photo'}
                      sx={{
                        width: '100%',
                        maxHeight: '300px',
                        borderRadius: 1,
                        objectFit: 'cover',
                        cursor: 'pointer',
                        display: 'block',
                        '&:hover': {
                          opacity: 0.9,
                        },
                      }}
                      onClick={() => {
                        // Open image in new tab/window for full view
                        window.open(msg.imageUrl, '_blank');
                      }}
                    />
                    {msg.text && (
                      <Typography variant="caption" sx={{ fontSize: '11px', color: muiTheme.palette.text.secondary }}>
                        {msg.text}
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <div className="text-[13.5px] whitespace-pre-wrap" style={{ color:tx }}>{msg.text}</div>
                )}
                {translated && <div className="text-[12px] mt-1" style={{ color: muiTheme.palette.text.secondary }}>{translated}</div>}
                <div className="flex items-center gap-1 mt-1 justify-end">
                  <span className="text-[11px]" style={{ color: muiTheme.palette.text.secondary }}>{msg.time}</span>
                  {isMine && (<DoneAllRoundedIcon sx={{ fontSize:14, color: msg.read? accentColor : EV.grey }} />)}
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
          <ListItemIcon><StarRoundedIcon fontSize="small" sx={{ color: starred ? accentColor : 'inherit' }}/></ListItemIcon>
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
          <Button onClick={(e)=>setReactFullEl(e.currentTarget)} sx={{ minWidth:32, minHeight:32, fontSize:18, color:accentColor }}>+</Button>
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

export default function ConversationWAHeader({ onBack, kind='1:1', moduleLabel='E-Commerce', onNavigate, location }){
  const muiTheme = useMuiTheme();
  const { isDark, accent } = useTheme();
  
  // Get theme accent color
  const accentColor = accent === 'orange' ? EV.orange : accent === 'green' ? EV.green : EV.grey;
  const [messages, setMessages] = useState(DEMO);
  const [replyTo, setReplyTo] = useState(null);
  const [draft, setDraft] = useState('');
  const [menuEl, setMenuEl] = useState(null);
  const [emojiEl, setEmojiEl] = useState(null);
  const [attachEl, setAttachEl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [videoRecordingTime, setVideoRecordingTime] = useState(0);
  const [muted, setMuted] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState(new Set());
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const videoRecordingIntervalRef = useRef(null);
  const videoMediaRecorderRef = useRef(null);
  const videoStreamRef = useRef(null);
  const videoChunksRef = useRef([]);
  const videoRecordingTimeRef = useRef(0); // Use ref to track current video recording time
  const listRef = useRef(null);

  // Check if this is a group chat from URL params
  const isGroupChat = useMemo(() => {
    const params = new URLSearchParams(location?.search || '');
    return params.get('group') === 'true' || kind === 'group';
  }, [location, kind]);

  // Store messages to forward (from previous conversation)
  const [messagesToForward] = useState([]);

  // Handle forwarded messages and shared contacts when arriving at conversation
  useEffect(() => {
    const params = new URLSearchParams(location?.search || '');
    const forwardParam = params.get('forward');
    const sharedContactParam = params.get('sharedContact');
    
    // Handle forwarded messages
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
    
    // Handle shared contact
    if (sharedContactParam) {
      try {
        const contactData = JSON.parse(decodeURIComponent(sharedContactParam));
        const ts = new Date();
        const contactText = `👤 ${contactData.name}${contactData.role ? `\n${contactData.role}` : ''}`;
        const newMsg = {
          id: 'contact-' + Date.now(),
          author: { id: 'me', name: 'You', avatar: 'https://i.pravatar.cc/100?img=2' },
          text: contactText,
          time: ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mine: true,
          read: false,
          contact: contactData
        };
        setMessages(prev => [...prev, newMsg]);
        
        // Scroll to bottom after sharing contact
        requestAnimationFrame(() => {
          const el = listRef.current;
          if (el) el.scrollTop = el.scrollHeight;
        });
        
        // Clear the sharedContact parameter from URL after handling
        const newParams = new URLSearchParams(params);
        newParams.delete('sharedContact');
        const newSearch = newParams.toString();
        onNavigate?.(`${location.pathname}${newSearch ? '?' + newSearch : ''}`, { replace: true });
      } catch (error) {
        console.error('Error parsing shared contact:', error);
      }
    }
  }, [location, onNavigate, messagesToForward.length]);

  // Update kind if it's a group chat
  const chatKind = useMemo(() => {
    if (isGroupChat) return 'group';
    return kind;
  }, [isGroupChat, kind]);

  const openHeaderMenu = (e)=> setMenuEl(e.currentTarget);
  const closeHeaderMenu = ()=> setMenuEl(null);

  // Get contact name from URL path or params
  const contactNameFromUrl = useMemo(() => {
    if (location?.pathname) {
      const pathParts = location.pathname.split('/');
      const conversationId = pathParts[pathParts.length - 1];
      if (conversationId && conversationId !== 'new') {
        // Decode the contact name from URL (e.g., "leslie-alexander" -> "Leslie Alexander")
        return conversationId
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
    }
    return null;
  }, [location]);

  // Get module from URL params (for live sessions)
  const moduleFromUrl = useMemo(() => {
    const params = new URLSearchParams(location?.search || '');
    return params.get('module') || null;
  }, [location]);

  // Update moduleLabel if provided via URL
  const effectiveModuleLabel = useMemo(() => {
    return moduleFromUrl || moduleLabel;
  }, [moduleFromUrl, moduleLabel]);

  const title = useMemo(()=> {
    if (chatKind === 'group') return 'Group Chat';
    if (chatKind === 'channel') return '#announcements';
    return contactNameFromUrl || 'Leslie Alexander';
  }, [chatKind, contactNameFromUrl]);
  
  const avatar = useMemo(()=> {
    if (chatKind !== '1:1') return 'https://i.pravatar.cc/100?img=15';
    // Use avatar based on contact name
    if (contactNameFromUrl === 'Leslie Alexander') return 'https://i.pravatar.cc/100?img=5';
    if (contactNameFromUrl === 'Etty Duke') return 'https://i.pravatar.cc/100?img=1';
    if (contactNameFromUrl === 'John Driver') return 'https://i.pravatar.cc/100?img=1';
    if (contactNameFromUrl === 'Ada Guide') return 'https://i.pravatar.cc/100?img=1';
    return 'https://i.pravatar.cc/100?img=5'; // default
  }, [chatKind, contactNameFromUrl]);
  
  const meta = useMemo(()=> chatKind==='channel'? 'Announcement channel' : (chatKind==='group'? 'Group' : 'Online'), [chatKind]);

  // Scroll to top on initial load and when conversation changes
  useEffect(() => {
    const el = listRef.current;
    if (el) {
      // Scroll to top so user sees the beginning of the conversation
      el.scrollTop = 0;
    }
  }, [location?.pathname]); // Re-scroll to top when conversation changes
  
  // Only scroll to bottom when sending a new message (when draft is cleared after sending)
  useEffect(()=>{ 
    if (draft === '' && messages.length > 0) {
      // Only scroll to bottom if we just sent a message (draft cleared)
      const el=listRef.current; 
      if(el) {
        setTimeout(() => {
          el.scrollTop = el.scrollHeight;
        }, 100);
      }
    }
  }, [draft, messages.length]);

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
        // eslint-disable-next-line no-unused-vars
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
  const handleAttachOption = async (option) => {
    setAttachEl(null);
    switch(option) {
      case 'photos':
        imageInputRef.current?.click();
        break;
      case 'videos':
        videoInputRef.current?.click();
        break;
      case 'camera':
        // Start video recording with camera and microphone
        startVideoRecording();
        break;
      case 'document':
        fileInputRef.current?.click();
        break;
      case 'audio':
        audioInputRef.current?.click();
        break;
      case 'location':
        // Get user's current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              // Create a location message
              const ts = new Date();
              const newMsg = {
                id: 'm' + Date.now(),
                author: { id: 'me', name: 'You', avatar: 'https://i.pravatar.cc/100?img=2' },
                text: `📍 Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
                time: ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                mine: true,
                read: false,
                location: { latitude, longitude },
                locationUrl: `https://www.google.com/maps?q=${latitude},${longitude}`
              };
              setMessages(prev => [...prev, newMsg]);
              requestAnimationFrame(() => {
                const el = listRef.current;
                if (el) el.scrollTop = el.scrollHeight;
              });
            },
            (error) => {
              alert('Unable to get location. Please enable location permissions.');
              console.error('Geolocation error:', error);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
          );
        } else {
          alert('Geolocation is not supported by your browser.');
        }
        break;
      case 'contact':
        // Open contacts picker - navigate to new message screen for contact selection
        // Pass current conversation path so we can return and share the contact
        onNavigate?.(`/new-message?shareContact=true&returnTo=${encodeURIComponent(location?.pathname || '/inbox')}`);
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
  const recordingTimeRef = useRef(0); // Use ref to track current recording time

  const startRecording = async () => {
    // Don't start if already recording
    if (isRecording) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Try to use mimeType that's supported
      let options = {};
      if (MediaRecorder.isTypeSupported('audio/webm')) {
        options = { mimeType: 'audio/webm' };
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        options = { mimeType: 'audio/mp4' };
      } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
        options = { mimeType: 'audio/ogg' };
      }
      
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Store the shouldSend flag in the mediaRecorder for access in sendRecording
      mediaRecorder._shouldSend = false;
      
      mediaRecorder.onstop = () => {
        // Only create message if _shouldSend is true (user clicked send)
        const shouldSend = mediaRecorder._shouldSend === true;
        const finalDuration = recordingTimeRef.current; // Use ref value which is always current
        
        if (shouldSend && audioChunksRef.current.length > 0 && finalDuration > 0) {
          try {
            const audioBlob = new Blob(audioChunksRef.current, { type: audioChunksRef.current[0].type || 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // Create voice message
            const ts = new Date();
            const newMsg = { 
              id:'m'+Date.now(), 
              author:{ id:'me', name:'You', avatar:'https://i.pravatar.cc/100?img=2' }, 
              text: `🎤 Voice message (${Math.floor(finalDuration/60)}:${String(finalDuration%60).padStart(2,'0')})`, 
              time: ts.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }), 
              mine:true, 
              read:false,
              audioUrl,
              audioBlob
            };
            
            // Add message to state
            setMessages(prev=> {
              const updated = [...prev, newMsg];
              return updated;
            });
            
            // Scroll to bottom after message is added
            setTimeout(() => {
              const el = listRef.current;
              if (el) {
                el.scrollTop = el.scrollHeight;
              }
            }, 100);
          } catch (error) {
            console.error('Error creating voice message:', error);
            alert('Error creating voice message. Please try again.');
          }
        }
        
        // Clean up
        audioChunksRef.current = [];
        recordingTimeRef.current = 0;
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        
        // Reset recording state
        setIsRecording(false);
        setIsPaused(false);
        if(recordingIntervalRef.current) {
          clearInterval(recordingIntervalRef.current);
          recordingIntervalRef.current = null;
        }
        setRecordingTime(0);
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        cancelRecording();
      };

      // Start recording with timeslice for better chunk handling
      mediaRecorder.start(100);
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      recordingTimeRef.current = 0; // Reset ref
      recordingIntervalRef.current = setInterval(() => {
        if (!isPaused) {
          recordingTimeRef.current += 1; // Update ref
          setRecordingTime(prev => prev + 1);
        }
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Microphone access denied. Please enable microphone permissions.');
      setIsRecording(false);
    }
  };

  // Pause/Resume recording
  const togglePauseRecording = () => {
    if (!isRecording) return;
    
    if (isPaused) {
      // Resume recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
        mediaRecorderRef.current.resume();
      }
      setIsPaused(false);
    } else {
      // Pause recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.pause();
      }
      setIsPaused(true);
    }
  };

  // Cancel/Delete recording
  const cancelRecording = () => {
    if (!isRecording) return;
    
    // Set flag to NOT send
    if (mediaRecorderRef.current && mediaRecorderRef.current._shouldSend !== undefined) {
      mediaRecorderRef.current._shouldSend = false;
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (error) {
        console.error('Error stopping recorder:', error);
      }
    }
    setIsRecording(false);
    setIsPaused(false);
    if(recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    // Stop stream if still active
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    // Clear audio chunks
    audioChunksRef.current = [];
    recordingTimeRef.current = 0;
    setRecordingTime(0);
  };

  // Send the recording
  const sendRecording = () => {
    if (!isRecording || !mediaRecorderRef.current) return;
    
    // Check if we have valid recording time using ref
    if (recordingTimeRef.current === 0) {
      alert('Please record something before sending.');
      return;
    }
    
    // Set flag to send the recording when onstop fires
    if (mediaRecorderRef.current._shouldSend !== undefined) {
      mediaRecorderRef.current._shouldSend = true;
    }
    
    // Stop recording - onstop will handle creating the message
    if (mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (error) {
        console.error('Error stopping recorder:', error);
        alert('Error stopping recording. Please try again.');
      }
    }
  };

  // Video recording handlers
  const startVideoRecording = async () => {
    try {
      // Request both video and audio
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, // Use back camera
        audio: true 
      });
      videoStreamRef.current = stream;
      
      // Try to use mimeType that's supported for video
      let options = {};
      if (MediaRecorder.isTypeSupported('video/webm')) {
        options = { mimeType: 'video/webm' };
      } else if (MediaRecorder.isTypeSupported('video/mp4')) {
        options = { mimeType: 'video/mp4' };
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) {
        options = { mimeType: 'video/webm;codecs=vp8,opus' };
      }
      
      const mediaRecorder = new MediaRecorder(stream, options);
      videoMediaRecorderRef.current = mediaRecorder;
      videoChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          videoChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Create video blob and message
        const finalDuration = videoRecordingTimeRef.current; // Use ref value which is always current
        
        if (videoChunksRef.current.length > 0 && finalDuration > 0) {
          try {
            const videoBlob = new Blob(videoChunksRef.current, { type: videoChunksRef.current[0].type || 'video/webm' });
            const videoUrl = URL.createObjectURL(videoBlob);
            
            // Create video message
            const ts = new Date();
            const newMsg = { 
              id:'m'+Date.now(), 
              author:{ id:'me', name:'You', avatar:'https://i.pravatar.cc/100?img=2' }, 
              text: `🎥 Video (${Math.floor(finalDuration/60)}:${String(finalDuration%60).padStart(2,'0')})`, 
              time: ts.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }), 
              mine:true, 
              read:false,
              videoUrl,
              videoBlob,
              fileName: `video-${Date.now()}.webm`
            };
            
            // Add message to state
            setMessages(prev=> {
              const updated = [...prev, newMsg];
              return updated;
            });
            
            // Scroll to bottom after message is added
            setTimeout(() => {
              const el = listRef.current;
              if (el) {
                el.scrollTop = el.scrollHeight;
              }
            }, 100);
          } catch (error) {
            console.error('Error creating video message:', error);
            alert('Error creating video message. Please try again.');
          }
        }
        
        // Clean up
        videoChunksRef.current = [];
        videoRecordingTimeRef.current = 0;
        
        if (videoStreamRef.current) {
          videoStreamRef.current.getTracks().forEach(track => track.stop());
          videoStreamRef.current = null;
        }
        setIsRecordingVideo(false);
        setVideoRecordingTime(0);
      };

      mediaRecorder.onerror = (event) => {
        console.error('Video MediaRecorder error:', event);
        stopVideoRecording();
      };

      // Start recording
      mediaRecorder.start(100);
      setIsRecordingVideo(true);
      setVideoRecordingTime(0);
      videoRecordingTimeRef.current = 0; // Reset ref
      videoRecordingIntervalRef.current = setInterval(() => {
        videoRecordingTimeRef.current += 1; // Update ref
        setVideoRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing camera/microphone:', error);
      alert('Camera/microphone access denied. Please enable permissions.');
      setIsRecordingVideo(false);
    }
  };

  const stopVideoRecording = () => {
    if (!isRecordingVideo || !videoMediaRecorderRef.current) return;
    
    // Check if we have valid recording time using ref
    if (videoRecordingTimeRef.current === 0) {
      alert('Please record something before sending.');
      return;
    }
    
    if (videoMediaRecorderRef.current.state !== 'inactive') {
      try {
        videoMediaRecorderRef.current.stop();
      } catch (error) {
        console.error('Error stopping video recorder:', error);
        alert('Error stopping video recording. Please try again.');
      }
    }
    
    if(videoRecordingIntervalRef.current) {
      clearInterval(videoRecordingIntervalRef.current);
      videoRecordingIntervalRef.current = null;
    }
    
    // Stream will be stopped in onstop handler
  };

  const cancelVideoRecording = () => {
    if (!isRecordingVideo) return;
    
    if (videoMediaRecorderRef.current && videoMediaRecorderRef.current.state !== 'inactive') {
      try {
        videoMediaRecorderRef.current.stop();
      } catch (error) {
        console.error('Error stopping video recorder:', error);
      }
    }
    
    setIsRecordingVideo(false);
    if(videoRecordingIntervalRef.current) {
      clearInterval(videoRecordingIntervalRef.current);
      videoRecordingIntervalRef.current = null;
    }
    
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach(track => track.stop());
      videoStreamRef.current = null;
    }
    
    videoChunksRef.current = [];
    videoRecordingTimeRef.current = 0;
    setVideoRecordingTime(0);
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
    const files = Array.from(e.target.files || []);
    if(files.length > 0) {
      files.forEach(file => {
        const isVideo = file.type.startsWith('video/') || file.name.match(/\.(mp4|webm|mov|avi)$/i);
        const isImage = file.type.startsWith('image/');
        
        if (isVideo) {
          const videoUrl = URL.createObjectURL(file);
          const ts = new Date();
          const newMsg = { 
            id:'m'+Date.now() + Math.random(), 
            author:{ id:'me', name:'You', avatar:'https://i.pravatar.cc/100?img=2' }, 
            text: `🎥 ${file.name}`, 
            time: ts.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }), 
            mine:true, 
            read:false,
            videoUrl,
            videoFile: file,
            fileName: file.name
          };
          setMessages(prev=> [...prev, newMsg]);
        } else if (isImage) {
          const imageUrl = URL.createObjectURL(file);
          const ts = new Date();
          const newMsg = { 
            id:'m'+Date.now() + Math.random(), 
            author:{ id:'me', name:'You', avatar:'https://i.pravatar.cc/100?img=2' }, 
            text: `🖼️ ${file.name}`, 
            time: ts.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }), 
            mine:true, 
            read:false,
            imageUrl,
            imageFile: file,
            fileName: file.name
          };
          setMessages(prev=> [...prev, newMsg]);
        }
      });
      requestAnimationFrame(()=>{ const el=listRef.current; if(el) el.scrollTop = el.scrollHeight; });
    }
    e.target.value = '';
  };

  const handleCameraCapture = (e) => {
    const file = e.target.files?.[0];
    if(file) {
      // Create a preview URL for the captured image
      const imageUrl = URL.createObjectURL(file);
      const ts = new Date();
      const newMsg = { 
        id:'m'+Date.now(), 
        author:{ id:'me', name:'You', avatar:'https://i.pravatar.cc/100?img=2' }, 
        text: `📷 Photo`, 
        time: ts.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }), 
        mine:true, 
        read:false,
        imageUrl,
        imageFile: file,
        fileName: file.name
      };
      setMessages(prev=> [...prev, newMsg]);
      requestAnimationFrame(()=>{ const el=listRef.current; if(el) el.scrollTop = el.scrollHeight; });
    }
    // Reset input to allow capturing again
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
                  {/* Module pill - always show */}
                  <Chip 
                    size="small" 
                    label={effectiveModuleLabel} 
                    sx={{ 
                      borderColor: accentColor, 
                      color: accent === 'green' ? '#0f5132' : accent === 'orange' ? '#5d2c00' : '#424242', 
                      bgcolor: lighten(accentColor,0.12), 
                      border:`1px solid ${lighten(accentColor,0.28)}`,
                      height: 20,
                      fontSize: '10px',
                      fontWeight: 600
                    }} 
                  />
                  {/* Online status indicator - green "Online" text */}
                  {!isGroupChat && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontSize: '12px',
                        color: accentColor,
                        fontWeight: 500
                      }}
                    >
                      Online
                    </Typography>
                  )}
                  {isGroupChat && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontSize: '11px',
                        color: muiTheme.palette.text.secondary
                      }}
                    >
                      {meta}
                    </Typography>
                  )}
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
                  aria-label="Conference call" 
                  size="small" 
                  sx={{ color: 'text.secondary' }}
                  onClick={()=>{
                    // Navigate to conference call page
                    onNavigate?.(`/group-call?contact=${encodeURIComponent(title)}&type=conference`);
                  }}
                >
                  <GroupsRoundedIcon fontSize="small"/>
                </IconButton>
                <IconButton 
                  aria-label="Meeting" 
                  size="small" 
                  sx={{ color: 'text.secondary' }}
                  onClick={()=>{
                    // Navigate to meeting page
                    onNavigate?.(`/group-call?contact=${encodeURIComponent(title)}&type=meeting`);
                  }}
                >
                  <MeetingRoomRoundedIcon fontSize="small"/>
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
            {/* Today divider */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 2 }}>
              <Divider sx={{ flex: 1, mx: 2 }} />
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: '12px',
                  color: 'text.secondary',
                  fontWeight: 500,
                  px: 1
                }}
              >
                Today
              </Typography>
              <Divider sx={{ flex: 1, mx: 2 }} />
            </Box>
            {messages.map(m=> (
              <Bubble 
                key={m.id} 
                msg={m} 
                onQuote={(mm)=>setReplyTo(mm)} 
                onAction={handleAction} 
                scrollTo={scrollToMsg}
                onSelect={handleSelectMessage}
                isSelected={selectedMessages.has(m.id)}
                isSelectionMode={selectedMessages.size > 0}
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
            {/* Attachment menu button (+ icon) - First, as per design */}
            <IconButton 
              aria-label="Attach" 
              onClick={(e)=>setAttachEl(attachEl ? null : e.currentTarget)}
              sx={{ 
                bgcolor: attachEl ? accentColor : 'transparent',
                color: attachEl ? '#fff' : accentColor,
                border: `1px solid ${accentColor}`,
                width: 40,
                height: 40,
                '&:hover': {
                  bgcolor: attachEl ? accentColor : lighten(accentColor, 0.1),
                  color: attachEl ? '#fff' : accentColor
                }
              }}
            >
              {attachEl ? <AddRoundedIcon sx={{ transform: 'rotate(45deg)', fontSize: 20 }} /> : <AddRoundedIcon sx={{ fontSize: 20 }} />}
            </IconButton>
            
            {/* Hidden file inputs */}
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".pdf,.doc,.docx,.txt" onChange={handleFileSelect} />
            <input type="file" ref={imageInputRef} style={{ display: 'none' }} accept="image/*" multiple onChange={handleImageSelect} />
            <input type="file" ref={videoInputRef} style={{ display: 'none' }} accept="video/*" multiple onChange={handleImageSelect} />
            {/* Camera input - will open camera on mobile when clicked */}
            <input 
              type="file" 
              ref={cameraInputRef} 
              style={{ display: 'none' }} 
              accept="image/*" 
              capture
              onChange={handleCameraCapture}
            />
            <input type="file" ref={audioInputRef} style={{ display: 'none' }} accept="audio/*" onChange={handleFileSelect} />
            
            {/* Text input field - Second, as per design */}
            <TextField
              fullWidth 
              size="small" 
              placeholder={
                isRecordingVideo 
                  ? `Recording video... ${Math.floor(videoRecordingTime/60)}:${String(videoRecordingTime%60).padStart(2,'0')}`
                  : isRecording 
                    ? (isPaused ? `Paused ${Math.floor(recordingTime/60)}:${String(recordingTime%60).padStart(2,'0')}` : `Recording... ${Math.floor(recordingTime/60)}:${String(recordingTime%60).padStart(2,'0')}`)
                    : "Type a message"
              }
              value={draft}
              onChange={(e)=>setDraft(e.target.value)}
              onFocus={()=>{ const el=listRef.current; if(el) el.scrollTop = el.scrollHeight; }}
              onKeyDown={(e)=>{ if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              multiline 
              minRows={1} 
              maxRows={6}
              disabled={isRecording || isRecordingVideo}
              InputProps={{ 
                sx:{ 
                  bgcolor: 'background.paper',
                  borderRadius: 2
                } 
              }}
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
            
            {/* Emoji picker button - Third, as per design */}
            <IconButton 
              aria-label="Emoji" 
              onClick={(e)=>setEmojiEl(emojiEl ? null : e.currentTarget)}
              sx={{ color: emojiEl ? accentColor : 'text.secondary' }}
            >
              <InsertEmoticonRoundedIcon/>
            </IconButton>
            
            {/* Recording Controls - Show when recording */}
            {isRecordingVideo ? (
              <>
                {/* Delete/Cancel button */}
                <IconButton 
                  aria-label="Cancel video recording" 
                  onClick={cancelVideoRecording}
                  sx={{ 
                    color: '#e53935',
                    '&:hover': {
                      bgcolor: 'rgba(229, 57, 53, 0.1)',
                    },
                  }}
                >
                  <DeleteRoundedIcon/>
                </IconButton>
                
                {/* Stop and Send button */}
                <IconButton 
                  aria-label="Stop and send video" 
                  onClick={stopVideoRecording}
                  disabled={videoRecordingTime === 0}
                  sx={{ 
                    color: accentColor,
                    '&:hover': {
                      bgcolor: lighten(accentColor, 0.1),
                    },
                    '&:disabled': {
                      opacity: 0.5,
                    },
                  }}
                >
                  <SendRoundedIcon/>
                </IconButton>
              </>
            ) : isRecording ? (
              <>
                {/* Delete/Cancel button */}
                <IconButton 
                  aria-label="Delete recording" 
                  onClick={cancelRecording}
                  sx={{ 
                    color: '#e53935',
                    '&:hover': {
                      bgcolor: 'rgba(229, 57, 53, 0.1)',
                    },
                  }}
                >
                  <DeleteRoundedIcon/>
                </IconButton>
                
                {/* Pause/Resume button */}
                <IconButton 
                  aria-label={isPaused ? "Resume recording" : "Pause recording"} 
                  onClick={togglePauseRecording}
                  sx={{ 
                    color: accentColor,
                    '&:hover': {
                      bgcolor: lighten(accentColor, 0.1),
                    },
                  }}
                >
                  {isPaused ? <PlayArrowRoundedIcon/> : <PauseRoundedIcon/>}
                </IconButton>
                
                {/* Send recording button */}
                <IconButton 
                  aria-label="Send recording" 
                  onClick={sendRecording}
                  disabled={recordingTime === 0}
                  sx={{ 
                    color: accentColor,
                    '&:hover': {
                      bgcolor: lighten(accentColor, 0.1),
                    },
                    '&:disabled': {
                      opacity: 0.5,
                    },
                  }}
                >
                  <SendRoundedIcon/>
                </IconButton>
              </>
            ) : (
              <>
                {/* Microphone/Send button - Fourth, as per design */}
                {draft.trim().length>0 ? (
                  <IconButton aria-label="Send" sx={{ color: accentColor }} onClick={send}>
                    <SendRoundedIcon/>
                  </IconButton>
                ) : (
                  <IconButton 
                    aria-label="Record" 
                    onClick={startRecording}
                    sx={{ color: accentColor }}
                  >
                    <MicRoundedIcon/>
                  </IconButton>
                )}
              </>
            )}
          </Box>
        </Box>

        {/* Attachment Menu - Vertical list as per design */}
        <Popover
          open={Boolean(attachEl)}
          anchorEl={attachEl}
          onClose={()=>setAttachEl(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          PaperProps={{ 
            sx:{ 
              borderRadius: 2, 
              p: 1, 
              minWidth: 200,
              bgcolor: 'background.paper',
              boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.15)'
            } 
          }}
        >
          <List sx={{ p: 0 }}>
            {[
              { icon: <CameraAltRoundedIcon />, label: 'Camera', action: 'camera' },
              { icon: <DescriptionRoundedIcon />, label: 'Document', action: 'document' },
              { icon: <ImageRoundedIcon />, label: 'Photos & Videos', action: 'photos' },
              { icon: <LocationOnRoundedIcon />, label: 'Location', action: 'location' },
              { icon: <ContactsRoundedIcon />, label: 'Contact', action: 'contact' },
            ].map((item) => (
              <MenuItem
                key={item.action}
                onClick={()=>{
                  handleAttachOption(item.action);
                  setAttachEl(null);
                }}
                sx={{
                  py: 1.5,
                  px: 2,
                  gap: 2,
                  borderRadius: 1,
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: accentColor }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '14px',
                    color: 'text.primary'
                  }}
                />
              </MenuItem>
            ))}
          </List>
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
