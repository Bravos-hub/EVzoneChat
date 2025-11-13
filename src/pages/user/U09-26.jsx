import React from "react";
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

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

/**
 * U09-26 — Contact & Organization Profiles
 * Contact card: reach (call/video/message), shared contexts (chips)
 * Organization card: office hours, location, channels
 */
export default function ContactOrgProfiles({ onBack, person = { name:'Leslie Alexander', role:'Tutor • School', phone:'+256 700 000 111', email:'leslie@example.com', avatar:'https://i.pravatar.cc/120?img=5', contexts:['School','Workspace'] }, org = { name:'EVzone School', logo:'https://i.pravatar.cc/120?img=24', location:'Millennium House, Nsambya Rd 472, Kampala', hours:{ Mon:'08:00–17:00', Tue:'08:00–17:00', Wed:'08:00–17:00', Thu:'08:00–17:00', Fri:'08:00–17:00', Sat:'10:00–14:00', Sun:'Closed' }, channels:['#announcements','Parents Group','Support'] } }) {
  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full mx-auto bg-white flex flex-col">
        <AppBar elevation={0} position="static" sx={{ bgcolor:'#fff', color:'#111', borderBottom:`1px solid ${EV.light}` }}>
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={onBack} aria-label="Back"><ArrowBackRoundedIcon /></IconButton>
            <Typography variant="h6" className="font-bold ml-1">Profile</Typography>
          </Toolbar>
        </AppBar>

        <Box className="flex-1 no-scrollbar" sx={{ overflowY:'auto' }}>
          {/* Contact card */}
          <Box className="p-4">
            <Box className="rounded-2xl p-4" sx={{ border:`1px solid ${EV.light}` }}>
              <div className="flex items-start gap-3">
                <Avatar src={person.avatar} sx={{ width: 64, height: 64 }} />
                <div className="flex-1">
                  <div className="font-semibold">{person.name}</div>
                  <div className="text-sm text-gray-600">{person.role}</div>
                  <div className="mt-2 flex gap-2">
                    {person.contexts.map(c => (<Chip key={c} size="small" label={c} sx={{ bgcolor: EV.light }} />))}
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <Button startIcon={<ChatRoundedIcon/>} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>Message</Button>
                    <Button startIcon={<PhoneRoundedIcon/>} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Call</Button>
                    <Button startIcon={<VideocamRoundedIcon/>} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Video</Button>
                  </div>
                </div>
              </div>
            </Box>
          </Box>

          {/* Organization card */}
          <Box className="px-4 pb-4">
            <Box className="rounded-2xl p-4" sx={{ border:`1px solid ${EV.light}` }}>
              <div className="flex items-start gap-3">
                <Avatar src={org.logo} sx={{ width: 64, height: 64 }} />
                <div className="flex-1">
                  <div className="font-semibold">{org.name}</div>
                  <div className="mt-1 flex items-center gap-1 text-sm text-gray-700"><PlaceRoundedIcon sx={{ fontSize:16 }} /> {org.location}</div>

                  <div className="mt-3 text-sm font-semibold flex items-center gap-1"><AccessTimeRoundedIcon sx={{ fontSize:16 }} /> Office hours</div>
                  <Grid container spacing={0.5} className="mt-1 text-sm">
                    {Object.entries(org.hours).map(([d,h]) => (
                      <React.Fragment key={d}>
                        <Grid item xs={4} className="text-gray-600">{d}</Grid>
                        <Grid item xs={8}>{h}</Grid>
                      </React.Fragment>
                    ))}
                  </Grid>

                  <Divider className="my-3" />
                  <div className="text-sm font-semibold mb-1">Channels</div>
                  <div className="flex gap-2 flex-wrap">
                    {org.channels.map(ch => (<Chip key={ch} size="small" label={ch} sx={{ bgcolor: EV.light }} />))}
                  </div>
                </div>
              </div>
            </Box>
          </Box>
        </Box>

        {/* footer */}
        <Box className="px-4 pb-4">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Share contact</Button>
            <Button variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>Add to group</Button>
          </div>
        </Box>
      </Box>
    </>
  );
}
