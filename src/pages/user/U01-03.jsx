import React, { useMemo, useRef, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
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

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

// demo data - matching design
const DEMO = [
  { id: 'c1', name: 'Etty Duke', avatar: 'https://i.pravatar.cc/100?img=1', module: 'Rides', last: 'I am near the pickup now', time: '09:30 PM', unread: 0, typing: true },
  { id: 'c2', name: 'Zev Sharp', avatar: 'https://i.pravatar.cc/100?img=2', module: 'Rides', last: 'Thanks for the ride', time: '10:30 AM', unread: 2, typing: false },
  { id: 'c3', name: 'EVrides', avatar: 'https://i.pravatar.cc/100?img=3', module: 'Rides', last: 'Your ride has been confirmed', time: 'Yesterday', unread: 1, typing: false },
  { id: 'c4', name: 'Zalmen Knox', avatar: 'https://i.pravatar.cc/100?img=4', module: 'Rides', last: 'On my way', time: 'Monday', unread: 0, typing: false },
  { id: 'c5', name: 'Benjamin Peck', avatar: 'https://i.pravatar.cc/100?img=6', module: 'Rides', last: 'See you soon', time: 'June 20', unread: 0, typing: false },
  { id: 'c6', name: 'Bessie Cooper', avatar: 'https://i.pravatar.cc/100?img=7', module: 'Other', last: 'Meeting scheduled', time: 'June 14', unread: 0, typing: false },
  { id: 'c7', name: 'Guy Hawkins', avatar: 'https://i.pravatar.cc/100?img=9', module: 'Other', last: 'Payment received', time: 'May 07', unread: 0, typing: false },
  { id: 'c8', name: 'Leslie Alexander', avatar: 'https://i.pravatar.cc/100?img=5', module: 'Other', last: "Newton's laws PDF attached", time: 'Yesterday', unread: 0, typing: false },
];

const LIVE_DEMO = [
  { id: 'ride_123', module: 'Rides', title: 'Kampala → Entebbe', subtitle: 'ETA 22 min', host: 'John Driver', startedAt: '7m', cta: 'Resume' },
  { id: 'lesson_45', module: 'School', title: 'Mathematics', subtitle: "Newton's Laws of Motion", host: 'Leslie Alexander', startedAt: '12m', cta: 'Join' },
  { id: 'tour_88', module: 'Travel', title: 'Evening Old Town Tour', subtitle: 'Live Q&A ongoing', host: 'Ada Guide', startedAt: '3m', cta: 'Join' },
];

/**
 * U01-03 Unified Inbox - Messages List
 * Design Structure (from PowerPoint):
 * 1. Top Header (Theme Color): Back arrow, "Inbox" title, Notification bell
 * 2. Live Ongoing Section (Dark Grey): Shows active session card
 * 3. Message Drawer (White Rounded Panel): Contains Messages title, icons, tabs, and chat list
 */
export default function UnifiedInbox({ items = DEMO, lives = LIVE_DEMO, onOpen, onRefresh, onNew, onLiveOpen, onModuleChange, onBack }) {
  const { accent, isDark } = useTheme();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState(0); // 0 = E-Commerce, 1 = Other
  const [selectedModule, setSelectedModule] = useState('E-Commerce');
  const [moduleMenuEl, setModuleMenuEl] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef(null);
  
  // Get theme accent color
  const accentColor = accent === 'orange' ? EV.orange : accent === 'green' ? EV.green : EV.grey;

  // Calculate total unread count
  const totalUnread = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.unread || 0), 0);
  }, [items]);

  // Available modules
  const MODULES = ['E-Commerce', 'EV Charging', 'Rides & Logistics', 'School & E-Learning', 'Medical & Health Care', 'Travel & Tourism', 'Green Investments', 'Faith Hub', 'Social Networking', 'Virtual Workspace', 'Wallet & Payments', 'AI Chatbot'];
  
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
        bgcolor: 'background.default', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* 1. Top Header - Parent Section (Theme Color Background) */}
        <AppBar 
          elevation={0} 
          position="static" 
          sx={{ 
            bgcolor: accentColor, 
            color: '#fff',
            boxShadow: 'none'
          }}
        >
          <Toolbar className="!min-h-[56px] !px-3">
            <IconButton 
              aria-label="Back" 
              onClick={onBack}
              sx={{ color: '#fff', mr: 1 }}
            >
              <ArrowBackRoundedIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              sx={{ 
                fontSize: '18px',
                fontWeight: 700,
                color: '#fff',
                flexGrow: 1
              }}
            >
              Inbox
            </Typography>
            <IconButton 
              aria-label="Notifications" 
              onClick={() => navigate('/dnd')}
              sx={{ color: '#fff' }}
            >
              <Badge 
                variant="dot" 
                sx={{
                  '& .MuiBadge-dot': {
                    backgroundColor: '#ff4444',
                    width: 8,
                    height: 8,
                    right: 4,
                    top: 4
                  }
                }}
            >
                <NotificationsRoundedIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* 2. Live Ongoing Section (Dark Grey Background) - Swipeable Carousel */}
        <Box 
          sx={{ 
            bgcolor: isDark ? '#2a2a2a' : '#4a4a4a',
            color: '#fff',
            px: 2,
            py: 1.5
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '12px',
              fontWeight: 600,
              color: '#fff',
              mb: 1.5,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            ONGOING EVENTS
          </Typography>
          {lives && lives.length > 0 ? (
            <Box
              sx={{
                display: 'flex',
                gap: 1.5,
                overflowX: 'auto',
                overflowY: 'hidden',
                pb: 1,
                scrollSnapType: 'x mandatory',
                '&::-webkit-scrollbar': {
                  display: 'none'
                },
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {lives.map((live, index) => (
                <Paper
                  key={live.id}
                  onClick={() => onLiveOpen?.(live)}
                  elevation={0}
                  sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                    p: 2,
                    cursor: 'pointer',
                    minWidth: '85%',
                    maxWidth: '85%',
                    flexShrink: 0,
                    scrollSnapAlign: 'start',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.15)'
                    },
                    '&:active': {
                      bgcolor: 'rgba(255, 255, 255, 0.2)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Avatar 
                      src={live.host === 'Leslie Alexander' ? 'https://i.pravatar.cc/100?img=5' : live.host === 'John Driver' ? 'https://i.pravatar.cc/100?img=1' : 'https://i.pravatar.cc/100?img=3'} 
                      sx={{ width: 40, height: 40 }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600, 
                            color: '#fff',
                            fontSize: '14px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            flex: 1
                          }}
                        >
                          {live.host}
                        </Typography>
                        <Chip 
                          size="small" 
                          label={live.module || 'E-Commerce'} 
                          sx={{ 
                            height: 18,
                            fontSize: '9px',
                            fontWeight: 600,
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            color: '#fff',
                            border: '1px solid rgba(255, 255, 255, 0.3)'
                          }} 
                        />
                      </Box>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '12px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          display: 'block'
                        }}
                      >
                        {live.title}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '13px',
                      fontWeight: 500,
                      mb: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {live.subtitle}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5 }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '11px'
                      }}
                    >
                      Started {live.startedAt} ago
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLiveOpen?.(live);
                      }}
                      sx={{
                        bgcolor: accentColor,
                        color: '#fff',
                        textTransform: 'none',
                        fontSize: '12px',
                        fontWeight: 600,
                        px: 2,
                        py: 0.5,
                        minWidth: 'auto',
                        '&:hover': {
                          bgcolor: accent === 'orange' ? '#e06f00' : accent === 'green' ? '#02b37b' : '#8f8f8f'
                        }
                      }}
                    >
                      {live.cta || 'Join'}
                    </Button>
                  </Box>
                </Paper>
              ))}
            </Box>
          ) : (
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '13px',
                textAlign: 'center',
                py: 2
              }}
            >
              No live sessions at the moment
            </Typography>
          )}
        </Box>

        {/* 3. Message Drawer (White Rounded Panel) - Overlaps Live Ongoing */}
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            bgcolor: 'background.paper',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            mt: -2, // Overlap more with Live Ongoing section to create layered effect
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 1,
            boxShadow: isDark ? '0 -2px 8px rgba(0,0,0,0.2)' : '0 -2px 8px rgba(0,0,0,0.1)'
          }}
        >
          {/* Drawer Header */}
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
                  bgcolor: 'background.paper',
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

          {/* Search - shown when search icon is clicked - Inside Drawer */}
          {showSearch && (
            <Box sx={{ px: 2, pb: 1.5 }}>
            <TextField
                inputRef={searchInputRef}
              fullWidth 
              size="small" 
              value={q} 
              onChange={(e)=>setQ(e.target.value)} 
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
        <Box className="flex-1" sx={{ overflowY:'auto', '&::-webkit-scrollbar':{ display:'none' }, scrollbarWidth:'none', msOverflowStyle:'none' }}>
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
                      <Avatar src={c.avatar || `https://i.pravatar.cc/100?u=${c.id}`} sx={{ bgcolor: 'background.default', color: 'text.primary' }} />
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
                            {c.name} typing…
                          </Typography>
                        ) : (
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
                        )}
                      </Box>
                    }
                    sx={{ m: 0 }}
                  />
                </ListItem>
                {idx < filtered.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
            {filtered.length === 0 && (<Box className="px-4 py-10 text-center" sx={{ color: 'text.secondary' }}>No conversations match your search.</Box>)}
          </List>
        </Box>
        </Paper>
      </Box>
    </>
  );
}
