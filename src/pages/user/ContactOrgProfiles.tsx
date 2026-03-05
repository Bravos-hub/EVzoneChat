import React from "react";
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
  Divider,
  Grid
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";

// const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

/**
 * U09-26 — Contact & Organization Profiles
 * Contact card: reach (call/video/message), shared contexts (chips)
 * Organization card: office hours, location, channels
 */
export default function ContactOrgProfiles({ onBack, person = { name:'Leslie Alexander', role:'Tutor • School', phone:'+256 700 000 111', email:'leslie@example.com', avatar:'https://i.pravatar.cc/120?img=5', contexts:['School','Workspace'] }, org = { name:'EVzone School', logo:'https://i.pravatar.cc/120?img=24', location:'Millennium House, Nsambya Rd 472, Kampala', hours:{ Mon:'08:00–17:00', Tue:'08:00–17:00', Wed:'08:00–17:00', Thu:'08:00–17:00', Fri:'08:00–17:00', Sat:'10:00–14:00', Sun:'Closed' }, channels:['#announcements','Parents Group','Support'] } }) {
  const muiTheme = useMuiTheme();
  // const { actualMode } = useTheme();
  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: 'transparent' }}>
        <AppBar elevation={0} position="static" sx={{ bgcolor: 'transparent', color: 'text.primary', borderBottom:`1px solid ${muiTheme.palette.divider}` }}>
          <Toolbar className="!min-h-[56px]" sx={{ px: { xs: 1.5, sm: 3 } }}>
            <IconButton onClick={onBack} aria-label="Back" sx={{ color: 'text.primary', padding: { xs: '6px', sm: '8px' } }}>
              <ArrowBackRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <Typography variant="h6" className="font-bold" sx={{ color: 'text.primary', fontSize: { xs: '16px', sm: '18px' }, ml: { xs: 0.5, sm: 1 } }}>Profile</Typography>
          </Toolbar>
        </AppBar>

        <Box className="flex-1 no-scrollbar" sx={{ overflowY:'auto' }}>
          {/* Contact card */}
          <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Box className="rounded-2xl" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper', p: { xs: 2, sm: 3, md: 4 } }}>
              <div className="flex items-start" style={{ gap: '12px' }}>
                <Avatar src={person.avatar} sx={{ width: { xs: 56, sm: 60, md: 64 }, height: { xs: 56, sm: 60, md: 64 } }} />
                <div className="flex-1" style={{ minWidth: 0 }}>
                  <div className="font-semibold" style={{ color: muiTheme.palette.text.primary, fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{person.name}</div>
                  <div style={{ color: muiTheme.palette.text.secondary, fontSize: '13px', marginTop: '4px' }}>{person.role}</div>
                  <div className="mt-2 flex flex-wrap" style={{ gap: '8px' }}>
                    {person.contexts.map(c => (<Chip key={c} size="small" label={c} sx={{ bgcolor: 'background.default', color: 'text.primary', fontSize: { xs: '11px', sm: '12px' }, height: { xs: 22, sm: 24 } }} />))}
                  </div>
                  <div className="mt-3 grid grid-cols-3" style={{ gap: '8px' }}>
                    <Button startIcon={<ChatRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} variant="contained" sx={{ textTransform:'none', fontSize: { xs: '11px', sm: '12px' }, py: { xs: 0.5, sm: 0.75 } }}>Message</Button>
                    <Button startIcon={<PhoneRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} variant="outlined" sx={{ textTransform:'none', fontSize: { xs: '11px', sm: '12px' }, py: { xs: 0.5, sm: 0.75 } }}>Call</Button>
                    <Button startIcon={<VideocamRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} variant="outlined" sx={{ textTransform:'none', fontSize: { xs: '11px', sm: '12px' }, py: { xs: 0.5, sm: 0.75 } }}>Video</Button>
                  </div>
                </div>
              </div>
            </Box>
          </Box>

          {/* Organization card */}
          <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, pb: { xs: 2, sm: 3, md: 4 } }}>
            <Box className="rounded-2xl" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper', p: { xs: 2, sm: 3, md: 4 } }}>
              <div className="flex items-start" style={{ gap: '12px' }}>
                <Avatar src={org.logo} sx={{ width: { xs: 56, sm: 60, md: 64 }, height: { xs: 56, sm: 60, md: 64 } }} />
                <div className="flex-1" style={{ minWidth: 0 }}>
                  <div className="font-semibold" style={{ color: muiTheme.palette.text.primary, fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{org.name}</div>
                  <div className="mt-1 flex items-center" style={{ gap: '4px', color: muiTheme.palette.text.primary, fontSize: '13px' }}>
                    <PlaceRoundedIcon sx={{ fontSize: { xs: 14, sm: 16 } }} /> 
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{org.location}</span>
                  </div>

                  <div className="mt-3 font-semibold flex items-center" style={{ gap: '4px', color: muiTheme.palette.text.primary, fontSize: '14px' }}>
                    <AccessTimeRoundedIcon sx={{ fontSize: { xs: 14, sm: 16 } }} /> 
                    <span>Office hours</span>
                  </div>
                  <Grid container spacing={0.5} sx={{ mt: 1 }} style={{ color: muiTheme.palette.text.primary, fontSize: '13px' }}>
                    {Object.entries(org.hours).map(([d,h]) => (
                      <React.Fragment key={d}>
                        <Grid item xs={4} style={{ color: muiTheme.palette.text.secondary }}>{d}</Grid>
                        <Grid item xs={8}>{h}</Grid>
                      </React.Fragment>
                    ))}
                  </Grid>

                  <Divider className="my-3" sx={{ borderColor: muiTheme.palette.divider }} />
                  <div className="font-semibold mb-1" style={{ color: muiTheme.palette.text.primary, fontSize: '14px' }}>Channels</div>
                  <div className="flex flex-wrap" style={{ gap: '8px' }}>
                    {org.channels.map(ch => (<Chip key={ch} size="small" label={ch} sx={{ bgcolor: 'background.default', color: 'text.primary', fontSize: { xs: '11px', sm: '12px' }, height: { xs: 22, sm: 24 } }} />))}
                  </div>
                </div>
              </div>
            </Box>
          </Box>
        </Box>

        {/* footer */}
        <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, pb: { xs: 2, sm: 3, md: 4 } }}>
          <div className="grid grid-cols-2" style={{ gap: '8px' }}>
            <Button variant="outlined" sx={{ textTransform:'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.75, sm: 1 } }}>Share contact</Button>
            <Button variant="contained" sx={{ textTransform:'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.75, sm: 1 } }}>Add to group</Button>
          </div>
        </Box>
      </Box>
    </>
  );
}
