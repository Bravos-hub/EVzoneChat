import { useMemo, useState, useEffect, useRef } from "react";
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
  Button,
  MenuItem
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import { CHAT_CHANNELS } from "../../constants/chatChannels";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

const PEOPLE = [
  { id: 'u1', name: 'Etty Duke', role: 'Rides • Driver', avatar: 'https://i.pravatar.cc/100?img=1' },
  { id: 'u2', name: 'Leslie Alexander', role: 'School • Tutor', avatar: 'https://i.pravatar.cc/100?img=5' },
  { id: 'u3', name: 'EVzone Support', role: 'Marketplace • Support', avatar: 'https://i.pravatar.cc/100?img=8' },
  { id: 'u4', name: 'Dr. Cohen', role: 'Medical • Doctor', avatar: 'https://i.pravatar.cc/100?img=12' },
  { id: 'g1', name: 'Charging Crew — Kampala', role: 'Charging • Group', avatar: 'https://i.pravatar.cc/100?img=15' },
  { id: 'g2', name: 'Workspace Team A', role: 'Workspace • Channel', avatar: 'https://i.pravatar.cc/100?img=17' },
];

const normalizeContactIds = (contactsParam) => {
  if (!contactsParam) return [];

  const rawContacts = contactsParam
    .split(",")
    .map((value) => decodeURIComponent(value).trim())
    .filter(Boolean);

  const mappedContacts = rawContacts.map((value) => {
    const byId = PEOPLE.find((person) => person.id === value);
    if (byId) return byId.id;

    const byName = PEOPLE.find((person) => person.name.toLowerCase() === value.toLowerCase());
    if (byName) return byName.id;

    return value;
  });

  return [...new Set(mappedContacts)];
};

export default function NewMessagePicker({ onClose, onStart, onNavigate }) {
  const muiTheme = useMuiTheme();
  const { accent } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]); // ids
  const [forwardingMessages, setForwardingMessages] = useState(null);
  const [isGroupMode, setIsGroupMode] = useState(false); // Track if we're creating a group
  const [selectedChannel, setSelectedChannel] = useState("");
  const [channelError, setChannelError] = useState(false);
  const [prefilledContacts, setPrefilledContacts] = useState([]);
  const autoStartFromPrefillRef = useRef(false);
  
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

    if (!selectedChannel) {
      setChannelError(true);
      return;
    }

    // If in group mode, toggle selection
    if (isGroupMode) {
      toggle(id);
      return;
    }

    // If NOT in group mode and NOT sharing contact, immediately start 1:1 chat
    if (!isGroupMode && !sharingContact) {
      onStart?.([id], undefined, selectedChannel);
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
    const contactsParam = params.get("contacts");
    const groupParam = params.get("group");
    const normalizedContacts = normalizeContactIds(contactsParam);
    const shouldUseGroupMode = groupParam === "true" || normalizedContacts.length > 1;

    autoStartFromPrefillRef.current = false;
    setForwardingMessages(forwardParam ? forwardParam.split(",") : null);
    setSharingContact(shareContactParam === "true");
    setReturnTo(returnToParam ? decodeURIComponent(returnToParam) : null);
    setSelected(normalizedContacts);
    setPrefilledContacts(normalizedContacts);
    setIsGroupMode(shouldUseGroupMode);
  }, [location.search]);

  useEffect(() => {
    if (sharingContact || !selectedChannel || prefilledContacts.length === 0 || autoStartFromPrefillRef.current) {
      return;
    }

    autoStartFromPrefillRef.current = true;
    if (forwardingMessages && forwardingMessages.length > 0) {
      onStart?.(prefilledContacts, forwardingMessages, selectedChannel);
      return;
    }

    onStart?.(prefilledContacts, undefined, selectedChannel);
  }, [sharingContact, selectedChannel, prefilledContacts, forwardingMessages, onStart]);

  const chips = selected.map(id => PEOPLE.find(p => p.id === id)).filter(Boolean);
  const contactsEnabled = sharingContact || Boolean(selectedChannel);

  const handleStart = () => {
    if (selected.length === 0) return;

    if (!sharingContact && !selectedChannel) {
      setChannelError(true);
      return;
    }
    
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
    if (forwardingMessages && forwardingMessages.length > 0) {
      onStart?.(selected, forwardingMessages, selectedChannel);
    } else {
      onStart?.(selected, undefined, selectedChannel);
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

      <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: 'transparent' }}>
        {/* Header with centered title */}
        <AppBar elevation={0} position="static" sx={{ bgcolor: 'transparent', color: 'text.primary', borderBottom: `1px solid ${muiTheme.palette.divider}` }}>
          <Toolbar className="!min-h-[56px]" sx={{ position: 'relative', px: { xs: 1.5, sm: 3 } }}>
            <IconButton 
              onClick={() => {
                setIsGroupMode(false);
                setSelected([]);
                setSelectedChannel("");
                setChannelError(false);
                onClose?.();
              }} 
              aria-label="Close"
              sx={{ 
                position: 'absolute',
                left: { xs: 4, sm: 8 },
                color: 'text.primary',
                padding: { xs: '6px', sm: '8px' }
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '16px', sm: '18px' },
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'text.primary',
                maxWidth: { xs: '60%', sm: '70%' },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
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
                  right: { xs: 4, sm: 8 },
                  color: accentColor,
                  padding: { xs: '6px', sm: '8px' }
                }}
              >
                <GroupAddRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>

        {!sharingContact && (
          <Box sx={{ px: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 3 }, pb: 2, borderBottom: `1px solid ${muiTheme.palette.divider}`, bgcolor: 'transparent' }}>
            <TextField
              select
              fullWidth
              size="small"
              required
              value={selectedChannel}
              label="Channel"
              onChange={(e) => {
                setSelectedChannel(e.target.value);
                setChannelError(false);
              }}
              error={channelError}
              helperText={channelError ? "Select a channel before starting a chat." : "Choose the channel for this chat."}
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
                  py: { xs: 1.25, sm: 1.5 },
                  fontSize: { xs: '14px', sm: '15px' },
                },
                '& .MuiFormHelperText-root': {
                  mx: 0,
                }
              }}
            >
              {CHAT_CHANNELS.map((module) => (
                <MenuItem key={module} value={module}>
                  {module}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        )}

        {/* To: field with chips and action button - only show in group mode or when sharing contact */}
        {(isGroupMode || sharingContact) && (
          <Box sx={{ px: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 3 }, pb: 2, borderBottom: `1px solid ${muiTheme.palette.divider}`, bgcolor: 'transparent', position: 'sticky', top: 0, zIndex: 5 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: { xs: '11px', sm: '12px' },
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
                <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 0.75 }, flexWrap: 'wrap', mb: 2 }}>
                  {chips.map((c) => (
                    <Chip
                      key={c.id}
                      avatar={<Avatar src={c.avatar} sx={{ width: { xs: 18, sm: 20 }, height: { xs: 18, sm: 20 } }} />}
                      label={c.name}
                      onDelete={() => toggle(c.id)}
                      size="small"
                      sx={{
                        bgcolor: accentColor,
                        color: '#fff',
                        height: { xs: '26px', sm: '28px' },
                        fontSize: { xs: '12px', sm: '13px' },
                        fontWeight: 500,
                        maxWidth: { xs: '200px', sm: 'none' },
                        '& .MuiChip-label': {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        },
                        '& .MuiChip-deleteIcon': {
                          color: '#fff',
                          fontSize: { xs: '16px', sm: '18px' },
                          '&:hover': {
                            color: 'rgba(255, 255, 255, 0.8)',
                          },
                        },
                        '& .MuiChip-avatar': {
                          width: { xs: 18, sm: 20 },
                          height: { xs: 18, sm: 20 },
                          marginLeft: { xs: '3px', sm: '4px' },
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
                    fontSize: { xs: '14px', sm: '15px' },
                    fontWeight: 600,
                    py: { xs: 1, sm: 1.25 },
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
                  fontSize: { xs: '12px', sm: '13px' },
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
        <Box sx={{ px: { xs: 2, sm: 3 }, pt: { xs: 1.5, sm: 2 }, pb: 2 }}>
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
                py: { xs: 1.25, sm: 1.5 },
                fontSize: { xs: '14px', sm: '15px' },
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'text.secondary',
                opacity: 1,
              },
            }}
          />
        </Box>

        {/* Select Participant section */}
        <Box sx={{ px: { xs: 2, sm: 3 }, pb: 1, pt: { xs: 1.5, sm: 2 } }}>
          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: '12px', sm: '14px' },
              fontWeight: 600,
              color: 'text.primary',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              mb: 1
            }}
          >
            {isGroupMode ? 'Select Participants' : 'Select Participant'}
          </Typography>
          {!contactsEnabled && (
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', display: 'block', mt: 0.75 }}
            >
              Select a channel first to enable participant selection.
            </Typography>
          )}
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
                  disabled={!contactsEnabled}
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
                    opacity: contactsEnabled ? 1 : 0.6,
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={p.avatar} sx={{ width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 } }} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: '14px', sm: '15px' },
                          color: isSelected ? accentColor : (contactsEnabled ? 'text.primary' : 'text.secondary'),
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: { xs: '200px', sm: 'none' }
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
