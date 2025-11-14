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
import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded";
import CommuteRoundedIcon from "@mui/icons-material/CommuteRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

/**
 * U11-31 — Context Panels Pack 1
 * Tabs: Marketplace | Rides | School
 */
export default function ContextPanelsPack1({ onBack }) {
  const muiTheme = useMuiTheme();
  const { accentColor } = useTheme();
  const tabs = [
    { key:'marketplace', label:'Marketplace', icon: <LocalMallRoundedIcon/> },
    { key:'rides', label:'Rides', icon: <CommuteRoundedIcon/> },
    { key:'school', label:'School', icon: <SchoolRoundedIcon/> },
  ];
  const [tab, setTab] = useState('marketplace');

  const Panel = useMemo(()=> ({
    marketplace: (
      <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper' }}>
        <div className="flex items-center gap-2 mb-2" style={{ color: muiTheme.palette.text.primary }}>
          <LocalMallRoundedIcon/><span className="font-semibold">Order EV‑CHG‑A32</span>
          <Chip size="small" label="Paid" sx={{ bgcolor: EV.green, color:'#fff', ml:'auto' }} />
        </div>
        <Grid container spacing={1} className="text-sm" style={{ color: muiTheme.palette.text.primary }}>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Item</Grid>
          <Grid item xs={7}>EV Fast Charger 22kW</Grid>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Seller</Grid>
          <Grid item xs={7} className="flex items-center gap-1">
            <Avatar src="https://i.pravatar.cc/100?img=8" sx={{ width:18, height:18 }} /> EVzone Store
          </Grid>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Total</Grid>
          <Grid item xs={7}>UGX 3,250,000</Grid>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Delivery</Grid>
          <Grid item xs={7}>ETA 3–5 days</Grid>
        </Grid>
        <Divider className="my-2" sx={{ borderColor: muiTheme.palette.divider }} />
        <div className="grid grid-cols-2 gap-2">
          <Button startIcon={<ReceiptLongRoundedIcon/>} variant="outlined" sx={{ textTransform:'none' }}>View invoice</Button>
          <Button startIcon={<ChatRoundedIcon/>} variant="contained" sx={{ textTransform:'none' }}>Message seller</Button>
        </div>
      </Box>
    ),
    rides: (
      <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper' }}>
        <div className="flex items-center gap-2 mb-2" style={{ color: muiTheme.palette.text.primary }}>
          <CommuteRoundedIcon/><span className="font-semibold">Trip #R‑90312</span>
          <Chip size="small" label="On route" sx={{ bgcolor: accentColor, color:'#fff', ml:'auto' }} />
        </div>
        <div className="text-sm flex items-center gap-1 mb-1" style={{ color: muiTheme.palette.text.primary }}><PlaceRoundedIcon sx={{ fontSize:16 }} /> Pickup: Kira Rd Police</div>
        <div className="text-sm flex items-center gap-1" style={{ color: muiTheme.palette.text.primary }}><PlaceRoundedIcon sx={{ fontSize:16 }} /> Dropoff: Entebbe Airport</div>
        <Grid container spacing={1} className="text-sm mt-1" style={{ color: muiTheme.palette.text.primary }}>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Driver</Grid>
          <Grid item xs={7} className="flex items-center gap-1"><Avatar src="https://i.pravatar.cc/100?img=10" sx={{ width:18, height:18 }} /> John Driver • UAB 123X</Grid>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>ETA</Grid>
          <Grid item xs={7}>22 min</Grid>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Fare</Grid>
          <Grid item xs={7}>UGX 48,000</Grid>
        </Grid>
        <Divider className="my-2" sx={{ borderColor: muiTheme.palette.divider }} />
        <div className="grid grid-cols-2 gap-2">
          <Button startIcon={<ChatRoundedIcon/>} variant="contained" sx={{ textTransform:'none' }}>Message driver</Button>
          <Button startIcon={<CallRoundedIcon/>} variant="outlined" sx={{ textTransform:'none' }}>Call</Button>
        </div>
      </Box>
    ),
    school: (
      <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper' }}>
        <div className="flex items-center gap-2 mb-2" style={{ color: muiTheme.palette.text.primary }}>
          <SchoolRoundedIcon/><span className="font-semibold">Mathematics — Newton's Laws</span>
          <Chip size="small" label="Live in 10m" sx={{ bgcolor: EV.green, color:'#fff', ml:'auto' }} />
        </div>
        <Grid container spacing={1} className="text-sm" style={{ color: muiTheme.palette.text.primary }}>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Teacher</Grid>
          <Grid item xs={7} className="flex items-center gap-1"><Avatar src="https://i.pravatar.cc/100?img=5" sx={{ width:18, height:18 }} /> Leslie Alexander</Grid>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Schedule</Grid>
          <Grid item xs={7} className="flex items-center gap-1"><ScheduleRoundedIcon sx={{ fontSize:16 }} /> Today • 15:00–16:00</Grid>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Roster</Grid>
          <Grid item xs={7}>28 students</Grid>
        </Grid>
        <Divider className="my-2" sx={{ borderColor: muiTheme.palette.divider }} />
        <div className="grid grid-cols-2 gap-2">
          <Button variant="contained" sx={{ textTransform:'none' }}>Join class</Button>
          <Button variant="outlined" sx={{ textTransform:'none' }}>Open assignments</Button>
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

        {/* tabs */}
        <Box className="px-3 py-2">
          <div className="flex gap-2 flex-wrap">
            {tabs.map(t => (
              <Chip key={t.key} icon={t.icon} label={t.label} onClick={()=>setTab(t.key)} sx={{ bgcolor: tab===t.key? EV.green: 'background.default', color: tab===t.key? '#fff': 'text.primary' }} />
            ))}
          </div>
        </Box>

        {/* body */}
        <Box className="flex-1 p-3 no-scrollbar" sx={{ overflowY:'auto' }}>
          {Panel[tab]}
        </Box>
      </Box>
    </>
  );
}
