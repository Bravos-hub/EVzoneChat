import { useMemo, useState } from "react";
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
import { useTheme as useMuiTheme } from "@mui/material/styles";
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
  // const { actualMode } = useTheme();
  const muiTheme = useMuiTheme();
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
      <Box className="rounded-2xl" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper', p: { xs: 2, sm: 3 } }}>
        <div className="flex items-center mb-2" style={{ gap: '8px', color: muiTheme.palette.text.primary }}>
          <FavoriteBorderRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
          <span className="font-semibold" style={{ fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>Sunday Service</span>
          <Chip size="small" label="Live in 1h" sx={{ bgcolor: EV.orange, color:'#fff', ml:'auto', fontSize: { xs: '11px', sm: '12px' }, height: { xs: 22, sm: 24 } }} />
        </div>
        <Grid container spacing={1} style={{ color: muiTheme.palette.text.primary, fontSize: '13px' }}>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Leader</Grid>
          <Grid item xs={7} className="flex items-center" style={{ gap: '4px' }}>
            <Avatar src="https://i.pravatar.cc/100?img=19" sx={{ width: { xs: 16, sm: 18 }, height: { xs: 16, sm: 18 } }} /> 
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Pastor Grace</span>
          </Grid>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Venue</Grid>
          <Grid item xs={7} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>City Chapel</Grid>
        </Grid>
        <Divider className="my-2" sx={{ borderColor: muiTheme.palette.divider }} />
        <div className="grid grid-cols-2" style={{ gap: '8px' }}>
          <Button variant="contained" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Join live</Button>
          <Button variant="outlined" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Request prayer</Button>
        </div>
      </Box>
    ),
    invest: (
      <Box className="rounded-2xl" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper', p: { xs: 2, sm: 3 } }}>
        <div className="flex items-center mb-2" style={{ gap: '8px', color: muiTheme.palette.text.primary }}>
          <TrendingUpRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
          <span className="font-semibold" style={{ fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>Green EV Fund</span>
          <Chip size="small" label="Pitch" sx={{ bgcolor: EV.green, color:'#fff', ml:'auto', fontSize: { xs: '11px', sm: '12px' }, height: { xs: 22, sm: 24 } }} />
        </div>
        <Grid container spacing={1} style={{ color: muiTheme.palette.text.primary, fontSize: '13px' }}>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Round</Grid>
          <Grid item xs={7}>Seed</Grid>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Docs</Grid>
          <Grid item xs={7} className="flex items-center" style={{ gap: '4px' }}>
            <DescriptionRoundedIcon sx={{ fontSize: { xs: 14, sm: 16 } }} /> 
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Term sheet, Deck</span>
          </Grid>
        </Grid>
        <Divider className="my-2" sx={{ borderColor: muiTheme.palette.divider }} />
        <div className="grid grid-cols-2" style={{ gap: '8px' }}>
          <Button variant="contained" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>View term sheet</Button>
          <Button startIcon={<CalendarMonthRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} variant="outlined" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Schedule call</Button>
        </div>
      </Box>
    ),
    social: (
      <Box className="rounded-2xl" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper', p: { xs: 2, sm: 3 } }}>
        <div className="flex items-center mb-2" style={{ gap: '8px', color: muiTheme.palette.text.primary }}>
          <ForumRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
          <span className="font-semibold" style={{ fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>#community‑projects</span>
          <Chip size="small" label="Open" sx={{ bgcolor: 'background.default', color: 'text.primary', ml:'auto', fontSize: { xs: '11px', sm: '12px' }, height: { xs: 22, sm: 24 } }} />
        </div>
        <div style={{ color: muiTheme.palette.text.primary, fontSize: '13px' }}>Community space for EV advocacy projects and meetups.</div>
        <Divider className="my-2" sx={{ borderColor: muiTheme.palette.divider }} />
        <div className="grid grid-cols-2" style={{ gap: '8px' }}>
          <Button variant="contained" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Open channel</Button>
          <Button variant="outlined" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Report</Button>
        </div>
      </Box>
    ),
    workspace: (
      <Box className="rounded-2xl" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper', p: { xs: 2, sm: 3 } }}>
        <div className="flex items-center mb-2" style={{ gap: '8px', color: muiTheme.palette.text.primary }}>
          <WorkRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
          <span className="font-semibold" style={{ fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>Project: EV App v2</span>
          <Chip size="small" label="Sprint 14" sx={{ bgcolor: EV.green, color:'#fff', ml:'auto', fontSize: { xs: '11px', sm: '12px' }, height: { xs: 22, sm: 24 } }} />
        </div>
        <Grid container spacing={1} style={{ color: muiTheme.palette.text.primary, fontSize: '13px' }}>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Next</Grid>
          <Grid item xs={7} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Release candidate • Fri</Grid>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Open tasks</Grid>
          <Grid item xs={7}>24</Grid>
        </Grid>
        <Divider className="my-2" sx={{ borderColor: muiTheme.palette.divider }} />
        <div className="grid grid-cols-2" style={{ gap: '8px' }}>
          <Button variant="contained" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Open board</Button>
          <Button startIcon={<CalendarMonthRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} variant="outlined" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Standup</Button>
        </div>
      </Box>
    ),
    wallet: (
      <Box className="rounded-2xl" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper', p: { xs: 2, sm: 3 } }}>
        <div className="flex items-center mb-2" style={{ gap: '8px', color: muiTheme.palette.text.primary }}>
          <AccountBalanceWalletRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
          <span className="font-semibold" style={{ fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>Wallet</span>
          <Chip size="small" label="UGX" sx={{ bgcolor: 'background.default', color: 'text.primary', ml:'auto', fontSize: { xs: '11px', sm: '12px' }, height: { xs: 22, sm: 24 } }} />
        </div>
        <Grid container spacing={1} style={{ color: muiTheme.palette.text.primary, fontSize: '13px' }}>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Balance</Grid>
          <Grid item xs={7}>UGX 182,000</Grid>
          <Grid item xs={5} style={{ color: muiTheme.palette.text.secondary }}>Last txn</Grid>
          <Grid item xs={7} className="flex items-center" style={{ gap: '4px' }}>
            <PaymentsRoundedIcon sx={{ fontSize: { xs: 14, sm: 16 } }} /> 
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>UGX −48,000 • Ride</span>
          </Grid>
        </Grid>
        <Divider className="my-2" sx={{ borderColor: muiTheme.palette.divider }} />
        <div className="grid grid-cols-2" style={{ gap: '8px' }}>
          <Button variant="contained" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Add funds</Button>
          <Button variant="outlined" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>View receipt</Button>
        </div>
      </Box>
    ),
    ai: (
      <Box className="rounded-2xl" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper', p: { xs: 2, sm: 3 } }}>
        <div className="flex items-center mb-2" style={{ gap: '8px', color: muiTheme.palette.text.primary }}>
          <SmartToyRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
          <span className="font-semibold" style={{ fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>AI Chatbot</span>
          <Chip size="small" label="Enabled" sx={{ bgcolor: EV.green, color:'#fff', ml:'auto', fontSize: { xs: '11px', sm: '12px' }, height: { xs: 22, sm: 24 } }} />
        </div>
        <div style={{ color: muiTheme.palette.text.primary, fontSize: '13px' }}>This chat may use AI suggestions and translations. Sensitive modules may disable AI features.</div>
        <Divider className="my-2" sx={{ borderColor: muiTheme.palette.divider }} />
        <div className="grid grid-cols-2" style={{ gap: '8px' }}>
          <Button variant="contained" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>View usage</Button>
          <Button variant="outlined" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Settings</Button>
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
