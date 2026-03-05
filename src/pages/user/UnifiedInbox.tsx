import React from 'react';
import { useMemo, useRef, useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Badge,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Paper,
  Tabs,
  Tab,
  Button,
  Chip,
  Menu,
  MenuItem
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import NotificationsOffRoundedIcon from "@mui/icons-material/NotificationsOffRounded";
import ListItemIcon from "@mui/material/ListItemIcon";
import PromoRingAvatar from "../../components/PromoRingAvatar";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import PlayCircleFilledWhiteRoundedIcon from "@mui/icons-material/PlayCircleFilledWhiteRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

// Empty demo data for testing the new user experience
const DEMO = [];

const LIVE_DEMO = [
  { id: 'ride_123', module: 'Rides', title: 'Kampala â†’ Entebbe', subtitle: 'ETA 22 min', host: 'John Driver', startedAt: '7m', cta: 'Resume' },
  { id: 'lesson_45', module: 'School', title: 'Mathematics', subtitle: "Newton's Laws of Motion", host: 'Leslie Alexander', startedAt: '12m', cta: 'Join' },
  { id: 'tour_88', module: 'Travel', title: 'Evening Old Town Tour', subtitle: 'Live Q&A ongoing', host: 'Ada Guide', startedAt: '3m', cta: 'Join' },
];

// Notification Icon Button with Mute Menu
function NotificationIconButton() {
  const navigate = useNavigate();
  const [menuEl, setMenuEl] = useState(null);
  const [muted, setMuted] = useState(false);

  const handleClick = (e) => {
    setMenuEl(e.currentTarget);
  };

  const handleClose = () => {
    setMenuEl(null);
  };

  const handleMute = () => {
    setMuted(!muted);
    alert(muted ? 'Notifications enabled' : 'Notifications muted');
    handleClose();
  };

  return (
    <>
      <IconButton
        aria-label="Notifications"
        onClick={handleClick}
        sx={{ color: '#fff', padding: { xs: '6px', sm: '8px' } }}
      >
        <Badge
          variant="dot"
          sx={{
            '& .MuiBadge-dot': {
              backgroundColor: '#ff4444',
              width: 8,
              height: 8,
              right: 4,
              top: 4,
              display: muted ? 'none' : 'block' // Hide badge when muted
            }
          }}
        >
          {muted ? <NotificationsOffRoundedIcon /> : <NotificationsRoundedIcon />}
        </Badge>
      </IconButton>
      <Menu
        anchorEl={menuEl}
        open={Boolean(menuEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
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
        <MenuItem onClick={handleMute}>
          <ListItemIcon><NotificationsOffRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary={muted ? "Unmute notifications" : "Mute notifications"} />
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); navigate('/dnd'); }}>
          <ListItemIcon><NotificationsRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Notification settings" />
        </MenuItem>
      </Menu>
    </>
  );
}

import AddRoundedIcon from "@mui/icons-material/AddRounded";

/**
 * U01-03 Unified Inbox - Messages List
 * Design Structure (from PowerPoint):
 * 1. Top Header (Theme Color): Back arrow, "Inbox" title, Notification bell
 * 2. Live Ongoing Section (Dark Grey): Shows active session card
 * 3. Message Drawer (White Rounded Panel): Contains Messages title, icons, tabs, and chat list
 */
export default function UnifiedInbox({ items = DEMO, lives = LIVE_DEMO, onOpen, onRefresh, onNew, onLiveOpen, onModuleChange, onBack }) {
  const { accent, isDark } = useTheme();
  const muiTheme = useMuiTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState(0); // 0 = E-Commerce, 1 = Other
  const [selectedModule, setSelectedModule] = useState('E-Commerce');
  const [moduleMenuEl, setModuleMenuEl] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef(null);
  const [draftRefresh, setDraftRefresh] = useState(0); // Force re-render to check drafts
  const [ringMenuEl, setRingMenuEl] = useState(null);
  const [ringMenuEntity, setRingMenuEntity] = useState(null);

  // Refresh drafts when location changes (when navigating back from chat)
  useEffect(() => {
    // Small delay to ensure localStorage is updated after navigation
    const timer = setTimeout(() => {
      setDraftRefresh(prev => prev + 1);
    }, 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Get theme accent color
  const accentColor = accent === 'orange' ? EV.orange : accent === 'green' ? EV.green : EV.grey;

  // Ring menu handlers
  const handleRingClick = (e, entity) => {
    e.stopPropagation();
    if (!entity.promos || entity.promos.length === 0) return;
    setRingMenuEntity(entity);
    setRingMenuEl(e.currentTarget);
  };

  const handleRingMenuClose = () => {
    setRingMenuEl(null);
    setRingMenuEntity(null);
  };

  const handleViewPromos = () => {
    if (ringMenuEntity) {
      navigate('/dealz');
    }
    handleRingMenuClose();
  };

  const handleJoinPromo = () => {
    if (ringMenuEntity) {
      const activePromo = ringMenuEntity.promos.find((p) => !p.seen && p.type === "live");
      if (activePromo) {
        navigate('/dealz');
      } else {
        navigate('/dealz');
      }
    }
    handleRingMenuClose();
  };

  // Calculate total unread count
  const totalUnread = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.unread || 0), 0);
  }, [items]);

  // Available modules
  const MODULES = ['E-Commerce', 'EV Charging', 'Rides & Logistics', 'School & E-Learning', 'Medical & Health Care', 'Travel & Tourism', 'Green Investments', 'Faith Hub', 'Social Networking', 'Virtual Workspace', 'Wallet & Payments', 'AI Chatbot'];

  // Get drafts for all conversations - reactive to draftRefresh and location changes
  const drafts = useMemo(() => {
    const draftMap = {};
    items.forEach((item) => {
      try {
        const draftKey = `chat-draft-${item.id}`;
        const draftText = localStorage.getItem(draftKey);
        if (draftText && draftText.trim()) {
          draftMap[item.id] = draftText;
        }
      } catch (e) {
        // Ignore localStorage errors
      }
    });
    return draftMap;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, draftRefresh, location.pathname]);

  // filter logic - filter by tab (E-Commerce = selected module, Other = everything else)
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter((it) => {
      const matchQ = !s || [it.name, it.module, it.last].join(" ").toLowerCase().includes(s);
      // Tab 0 = Selected module (E-Commerce by default), Tab 1 = Other (everything except selected module)
      const matchTab = tab === 0 ? it.module === selectedModule : it.module !== selectedModule;
      return matchQ && matchTab;
    });
  }, [q, items, tab, selectedModule]);


  return (
    <>
      {/* Hide scrollbars globally for this component */}
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box sx={{
        width: '100%',
        mx: 'auto',
        bgcolor: 'transparent',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* 1. Top Header - Centered Title */}
        <AppBar
          elevation={0}
          position="static"
          sx={{
            bgcolor: accentColor,
            color: '#fff',
            boxShadow: 'none'
          }}
        >
          <Toolbar className="!min-h-[56px]" sx={{ px: { xs: 1.5, sm: 3 }, justifyContent: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '16px', sm: '18px' },
                fontWeight: 700,
                color: '#fff',
                textAlign: 'center'
              }}
            >
              Inbox
            </Typography>
          </Toolbar>
        </AppBar>



        {/* 3. Message Drawer (White Rounded Panel) - Flush Layout */}
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            bgcolor: 'transparent',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 0
          }}
        >
          {/* Drawer Header - Only show if there are actual items or user is searching */}
          {(items.length > 0 || q.length > 0) && (
            <Box sx={{ px: 2, pt: 2, pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: 'text.primary'
                    }}
                  >
                    Messages
                  </Typography>
                  {totalUnread > 0 && (
                    <Badge
                      badgeContent={totalUnread}
                      sx={{
                        '& .MuiBadge-badge': {
                          backgroundColor: accentColor,
                          color: '#fff',
                          fontSize: '11px',
                          minWidth: '20px',
                          height: '20px',
                          padding: '0 6px'
                        }
                      }}
                    />
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                  <IconButton
                    aria-label="Refresh"
                    onClick={onRefresh}
                    size="small"
                    sx={{ color: 'text.secondary' }}
                  >
                    <RefreshRoundedIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    aria-label="Search"
                    onClick={() => {
                      setShowSearch(!showSearch);
                      if (!showSearch) {
                        setTimeout(() => searchInputRef.current?.focus(), 100);
                      } else {
                        setQ('');
                      }
                    }}
                    size="small"
                    sx={{ color: showSearch ? accentColor : 'text.secondary' }}
                  >
                    <SearchRoundedIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              {/* Tabs: E-Commerce and Other - Inside Drawer */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tabs
                  value={tab}
                  onChange={(e, v) => {
                    if (v === 1) {
                      // When clicking "Other" tab, switch to it AND show module selection menu
                      setTab(1);
                      setModuleMenuEl(e.currentTarget);
                    } else {
                      setTab(v);
                    }
                  }}
                  textColor="inherit"
                  TabIndicatorProps={{
                    style: { background: accentColor }
                  }}
                  sx={{
                    minHeight: 40,
                    flex: 1,
                    '& .MuiTab-root': {
                      color: 'text.secondary',
                      fontWeight: 500,
                      textTransform: 'none',
                      fontSize: '14px',
                      minHeight: 40,
                      px: 2,
                      '&.Mui-selected': {
                        color: accentColor,
                        fontWeight: 600
                      }
                    }
                  }}
                >
                  <Tab label={selectedModule} onClick={(e) => {
                    if (tab === 0) {
                      e.stopPropagation();
                      setModuleMenuEl(e.currentTarget);
                    }
                  }} />
                  <Tab label="Other" />
                </Tabs>
              </Box>

              {/* Module Selection Menu */}
              <Menu
                anchorEl={moduleMenuEl}
                open={Boolean(moduleMenuEl)}
                onClose={() => setModuleMenuEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                PaperProps={{
                  sx: {
                    width: '90vw',
                    maxWidth: 'calc(100vw - 1rem)',
                    borderRadius: 2,
                    py: 0.5,
                    bgcolor: 'transparent',
                    '& .MuiMenuItem-root': {
                      color: 'text.primary',
                    }
                  }
                }}
              >
                {MODULES.filter(m => m !== selectedModule).map((module) => (
                  <MenuItem
                    key={module}
                    onClick={() => {
                      // When selecting a new module from "Other" menu:
                      // 1. The selected module becomes the new active tab
                      // 2. Switch to tab 0 to show the selected module's conversations
                      setSelectedModule(module);
                      setTab(0); // Switch to the first tab (selected module tab)
                      setModuleMenuEl(null);
                    }}
                  >
                    {module}
                  </MenuItem>
                ))}
                {/* Option to view "Other" tab (all conversations not matching selected module) */}
                <MenuItem
                  onClick={() => {
                    // Switch to "Other" tab to show all conversations except selected module
                    setTab(1);
                    setModuleMenuEl(null);
                  }}
                >
                  View All Other Conversations
                </MenuItem>
              </Menu>
            </Box>
          )}

          {/* Search - shown when search icon is clicked - Inside Drawer */}
          {showSearch && (
            <Box sx={{ px: 2, pb: 1.5 }}>
              <TextField
                inputRef={searchInputRef}
                fullWidth
                size="small"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search people, channels, messages"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'background.default',
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: 'action.hover'
                    },
                    '&.Mui-focused': {
                      bgcolor: 'background.paper',
                      boxShadow: `0 0 0 2px ${accentColor}33`
                    },
                    '& .MuiInputBase-input': {
                      color: 'text.primary',
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'text.secondary',
                      opacity: 1,
                    },
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  )
                }}
              />
            </Box>
          )}

          {/* Conversation list - Inside Drawer */}
          <Box className="flex-1" sx={{ overflowY: 'auto', '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <List>
              {filtered.map((c, idx) => (
                <React.Fragment key={c.id}>
                  <ListItem button onClick={() => onOpen?.(c)} alignItems="flex-start">
                    <ListItemAvatar>
                      <Badge
                        invisible={!c.unread}
                        badgeContent={c.unread}
                        overlap="circular"
                        sx={{
                          '& .MuiBadge-badge': {
                            backgroundColor: accentColor,
                            color: '#fff'
                          }
                        }}
                      >
                        <PromoRingAvatar
                          entity={c}
                          accentColor={accentColor}
                          onClick={(e) => handleRingClick(e, c)}
                          size={40}
                        />
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: 'text.primary',
                              fontSize: '15px',
                              flex: 1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {c.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              fontSize: '12px',
                              flexShrink: 0,
                              ml: 1
                            }}
                          >
                            {c.time}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                          {c.typing ? (
                            <Typography
                              variant="caption"
                              sx={{
                                color: accentColor,
                                fontSize: '12px',
                                fontWeight: 500
                              }}
                            >
                              {c.name} typingâ€¦
                            </Typography>
                          ) : (() => {
                            // Check for draft message from the drafts map
                            const draftText = drafts[c.id];

                            if (draftText && draftText.trim()) {
                              return (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: accentColor,
                                    fontSize: '12px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    flex: 1,
                                    fontStyle: 'italic'
                                  }}
                                >
                                  Draft: {draftText.length > 30 ? draftText.substring(0, 30) + '...' : draftText}
                                </Typography>
                              );
                            }

                            return (
                              <Typography
                                variant="caption"
                                sx={{
                                  color: 'text.secondary',
                                  fontSize: '12px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  flex: 1
                                }}
                              >
                                {c.last}
                              </Typography>
                            );
                          })()}
                        </Box>
                      }
                      sx={{ m: 0 }}
                    />
                  </ListItem>
                  {idx < filtered.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}

              {/* Empty States */}
              {filtered.length === 0 && q.trim().length > 0 && (
                <Box className="px-4 py-10 text-center" sx={{ color: 'text.secondary' }}>
                  No conversations match your search.
                </Box>
              )}

              {items.length === 0 && q.trim().length === 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 4,
                    py: { xs: 12, sm: 16 }, // Add plenty of padding specifically on top/bottom to center it in the remaining viewport
                    textAlign: 'center',
                    height: '100%',
                    flex: 1
                  }}
                >
                  <Box
                    sx={{
                      fontSize: '64px',
                      mb: 2,
                      filter: isDark ? `drop-shadow(0 0 20px ${accentColor}40)` : `drop-shadow(0 8px 16px ${accentColor}30)`,
                      animation: 'float 3s ease-in-out infinite'
                    }}
                  >
                    ðŸ”¥
                  </Box>
                  <style>{`
                  @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                  }
                `}</style>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      color: 'text.primary',
                      fontSize: '22px'
                    }}
                  >
                    Welcome to Chat!
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      mb: 4,
                      maxWidth: '80%',
                      lineHeight: 1.5
                    }}
                  >
                    Feel free to start a new conversation by tapping the button below.
                  </Typography>
                  <Button
                    onClick={onNew}
                    startIcon={<AddRoundedIcon />}
                    sx={{
                      bgcolor: accentColor,
                      color: '#fff',
                      fontWeight: 700,
                      borderRadius: '24px',
                      textTransform: 'none',
                      px: 4,
                      py: 1.25,
                      fontSize: '15px',
                      boxShadow: isDark ? `0 4px 12px ${accentColor}40` : `0 4px 12px ${accentColor}30`,
                      '&:hover': {
                        bgcolor: isDark ? `${accentColor}dd` : `${accentColor}dd`,
                        transform: 'translateY(-1px)'
                      },
                      '&:active': {
                        transform: 'translateY(1px)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Start New Chat
                  </Button>
                </Box>
              )}
            </List>
          </Box>
        </Paper>
      </Box>

      {/* Ring Menu - Pull-up menu for promo rings */}
      <Menu
        anchorEl={ringMenuEl}
        open={Boolean(ringMenuEl)}
        onClose={handleRingMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        PaperProps={{
          sx: {
            width: '90vw',
            maxWidth: 300,
            borderRadius: 3,
            py: 0.5,
            bgcolor: 'background.paper',
            '& .MuiMenuItem-root': {
              color: 'text.primary',
            }
          }
        }}
      >
        {ringMenuEntity && (
          <>
            <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${muiTheme.palette.divider}` }}>
              <Typography variant="subtitle2" className="font-semibold" sx={{ color: 'text.primary' }}>
                {ringMenuEntity.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {ringMenuEntity.promos.filter((p) => !p.seen).length} active promo{ringMenuEntity.promos.filter((p) => !p.seen).length !== 1 ? 's' : ''}
              </Typography>
            </Box>
            {ringMenuEntity.promos.some((p) => !p.seen && p.type === "live") && (
              <MenuItem onClick={handleJoinPromo}>
                <ListItemIcon><PlayCircleFilledWhiteRoundedIcon fontSize="small" sx={{ color: accentColor }} /></ListItemIcon>
                <ListItemText primary="Join live session" />
              </MenuItem>
            )}
            <MenuItem onClick={handleViewPromos}>
              <ListItemIcon><VisibilityRoundedIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="View all promos" />
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
}
