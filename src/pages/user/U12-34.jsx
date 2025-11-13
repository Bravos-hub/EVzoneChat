import React, { useMemo, useState } from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { useTheme } from "../../context/ThemeContext";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Paper,
  Switch,
  FormControlLabel,
  FormGroup,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PrivacyTipRoundedIcon from "@mui/icons-material/PrivacyTipRounded";
import ReportRoundedIcon from "@mui/icons-material/ReportRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

/**
 * U12-34 — Safety Center
 * - Recording consent
 * - Sensitive context reminders
 * - Report abuse form
 * - Blocked words notice
 */
export default function SafetyCenter({ onBack }) {
  const muiTheme = useMuiTheme();
  const { actualMode } = useTheme();
  const [recordConsent, setRecordConsent] = useState(false);
  const [remindSensitive, setRemindSensitive] = useState(true);
  const [module, setModule] = useState('Medical');
  const [abuseType, setAbuseType] = useState('harassment');
  const [details, setDetails] = useState('');
  const [snack, setSnack] = useState('');

  const sensitiveModules = ['Medical','Charging','School','Faith','Wallet'];
  const bannedWords = useMemo(()=> ['spam','scam','explicit','hate','contact details'], []);

  const submitReport = () => {
    if (!details.trim()) { setSnack('Please describe the issue.'); return; }
    setSnack('Report submitted. Our moderators will review.');
    setDetails('');
  };

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: 'background.default' }}>
        <AppBar elevation={0} position="static" sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom:`1px solid ${muiTheme.palette.divider}` }}>
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={onBack} aria-label="Back" sx={{ color: 'text.primary' }}><ArrowBackRoundedIcon /></IconButton>
            <Typography variant="h6" className="font-bold ml-1" sx={{ color: 'text.primary' }}>Safety Center</Typography>
          </Toolbar>
        </AppBar>

        <Box className="flex-1 p-3 space-y-3 no-scrollbar" sx={{ overflowY:'auto' }}>
          {/* Recording consent */}
          <Paper elevation={0} sx={{ border:`1px solid ${muiTheme.palette.divider}`, borderRadius:2, p:2, bgcolor: 'background.paper' }}>
            <div className="flex items-center gap-2 mb-1" style={{ color: muiTheme.palette.text.primary }}><PrivacyTipRoundedIcon/><span className="font-semibold">Recording consent</span></div>
            <FormGroup>
              <FormControlLabel control={<Switch checked={recordConsent} onChange={(e)=>setRecordConsent(e.target.checked)} />} label={<span style={{ color: muiTheme.palette.text.primary }}>I consent to call recording when enabled</span>} />
            </FormGroup>
            <Alert severity="info" sx={{ mt: 1 }}>When recording is on, a banner is shown to all participants and a tone may play.</Alert>
          </Paper>

          {/* Sensitive context reminders */}
          <Paper elevation={0} sx={{ border:`1px solid ${muiTheme.palette.divider}`, borderRadius:2, p:2, bgcolor: 'background.paper' }}>
            <div className="flex items-center gap-2 mb-1" style={{ color: muiTheme.palette.text.primary }}><InfoRoundedIcon/><span className="font-semibold">Sensitive contexts</span></div>
            <div className="text-sm mb-2" style={{ color: muiTheme.palette.text.primary }}>These modules apply stricter privacy rules and may limit AI features:</div>
            <div className="flex gap-2 flex-wrap mb-2">
              {sensitiveModules.map(m => (<Chip key={m} size="small" label={m} sx={{ bgcolor: 'background.default', color: 'text.primary' }} />))}
            </div>
            <FormGroup>
              <FormControlLabel control={<Switch checked={remindSensitive} onChange={(e)=>setRemindSensitive(e.target.checked)} />} label={<span style={{ color: muiTheme.palette.text.primary }}>Show reminders when I chat in sensitive modules</span>} />
            </FormGroup>
          </Paper>

          {/* Report abuse */}
          <Paper elevation={0} sx={{ border:`1px solid ${muiTheme.palette.divider}`, borderRadius:2, p:2, bgcolor: 'background.paper' }}>
            <div className="flex items-center gap-2 mb-1" style={{ color: muiTheme.palette.text.primary }}><ReportRoundedIcon/><span className="font-semibold">Report abuse</span></div>
            <div className="grid grid-cols-2 gap-2 mb-2 items-end">
              <FormControl size="small">
                <InputLabel>Module</InputLabel>
                <Select label="Module" value={module} onChange={(e)=>setModule(e.target.value)}>
                  {['Marketplace','Rides','School','Medical','Charging','Travel','Investments','Faith','Social','Workspace','Wallet','AI Bot'].map(m => (<MenuItem key={m} value={m}>{m}</MenuItem>))}
                </Select>
              </FormControl>
              <FormControl size="small">
                <InputLabel>Type</InputLabel>
                <Select label="Type" value={abuseType} onChange={(e)=>setAbuseType(e.target.value)}>
                  <MenuItem value="harassment">Harassment</MenuItem>
                  <MenuItem value="scam">Scam / Fraud</MenuItem>
                  <MenuItem value="spam">Spam</MenuItem>
                  <MenuItem value="illegal">Illegal content</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </div>
            <TextField multiline minRows={3} fullWidth placeholder="Describe what happened (no personal data)" value={details} onChange={(e)=>setDetails(e.target.value)} />
            <div className="mt-2 flex justify-end">
              <Button onClick={submitReport} startIcon={<ReportRoundedIcon/>} variant="contained" sx={{ textTransform:'none' }}>Submit report</Button>
            </div>
          </Paper>

          {/* Blocked words notice */}
          <Paper elevation={0} sx={{ border:`1px solid ${muiTheme.palette.divider}`, borderRadius:2, p:2, bgcolor: 'background.paper' }}>
            <div className="flex items-center gap-2 mb-1" style={{ color: muiTheme.palette.text.primary }}><BlockRoundedIcon/><span className="font-semibold">Blocked words & contact masking</span></div>
            <div className="text-sm" style={{ color: muiTheme.palette.text.primary }}>Messages may be filtered or masked if they contain these items in certain modules:</div>
            <div className="flex gap-2 flex-wrap mt-2">
              {bannedWords.map(w => (<Chip key={w} size="small" label={w} sx={{ bgcolor: 'background.default', color: 'text.primary' }} />))}
              <Chip size="small" label="emails/phones masked in Marketplace" sx={{ bgcolor: 'background.default', color: 'text.primary' }} />
            </div>
          </Paper>
        </Box>

        <Box className="px-3 pb-3">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outlined" sx={{ textTransform:'none' }}>Close</Button>
            <Button onClick={()=>setSnack('Safety preferences saved')} variant="contained" sx={{ textTransform:'none' }}>Save</Button>
          </div>
        </Box>
      </Box>

      <Snackbar open={!!snack} autoHideDuration={1500} message={snack} onClose={()=>setSnack('')} />
    </>
  );
}
