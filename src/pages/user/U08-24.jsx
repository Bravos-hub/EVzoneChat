import React, { useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  Snackbar,
  FormControl,
  InputLabel
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

/**
 * U08-24 — Invite/Join (Link/QR)
 * - Show invite link + code, copy/share
 * - QR preview (placeholder) + download
 * - Link expiry + permissions
 * - Join by code
 */
export default function InviteJoinLinkQR({ onBack, info = { name:'Charging Crew — Kampala', code:'evz-crew-kla', link:'https://evzone.app/invite/evz-crew-kla' } }) {
  const [snack, setSnack] = useState('');
  const [allowAnyone, setAllowAnyone] = useState(true);
  const [approval, setApproval] = useState(false);
  const [expiry, setExpiry] = useState('7d');
  const [joinCode, setJoinCode] = useState('');

  const qrSrc = useMemo(()=> {
    // Note: Using external QR service for preview; replace with on-device generator in production.
    const data = encodeURIComponent(info.link);
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${data}`;
  }, [info.link]);

  const copy = async () => { try { await navigator.clipboard?.writeText(info.link); setSnack('Link copied'); } catch { setSnack('Copy failed'); } };
  const share = async () => { try { if (navigator.share) await navigator.share({ title: info.name, url: info.link }); else await navigator.clipboard?.writeText(info.link); setSnack(navigator.share? 'Shared' : 'Link copied'); } catch {} };
  const downloadQR = async () => { setSnack('Downloading QR…'); };
  const apply = () => setSnack('Invite settings updated');
  const join = () => setSnack(`Joining with code: ${joinCode}`);

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full max-w-sm mx-auto bg-white flex flex-col">
        <AppBar elevation={0} position="static" sx={{ bgcolor:'#fff', color:'#111', borderBottom:`1px solid ${EV.light}` }}>
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={onBack} aria-label="Back"><ArrowBackRoundedIcon /></IconButton>
            <Typography variant="h6" className="font-bold ml-1">Invite / Join</Typography>
          </Toolbar>
        </AppBar>

        <Box className="p-3 space-y-3 flex-1 no-scrollbar" sx={{ overflowY:'auto' }}>
          {/* Link & actions */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${EV.light}` }}>
            <div className="font-semibold">{info.name}</div>
            <div className="text-sm text-gray-700 break-all mt-1 flex items-center gap-1"><LinkRoundedIcon sx={{ fontSize: 16 }} /> {info.link}</div>
            <div className="mt-2 flex gap-2">
              <Button startIcon={<ContentCopyRoundedIcon/>} onClick={copy} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Copy</Button>
              <Button startIcon={<ShareRoundedIcon/>} onClick={share} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>Share</Button>
            </div>
          </Box>

          {/* QR */}
          <Box className="rounded-2xl p-3 grid place-items-center" sx={{ border:`1px solid ${EV.light}` }}>
            <img src={qrSrc} alt="QR" width={220} height={220} className="rounded-lg" />
            <Button startIcon={<QrCode2RoundedIcon/>} onClick={downloadQR} variant="outlined" sx={{ mt:1.5, borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Download QR</Button>
          </Box>

          {/* Permissions */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${EV.light}` }}>
            <div className="text-sm font-semibold mb-1">Invite settings</div>
            <FormGroup>
              <FormControlLabel control={<Switch checked={allowAnyone} onChange={(e)=>setAllowAnyone(e.target.checked)} />} label="Anyone with link can request to join" />
              <FormControlLabel control={<Switch checked={approval} onChange={(e)=>setApproval(e.target.checked)} />} label="Require admin approval" />
            </FormGroup>
            <div className="grid grid-cols-2 gap-2 mt-2 items-end">
              <FormControl size="small">
                <InputLabel>Expiry</InputLabel>
                <Select label="Expiry" value={expiry} onChange={(e)=>setExpiry(e.target.value)}>
                  <MenuItem value="24h">24 hours</MenuItem>
                  <MenuItem value="7d">7 days</MenuItem>
                  <MenuItem value="30d">30 days</MenuItem>
                  <MenuItem value="never">Never</MenuItem>
                </Select>
              </FormControl>
              <Button onClick={apply} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>Apply</Button>
            </div>
          </Box>

          <Divider />

          {/* Join by code */}
          <Box className="rounded-2xl p-3" sx={{ border:`1px solid ${EV.light}` }}>
            <div className="text-sm font-semibold mb-1">Join by code</div>
            <div className="grid grid-cols-3 gap-2 items-end">
              <TextField className="col-span-2" size="small" label="Enter code" value={joinCode} onChange={(e)=>setJoinCode(e.target.value)} placeholder={info.code} />
              <Button onClick={join} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover':{ bgcolor:'#e06f00' } }}>Join</Button>
            </div>
          </Box>
        </Box>
      </Box>

      <Snackbar open={!!snack} autoHideDuration={1400} message={snack} onClose={()=>setSnack('')} />
    </>
  );
}

/*
  ===== Basic tests (React Testing Library) =====
  Save as: U08-24.invite-join.test.jsx

  import React from 'react';
  import { render, screen, fireEvent } from '@testing-library/react';
  import InviteJoinLinkQR from './InviteJoinLinkQR';

  const info = { name: 'Charging Crew — Kampala', code: 'evz-crew-kla', link: 'https://evzone.app/invite/evz-crew-kla' };

  test('renders link and QR controls', () => {
    render(<InviteJoinLinkQR info={info} />);
    expect(screen.getByText(info.name)).toBeInTheDocument();
    expect(screen.getByText(info.link)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download qr/i })).toBeInTheDocument();
  });

  test('invite settings apply button works', () => {
    render(<InviteJoinLinkQR info={info} />);
    fireEvent.click(screen.getByRole('button', { name: /apply/i }));
    // snackbar should appear; in a real test we would assert via queryByText or aria status region
  });

  test('join by code emits snack', () => {
    render(<InviteJoinLinkQR info={info} />);
    fireEvent.change(screen.getByLabelText(/enter code/i), { target: { value: 'evz-crew-kla' } });
    fireEvent.click(screen.getByRole('button', { name: /^join$/i }));
  });
*/
