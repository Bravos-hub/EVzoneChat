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

      <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: 'background.default' }}>
        <AppBar elevation={0} position="static" sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom:`1px solid ${muiTheme.palette.divider}` }}>
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={onBack} aria-label="Back" sx={{ color: 'text.primary' }}><ArrowBackRoundedIcon /></IconButton>
            <Typography variant="h6" className="font-bold ml-1" sx={{ color: 'text.primary' }}>Profile</Typography>
          </Toolbar>
        </AppBar>

        <Box className="flex-1 no-scrollbar" sx={{ overflowY:'auto' }}>
          {/* Contact card */}
          <Box className="p-4">
            <Box className="rounded-2xl p-4" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper' }}>
              <div className="flex items-start gap-3">
                <Avatar src={person.avatar} sx={{ width: 64, height: 64 }} />
                <div className="flex-1">
                  <div className="font-semibold" style={{ color: muiTheme.palette.text.primary }}>{person.name}</div>
                  <div className="text-sm" style={{ color: muiTheme.palette.text.secondary }}>{person.role}</div>
                  <div className="mt-2 flex gap-2">
                    {person.contexts.map(c => (<Chip key={c} size="small" label={c} sx={{ bgcolor: 'background.default', color: 'text.primary' }} />))}
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <Button startIcon={<ChatRoundedIcon/>} variant="contained" sx={{ textTransform:'none' }}>Message</Button>
                    <Button startIcon={<PhoneRoundedIcon/>} variant="outlined" sx={{ textTransform:'none' }}>Call</Button>
                    <Button startIcon={<VideocamRoundedIcon/>} variant="outlined" sx={{ textTransform:'none' }}>Video</Button>
                  </div>
                </div>
              </div>
            </Box>
          </Box>

          {/* Organization card */}
          <Box className="px-4 pb-4">
            <Box className="rounded-2xl p-4" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper' }}>
              <div className="flex items-start gap-3">
                <Avatar src={org.logo} sx={{ width: 64, height: 64 }} />
                <div className="flex-1">
                  <div className="font-semibold" style={{ color: muiTheme.palette.text.primary }}>{org.name}</div>
                  <div className="mt-1 flex items-center gap-1 text-sm" style={{ color: muiTheme.palette.text.primary }}><PlaceRoundedIcon sx={{ fontSize:16 }} /> {org.location}</div>

                  <div className="mt-3 text-sm font-semibold flex items-center gap-1" style={{ color: muiTheme.palette.text.primary }}><AccessTimeRoundedIcon sx={{ fontSize:16 }} /> Office hours</div>
                  <Grid container spacing={0.5} className="mt-1 text-sm" style={{ color: muiTheme.palette.text.primary }}>
                    {Object.entries(org.hours).map(([d,h]) => (
                      <React.Fragment key={d}>
                        <Grid item xs={4} style={{ color: muiTheme.palette.text.secondary }}>{d}</Grid>
                        <Grid item xs={8}>{h}</Grid>
                      </React.Fragment>
                    ))}
                  </Grid>

                  <Divider className="my-3" sx={{ borderColor: muiTheme.palette.divider }} />
                  <div className="text-sm font-semibold mb-1" style={{ color: muiTheme.palette.text.primary }}>Channels</div>
                  <div className="flex gap-2 flex-wrap">
                    {org.channels.map(ch => (<Chip key={ch} size="small" label={ch} sx={{ bgcolor: 'background.default', color: 'text.primary' }} />))}
                  </div>
                </div>
              </div>
            </Box>
          </Box>
        </Box>

        {/* footer */}
        <Box className="px-4 pb-4">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outlined" sx={{ textTransform:'none' }}>Share contact</Button>
            <Button variant="contained" sx={{ textTransform:'none' }}>Add to group</Button>
          </div>
        </Box>
      </Box>
    </>
  );
}
