import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useCall } from "../context/CallContext";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from "@mui/material";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import AddCommentRoundedIcon from "@mui/icons-material/AddCommentRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import CallEndRoundedIcon from "@mui/icons-material/CallEndRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import BrushRoundedIcon from "@mui/icons-material/BrushRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import NotificationsPausedRoundedIcon from "@mui/icons-material/NotificationsPausedRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

/* -----------------------------------------------------------
   Helper component for missing routes
------------------------------------------------------------ */
const Screen = ({ title }) => (
  <Box className="p-4 space-y-3">
    <Typography variant="h6" className="font-semibold">{title}</Typography>
    <Box className="rounded-2xl p-4 shadow-sm" sx={{ bgcolor: 'background.paper' }}><Typography variant="body2" sx={{ color: 'text.primary' }}>Placeholder content for {title}.</Typography></Box>
  </Box>
);

/* -----------------------------------------------------------
   Registry-based component resolver
------------------------------------------------------------ */
function getComponent(registry, id, fallback) {
  const Component = registry?.[id];
  if (Component) {
    return Component;
  }
  // Return fallback component
  return fallback || (() => <Screen title={id || 'Page'} />);
}

/* -----------------------------------------------------------
   Mobile-only utilities
------------------------------------------------------------ */
function useTabFromLocation(){
  const { pathname } = useLocation();
  if (pathname.startsWith('/search')) return 'search';
  if (pathname.startsWith('/call')) return 'call';
  if (pathname.startsWith('/media')) return 'media';
  if (pathname.startsWith('/settings')) return 'settings';
  return 'inbox';
}

/* -----------------------------------------------------------
   Responsive mobile shell - adapts to all mobile device sizes
------------------------------------------------------------ */
function ShellFrame({ children }){
  const navigate = useNavigate();
  const location = useLocation();
  const { actualMode, accent } = useTheme();
  const { activeCall, isInCall, endCall } = useCall();
  const [menuEl, setMenuEl] = useState(null);
  const openMenu = (e) => setMenuEl(e.currentTarget);
  const closeMenu = () => setMenuEl(null);
  const go = (path) => { closeMenu(); navigate(path); };
  
  // Check if we're on a conversation page
  const isConversationPage = location.pathname.startsWith('/conversation') || location.pathname.startsWith('/new-message');
  
  // Check if we're on the call page
  const isOnCallPage = location.pathname.startsWith('/call') && activeCall;
  
  const accentColor = accent === 'orange' ? EV.orange : accent === 'green' ? EV.green : EV.grey;
  
  // Calculate call duration
  const [callDuration, setCallDuration] = useState(0);
  useEffect(() => {
    if (activeCall && activeCall.startTime) {
      const interval = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - activeCall.startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCallDuration(0);
    }
  }, [activeCall]);
  
  // Apply dark mode class to body and update meta theme-color
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    
    if (actualMode === 'dark') {
      body.classList.add('dark-mode');
      html.style.colorScheme = 'dark';
    } else {
      body.classList.remove('dark-mode');
      html.style.colorScheme = 'light';
    }

    // Update meta theme-color for mobile browsers
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', actualMode === 'dark' ? '#121212' : accentColor);

    return () => {
      html.style.colorScheme = '';
    };
  }, [actualMode, accentColor]);

  return (
    <Box sx={{ 
      bgcolor: actualMode === 'dark' ? '#121212' : EV.light, 
      minHeight:'100vh',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      mx: 'auto',
      position: 'relative',
      transition: 'background-color 0.3s ease'
    }}>
      {/* Header (mobile frame) - always visible for consistent mobile experience */}
      <AppBar 
        elevation={0} 
        position="fixed" 
        sx={{ 
          bgcolor: accentColor, 
          color:'#fff',
          width: '100%',
          zIndex: 1200,
          transition: 'background-color 0.3s ease'
        }}
      >
        <Toolbar className="!min-h-[56px] !px-3" sx={{ width:'100%' }}>
          <Avatar 
            src="https://i.pravatar.cc/100?img=20"
            onClick={()=>navigate('/profile')} 
            sx={{ 
              bgcolor:'#fff', 
              color:EV.green, 
              width: '2rem', 
              height: '2rem', 
              mr: 1.5, 
              cursor:'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }} 
            title="Open profile"
          />
          <Typography variant="subtitle1" className="font-semibold" sx={{ fontSize: '16px', fontWeight: 600 }}>
            EVzone Chat
          </Typography>
          <Box sx={{ flexGrow:1 }} />
          <IconButton 
            size="small" 
            sx={{ color:'#fff' }} 
            aria-label="More" 
            onClick={openMenu}
          >
            <MoreHorizRoundedIcon/>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile-sized 3-dots menu */}
      <Menu
        anchorEl={menuEl}
        open={Boolean(menuEl)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ 
          sx:{ 
            width: '90vw', 
            maxWidth: 'calc(100vw - 1rem)', 
            borderRadius: 2, 
            py: 0.5, 
            mx: 'auto',
            bgcolor: 'background.paper',
            '& .MuiMenuItem-root': {
              color: 'text.primary',
            }
          } 
        }}
      >
        {/* Global quick actions */}
        <MenuItem onClick={()=>go('/new-message')}>
          <ListItemIcon><AddCommentRoundedIcon fontSize="small"/></ListItemIcon>
          <ListItemText primary="New message" />
        </MenuItem>
        <MenuItem onClick={()=>go('/create-channel')}>
          <ListItemIcon><GroupAddRoundedIcon fontSize="small"/></ListItemIcon>
          <ListItemText primary="Create group/channel" />
        </MenuItem>
        <MenuItem onClick={()=>go('/invite')}>
          <ListItemIcon><QrCode2RoundedIcon fontSize="small"/></ListItemIcon>
          <ListItemText primary="Scan QR / Invite link" />
        </MenuItem>
        <MenuItem onClick={()=>go('/call')}>
          <ListItemIcon><CallRoundedIcon fontSize="small"/></ListItemIcon>
          <ListItemText primary="Start call" />
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        {/* Personalization */}
        <MenuItem onClick={()=>go('/theme')}>
          <ListItemIcon><BrushRoundedIcon fontSize="small"/></ListItemIcon>
          <ListItemText primary="Theme" secondary="Light · Dark · System" />
        </MenuItem>
        <MenuItem onClick={()=>go('/language')}>
          <ListItemIcon><TranslateRoundedIcon fontSize="small"/></ListItemIcon>
          <ListItemText primary="Language" />
        </MenuItem>
        <MenuItem onClick={()=>go('/dnd')}>
          <ListItemIcon><NotificationsPausedRoundedIcon fontSize="small"/></ListItemIcon>
          <ListItemText primary="Quiet hours / DND" />
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        {/* Help & safety */}
        <MenuItem onClick={()=>go('/safety')}>
          <ListItemIcon><ShieldRoundedIcon fontSize="small"/></ListItemIcon>
          <ListItemText primary="Safety Center" />
        </MenuItem>
        <MenuItem onClick={()=>go('/help')}>
          <ListItemIcon><HelpOutlineRoundedIcon fontSize="small"/></ListItemIcon>
          <ListItemText primary="Help" />
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        {/* Account */}
        <MenuItem onClick={()=>go('/settings')}>
          <ListItemIcon><SettingsRoundedIcon fontSize="small"/></ListItemIcon>
          <ListItemText primary="Settings" />
        </MenuItem>
        <MenuItem onClick={()=>go('/security')}>
          <ListItemIcon><SecurityRoundedIcon fontSize="small"/></ListItemIcon>
          <ListItemText primary="Security" />
        </MenuItem>
        <MenuItem onClick={()=>{ closeMenu(); alert('Signed out'); }}>
          <ListItemIcon><LogoutRoundedIcon fontSize="small"/></ListItemIcon>
          <ListItemText primary="Sign out" />
        </MenuItem>
      </Menu>

      {/* Content (mobile frame) - always has padding for header and bottom nav */}
      <Box sx={{ 
        pt: '56px', 
        pb: '88px', 
        width:'100%', 
        minHeight: 'calc(100vh - 144px)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: actualMode === 'dark' ? '#121212' : 'transparent',
        transition: 'background-color 0.3s ease'
      }}>
        {children}
      </Box>

      {/* Bottom nav (mobile frame) - always visible for consistent mobile navigation */}
        <Box sx={{ 
          position:'fixed', 
          left:0, 
          right:0, 
          bottom:0, 
          bgcolor:'transparent', 
          pb:'env(safe-area-inset-bottom)',
          zIndex: 1100,
          display: 'flex',
          justifyContent: 'center'
        }}>
        <Box sx={{ 
          width:'100%', 
          px: 2, 
          pb: 1.5 
        }}>
          <Box sx={{ 
            borderRadius: 16, 
            bgcolor: actualMode === 'dark' ? 'rgba(18,18,18,0.95)' : 'rgba(255,255,255,0.95)', 
            backdropFilter: 'blur(12px)', 
            border: actualMode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)', 
            boxShadow: actualMode === 'dark' ? '0 -4px 20px rgba(0,0,0,0.5)' : '0 -4px 20px rgba(0,0,0,0.08)'
          }}>
            <MobileBottomNav/>
          </Box>
        </Box>
      </Box>

      {/* Launcher — fixed to right edge of the mobile frame (hidden on conversation pages) */}
      {!isConversationPage && <Launcher unread={2}/>}

      {/* Persistent Call Banner - WhatsApp style (shown when call is active and user navigates away) */}
      {isInCall && !isOnCallPage && activeCall && (
        <CallBanner 
          call={activeCall} 
          duration={callDuration}
          onTap={() => navigate(`/call?type=${activeCall.type}&contact=${encodeURIComponent(activeCall.contact)}&state=${activeCall.state}`)}
          onEnd={() => {
            endCall();
            // Don't navigate away, just end the call
          }}
        />
      )}
    </Box>
  );
}

/* -----------------------------------------------------------
Bottom Navigation (labels under icons)
------------------------------------------------------------ */
function MobileBottomNav(){
  const value = useTabFromLocation();
  const nav = useNavigate();
  const { accentColor } = useTheme();
  const muiTheme = useMuiTheme();
  
  return (
    <BottomNavigation
      value={value}
      onChange={(_, v)=>{ const map={ inbox:'/inbox', search:'/search', call:'/call', media:'/media', settings:'/settings' }; if(map[v]) nav(map[v]); }}
      showLabels
      sx={{ 
        height: '4.5rem', 
        bgcolor:'transparent', 
        '& .Mui-selected':{ 
          color: accentColor,
          '& .MuiSvgIcon-root': {
            transform: 'scale(1.1)'
          },
          '& .MuiBottomNavigationAction-label': {
            color: accentColor
          }
        }, 
        '& .MuiBottomNavigationAction-root':{ 
          minWidth: 0, 
          pt: 1.5,
          transition: 'all 0.2s ease',
          color: muiTheme.palette.text.secondary
        }, 
        '& .MuiSvgIcon-root':{ 
          fontSize: 24,
          transition: 'transform 0.2s ease'
        }, 
        '& .MuiBottomNavigationAction-label':{ 
          fontSize: 11, 
          fontWeight: 600,
          mt: 0.5,
          color: muiTheme.palette.text.secondary
        } 
      }}
    >
      <BottomNavigationAction value="inbox" label="Inbox" icon={<ChatBubbleOutlineRoundedIcon/>} />
      <BottomNavigationAction value="search" label="Search" icon={<SearchRoundedIcon/>} />
      <BottomNavigationAction value="call" label="Calls" icon={<PhoneRoundedIcon/>} />
      <BottomNavigationAction value="media" label="Media" icon={<ImageRoundedIcon/>} />
      <BottomNavigationAction value="settings" label="Settings" icon={<SettingsRoundedIcon/>} />
    </BottomNavigation>
  );
}

/* -----------------------------------------------------------
   Floating Launcher — centered to mobile frame then right-aligned
------------------------------------------------------------ */
function Launcher({ unread=0 }){
  const navigate = useNavigate();
  const { accentColor } = useTheme();
  
  // Calculate hover color based on accent
  const hoverColor = accentColor === EV.green ? '#02b37b' : accentColor === EV.orange ? '#e06f00' : '#8f8f8f';
  const shadowColor = accentColor === EV.green ? 'rgba(3, 205, 140, 0.4)' : accentColor === EV.orange ? 'rgba(247, 127, 0, 0.4)' : 'rgba(166, 166, 166, 0.4)';
  const shadowColorHover = accentColor === EV.green ? 'rgba(3, 205, 140, 0.5)' : accentColor === EV.orange ? 'rgba(247, 127, 0, 0.5)' : 'rgba(166, 166, 166, 0.5)';
  
  return (
    <Box sx={{
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 96,
      display: 'flex',
      justifyContent: 'center',
      zIndex: 1000,
      pointerEvents: 'none'
    }}>
        <Box sx={{
          position: 'relative',
          width: '100%',
          px: 2,
          pb: 1
        }}>
        <IconButton
          aria-label="New message"
          onClick={() => navigate('/new-message')}
          sx={{
            position: 'absolute',
            right: '1rem',
            bottom: 0,
            width: '3.5rem',
            height: '3.5rem',
            bgcolor: accentColor,
            color: '#fff',
            boxShadow: `0 4px 16px ${shadowColor}`,
            '&:hover': {
              bgcolor: hoverColor,
              boxShadow: `0 6px 20px ${shadowColorHover}`,
              transform: 'scale(1.05)'
            },
            transition: 'all 0.2s ease',
            pointerEvents: 'auto'
          }}
        >
          <Badge color="error" badgeContent={unread} overlap="circular">
            <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 28, position: 'relative' }} />
            <AddRoundedIcon sx={{ 
              fontSize: 16, 
              position: 'absolute', 
              bottom: '0.25rem', 
              right: '0.25rem', 
              bgcolor: EV.green, 
              borderRadius: '50%', 
              p: 0.25,
              border: '2px solid #fff'
            }} />
          </Badge>
        </IconButton>
      </Box>
    </Box>
  );
}

/* -----------------------------------------------------------
   Persistent Call Banner (WhatsApp style)
------------------------------------------------------------ */
function CallBanner({ call, duration, onTap, onEnd }) {
  const muiTheme = useMuiTheme();
  const { actualMode } = useTheme();
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getStatusText = () => {
    switch(call.state) {
      case 'dialing': return 'Dialing...';
      case 'ringing': return 'Ringing...';
      case 'connecting': return 'Connecting...';
      case 'connected': return call.type === 'video' ? `Video • ${formatDuration(duration)}` : `Voice • ${formatDuration(duration)}`;
      default: return 'Calling...';
    }
  };

  return (
    <Box
      onClick={onTap}
      sx={{
        position: 'fixed',
        top: '3.5rem', // Below main header
        left: 0,
        right: 0,
        zIndex: 1200,
        bgcolor: actualMode === 'dark' ? 'rgba(18,18,18,0.95)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${muiTheme.palette.divider}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, gap: 2 }}>
        <Avatar src={call.avatar} sx={{ width: '2.5rem', height: '2.5rem' }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.875rem' }}>
            {call.contact}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
            {call.type === 'video' ? (
              <VideocamRoundedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            ) : (
              <CallRoundedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            )}
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
              {getStatusText()}
            </Typography>
          </Box>
        </Box>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            // Just end the call, don't navigate away
            onEnd();
          }}
          sx={{
            bgcolor: '#e53935',
            color: '#fff',
            '&:hover': { bgcolor: '#c62828' },
            width: '2rem',
            height: '2rem'
          }}
        >
          <CallEndRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
    </Box>
  );
}

/* -----------------------------------------------------------
   Component wrapper with navigation props
------------------------------------------------------------ */
function RouteWrapper({ Component, ...props }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { endCall } = useCall();
  
  // Provide comprehensive navigation props to components that need them
  const navProps = {
    onBack: () => navigate(-1),
    onClose: () => navigate(-1),
    onNavigate: navigate,
    onEnd: () => {
      endCall();
      navigate(-1);
    },
    location,
    // Navigation handlers for common actions
    onOpen: (item) => {
      // Navigate to conversation or detail view
      if (item?.id) {
        // Include module in URL if available
        const moduleParam = item?.module ? `?module=${encodeURIComponent(item.module)}` : '';
        navigate(`/conversation/${item.id}${moduleParam}`);
      }
    },
    onNew: () => navigate('/new-message'),
    onRefresh: () => {
      // Could trigger a refresh action, for now just log
      console.log('Refresh triggered');
    },
    onLiveOpen: (live) => {
      // Navigate to video call for live session (not chat - live sessions are video-based)
      if (live?.host) {
        // Open video call with the host - live sessions are video calls, not messages
        navigate(`/call?type=video&contact=${encodeURIComponent(live.host)}&state=connecting&live=${live.id}&module=${live.module || 'School'}`);
      } else if (live?.id) {
        // Fallback: navigate to video call with session ID
        navigate(`/call?type=video&state=connecting&live=${live.id}`);
      }
    },
    onModuleChange: (module) => {
      // Handle module filter change
      console.log('Module changed to:', module);
    },
    onStart: (selected, forwardMessages) => {
      // Start new conversation with selected contacts
      if (selected && selected.length > 0) {
        const forwardParam = forwardMessages ? `&forward=${forwardMessages.join(',')}` : '';
        // If multiple contacts, automatically open as group chat
        if (selected.length > 1) {
          navigate(`/conversation/new?contacts=${selected.join(',')}&group=true${forwardParam}`);
        } else {
          navigate(`/conversation/new?contacts=${selected.join(',')}${forwardParam}`);
        }
      }
    },
  };
  
  if (!Component) return <Screen title="Page not found" />;
  
  // Check if component accepts these props by trying to render with them
  return <Component {...navProps} {...props} />;
}

export default function MobileUserShell({ registry = {} }){
  // Get components from registry
  const Inbox = getComponent(registry, 'U01-03', () => <Screen title="Messages"/>);
  const Search = getComponent(registry, 'U03-09', () => <Screen title="Search"/>);
  const Call = getComponent(registry, 'U04-10', () => <Screen title="Calls"/>);
  const GroupCallParticipants = getComponent(registry, 'U04-11', () => <Screen title="Group Call Participants"/>);
  const Media = getComponent(registry, 'U03-08', () => <Screen title="Media"/>);
  const Settings = getComponent(registry, 'U10-29', () => <Screen title="Settings"/>);
  const Security = getComponent(registry, 'U10-28', () => <Screen title="Security"/>);
  const CreateChannel = getComponent(registry, 'U08-22', () => <Screen title="Create group / channel"/>);
  const Invite = getComponent(registry, 'U08-24', () => <Screen title="Scan QR / Invite link"/>);
  const Theme = getComponent(registry, 'U10-30', () => <Screen title="Theme"/>);
  const Language = getComponent(registry, 'U10-29', () => <Screen title="Language"/>);
  const DND = getComponent(registry, 'U09-27', () => <Screen title="Quiet hours / DND"/>);
  const Safety = getComponent(registry, 'U12-34', () => <Screen title="Safety Center"/>);
  const Profile = getComponent(registry, 'U09-25', () => <Screen title="Profile"/>);
  const NewMessage = getComponent(registry, 'U02-04', () => <Screen title="New Message"/>);
  const Conversation = getComponent(registry, 'U02-05', () => <Screen title="Conversation"/>);
  const Help = getComponent(registry, 'U12-34', () => <Screen title="Help Center"/>);

  return (
    <BrowserRouter>
      <ShellFrame>
        <Routes>
          <Route path="/" element={<Navigate to="/inbox" replace/>} />
          <Route path="/inbox" element={<RouteWrapper Component={Inbox} />} />
          <Route path="/search" element={<RouteWrapper Component={Search} />} />
          <Route path="/call" element={<RouteWrapper Component={Call} />} />
          <Route path="/group-call" element={<RouteWrapper Component={GroupCallParticipants} />} />
          <Route path="/call/participants" element={<RouteWrapper Component={GroupCallParticipants} />} />
          <Route path="/media" element={<RouteWrapper Component={Media} />} />
          <Route path="/settings" element={<RouteWrapper Component={Settings} />} />
          <Route path="/security" element={<RouteWrapper Component={Security} />} />
          {/* Menu target routes */}
          <Route path="/create-channel" element={<RouteWrapper Component={CreateChannel} />} />
          <Route path="/invite" element={<RouteWrapper Component={Invite} />} />
          <Route path="/theme" element={<RouteWrapper Component={Theme} />} />
          <Route path="/language" element={<RouteWrapper Component={Language} />} />
          <Route path="/dnd" element={<RouteWrapper Component={DND} />} />
          <Route path="/safety" element={<RouteWrapper Component={Safety} />} />
          <Route path="/profile" element={<RouteWrapper Component={Profile} />} />
          <Route path="/help" element={<RouteWrapper Component={Help} />} />
          {/* Conversation routes */}
          <Route path="/new-message" element={<RouteWrapper Component={NewMessage} />} />
          <Route path="/conversation/:id" element={<RouteWrapper Component={Conversation} />} />
          <Route path="/conversation/new" element={<RouteWrapper Component={Conversation} />} />
        </Routes>
      </ShellFrame>
    </BrowserRouter>
  );
}

/*
  ===== Basic tests (React Testing Library) — copy to MobileUserShell.test.jsx =====

  import React from 'react';
  import { render, screen } from '@testing-library/react';
  import MobileUserShell from './MobileUserShell';

  test('renders header title', () => {
    render(<MobileUserShell />);
    expect(screen.getByText(/EVzone Chat/i)).toBeInTheDocument();
  });

  test('defaults to inbox route', () => {
    render(<MobileUserShell />);
    expect(screen.getByText(/Messages/i)).toBeInTheDocument();
  });
*/
