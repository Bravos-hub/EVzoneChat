import { useMemo, useState } from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
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

// const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

/**
 * U12-34 — Safety Center
 * - Recording consent
 * - Sensitive context reminders
 * - Report abuse form
 * - Blocked words notice
 */
export default function SafetyCenter({ onBack, layoutMode = 'mobile' }) {
  const muiTheme = useMuiTheme();
  // const { actualMode } = useTheme();
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

      <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: 'transparent' }}>
        <AppBar elevation={0} position="static" sx={{ bgcolor: 'transparent', color: 'text.primary', borderBottom:`1px solid ${muiTheme.palette.divider}` }}>
          <Toolbar className="!min-h-[56px]" sx={{ px: { xs: 1.5, sm: 3 } }}>
            <IconButton onClick={onBack} aria-label="Back" sx={{ color: 'text.primary', padding: { xs: '6px', sm: '8px' } }}>
              <ArrowBackRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <Typography variant="h6" className="font-bold" sx={{ color: 'text.primary', fontSize: { xs: '16px', sm: '18px' }, ml: { xs: 0.5, sm: 1 } }}>Safety Center</Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 2, sm: 3 }, flex: 1, overflowY: 'auto' }} className="no-scrollbar">
          {/* Recording consent */}
          <Paper elevation={0} sx={{ border:`1px solid ${muiTheme.palette.divider}`, borderRadius:2, p: { xs: 2, sm: 2.5 }, bgcolor: 'background.paper', mb: { xs: 2, sm: 3 } }}>
            <div className="flex items-center mb-1" style={{ gap: '8px', color: muiTheme.palette.text.primary }}>
              <PrivacyTipRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              <span className="font-semibold" style={{ fontSize: '15px' }}>Recording consent</span>
            </div>
            <FormGroup>
              <FormControlLabel control={<Switch checked={recordConsent} onChange={(e)=>setRecordConsent(e.target.checked)} />} label={<span style={{ color: muiTheme.palette.text.primary, fontSize: '14px' }}>I consent to call recording when enabled</span>} />
            </FormGroup>
            <Alert severity="info" sx={{ mt: 1, fontSize: { xs: '12px', sm: '14px' } }}>When recording is on, a banner is shown to all participants and a tone may play.</Alert>
          </Paper>

          {/* Sensitive context reminders */}
          <Paper elevation={0} sx={{ border:`1px solid ${muiTheme.palette.divider}`, borderRadius:2, p: { xs: 2, sm: 2.5 }, bgcolor: 'background.paper', mb: { xs: 2, sm: 3 } }}>
            <div className="flex items-center mb-1" style={{ gap: '8px', color: muiTheme.palette.text.primary }}>
              <InfoRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              <span className="font-semibold" style={{ fontSize: '15px' }}>Sensitive contexts</span>
            </div>
            <div style={{ color: muiTheme.palette.text.primary, fontSize: '13px', marginBottom: '8px' }}>These modules apply stricter privacy rules and may limit AI features:</div>
            <div className="flex flex-wrap mb-2" style={{ gap: '8px' }}>
              {sensitiveModules.map(m => (<Chip key={m} size="small" label={m} sx={{ bgcolor: 'background.default', color: 'text.primary', fontSize: { xs: '11px', sm: '12px' }, height: { xs: 22, sm: 24 } }} />))}
            </div>
            <FormGroup>
              <FormControlLabel control={<Switch checked={remindSensitive} onChange={(e)=>setRemindSensitive(e.target.checked)} />} label={<span style={{ color: muiTheme.palette.text.primary, fontSize: '14px' }}>Show reminders when I chat in sensitive modules</span>} />
            </FormGroup>
          </Paper>

          {/* Report abuse */}
          <Paper elevation={0} sx={{ border:`1px solid ${muiTheme.palette.divider}`, borderRadius:2, p: { xs: 2, sm: 2.5 }, bgcolor: 'background.paper', mb: { xs: 2, sm: 3 } }}>
            <div className="flex items-center mb-1" style={{ gap: '8px', color: muiTheme.palette.text.primary }}>
              <ReportRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              <span className="font-semibold" style={{ fontSize: '15px' }}>Report abuse</span>
            </div>
            <div className="grid grid-cols-2 mb-2 items-end" style={{ gap: '8px' }}>
              <FormControl size="small">
                <InputLabel sx={{ fontSize: { xs: '13px', sm: '14px' } }}>Module</InputLabel>
                <Select label="Module" value={module} onChange={(e)=>setModule(e.target.value)} sx={{ fontSize: { xs: '13px', sm: '14px' } }}>
                  {['Marketplace','Rides','School','Medical','Charging','Travel','Investments','Faith','Social','Workspace','Wallet','AI Bot'].map(m => (<MenuItem key={m} value={m} sx={{ fontSize: { xs: '13px', sm: '14px' } }}>{m}</MenuItem>))}
                </Select>
              </FormControl>
              <FormControl size="small">
                <InputLabel sx={{ fontSize: { xs: '13px', sm: '14px' } }}>Type</InputLabel>
                <Select label="Type" value={abuseType} onChange={(e)=>setAbuseType(e.target.value)} sx={{ fontSize: { xs: '13px', sm: '14px' } }}>
                  <MenuItem value="harassment" sx={{ fontSize: { xs: '13px', sm: '14px' } }}>Harassment</MenuItem>
                  <MenuItem value="scam" sx={{ fontSize: { xs: '13px', sm: '14px' } }}>Scam / Fraud</MenuItem>
                  <MenuItem value="spam" sx={{ fontSize: { xs: '13px', sm: '14px' } }}>Spam</MenuItem>
                  <MenuItem value="illegal" sx={{ fontSize: { xs: '13px', sm: '14px' } }}>Illegal content</MenuItem>
                  <MenuItem value="other" sx={{ fontSize: { xs: '13px', sm: '14px' } }}>Other</MenuItem>
                </Select>
              </FormControl>
            </div>
            <TextField multiline minRows={3} fullWidth placeholder="Describe what happened (no personal data)" value={details} onChange={(e)=>setDetails(e.target.value)} sx={{ '& .MuiInputBase-input': { fontSize: { xs: '13px', sm: '14px' } } }} />
            <div className="mt-2 flex justify-end">
              <Button onClick={submitReport} startIcon={<ReportRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />} variant="contained" sx={{ textTransform:'none', fontSize: { xs: '12px', sm: '13px' }, py: { xs: 0.5, sm: 0.75 } }}>Submit report</Button>
            </div>
          </Paper>

          {/* Blocked words notice */}
          <Paper elevation={0} sx={{ border:`1px solid ${muiTheme.palette.divider}`, borderRadius:2, p: { xs: 2, sm: 2.5 }, bgcolor: 'background.paper' }}>
            <div className="flex items-center mb-1" style={{ gap: '8px', color: muiTheme.palette.text.primary }}>
              <BlockRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              <span className="font-semibold" style={{ fontSize: '15px' }}>Blocked words & contact masking</span>
            </div>
            <div style={{ color: muiTheme.palette.text.primary, fontSize: '13px' }}>Messages may be filtered or masked if they contain these items in certain modules:</div>
            <div className="flex flex-wrap mt-2" style={{ gap: '8px' }}>
              {bannedWords.map(w => (<Chip key={w} size="small" label={w} sx={{ bgcolor: 'background.default', color: 'text.primary', fontSize: { xs: '11px', sm: '12px' }, height: { xs: 22, sm: 24 } }} />))}
              <Chip size="small" label="emails/phones masked in Marketplace" sx={{ bgcolor: 'background.default', color: 'text.primary', fontSize: { xs: '11px', sm: '12px' }, height: { xs: 22, sm: 24 } }} />
            </div>
          </Paper>
        </Box>

        <Box sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
          <div className="grid grid-cols-2" style={{ gap: '8px' }}>
            <Button variant="outlined" sx={{ textTransform:'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.75, sm: 1 } }}>Close</Button>
            <Button onClick={()=>setSnack('Safety preferences saved')} variant="contained" sx={{ textTransform:'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.75, sm: 1 } }}>Save</Button>
          </div>
        </Box>
      </Box>

      <Snackbar open={!!snack} autoHideDuration={1500} message={snack} onClose={()=>setSnack('')} />
    </>
  );
}

