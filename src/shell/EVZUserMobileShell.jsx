import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
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
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import BrushRoundedIcon from "@mui/icons-material/BrushRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import NotificationsPausedRoundedIcon from "@mui/icons-material/NotificationsPausedRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

/* -----------------------------------------------------------
   Helper component for missing routes
------------------------------------------------------------ */
const Screen = ({ title }) => (
  <Box className="p-4 space-y-3">
    <Typography variant="h6" className="font-semibold">{title}</Typography>
    <Box className="rounded-2xl p-4 bg-white shadow-sm"><Typography variant="body2">Placeholder content for {title}.</Typography></Box>
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
   Fixed mobile frame shell (maxWidth 390px)
------------------------------------------------------------ */
function ShellFrame({ children }){
  const navigate = useNavigate();
  const [menuEl, setMenuEl] = useState(null);
  const openMenu = (e) => setMenuEl(e.currentTarget);
  const closeMenu = () => setMenuEl(null);
  const go = (path) => { closeMenu(); navigate(path); };

  return (
    <Box sx={{ bgcolor: EV.light, minHeight:'100vh' }}>
      {/* Header (mobile frame) */}
      <AppBar elevation={0} position="fixed" sx={{ bgcolor: EV.green, color:'#fff' }}>
        <Toolbar className="!min-h-[56px]" sx={{ width:'100%', maxWidth:390, mx:'auto' }}>
          <Avatar onClick={()=>navigate('/profile')} sx={{ bgcolor:'#fff', color:EV.green, width: 32, height: 32, mr: 1, cursor:'pointer' }} title="Open profile">EV</Avatar>
          <Typography variant="subtitle1" className="font-semibold">EVzone Chat</Typography>
          <Box sx={{ flexGrow:1 }} />
          <IconButton size="small" sx={{ color:'#fff' }} aria-label="More" onClick={openMenu}><MoreHorizRoundedIcon/></IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile-sized 3-dots menu */}
      <Menu
        anchorEl={menuEl}
        open={Boolean(menuEl)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx:{ width: 360, maxWidth: 'calc(100vw - 16px)', borderRadius: 2, py: 0.5, mx: 'auto' } }}
      >
        {/* Global quick actions */}
        <MenuItem onClick={()=>go('/inbox')}>
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
        <MenuItem onClick={()=>{ closeMenu(); alert('Help center'); }}>
          <ListItemIcon><HelpOutlineRoundedIcon fontSize="small"/></ListItemIcon>
          <ListItemText primary="Help" />
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        {/* Account */}
        <MenuItem onClick={()=>go('/settings')}>
          <ListItemIcon><SettingsRoundedIcon fontSize="small"/></ListItemIcon>
          <ListItemText primary="Settings" />
        </MenuItem>
        <MenuItem onClick={()=>{ closeMenu(); alert('Signed out'); }}>
          <ListItemIcon><LogoutRoundedIcon fontSize="small"/></ListItemIcon>
          <ListItemText primary="Sign out" />
        </MenuItem>
      </Menu>

      {/* Content (mobile frame) */}
      <Box sx={{ pt:'56px', pb:'88px', width:'100%', maxWidth:390, mx:'auto', minHeight: 'calc(100vh - 144px)' }}>
        {children}
      </Box>

      {/* Bottom nav (mobile frame) */}
      <Box sx={{ position:'fixed', left:0, right:0, bottom:0, bgcolor:'transparent', pb:'env(safe-area-inset-bottom)' }}>
        <Box sx={{ width:'100%', maxWidth:390, mx:'auto', px: 2, pb: 1.5 }}>
          <Box sx={{ borderRadius: 14, bgcolor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}>
            <MobileBottomNav/>
          </Box>
        </Box>
      </Box>

      {/* Launcher — fixed to right edge of the mobile frame */}
      <Launcher unread={2}/>
    </Box>
  );
}

/* -----------------------------------------------------------
   Bottom Navigation (labels under icons)
------------------------------------------------------------ */
function MobileBottomNav(){
  const value = useTabFromLocation();
  const nav = useNavigate();
  return (
    <BottomNavigation
      value={value}
      onChange={(_, v)=>{ const map={ inbox:'/inbox', search:'/search', call:'/call', media:'/media', settings:'/settings' }; if(map[v]) nav(map[v]); }}
      showLabels
      sx={{ height:72, bgcolor:'transparent', '& .Mui-selected':{ color: EV.green }, '& .MuiBottomNavigationAction-root':{ minWidth:0, pt:1.5 }, '& .MuiSvgIcon-root':{ fontSize:22 }, '& .MuiBottomNavigationAction-label':{ fontSize:11, fontWeight:600 } }}
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
  return (
    <div className="fixed inset-x-0 z-50 flex justify-center" style={{ bottom: 96 }}>
      <div className="relative w-full max-w-[390px] px-4 pb-4">
        <button
          aria-label="Open chat"
          className="absolute right-0 bottom-0 h-14 w-14 rounded-full shadow-xl grid place-items-center"
          style={{ background: EV.orange, color:'#fff' }}
        >
          <span className="inline-block relative">
            <Badge color="error" badgeContent={unread} overlap="circular">
              {/* Chat bubble outline only (bigger) */}
              <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 40 }} />
            </Badge>
          </span>
        </button>
      </div>
    </div>
  );
}

/* -----------------------------------------------------------
   Component wrapper with navigation props
------------------------------------------------------------ */
function RouteWrapper({ Component, ...props }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Provide navigation props to components that need them
  const navProps = {
    onBack: () => navigate(-1),
    onClose: () => navigate(-1),
    onNavigate: navigate,
    location,
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
  const Media = getComponent(registry, 'U03-08', () => <Screen title="Media"/>);
  const Settings = getComponent(registry, 'U10-29', () => <Screen title="Settings"/>);
  const CreateChannel = getComponent(registry, 'U08-22', () => <Screen title="Create group / channel"/>);
  const Invite = getComponent(registry, 'U08-24', () => <Screen title="Scan QR / Invite link"/>);
  const Theme = getComponent(registry, 'U10-30', () => <Screen title="Theme"/>);
  const Language = getComponent(registry, 'U10-29', () => <Screen title="Language"/>);
  const DND = getComponent(registry, 'U09-27', () => <Screen title="Quiet hours / DND"/>);
  const Safety = getComponent(registry, 'U12-34', () => <Screen title="Safety Center"/>);
  const Profile = getComponent(registry, 'U09-25', () => <Screen title="Profile"/>);

  return (
    <BrowserRouter>
      <ShellFrame>
        <Routes>
          <Route path="/" element={<Navigate to="/inbox" replace/>} />
          <Route path="/inbox" element={<RouteWrapper Component={Inbox} />} />
          <Route path="/search" element={<RouteWrapper Component={Search} />} />
          <Route path="/call" element={<RouteWrapper Component={Call} />} />
          <Route path="/media" element={<RouteWrapper Component={Media} />} />
          <Route path="/settings" element={<RouteWrapper Component={Settings} />} />
          {/* Menu target routes */}
          <Route path="/create-channel" element={<RouteWrapper Component={CreateChannel} />} />
          <Route path="/invite" element={<RouteWrapper Component={Invite} />} />
          <Route path="/theme" element={<RouteWrapper Component={Theme} />} />
          <Route path="/language" element={<RouteWrapper Component={Language} />} />
          <Route path="/dnd" element={<RouteWrapper Component={DND} />} />
          <Route path="/safety" element={<RouteWrapper Component={Safety} />} />
          <Route path="/profile" element={<RouteWrapper Component={Profile} />} />
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
