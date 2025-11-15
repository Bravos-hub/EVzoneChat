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
      <Box className="rounded-2xl" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper', p: { xs: 2, sm: 3 } }}>
        <div className="flex items-center mb-2" style={{ gap: '8px', color: muiTheme.palette.text.primary }}>
          <LocalMallRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
          <span className="font-semibold" style={{ fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>Order EV‑CHG‑A32</span>
          <Chip size="small" label="Paid" sx={{ bgcolor: EV.green, color:'#fff', ml:'auto', fontSize: { xs: '11px', sm: '12px' }, height: { xs: 22, sm: 24 } }} />
        </div>
        <Grid container spacing={1} style={{ color: muiTheme.palette.text.primary, fontSize: '13px' }}>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Item</Grid>
          <Grid item xs={7} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>EV Fast Charger 22kW</Grid>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Seller</Grid>
          <Grid item xs={7} className="flex items-center" style={{ gap: '4px' }}>
            <Avatar src="https://i.pravatar.cc/100?img=8" sx={{ width: { xs: 16, sm: 18 }, height: { xs: 16, sm: 18 } }} /> 
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>EVzone Store</span>
          </Grid>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Total</Grid>
          <Grid item xs={7}>UGX 3,250,000</Grid>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Delivery</Grid>
          <Grid item xs={7}>ETA 3–5 days</Grid>
        </Grid>
        <Divider className="my-2" sx={{ borderColor: muiTheme.palette.divider }} />
        <div className="grid grid-cols-2" style={{ gap: '8px' }}>
          <Button startIcon={<ReceiptLongRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} variant="outlined" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>View invoice</Button>
          <Button startIcon={<ChatRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} variant="contained" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Message seller</Button>
        </div>
      </Box>
    ),
    rides: (
      <Box className="rounded-2xl" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper', p: { xs: 2, sm: 3 } }}>
        <div className="flex items-center mb-2" style={{ gap: '8px', color: muiTheme.palette.text.primary }}>
          <CommuteRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
          <span className="font-semibold" style={{ fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>Trip #R‑90312</span>
          <Chip size="small" label="On route" sx={{ bgcolor: accentColor, color:'#fff', ml:'auto', fontSize: { xs: '11px', sm: '12px' }, height: { xs: 22, sm: 24 } }} />
        </div>
        <div className="flex items-center mb-1" style={{ gap: '4px', color: muiTheme.palette.text.primary, fontSize: '13px' }}>
          <PlaceRoundedIcon sx={{ fontSize: { xs: 14, sm: 16 } }} /> 
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Pickup: Kira Rd Police</span>
        </div>
        <div className="flex items-center" style={{ gap: '4px', color: muiTheme.palette.text.primary, fontSize: '13px' }}>
          <PlaceRoundedIcon sx={{ fontSize: { xs: 14, sm: 16 } }} /> 
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dropoff: Entebbe Airport</span>
        </div>
        <Grid container spacing={1} sx={{ mt: 1 }} style={{ color: muiTheme.palette.text.primary, fontSize: '13px' }}>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Driver</Grid>
          <Grid item xs={7} className="flex items-center" style={{ gap: '4px' }}>
            <Avatar src="https://i.pravatar.cc/100?img=10" sx={{ width: { xs: 16, sm: 18 }, height: { xs: 16, sm: 18 } }} /> 
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>John Driver • UAB 123X</span>
          </Grid>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>ETA</Grid>
          <Grid item xs={7}>22 min</Grid>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Fare</Grid>
          <Grid item xs={7}>UGX 48,000</Grid>
        </Grid>
        <Divider className="my-2" sx={{ borderColor: muiTheme.palette.divider }} />
        <div className="grid grid-cols-2" style={{ gap: '8px' }}>
          <Button startIcon={<ChatRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} variant="contained" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Message driver</Button>
          <Button startIcon={<CallRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} variant="outlined" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Call</Button>
        </div>
      </Box>
    ),
    school: (
      <Box className="rounded-2xl" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper', p: { xs: 2, sm: 3 } }}>
        <div className="flex items-center mb-2" style={{ gap: '8px', color: muiTheme.palette.text.primary }}>
          <SchoolRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
          <span className="font-semibold" style={{ fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>Mathematics — Newton's Laws</span>
          <Chip size="small" label="Live in 10m" sx={{ bgcolor: EV.green, color:'#fff', ml:'auto', fontSize: { xs: '11px', sm: '12px' }, height: { xs: 22, sm: 24 } }} />
        </div>
        <Grid container spacing={1} style={{ color: muiTheme.palette.text.primary, fontSize: '13px' }}>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Teacher</Grid>
          <Grid item xs={7} className="flex items-center" style={{ gap: '4px' }}>
            <Avatar src="https://i.pravatar.cc/100?img=5" sx={{ width: { xs: 16, sm: 18 }, height: { xs: 16, sm: 18 } }} /> 
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Leslie Alexander</span>
          </Grid>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Schedule</Grid>
          <Grid item xs={7} className="flex items-center" style={{ gap: '4px' }}>
            <ScheduleRoundedIcon sx={{ fontSize: { xs: 14, sm: 16 } }} /> 
            <span>Today • 15:00–16:00</span>
          </Grid>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Roster</Grid>
          <Grid item xs={7}>28 students</Grid>
        </Grid>
        <Divider className="my-2" sx={{ borderColor: muiTheme.palette.divider }} />
        <div className="grid grid-cols-2" style={{ gap: '8px' }}>
          <Button variant="contained" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Join class</Button>
          <Button variant="outlined" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Open assignments</Button>
        </div>
      </Box>
    )
  }), [muiTheme, accentColor]);

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: 'background.default' }}>
        <AppBar elevation={0} position="static" sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom:`1px solid ${muiTheme.palette.divider}` }}>
          <Toolbar className="!min-h-[56px]" sx={{ px: { xs: 1.5, sm: 3 } }}>
            <IconButton onClick={onBack} aria-label="Back" sx={{ color: 'text.primary', padding: { xs: '6px', sm: '8px' } }}>
              <ArrowBackRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <Typography variant="h6" className="font-bold" sx={{ color: 'text.primary', fontSize: { xs: '16px', sm: '18px' }, ml: { xs: 0.5, sm: 1 } }}>Context</Typography>
          </Toolbar>
        </AppBar>

        {/* tabs */}
        <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
          <div className="flex flex-wrap" style={{ gap: '8px' }}>
            {tabs.map(t => (
              <Chip key={t.key} icon={t.icon} label={t.label} onClick={()=>setTab(t.key)} sx={{ bgcolor: tab===t.key? EV.green: 'background.default', color: tab===t.key? '#fff': 'text.primary', fontSize: { xs: '12px', sm: '13px' }, height: { xs: 32, sm: 36 }, '& .MuiChip-icon': { fontSize: { xs: 16, sm: 18 } } }} />
            ))}
          </div>
        </Box>

        {/* body */}
        <Box sx={{ p: { xs: 2, sm: 3 }, flex: 1, overflowY: 'auto' }} className="no-scrollbar">
          {Panel[tab]}
        </Box>
      </Box>
    </>
  );
}
