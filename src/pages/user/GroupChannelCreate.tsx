import { useEffect, useState } from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  TextField,
  Chip,
  Button,
  FormGroup,
  FormControlLabel,
  Switch,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

const MODULES = ["Marketplace","Rides","School","Medical","Charging","Travel","Investments","Faith","Social","Workspace","Wallet","AI Bot"];

/**
 * U08-22 — Create Group/Channel
 * - Types: Open / Private / Announcement
 * - Posting mode: Auto-approve / Pre-approval / Admin-only
 * - Options: allow media, mentions, approval to join, list in directory
 */
export default function GroupChannelCreate({ onBack, onCreated }) {
  const muiTheme = useMuiTheme();
  const [snack, setSnack] = useState("");

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [module, setModule] = useState("Marketplace");

  const [type, setType] = useState("Open"); // Open | Private | Announcement
  const [posting, setPosting] = useState("Auto-approve"); // Auto-approve | Pre-approval | Admin-only

  const [allowMedia, setAllowMedia] = useState(true);
  const [allowMentions, setAllowMentions] = useState(true);
  const [joinApproval, setJoinApproval] = useState(false);
  const [listDirectory, setListDirectory] = useState(true);

  // If announcement-only, enforce Admin-only posting
  useEffect(()=>{ if (type === 'Announcement') setPosting('Admin-only'); }, [type]);

  const disabled = !name.trim();

  const save = () => {
    const payload = { name, desc, module, type, posting, options:{ allowMedia, allowMentions, joinApproval, listDirectory } };
    setSnack('Group/Channel created');
    onCreated?.(payload);
  };

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: 'transparent' }}>
        <AppBar elevation={0} position="static" sx={{ bgcolor: 'transparent', color:'text.primary', borderBottom:`1px solid ${muiTheme.palette.divider}` }}>
          <Toolbar className="!min-h-[56px]" sx={{ px: { xs: 1.5, sm: 3 } }}>
            <IconButton onClick={onBack} aria-label="Back" sx={{ color: 'text.primary', padding: { xs: '6px', sm: '8px' } }}>
              <ArrowBackRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <Typography variant="h6" className="font-bold" sx={{ color: 'text.primary', fontSize: { xs: '16px', sm: '18px' }, ml: { xs: 0.5, sm: 1 } }}>Create group/channel</Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 2, sm: 3 }, '& > * + *': { mt: { xs: 2, sm: 3 } }, flex: 1, overflowY: 'auto' }} className="no-scrollbar">
          <TextField 
            fullWidth 
            label="Name" 
            value={name} 
            onChange={(e)=>setName(e.target.value)} 
            placeholder="e.g., Charging Crew — Kampala"
            sx={{
              '& .MuiInputBase-input': {
                color: 'text.primary',
                fontSize: { xs: '14px', sm: '16px' },
              },
            }}
          />
          <TextField 
            fullWidth 
            label="Description" 
            value={desc} 
            onChange={(e)=>setDesc(e.target.value)} 
            multiline 
            minRows={2} 
            placeholder="What is this group/channel about?"
            sx={{
              '& .MuiInputBase-input': {
                color: 'text.primary',
                fontSize: { xs: '14px', sm: '16px' },
              },
            }}
          />

          {/* module */}
          <FormControl size="small" fullWidth>
            <InputLabel sx={{ fontSize: { xs: '13px', sm: '14px' } }}>Module</InputLabel>
            <Select label="Module" value={module} onChange={(e)=>setModule(e.target.value)} sx={{ fontSize: { xs: '13px', sm: '14px' } }}>
              {MODULES.map(m => (<MenuItem key={m} value={m} sx={{ fontSize: { xs: '13px', sm: '14px' } }}>{m}</MenuItem>))}
            </Select>
          </FormControl>

          {/* type */}
          <Box>
            <div className="font-semibold mb-1" style={{ color: muiTheme.palette.text.primary, fontSize: '14px' }}>Type</div>
            <div className="flex flex-wrap" style={{ gap: '8px' }}>
              {['Open','Private','Announcement'].map(t => (
                <Chip 
                  key={t} 
                  label={t} 
                  onClick={()=>setType(t)} 
                  sx={{ 
                    bgcolor: type===t?EV.green:'background.default', 
                    color: type===t?'#fff':'text.primary', 
                    fontSize: { xs: '12px', sm: '13px' },
                    height: { xs: 28, sm: 32 },
                    '&:hover':{ bgcolor: type===t?'#02b37b':'action.hover' } 
                  }} 
                />
              ))}
            </div>
          </Box>

          {/* posting mode */}
          <Box>
            <div className="font-semibold mb-1" style={{ color: muiTheme.palette.text.primary, fontSize: '14px' }}>Posting mode</div>
            <div className="flex flex-wrap" style={{ gap: '8px' }}>
              {['Auto-approve','Pre-approval','Admin-only'].map(pm => (
                <Chip 
                  key={pm} 
                  label={pm} 
                  onClick={()=>setPosting(pm)} 
                  disabled={type==='Announcement' && pm!=='Admin-only'}
                  sx={{ 
                    bgcolor: posting===pm?EV.green:'background.default', 
                    color: posting===pm?'#fff':'text.primary', 
                    fontSize: { xs: '12px', sm: '13px' },
                    height: { xs: 28, sm: 32 },
                    opacity: type==='Announcement' && pm!=='Admin-only'?0.5:1, 
                    '&:hover':{ bgcolor: posting===pm?'#02b37b':'action.hover' } 
                  }} 
                />
              ))}
            </div>
            {type==='Announcement' && (
              <div className="mt-1 flex items-center" style={{ gap: '4px', color: muiTheme.palette.text.secondary, fontSize: '12px' }}>
                <InfoRoundedIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: 'text.secondary' }} /> 
                <span>Announcement channels require Admin-only posting.</span>
              </div>
            )}
          </Box>

          <Divider />

          {/* options */}
          <Box className="rounded-2xl" sx={{ border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper', p: { xs: 2, sm: 3 } }}>
            <div className="font-semibold mb-1" style={{ color: muiTheme.palette.text.primary, fontSize: '14px' }}>Options</div>
            <FormGroup>
              <FormControlLabel 
                control={<Switch checked={allowMedia} onChange={(e)=>setAllowMedia(e.target.checked)} />} 
                label={<span style={{ color: muiTheme.palette.text.primary, fontSize: '14px' }}>Allow media & files</span>} 
              />
              <FormControlLabel 
                control={<Switch checked={allowMentions} onChange={(e)=>setAllowMentions(e.target.checked)} />} 
                label={<span style={{ color: muiTheme.palette.text.primary, fontSize: '14px' }}>Allow @mentions</span>} 
              />
              <FormControlLabel 
                control={<Switch checked={joinApproval} onChange={(e)=>setJoinApproval(e.target.checked)} />} 
                label={<span style={{ color: muiTheme.palette.text.primary, fontSize: '14px' }}>Require approval to join</span>} 
              />
              <FormControlLabel 
                control={<Switch checked={listDirectory} onChange={(e)=>setListDirectory(e.target.checked)} />} 
                label={<span style={{ color: muiTheme.palette.text.primary, fontSize: '14px' }}>List in directory (discoverable)</span>} 
              />
            </FormGroup>
          </Box>
        </Box>

        {/* footer */}
        <Box sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
            <div className="grid grid-cols-2" style={{ gap: '8px' }}>
            <Button variant="outlined" sx={{ textTransform:'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.75, sm: 1 } }} onClick={()=>{ setName(''); setDesc(''); setType('Open'); setPosting('Auto-approve'); setAllowMedia(true); setAllowMentions(true); setJoinApproval(false); setListDirectory(true); }}>Reset</Button>
            <Button disabled={disabled} variant="contained" sx={{ textTransform:'none', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.75, sm: 1 } }} onClick={save}>Create</Button>
          </div>
        </Box>
      </Box>

      <Snackbar open={!!snack} autoHideDuration={1400} message={snack} onClose={()=>setSnack('')} />
    </>
  );
}
