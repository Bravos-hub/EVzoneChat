import React, { useMemo, useState } from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { useTheme } from "../../context/ThemeContext";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Chip,
  Divider,
  Button,
  Avatar,
  Grid
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import EvStationRoundedIcon from "@mui/icons-material/EvStationRounded";
import TravelExploreRoundedIcon from "@mui/icons-material/TravelExploreRounded";
import VideoCallRoundedIcon from "@mui/icons-material/VideoCallRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

export default function ContextPanelsPack2({ onBack }) {
  const muiTheme = useMuiTheme();
  const { actualMode } = useTheme();
  const tabs = [
    { key:'medical', label:'Medical', icon: <MedicalServicesRoundedIcon/> },
    { key:'charging', label:'Charging', icon: <EvStationRoundedIcon/> },
    { key:'travel', label:'Travel', icon: <TravelExploreRoundedIcon/> },
  ];
  const [tab, setTab] = useState('medical');

  const Panel = useMemo(()=> ({
    medical: (
      <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper' }}>
        <div className="flex items-center gap-2 mb-2" style={{ color: muiTheme.palette.text.primary }}>
          <MedicalServicesRoundedIcon/><span className="font-semibold">Appointment #MD‑2041</span>
          <Chip size="small" label="Today 15:30" sx={{ bgcolor: EV.green, color:'#fff', ml:'auto' }} />
        </div>
        <Grid container spacing={1} className="text-sm" style={{ color: muiTheme.palette.text.primary }}>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Doctor</Grid>
          <Grid item xs={7} className="flex items-center gap-1"><Avatar src="https://i.pravatar.cc/100?img=12" sx={{ width:18, height:18 }} /> Dr. Cohen</Grid>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Mode</Grid>
          <Grid item xs={7}>Telehealth • Video</Grid>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Location</Grid>
          <Grid item xs={7} className="flex items-center gap-1"><PlaceRoundedIcon sx={{ fontSize:16 }} /> Kampala Clinic</Grid>
        </Grid>
        <Divider className="my-2" sx={{ borderColor: muiTheme.palette.divider }} />
        <div className="grid grid-cols-2 gap-2">
          <Button startIcon={<VideoCallRoundedIcon/>} variant="contained" sx={{ textTransform:'none' }}>Join video</Button>
          <Button variant="outlined" sx={{ textTransform:'none' }}>View records</Button>
        </div>
        <div className="text-[11px] mt-2" style={{ color: muiTheme.palette.text.secondary }}>Sensitive data protected. Follow medical privacy rules.</div>
      </Box>
    ),
    charging: (
      <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper' }}>
        <div className="flex items-center gap-2 mb-2" style={{ color: muiTheme.palette.text.primary }}>
          <EvStationRoundedIcon/><span className="font-semibold">Station: EVzone Wandegeya</span>
          <Chip size="small" label="Available" sx={{ bgcolor: EV.green, color:'#fff', ml:'auto' }} />
        </div>
        <Grid container spacing={1} className="text-sm" style={{ color: muiTheme.palette.text.primary }}>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Connector</Grid>
          <Grid item xs={7}>Type 2 • 22kW</Grid>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Tariff</Grid>
          <Grid item xs={7} className="flex items-center gap-1"><LocalOfferRoundedIcon sx={{ fontSize:16 }} /> UGX 1,200/kWh</Grid>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Session</Grid>
          <Grid item xs={7}>ID S‑7719 • 6.4 kWh • UGX 7,680</Grid>
        </Grid>
        <Divider className="my-2" sx={{ borderColor: muiTheme.palette.divider }} />
        <div className="grid grid-cols-2 gap-2">
          <Button startIcon={<MapRoundedIcon/>} variant="outlined" sx={{ textTransform:'none' }}>Navigate</Button>
          <Button startIcon={<BoltRoundedIcon/>} variant="contained" sx={{ textTransform:'none' }}>Resume charge</Button>
        </div>
      </Box>
    ),
    travel: (
      <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper' }}>
        <div className="flex items-center gap-2 mb-2" style={{ color: muiTheme.palette.text.primary }}>
          <TravelExploreRoundedIcon/><span className="font-semibold">Tour: Old Kampala Walk</span>
          <Chip size="small" label="Live in 3m" sx={{ bgcolor: EV.orange, color:'#fff', ml:'auto' }} />
        </div>
        <Grid container spacing={1} className="text-sm" style={{ color: muiTheme.palette.text.primary }}>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Guide</Grid>
          <Grid item xs={7} className="flex items-center gap-1"><Avatar src="https://i.pravatar.cc/100?img=22" sx={{ width:18, height:18 }} /> Ada Guide</Grid>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Voucher</Grid>
          <Grid item xs={7}>#TR‑KLA‑8821</Grid>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Meeting</Grid>
          <Grid item xs={7} className="flex items-center gap-1"><PlaceRoundedIcon sx={{ fontSize:16 }} /> Old Taxi Park, 17:00</Grid>
        </Grid>
        <Divider className="my-2" sx={{ borderColor: muiTheme.palette.divider }} />
        <div className="grid grid-cols-2 gap-2">
          <Button variant="contained" sx={{ textTransform:'none' }}>Open voucher</Button>
          <Button variant="outlined" sx={{ textTransform:'none' }}>Share</Button>
        </div>
      </Box>
    )
  }), [muiTheme]);

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: 'background.default' }}>
        <AppBar elevation={0} position="static" sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom:`1px solid ${muiTheme.palette.divider}` }}>
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={onBack} aria-label="Back" sx={{ color: 'text.primary' }}><ArrowBackRoundedIcon /></IconButton>
            <Typography variant="h6" className="font-bold ml-1" sx={{ color: 'text.primary' }}>Context</Typography>
          </Toolbar>
        </AppBar>

        <Box className="px-3 py-2">
          <div className="flex gap-2 flex-wrap">
            {tabs.map(t => (
              <Chip key={t.key} icon={t.icon} label={t.label} onClick={()=>setTab(t.key)} sx={{ bgcolor: tab===t.key? EV.green: 'background.default', color: tab===t.key? '#fff': 'text.primary' }} />
            ))}
          </div>
        </Box>

        <Box className="flex-1 p-3 no-scrollbar" sx={{ overflowY:'auto' }}>
          {Panel[tab]}
        </Box>
      </Box>
    </>
  );
}
