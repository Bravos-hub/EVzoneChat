import { useMemo, useState } from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
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
  // const { actualMode } = useTheme();
  const tabs = [
    { key:'medical', label:'Medical', icon: <MedicalServicesRoundedIcon/> },
    { key:'charging', label:'Charging', icon: <EvStationRoundedIcon/> },
    { key:'travel', label:'Travel', icon: <TravelExploreRoundedIcon/> },
  ];
  const [tab, setTab] = useState('medical');

  const Panel = useMemo(()=> ({
    medical: (
      <Box className="rounded-2xl" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper', p: { xs: 2, sm: 3 } }}>
        <div className="flex items-center mb-2" style={{ gap: '8px', color: muiTheme.palette.text.primary }}>
          <MedicalServicesRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
          <span className="font-semibold" style={{ fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>Appointment #MD‑2041</span>
          <Chip size="small" label="Today 15:30" sx={{ bgcolor: EV.green, color:'#fff', ml:'auto', fontSize: { xs: '11px', sm: '12px' }, height: { xs: 22, sm: 24 } }} />
        </div>
        <Grid container spacing={1} style={{ color: muiTheme.palette.text.primary, fontSize: '13px' }}>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Doctor</Grid>
          <Grid item xs={7} className="flex items-center" style={{ gap: '4px' }}>
            <Avatar src="https://i.pravatar.cc/100?img=12" sx={{ width: { xs: 16, sm: 18 }, height: { xs: 16, sm: 18 } }} /> 
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dr. Cohen</span>
          </Grid>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Mode</Grid>
          <Grid item xs={7}>Telehealth • Video</Grid>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Location</Grid>
          <Grid item xs={7} className="flex items-center" style={{ gap: '4px' }}>
            <PlaceRoundedIcon sx={{ fontSize: { xs: 14, sm: 16 } }} /> 
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Kampala Clinic</span>
          </Grid>
        </Grid>
        <Divider className="my-2" sx={{ borderColor: muiTheme.palette.divider }} />
        <div className="grid grid-cols-2" style={{ gap: '8px' }}>
          <Button startIcon={<VideoCallRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} variant="contained" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Join video</Button>
          <Button variant="outlined" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>View records</Button>
        </div>
        <div style={{ color: muiTheme.palette.text.secondary, fontSize: '11px', marginTop: '8px' }}>Sensitive data protected. Follow medical privacy rules.</div>
      </Box>
    ),
    charging: (
      <Box className="rounded-2xl" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper', p: { xs: 2, sm: 3 } }}>
        <div className="flex items-center mb-2" style={{ gap: '8px', color: muiTheme.palette.text.primary }}>
          <EvStationRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
          <span className="font-semibold" style={{ fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>Station: EVzone Wandegeya</span>
          <Chip size="small" label="Available" sx={{ bgcolor: EV.green, color:'#fff', ml:'auto', fontSize: { xs: '11px', sm: '12px' }, height: { xs: 22, sm: 24 } }} />
        </div>
        <Grid container spacing={1} style={{ color: muiTheme.palette.text.primary, fontSize: '13px' }}>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Connector</Grid>
          <Grid item xs={7}>Type 2 • 22kW</Grid>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Tariff</Grid>
          <Grid item xs={7} className="flex items-center" style={{ gap: '4px' }}>
            <LocalOfferRoundedIcon sx={{ fontSize: { xs: 14, sm: 16 } }} /> 
            <span>UGX 1,200/kWh</span>
          </Grid>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Session</Grid>
          <Grid item xs={7} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>ID S‑7719 • 6.4 kWh • UGX 7,680</Grid>
        </Grid>
        <Divider className="my-2" sx={{ borderColor: muiTheme.palette.divider }} />
        <div className="grid grid-cols-2" style={{ gap: '8px' }}>
          <Button startIcon={<MapRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} variant="outlined" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Navigate</Button>
          <Button startIcon={<BoltRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} variant="contained" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Resume charge</Button>
        </div>
      </Box>
    ),
    travel: (
      <Box className="rounded-2xl" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper', p: { xs: 2, sm: 3 } }}>
        <div className="flex items-center mb-2" style={{ gap: '8px', color: muiTheme.palette.text.primary }}>
          <TravelExploreRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
          <span className="font-semibold" style={{ fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>Tour: Old Kampala Walk</span>
          <Chip size="small" label="Live in 3m" sx={{ bgcolor: EV.orange, color:'#fff', ml:'auto', fontSize: { xs: '11px', sm: '12px' }, height: { xs: 22, sm: 24 } }} />
        </div>
        <Grid container spacing={1} style={{ color: muiTheme.palette.text.primary, fontSize: '13px' }}>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Guide</Grid>
          <Grid item xs={7} className="flex items-center" style={{ gap: '4px' }}>
            <Avatar src="https://i.pravatar.cc/100?img=22" sx={{ width: { xs: 16, sm: 18 }, height: { xs: 16, sm: 18 } }} /> 
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Ada Guide</span>
          </Grid>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Voucher</Grid>
          <Grid item xs={7}>#TR‑KLA‑8821</Grid>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Meeting</Grid>
          <Grid item xs={7} className="flex items-center" style={{ gap: '4px' }}>
            <PlaceRoundedIcon sx={{ fontSize: { xs: 14, sm: 16 } }} /> 
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Old Taxi Park, 17:00</span>
          </Grid>
        </Grid>
        <Divider className="my-2" sx={{ borderColor: muiTheme.palette.divider }} />
        <div className="grid grid-cols-2" style={{ gap: '8px' }}>
          <Button variant="contained" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Open voucher</Button>
          <Button variant="outlined" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Share</Button>
        </div>
      </Box>
    )
  }), [muiTheme]);

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

        <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
          <div className="flex flex-wrap" style={{ gap: '8px' }}>
            {tabs.map(t => (
              <Chip key={t.key} icon={t.icon} label={t.label} onClick={()=>setTab(t.key)} sx={{ bgcolor: tab===t.key? EV.green: 'background.default', color: tab===t.key? '#fff': 'text.primary', fontSize: { xs: '12px', sm: '13px' }, height: { xs: 32, sm: 36 }, '& .MuiChip-icon': { fontSize: { xs: 16, sm: 18 } } }} />
            ))}
          </div>
        </Box>

        <Box sx={{ p: { xs: 2, sm: 3 }, flex: 1, overflowY: 'auto' }} className="no-scrollbar">
          {Panel[tab]}
        </Box>
      </Box>
    </>
  );
}
