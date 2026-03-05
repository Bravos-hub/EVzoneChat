import { useRef, useState, useMemo } from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Button,
  Chip,
  TextField,
  Switch,
  FormControlLabel,
  Snackbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import BrushRoundedIcon from "@mui/icons-material/BrushRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

// Demo contact data
const CONTACTS = {
  'Leslie Alexander': { name:'Leslie Alexander', handle:'@leslie', bio:'Tutor • School', avatar:'https://i.pravatar.cc/160?img=5', presence:'online', custom:'' },
  'Ronald Isabirye': { name:'Ronald Isabirye', handle:'@ronald', bio:'Founder & CEO, EVzone', avatar:'https://i.pravatar.cc/160?img=20', presence:'online', custom:'' }
};

/**
 * U09-25 — Profile (Self) & Presence
 * Avatar edit, name/handle, bio, presence (online/away/DND/custom), share status across modules
 * Also handles viewing other contacts' profiles via ?contact= parameter
 */
export default function ProfileSelfPresence({ onBack, initial, location, onNavigate }) {
  const muiTheme = useMuiTheme();
  // const { actualMode } = useTheme();
  
  // Check if viewing a contact's profile
  const contactName = useMemo(() => {
    const params = new URLSearchParams(location?.search || '');
    return params.get('contact');
  }, [location]);
  
  const isViewingContact = !!contactName;
  const contactData = contactName && CONTACTS[contactName] ? CONTACTS[contactName] : null;
  const defaultInitial = { name:'Ronald Isabirye', handle:'@ronald', bio:'Founder & CEO, EVzone', avatar:'https://i.pravatar.cc/160?img=20', presence:'online', custom:'' };
  const effectiveInitial = isViewingContact && contactData ? contactData : (initial || defaultInitial);
  
  const [name, setName] = useState(effectiveInitial.name);
  const [handle, setHandle] = useState(effectiveInitial.handle);
  const [bio, setBio] = useState(effectiveInitial.bio);
  const [avatar, setAvatar] = useState(effectiveInitial.avatar);
  const [presence, setPresence] = useState(effectiveInitial.presence); // online | away | dnd | custom
  const [custom, setCustom] = useState(effectiveInitial.custom);
  const [share, setShare] = useState(true);
  const [snack, setSnack] = useState('');
  const fileRef = useRef(null);

  const pickPhoto = () => fileRef.current?.click();
  const onPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatar(url);
  };

  const save = () => { setSnack('Profile saved'); };

  const statuses = [
    { key:'online', label:'Online' },
    { key:'away', label:'Away' },
    { key:'dnd', label:'Do not disturb' },
    { key:'custom', label:'Custom' },
  ];

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
      .presence-dot{position:absolute;right:6px;bottom:6px;width:14px;height:14px;border-radius:9999px;border:2px solid #fff}`}</style>

      <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: 'transparent' }}>
        <AppBar elevation={0} position="static" sx={{ bgcolor: 'transparent', color: 'text.primary', borderBottom:`1px solid ${muiTheme.palette.divider}` }}>
          <Toolbar className="!min-h-[56px]" sx={{ px: { xs: 1.5, sm: 3 } }}>
            <IconButton onClick={onBack} aria-label="Back" sx={{ color: 'text.primary', padding: { xs: '6px', sm: '8px' } }}>
              <ArrowBackRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <Typography variant="h6" className="font-bold" sx={{ color: 'text.primary', fontSize: { xs: '16px', sm: '18px' }, ml: { xs: 0.5, sm: 1 }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{isViewingContact ? `${contactName}'s profile` : 'My profile'}</Typography>
          </Toolbar>
        </AppBar>

        <Box className="flex-1 no-scrollbar" sx={{ overflowY:'auto' }}>
          <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, pt: { xs: 2, sm: 3, md: 4 } }}>
            {/* Avatar + edit */}
            <div className="relative inline-block">
              <Avatar src={avatar} sx={{ width: { xs: 72, sm: 84, md: 96 }, height: { xs: 72, sm: 84, md: 96 } }} />
              <span className="presence-dot" style={{ background: presence==='online'? EV.green : presence==='away'? '#f0ad4e' : presence==='dnd'? '#e53935' : EV.grey, width: 12, height: 12 }} />
              {!isViewingContact && (
                <>
                  <Button onClick={pickPhoto} size="small" startIcon={<EditRoundedIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />} variant="outlined" sx={{ position:'absolute', left: { xs: 85, sm: 100, md: 110 }, top: { xs: 20, sm: 25, md: 30 }, textTransform:'none', fontSize: { xs: '11px', sm: '12px' }, py: { xs: 0.25, sm: 0.5 } }}>Change</Button>
                  <input ref={fileRef} type="file" accept="image/*" onChange={onPhoto} hidden />
                </>
              )}
            </div>

            {/* Name/handle/bio */}
            <Box sx={{ mt: { xs: 2, sm: 3 } }}>
              <TextField 
                fullWidth 
                label="Name" 
                value={name} 
                onChange={(e)=>setName(e.target.value)} 
                disabled={isViewingContact} 
                sx={{ 
                  mb: { xs: 2.5, sm: 3 },
                  '& .MuiInputBase-input': { fontSize: { xs: '14px', sm: '16px' } } 
                }} 
              />
              <TextField 
                fullWidth 
                label="Handle" 
                value={handle} 
                onChange={(e)=>setHandle(e.target.value)} 
                helperText="Public username" 
                disabled={isViewingContact} 
                sx={{ 
                  mb: { xs: 2.5, sm: 3 },
                  '& .MuiInputBase-input': { fontSize: { xs: '14px', sm: '16px' } }, 
                  '& .MuiFormHelperText-root': { fontSize: { xs: '11px', sm: '12px' } } 
                }} 
              />
              <TextField 
                fullWidth 
                multiline 
                minRows={3} 
                label="Bio" 
                value={bio} 
                onChange={(e)=>setBio(e.target.value)} 
                disabled={isViewingContact} 
                sx={{ 
                  '& .MuiInputBase-input': { fontSize: { xs: '14px', sm: '16px' } } 
                }} 
              />
            </Box>

            {/* Presence */}
            {!isViewingContact && (
              <Box sx={{ mt: { xs: 3, sm: 4 } }}>
                <div className="font-semibold mb-1" style={{ color: muiTheme.palette.text.primary, fontSize: '14px' }}>Presence</div>
                <div className="flex flex-wrap" style={{ gap: '8px' }}>
                  {statuses.map(s => (
                    <Chip key={s.key} label={s.label} onClick={()=>setPresence(s.key)} sx={{ bgcolor: presence===s.key? EV.green: 'background.default', color: presence===s.key? '#fff': 'text.primary', fontSize: { xs: '12px', sm: '13px' }, height: { xs: 28, sm: 32 }, '&:hover':{ bgcolor: presence===s.key? '#02b37b': 'action.hover' } }} />
                  ))}
                </div>
                {presence==='custom' && (
                  <TextField fullWidth size="small" label="Custom status" value={custom} onChange={(e)=>setCustom(e.target.value)} sx={{ mt: 1, '& .MuiInputBase-input': { fontSize: { xs: '13px', sm: '14px' } } }} />
                )}
                <FormControlLabel 
                  control={<Switch checked={share} onChange={(e)=>setShare(e.target.checked)} />} 
                  label={<span style={{ color: muiTheme.palette.text.primary, fontSize: '14px' }}>Share my status across modules</span>} 
                  sx={{ mt: 1 }} 
                />
              </Box>
            )}

            {/* Quick Actions - Show for contact profiles */}
            {isViewingContact && contactData && (
              <Box sx={{ mt: { xs: 3, sm: 4 } }}>
                <div className="font-semibold mb-2" style={{ color: muiTheme.palette.text.primary, fontSize: '14px' }}>Quick Actions</div>
                <div className="grid grid-cols-2" style={{ gap: '8px' }}>
                  <Button
                    variant="outlined"
                    startIcon={<ChatBubbleOutlineRoundedIcon />}
                    onClick={() => onNavigate?.(`/conversation/new?contacts=${encodeURIComponent(contactName)}`)}
                    sx={{ textTransform: 'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.75, sm: 1 } }}
                  >
                    Chat
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CallRoundedIcon />}
                    onClick={() => onNavigate?.(`/call?type=voice&contact=${encodeURIComponent(contactName)}&state=dialing`)}
                    sx={{ textTransform: 'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.75, sm: 1 } }}
                  >
                    Call
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<VideocamRoundedIcon />}
                    onClick={() => onNavigate?.(`/call?type=video&contact=${encodeURIComponent(contactName)}&state=dialing`)}
                    sx={{ textTransform: 'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.75, sm: 1 } }}
                  >
                    Video
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<GroupsRoundedIcon />}
                    onClick={() => onNavigate?.(`/group-call?contact=${encodeURIComponent(contactName)}&type=conference`)}
                    sx={{ textTransform: 'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.75, sm: 1 } }}
                  >
                    Conference
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<EventAvailableRoundedIcon />}
                    onClick={() => onNavigate?.('/meetings/book')}
                    sx={{ textTransform: 'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.75, sm: 1 }, gridColumn: 'span 2' }}
                  >
                    Schedule Meeting
                  </Button>
                </div>
              </Box>
            )}
          </Box>

          {/* Settings links - Only show for own profile */}
          {!isViewingContact && (
            <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, mt: { xs: 3, sm: 4 } }}>
              <Box className="rounded-2xl" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper' }}>
                <List sx={{ py: 0 }}>
                  <ListItem 
                    button 
                    onClick={() => onNavigate?.('/settings')}
                    sx={{ borderRadius: '8px 8px 0 0', px: { xs: 2, sm: 3 }, py: { xs: 1, sm: 1.25 } }}
                  >
                    <ListItemIcon>
                      <SettingsRoundedIcon sx={{ color: 'text.primary', fontSize: { xs: 20, sm: 24 } }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<span style={{ fontSize: '15px' }}>Settings</span>} 
                      secondary={<span style={{ fontSize: '13px' }}>Language, Accessibility & Storage</span>} 
                      sx={{ color: 'text.primary' }} 
                    />
                    <ChevronRightRoundedIcon sx={{ color: 'text.secondary', fontSize: { xs: 18, sm: 20 } }} />
                  </ListItem>
                  <Divider />
                  <ListItem 
                    button 
                    onClick={() => onNavigate?.('/security')}
                    sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1, sm: 1.25 } }}
                  >
                    <ListItemIcon>
                      <SecurityRoundedIcon sx={{ color: 'text.primary', fontSize: { xs: 20, sm: 24 } }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<span style={{ fontSize: '15px' }}>Security</span>} 
                      secondary={<span style={{ fontSize: '13px' }}>Sessions & 2FA</span>} 
                      sx={{ color: 'text.primary' }} 
                    />
                    <ChevronRightRoundedIcon sx={{ color: 'text.secondary', fontSize: { xs: 18, sm: 20 } }} />
                  </ListItem>
                  <Divider />
                  <ListItem 
                    button 
                    onClick={() => onNavigate?.('/theme')}
                    sx={{ borderRadius: '0 0 8px 8px', px: { xs: 2, sm: 3 }, py: { xs: 1, sm: 1.25 } }}
                  >
                    <ListItemIcon>
                      <BrushRoundedIcon sx={{ color: 'text.primary', fontSize: { xs: 20, sm: 24 } }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<span style={{ fontSize: '15px' }}>Theme</span>} 
                      secondary={<span style={{ fontSize: '13px' }}>Light · Dark · System</span>} 
                      sx={{ color: 'text.primary' }} 
                    />
                    <ChevronRightRoundedIcon sx={{ color: 'text.secondary', fontSize: { xs: 18, sm: 20 } }} />
                  </ListItem>
                </List>
              </Box>
            </Box>
          )}
        </Box>

        {/* Footer */}
        {!isViewingContact && (
          <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, pb: { xs: 2, sm: 3, md: 4 }, pt: 2, borderTop: `1px solid ${muiTheme.palette.divider}` }}>
            <div className="grid grid-cols-2" style={{ gap: '8px' }}>
              <Button variant="outlined" sx={{ textTransform:'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.75, sm: 1 } }}>Cancel</Button>
              <Button onClick={save} variant="contained" sx={{ textTransform:'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.75, sm: 1 } }}>Save</Button>
            </div>
          </Box>
        )}
      </Box>

      <Snackbar open={!!snack} autoHideDuration={1500} message={snack} onClose={()=>setSnack('')} />
    </>
  );
}
