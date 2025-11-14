import React, { useMemo, useState, useEffect } from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { useTheme } from "../../context/ThemeContext";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

const PEOPLE = [
  { id: 'u1', name: 'Etty Duke', role: 'Rides • Driver', avatar: 'https://i.pravatar.cc/100?img=1' },
  { id: 'u2', name: 'Leslie Alexander', role: 'School • Tutor', avatar: 'https://i.pravatar.cc/100?img=5' },
  { id: 'u3', name: 'EVzone Support', role: 'Marketplace • Support', avatar: 'https://i.pravatar.cc/100?img=8' },
  { id: 'u4', name: 'Dr. Cohen', role: 'Medical • Doctor', avatar: 'https://i.pravatar.cc/100?img=12' },
  { id: 'g1', name: 'Charging Crew — Kampala', role: 'Charging • Group', avatar: 'https://i.pravatar.cc/100?img=15' },
  { id: 'g2', name: 'Workspace Team A', role: 'Workspace • Channel', avatar: 'https://i.pravatar.cc/100?img=17' },
];

export default function NewMessagePicker({ onClose, onStart, onNavigate }) {
  const muiTheme = useMuiTheme();
  const { accent } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]); // ids
  const [forwardingMessages, setForwardingMessages] = useState(null);
  const [isGroupMode, setIsGroupMode] = useState(false); // Track if we're creating a group
  
  // Get theme accent color
  const accentColor = accent === 'orange' ? EV.orange : accent === 'green' ? EV.green : EV.grey;

  const filtered = useMemo(() => {
    const s = query.trim().toLowerCase();
    if (!s) return PEOPLE;
    return PEOPLE.filter(p => (p.name + ' ' + p.role).toLowerCase().includes(s));
  }, [query]);

  const toggle = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // Handle contact click - immediate start for 1:1, toggle selection for group
  const handleContactClick = (id) => {
    // If sharing contact, use toggle behavior
    if (sharingContact) {
      toggle(id);
      return;
    }

    // If in group mode, toggle selection
    if (isGroupMode) {
      toggle(id);
      return;
    }

    // If NOT in group mode and NOT sharing contact, immediately start 1:1 chat
    if (!isGroupMode && !sharingContact) {
      onStart?.([id]);
    }
  };

  // Enable group mode
  const handleCreateGroup = () => {
    setIsGroupMode(true);
    setSelected([]); // Clear any previous selections
  };

  const [sharingContact, setSharingContact] = useState(false);
  const [returnTo, setReturnTo] = useState(null);

  // Check URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const forwardParam = params.get('forward');
    const shareContactParam = params.get('shareContact');
    const returnToParam = params.get('returnTo');
    
    if (forwardParam) {
      setForwardingMessages(forwardParam.split(','));
    }
    if (shareContactParam === 'true') {
      setSharingContact(true);
    }
    if (returnToParam) {
      setReturnTo(decodeURIComponent(returnToParam));
    }
  }, [location.search]);

  const chips = selected.map(id => PEOPLE.find(p => p.id === id)).filter(Boolean);

  const handleStart = () => {
    if (selected.length === 0) return;
    
    // If sharing contact, create contact message and return to conversation
    if (sharingContact && returnTo) {
      const contact = PEOPLE.find(p => p.id === selected[0]);
      if (contact) {
        // Store contact data to share (in real app, use global state or context)
        const contactData = {
          name: contact.name,
          role: contact.role,
          avatar: contact.avatar,
          id: contact.id
        };
        // Navigate back with contact data in URL
        const contactParam = encodeURIComponent(JSON.stringify(contactData));
        const navigateTo = onNavigate || navigate;
        navigateTo?.(`${returnTo}?sharedContact=${contactParam}`);
        return;
      }
    }
    
    // If forwarding messages, pass them along
    if (forwardingMessages) {
      onStart?.(selected, forwardingMessages);
    } else {
      onStart?.(selected);
    }
    
    // Reset group mode after starting chat
    if (isGroupMode) {
      setIsGroupMode(false);
      setSelected([]);
    }
  };

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: 'background.paper' }}>
        {/* Header with centered title */}
        <AppBar elevation={0} position="static" sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom: `1px solid ${muiTheme.palette.divider}` }}>
          <Toolbar className="!min-h-[56px] !px-3" sx={{ position: 'relative' }}>
            <IconButton 
              onClick={() => {
                setIsGroupMode(false);
                setSelected([]);
                onClose?.();
              }} 
              aria-label="Close"
              sx={{ 
                position: 'absolute',
                left: 8,
                color: 'text.primary'
              }}
            >
              <CloseRoundedIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                fontSize: '18px',
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'text.primary'
              }}
            >
              {sharingContact ? 'Share Contact' : isGroupMode ? 'Create Group' : 'New message'}
            </Typography>
            {/* Create Group button - only show when NOT in group mode and NOT sharing contact */}
            {!isGroupMode && !sharingContact && (
              <IconButton
                onClick={handleCreateGroup}
                aria-label="Create Group"
                sx={{
                  position: 'absolute',
                  right: 8,
                  color: accentColor
                }}
              >
                <GroupAddRoundedIcon />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>

        {/* To: field with chips and action button - only show in group mode or when sharing contact */}
        {(isGroupMode || sharingContact) && (
          <Box sx={{ px: 3, pt: 3, pb: 2, borderBottom: `1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper', position: 'sticky', top: 0, zIndex: 5 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: '12px',
                color: 'text.secondary',
                mb: 1,
                fontWeight: 500
              }}
            >
              To:
            </Typography>
            {/* Selected contacts as chips */}
            {chips.length > 0 ? (
              <>
                <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 2 }}>
                  {chips.map((c) => (
                    <Chip
                      key={c.id}
                      avatar={<Avatar src={c.avatar} sx={{ width: 20, height: 20 }} />}
                      label={c.name}
                      onDelete={() => toggle(c.id)}
                      size="small"
                      sx={{
                        bgcolor: accentColor,
                        color: '#fff',
                        height: '28px',
                        fontSize: '13px',
                        fontWeight: 500,
                        '& .MuiChip-deleteIcon': {
                          color: '#fff',
                          fontSize: '18px',
                          '&:hover': {
                            color: 'rgba(255, 255, 255, 0.8)',
                          },
                        },
                        '& .MuiChip-avatar': {
                          width: 20,
                          height: 20,
                          marginLeft: '4px',
                        },
                      }}
                    />
                  ))}
                </Box>
                {/* Action Button - Right here, always visible */}
                <Button
                  fullWidth
                  variant="contained"
                  size="medium"
                  onClick={handleStart}
                  sx={{
                    bgcolor: accentColor,
                    color: '#fff',
                    textTransform: 'none',
                    fontSize: '15px',
                    fontWeight: 600,
                    py: 1.25,
                    borderRadius: 2,
                    boxShadow: `0 4px 12px ${accentColor}40`,
                    '&:hover': {
                      bgcolor: accent === 'orange' ? '#e06f00' : accent === 'green' ? '#02b37b' : '#8f8f8f',
                      boxShadow: `0 6px 16px ${accentColor}60`,
                    },
                    '&:active': {
                      transform: 'scale(0.98)',
                    },
                  }}
                >
                  {sharingContact ? 'Share Contact' : forwardingMessages ? `Forward to ${selected.length}` : isGroupMode ? `Create Group (${selected.length})` : `Start chat${selected.length > 1 ? ` (${selected.length})` : ''}`}
                </Button>
              </>
            ) : (
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '13px',
                  color: 'text.secondary',
                  fontStyle: 'italic',
                  mb: 1
                }}
              >
                {isGroupMode ? 'Select participants to create a group' : 'Select a contact to share'}
              </Typography>
            )}
          </Box>
        )}
        
        {/* Search field - always visible */}
        <Box sx={{ px: 3, pt: isGroupMode || sharingContact ? 2 : 3, pb: 2 }}>
          <TextField
            fullWidth
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isGroupMode ? "Search participants" : "Type a name or multiple names"}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.default',
                '& fieldset': {
                  borderColor: muiTheme.palette.divider,
                },
                '&:hover fieldset': {
                  borderColor: accentColor,
                },
                '&.Mui-focused fieldset': {
                  borderColor: accentColor,
                  borderWidth: '2px',
                },
              },
              '& .MuiInputBase-input': {
                color: 'text.primary',
                py: 1.5,
                fontSize: '15px',
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'text.secondary',
                opacity: 1,
              },
            }}
          />
        </Box>

        {/* Select Participant section */}
        <Box sx={{ px: 3, pb: 1, pt: isGroupMode || sharingContact ? 2 : 3 }}>
          <Typography
            variant="body2"
            sx={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'text.primary',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              mb: 1
            }}
          >
            {isGroupMode ? 'Select Participants' : 'Select Participant'}
          </Typography>
        </Box>

        {/* Contact list - simplified, no checkboxes, no role text */}
        <Box 
          className="flex-1 no-scrollbar" 
          sx={{ 
            overflowY: 'auto',
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <List sx={{ py: 0 }}>
            {filtered.map((p) => {
              const isSelected = selected.includes(p.id);
              return (
                <ListItem
                  key={p.id}
                  button
                  onClick={() => handleContactClick(p.id)}
                  sx={{
                    py: 1.5,
                    px: 3,
                    bgcolor: isSelected ? (muiTheme.palette.mode === 'dark' 
                      ? `rgba(${accent === 'orange' ? '247, 127, 0' : accent === 'green' ? '3, 205, 140' : '166, 166, 166'}, 0.15)` 
                      : `rgba(${accent === 'orange' ? '247, 127, 0' : accent === 'green' ? '3, 205, 140' : '166, 166, 166'}, 0.08)`) 
                      : 'transparent',
                    '&:hover': {
                      bgcolor: isSelected 
                        ? (muiTheme.palette.mode === 'dark' 
                          ? `rgba(${accent === 'orange' ? '247, 127, 0' : accent === 'green' ? '3, 205, 140' : '166, 166, 166'}, 0.2)` 
                          : `rgba(${accent === 'orange' ? '247, 127, 0' : accent === 'green' ? '3, 205, 140' : '166, 166, 166'}, 0.12)`)
                        : (muiTheme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'),
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={p.avatar} sx={{ width: 40, height: 40 }} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          fontSize: '15px',
                          color: isSelected ? accentColor : 'text.primary',
                        }}
                      >
                        {p.name}
                      </Typography>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        </Box>

      </Box>
    </>
  );
}
