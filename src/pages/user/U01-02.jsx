import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Checkbox,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";

// EVzone brand tokens
const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

/**
 * U01-02 — Onboarding & Permissions + Consents (Final)
 * Mobile-first, CRA + MUI + Tailwind (JS).
 * - Required: Microphone, Notifications, Recording Consent
 * - Optional: Camera (video calls)
 * - Configurable: Sensitive/Medical consent requirement via prop
 * - All CTAs use EV Orange for filled and outlined styles
 * - No visible scrollbars
 */
export default function OnboardingPermissionsFinal({ onClose, onContinue, requireSensitiveConsent = true }) {
  const [mic, setMic] = useState(false);
  const [cam, setCam] = useState(false);
  const [notif, setNotif] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const [recordingConsent, setRecordingConsent] = useState(false);
  const [sensitiveConsent, setSensitiveConsent] = useState(false);

  const handleError = (msg) => setErr(msg);

  const requestMic = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        handleError("Microphone not supported on this device");
        return;
      }
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMic(true);
    } catch (e) {
      handleError("Microphone permission denied");
    }
  };

  const requestCam = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        handleError("Camera not supported on this device");
        return;
      }
      await navigator.mediaDevices.getUserMedia({ video: true });
      setCam(true);
    } catch (e) {
      handleError("Camera permission denied");
    }
  };

  const requestNotif = async () => {
    try {
      if (typeof Notification === "undefined") {
        handleError("Notifications are not supported on this device");
        return;
      }
      const res = await Notification.requestPermission();
      setNotif(res === "granted");
      if (res !== "granted") handleError("Notification permission denied");
    } catch (e) {
      handleError("Notifications permission error");
    }
  };

  const allowAll = async () => {
    setBusy(true); setErr("");
    try {
      await requestMic();
      await requestCam();
      await requestNotif();
    } finally {
      setBusy(false);
    }
  };

  const canContinue = mic && notif && recordingConsent && (!requireSensitiveConsent || sensitiveConsent);

  return (
    <>
      {/* Hide scrollbars visually */}
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full mx-auto bg-white flex flex-col">
        <AppBar elevation={0} position="static" sx={{ bgcolor: '#fff', color: '#111', borderBottom: `1px solid ${EV.light}` }}>
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={onClose} aria-label="Close"><CloseRoundedIcon /></IconButton>
            <Typography variant="h6" className="font-bold ml-1">First‑time Setup</Typography>
          </Toolbar>
        </AppBar>

        <Box className="p-4 flex-1" sx={{ overflowY: 'auto', '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <Typography variant="subtitle1" className="font-semibold mb-2">Enable access & confirm consents</Typography>
          <Typography variant="body2" className="text-gray-600 mb-3">Allow the permissions below, then confirm your consents. You can change these later in Settings.</Typography>

          {err && <Alert role="status" aria-live="polite" severity="warning" className="mb-3">{err}</Alert>}

          {/* Permissions */}
          <Paper elevation={0} sx={{ border: `1px solid ${EV.light}`, borderRadius: 2, overflow: 'hidden' }}>
            <List>
              <ListItem>
                <ListItemText primary={<span className="font-semibold">Microphone</span>} secondary="Required for voice calls & voice notes" />
                <ListItemSecondaryAction>
                  <Button aria-label="Allow microphone" onClick={requestMic} size="small" variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform: 'none', '&:hover': { borderColor: '#e06f00', bgcolor: EV.light } }}>Allow</Button>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary={<span className="font-semibold">Camera</span>} secondary="Optional, needed for video calls" />
                <ListItemSecondaryAction>
                  <Button aria-label="Allow camera" onClick={requestCam} size="small" variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform: 'none', '&:hover': { borderColor: '#e06f00', bgcolor: EV.light } }}>Allow</Button>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary={<span className="font-semibold">Notifications</span>} secondary="Required for message alerts & call ringing" />
                <ListItemSecondaryAction>
                  <Button aria-label="Allow notifications" onClick={requestNotif} size="small" variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform: 'none', '&:hover': { borderColor: '#e06f00', bgcolor: EV.light } }}>Allow</Button>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>

          {/* Granted states */}
          <Box className="mt-3 space-y-2">
            <Box className="flex items-center gap-2">{mic ? <CheckCircleRoundedIcon sx={{ color: EV.green }} /> : <RadioButtonUncheckedRoundedIcon sx={{ color: EV.grey }} />}<Typography variant="body2">Microphone {mic ? 'granted' : 'required'}</Typography></Box>
            <Box className="flex items-center gap-2">{cam ? <CheckCircleRoundedIcon sx={{ color: EV.green }} /> : <RadioButtonUncheckedRoundedIcon sx={{ color: EV.grey }} />}<Typography variant="body2">Camera {cam ? 'granted' : 'optional'}</Typography></Box>
            <Box className="flex items-center gap-2">{notif ? <CheckCircleRoundedIcon sx={{ color: EV.green }} /> : <RadioButtonUncheckedRoundedIcon sx={{ color: EV.grey }} />}<Typography variant="body2">Notifications {notif ? 'granted' : 'required'}</Typography></Box>
          </Box>

          {/* Consents */}
          <Typography variant="subtitle1" className="font-semibold mt-4 mb-2">Consents</Typography>
          <Paper elevation={0} sx={{ border: `1px solid ${EV.light}`, borderRadius: 2 }}>
            <List>
              <ListItem>
                <Checkbox sx={{ color: EV.orange, '&.Mui-checked': { color: EV.orange } }} checked={recordingConsent} onChange={(e)=>setRecordingConsent(e.target.checked)} />
                <ListItemText primary={<span className="font-semibold">I consent to call recording when enabled</span>} secondary="A banner is shown to all participants during recording. Stored securely per EVzone policy." />
              </ListItem>
              <Divider />
              <ListItem>
                <Checkbox sx={{ color: EV.orange, '&.Mui-checked': { color: EV.orange } }} checked={sensitiveConsent} onChange={(e)=>setSensitiveConsent(e.target.checked)} />
                <ListItemText primary={<span className="font-semibold">I acknowledge sensitive/medical chats have stricter privacy</span>} secondary="Certain modules apply extra safeguards. Avoid sharing unnecessary personal data." />
              </ListItem>
            </List>
          </Paper>

          <Button disabled={busy} onClick={allowAll} fullWidth variant="outlined" sx={{ mt: 3, borderColor: EV.orange, color: EV.orange, textTransform: 'none', '&:hover': { borderColor: '#e06f00', bgcolor: EV.light } }}>Allow all</Button>
          <Button disabled={!canContinue || busy} onClick={() => onContinue?.({ granted: { mic, cam, notif }, consents: { recordingConsent, sensitiveConsent } })} fullWidth variant="contained" size="large" sx={{ mt: 1.5, bgcolor: EV.orange, textTransform: 'none', '&:hover': { bgcolor: '#e06f00' } }}>Continue</Button>

          <Typography variant="caption" className="text-gray-500 mt-2 block">By continuing, you agree to EVzone Terms & Privacy.</Typography>
        </Box>
      </Box>
    </>
  );
}

/*
  ===== Test cases (React Testing Library) =====
  Save as: U01-02.onboarding.test.jsx

  import React from 'react';
  import { render, screen, fireEvent, waitFor } from '@testing-library/react';
  import OnboardingPermissionsFinal from './OnboardingPermissionsFinal';

  // helpers to mock permissions
  const mockGUM = () => {
    global.navigator.mediaDevices = {
      getUserMedia: jest.fn().mockResolvedValue({})
    };
  };
  const mockNotification = (state = 'granted') => {
    global.Notification = { requestPermission: jest.fn().mockResolvedValue(state) };
  };

  test('Continue is disabled initially', () => {
    render(<OnboardingPermissionsFinal />);
    expect(screen.getByRole('button', { name: /continue/i })).toBeDisabled();
  });

  test('Allow all enables permissions and Continue after consents', async () => {
    mockGUM();
    mockNotification('granted');
    render(<OnboardingPermissionsFinal />);

    fireEvent.click(screen.getByRole('button', { name: /allow all/i }));

    // checkboxes must be ticked to proceed
    fireEvent.click(screen.getByLabelText(/consent to call recording/i, { selector: 'input' }));
    fireEvent.click(screen.getByLabelText(/sensitive\/medical chats/i, { selector: 'input' }));

    await waitFor(() => expect(screen.getByRole('button', { name: /continue/i })).not.toBeDisabled());
  });

  test('Sensitive consent can be optional when configured', async () => {
    mockGUM();
    mockNotification('granted');
    render(<OnboardingPermissionsFinal requireSensitiveConsent={false} />);

    fireEvent.click(screen.getByRole('button', { name: /allow all/i }));
    fireEvent.click(screen.getByLabelText(/consent to call recording/i, { selector: 'input' }));

    await waitFor(() => expect(screen.getByRole('button', { name: /continue/i })).not.toBeDisabled());
  });

*/
