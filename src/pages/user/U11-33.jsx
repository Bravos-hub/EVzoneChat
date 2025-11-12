import React, { useMemo, useState } from "react";
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
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

export default function ContextPanelsPack3({ onBack }) {
  const tabs = [
    { key:'faith', label:'Faith', icon: <FavoriteBorderRoundedIcon/> },
    { key:'invest', label:'Investments', icon: <TrendingUpRoundedIcon/> },
    { key:'social', label:'Social', icon: <ForumRoundedIcon/> },
    { key:'workspace', label:'Workspace', icon: <WorkRoundedIcon/> },
    { key:'wallet', label:'Wallet', icon: <AccountBalanceWalletRoundedIcon/> },
    { key:'ai', label:'AI', icon: <SmartToyRoundedIcon/> },
  ];
  const [tab, setTab] = useState('faith');

  const Panel = useMemo(()=> ({
    faith: (
      <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${EV.light}` }}>
        <div className="flex items-center gap-2 mb-2">
          <FavoriteBorderRoundedIcon/><span className="font-semibold">Sunday Service</span>
          <Chip size="small" label="Live in 1h" sx={{ bgcolor: EV.orange, color:'#fff', ml:'auto' }} />
        </div>
        <Grid container spacing={1} className="text-sm text-gray-700">
          <Grid item xs={5} className="text-gray-600">Leader</Grid>
          <Grid item xs={7} className="flex items-center gap-1"><Avatar src="https://i.pravatar.cc/100?img=19" sx={{ width:18, height:18 }} /> Pastor Grace</Grid>
          <Grid item xs={5} className="text-gray-600">Venue</Grid>
          <Grid item xs={7}>City Chapel</Grid>
        </Grid>
        <Divider className="my-2" />
        <div className="grid grid-cols-2 gap-2">
          <Button variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>Join live</Button>
          <Button variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Request prayer</Button>
        </div>
      </Box>
    ),
    invest: (
      <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${EV.light}` }}>
        <div className="flex items-center gap-2 mb-2">
          <TrendingUpRoundedIcon/><span className="font-semibold">Green EV Fund</span>
          <Chip size="small" label="Pitch" sx={{ bgcolor: EV.green, color:'#fff', ml:'auto' }} />
        </div>
        <Grid container spacing={1} className="text-sm text-gray-700">
          <Grid item xs={5} className="text-gray-600">Round</Grid>
          <Grid item xs={7}>Seed</Grid>
          <Grid item xs={5} className="text-gray-600">Docs</Grid>
          <Grid item xs={7} className="flex items-center gap-1"><DescriptionRoundedIcon sx={{ fontSize:16 }} /> Term sheet, Deck</Grid>
        </Grid>
        <Divider className="my-2" />
        <div className="grid grid-cols-2 gap-2">
          <Button variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>View term sheet</Button>
          <Button startIcon={<CalendarMonthRoundedIcon/>} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Schedule call</Button>
        </div>
      </Box>
    ),
    social: (
      <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${EV.light}` }}>
        <div className="flex items-center gap-2 mb-2">
          <ForumRoundedIcon/><span className="font-semibold">#community‑projects</span>
          <Chip size="small" label="Open" sx={{ bgcolor: EV.light, ml:'auto' }} />
        </div>
        <div className="text-sm text-gray-700">Community space for EV advocacy projects and meetups.</div>
        <Divider className="my-2" />
        <div className="grid grid-cols-2 gap-2">
          <Button variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>Open channel</Button>
          <Button variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Report</Button>
        </div>
      </Box>
    ),
    workspace: (
      <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${EV.light}` }}>
        <div className="flex items-center gap-2 mb-2">
          <WorkRoundedIcon/><span className="font-semibold">Project: EV App v2</span>
          <Chip size="small" label="Sprint 14" sx={{ bgcolor: EV.green, color:'#fff', ml:'auto' }} />
        </div>
        <Grid container spacing={1} className="text-sm text-gray-700">
          <Grid item xs={5} className="text-gray-600">Next</Grid>
          <Grid item xs={7}>Release candidate • Fri</Grid>
          <Grid item xs={5} className="text-gray-600">Open tasks</Grid>
          <Grid item xs={7}>24</Grid>
        </Grid>
        <Divider className="my-2" />
        <div className="grid grid-cols-2 gap-2">
          <Button variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>Open board</Button>
          <Button startIcon={<CalendarMonthRoundedIcon/>} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Standup</Button>
        </div>
      </Box>
    ),
    wallet: (
      <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${EV.light}` }}>
        <div className="flex items-center gap-2 mb-2">
          <AccountBalanceWalletRoundedIcon/><span className="font-semibold">Wallet</span>
          <Chip size="small" label="UGX" sx={{ bgcolor: EV.light, ml:'auto' }} />
        </div>
        <Grid container spacing={1} className="text-sm text-gray-700">
          <Grid item xs={5} className="text-gray-600">Balance</Grid>
          <Grid item xs={7}>UGX 182,000</Grid>
          <Grid item xs={5} className="text-gray-600">Last txn</Grid>
          <Grid item xs={7} className="flex items-center gap-1"><PaymentsRoundedIcon sx={{ fontSize:16 }} /> UGX −48,000 • Ride</Grid>
        </Grid>
        <Divider className="my-2" />
        <div className="grid grid-cols-2 gap-2">
          <Button variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>Add funds</Button>
          <Button variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>View receipt</Button>
        </div>
      </Box>
    ),
    ai: (
      <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${EV.light}` }}>
        <div className="flex items-center gap-2 mb-2">
          <SmartToyRoundedIcon/><span className="font-semibold">AI Chatbot</span>
          <Chip size="small" label="Enabled" sx={{ bgcolor: EV.green, color:'#fff', ml:'auto' }} />
        </div>
        <div className="text-sm text-gray-700">This chat may use AI suggestions and translations. Sensitive modules may disable AI features.</div>
        <Divider className="my-2" />
        <div className="grid grid-cols-2 gap-2">
          <Button variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>View usage</Button>
          <Button variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Settings</Button>
        </div>
      </Box>
    )
  }), []);

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full max-w-sm mx-auto bg-white flex flex-col">
        <AppBar elevation={0} position="static" sx={{ bgcolor:'#fff', color:'#111', borderBottom:`1px solid ${EV.light}` }}>
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={onBack} aria-label="Back"><ArrowBackRoundedIcon /></IconButton>
            <Typography variant="h6" className="font-bold ml-1">Context</Typography>
          </Toolbar>
        </AppBar>

        <Box className="px-3 py-2">
          <div className="flex gap-2 flex-wrap">
            {tabs.map(t => (
              <Chip key={t.key} icon={t.icon} label={t.label} onClick={()=>setTab(t.key)} sx={{ bgcolor: tab===t.key? EV.green: EV.light, color: tab===t.key? '#fff':'#111' }} />
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
