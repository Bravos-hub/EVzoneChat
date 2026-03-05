import { useState } from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { useTheme } from "../../context/ThemeContext";
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
  const muiTheme = useMuiTheme();
  const { accentColor } = useTheme();
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

      <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: 'transparent' }}>
        <AppBar elevation={0} position="static" sx={{ bgcolor: 'transparent', color: 'text.primary', borderBottom: `1px solid ${muiTheme.palette.divider}` }}>
          <Toolbar className="!min-h-[56px]" sx={{ px: { xs: 1.5, sm: 3 } }}>
            <IconButton onClick={onClose} aria-label="Close" sx={{ color: 'text.primary', padding: { xs: '6px', sm: '8px' } }}>
              <CloseRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <Typography variant="h6" className="font-bold" sx={{ color: 'text.primary', fontSize: { xs: '16px', sm: '18px' }, ml: { xs: 0.5, sm: 1 } }}>First‑time Setup</Typography>
          </Toolbar>
        </AppBar>

        <Box className="flex-1" sx={{ overflowY: 'auto', p: { xs: 2, sm: 3, md: 4 }, '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <Typography variant="subtitle1" className="font-semibold mb-2" sx={{ color: 'text.primary', fontSize: { xs: '15px', sm: '16px' } }}>Enable access & confirm consents</Typography>
          <Typography variant="body2" className="mb-3" sx={{ color: 'text.secondary', fontSize: { xs: '13px', sm: '14px' } }}>Allow the permissions below, then confirm your consents. You can change these later in Settings.</Typography>

          {err && <Alert role="status" aria-live="polite" severity="warning" className="mb-3">{err}</Alert>}

          {/* Permissions */}
          <Paper elevation={0} sx={{ border: `1px solid ${muiTheme.palette.divider}`, borderRadius: 2, overflow: 'hidden', bgcolor: 'background.paper' }}>
            <List>
              <ListItem
                sx={{
                  '& .MuiListItemText-primary': {
                    color: 'text.primary',
                  },
                  '& .MuiListItemText-secondary': {
                    color: 'text.secondary',
                  },
                }}
              >
                <ListItemText primary={<span className="font-semibold">Microphone</span>} secondary="Required for voice calls & voice notes" />
                <ListItemSecondaryAction>
                  <Button aria-label="Allow microphone" onClick={requestMic} size="small" variant="outlined" sx={{ textTransform: 'none', fontSize: { xs: '12px', sm: '13px' }, padding: { xs: '4px 12px', sm: '6px 16px' } }}>Allow</Button>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem
                sx={{
                  '& .MuiListItemText-primary': {
                    color: 'text.primary',
                  },
                  '& .MuiListItemText-secondary': {
                    color: 'text.secondary',
                  },
                }}
              >
                <ListItemText primary={<span className="font-semibold">Camera</span>} secondary="Optional, needed for video calls" />
                <ListItemSecondaryAction>
                  <Button aria-label="Allow camera" onClick={requestCam} size="small" variant="outlined" sx={{ textTransform: 'none', fontSize: { xs: '12px', sm: '13px' }, padding: { xs: '4px 12px', sm: '6px 16px' } }}>Allow</Button>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem
                sx={{
                  '& .MuiListItemText-primary': {
                    color: 'text.primary',
                  },
                  '& .MuiListItemText-secondary': {
                    color: 'text.secondary',
                  },
                }}
              >
                <ListItemText primary={<span className="font-semibold">Notifications</span>} secondary="Required for message alerts & call ringing" />
                <ListItemSecondaryAction>
                  <Button aria-label="Allow notifications" onClick={requestNotif} size="small" variant="outlined" sx={{ textTransform: 'none', fontSize: { xs: '12px', sm: '13px' }, padding: { xs: '4px 12px', sm: '6px 16px' } }}>Allow</Button>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>

          {/* Granted states */}
          <Box className="mt-3 space-y-2" sx={{ gap: { xs: 1, sm: 1.5 } }}>
            <Box className="flex items-center" sx={{ gap: { xs: 1, sm: 1.5 } }}>
              {mic ? <CheckCircleRoundedIcon sx={{ color: EV.green, fontSize: { xs: 18, sm: 20 } }} /> : <RadioButtonUncheckedRoundedIcon sx={{ color: 'text.secondary', fontSize: { xs: 18, sm: 20 } }} />}
              <Typography variant="body2" sx={{ color: 'text.primary', fontSize: { xs: '13px', sm: '14px' } }}>Microphone {mic ? 'granted' : 'required'}</Typography>
            </Box>
            <Box className="flex items-center" sx={{ gap: { xs: 1, sm: 1.5 } }}>
              {cam ? <CheckCircleRoundedIcon sx={{ color: EV.green, fontSize: { xs: 18, sm: 20 } }} /> : <RadioButtonUncheckedRoundedIcon sx={{ color: 'text.secondary', fontSize: { xs: 18, sm: 20 } }} />}
              <Typography variant="body2" sx={{ color: 'text.primary', fontSize: { xs: '13px', sm: '14px' } }}>Camera {cam ? 'granted' : 'optional'}</Typography>
            </Box>
            <Box className="flex items-center" sx={{ gap: { xs: 1, sm: 1.5 } }}>
              {notif ? <CheckCircleRoundedIcon sx={{ color: EV.green, fontSize: { xs: 18, sm: 20 } }} /> : <RadioButtonUncheckedRoundedIcon sx={{ color: 'text.secondary', fontSize: { xs: 18, sm: 20 } }} />}
              <Typography variant="body2" sx={{ color: 'text.primary', fontSize: { xs: '13px', sm: '14px' } }}>Notifications {notif ? 'granted' : 'required'}</Typography>
            </Box>
          </Box>

          {/* Consents */}
          <Typography variant="subtitle1" className="font-semibold mt-4 mb-2" sx={{ color: 'text.primary', fontSize: { xs: '15px', sm: '16px' } }}>Consents</Typography>
          <Paper elevation={0} sx={{ border: `1px solid ${muiTheme.palette.divider}`, borderRadius: 2, bgcolor: 'background.paper' }}>
            <List>
              <ListItem
                sx={{
                  '& .MuiListItemText-primary': {
                    color: 'text.primary',
                  },
                  '& .MuiListItemText-secondary': {
                    color: 'text.secondary',
                  },
                }}
              >
                <Checkbox sx={{ color: accentColor, '&.Mui-checked': { color: accentColor } }} checked={recordingConsent} onChange={(e)=>setRecordingConsent(e.target.checked)} />
                <ListItemText primary={<span className="font-semibold">I consent to call recording when enabled</span>} secondary="A banner is shown to all participants during recording. Stored securely per EVzone policy." />
              </ListItem>
              <Divider />
              <ListItem
                sx={{
                  '& .MuiListItemText-primary': {
                    color: 'text.primary',
                  },
                  '& .MuiListItemText-secondary': {
                    color: 'text.secondary',
                  },
                }}
              >
                <Checkbox sx={{ color: EV.orange, '&.Mui-checked': { color: EV.orange } }} checked={sensitiveConsent} onChange={(e)=>setSensitiveConsent(e.target.checked)} />
                <ListItemText primary={<span className="font-semibold">I acknowledge sensitive/medical chats have stricter privacy</span>} secondary="Certain modules apply extra safeguards. Avoid sharing unnecessary personal data." />
              </ListItem>
            </List>
          </Paper>

          <Button disabled={busy} onClick={allowAll} fullWidth variant="outlined" sx={{ mt: 3, textTransform: 'none', fontSize: { xs: '14px', sm: '15px' }, py: { xs: 1, sm: 1.25 } }}>Allow all</Button>
          <Button disabled={!canContinue || busy} onClick={() => onContinue?.({ granted: { mic, cam, notif }, consents: { recordingConsent, sensitiveConsent } })} fullWidth variant="contained" size="large" sx={{ mt: 1.5, textTransform: 'none', fontSize: { xs: '15px', sm: '16px' }, py: { xs: 1.25, sm: 1.5 } }}>Continue</Button>

          <Typography variant="caption" className="mt-2 block" sx={{ color: 'text.secondary', fontSize: { xs: '11px', sm: '12px' } }}>By continuing, you agree to EVzone Terms & Privacy.</Typography>
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
