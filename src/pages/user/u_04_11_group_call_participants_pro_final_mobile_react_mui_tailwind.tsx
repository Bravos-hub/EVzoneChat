import { useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  Button,
  Divider
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import MicOffRoundedIcon from "@mui/icons-material/MicOffRounded";
import MicNoneRoundedIcon from "@mui/icons-material/MicNoneRounded";
import VideocamOffRoundedIcon from "@mui/icons-material/VideocamOffRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import CallEndRoundedIcon from "@mui/icons-material/CallEndRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import SignalCellularAltRoundedIcon from "@mui/icons-material/SignalCellularAltRounded";
import { useCall } from "../../context/CallContext";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

// Demo data: used only when no real participants prop is provided
const BASE = [
  { name: "Eduardo", role: "host" },
  { name: "Kayle", role: "cohost" },
  { name: "Richards", role: "member" },
  { name: "KB", role: "member" },
  { name: "Samira", role: "member" },
  { name: "Chen", role: "member" },
  { name: "Diana", role: "member" },
  { name: "Miguel", role: "member" },
  { name: "Fatima", role: "member" },
  { name: "Omar", role: "member" }
];

const DEMO = BASE.map((p, i) => ({
  id: `u${i + 1}`,
  name: p.name,
  avatar: `https://i.pravatar.cc/120?img=${(i % 10) + 1}`,
  video: i % 3 !== 0,
  muted: i % 4 === 0,
  active: i % 2 === 0,
  role: p.role,
  handRaised: i % 3 === 0
}));

function ParticipantTile({ p }) {
  const isVoiceOnly = !p.video;

  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-black border ${
        p.active ? "ring-2 ring-ev-green" : ""
      }`}
      style={{ borderColor: "rgba(255,255,255,0.24)", aspectRatio: "9/16" }}
    >
      <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center">
        {isVoiceOnly ? (
          <Avatar src={p.avatar} sx={{ width: 56, height: 56 }} />
        ) : (
          <Typography variant="h6" sx={{ opacity: 0.7 }}>
            Video
          </Typography>
        )}
      </div>
      <div className="absolute inset-x-2 bottom-2 flex items-center gap-1 text-white">
        <Avatar src={p.avatar} sx={{ width: 20, height: 20 }} />
        <span className="text-[11px] truncate">{p.name}</span>
        {p.muted && <MicOffRoundedIcon sx={{ fontSize: 14, opacity: 0.8 }} />}
        {isVoiceOnly && <VideocamOffRoundedIcon sx={{ fontSize: 14, opacity: 0.8 }} />}
        {p.handRaised && (
          <span className="ml-1 text-[11px] border border-yellow-400 rounded-full px-1">
            ✋
          </span>
        )}
        {p.role !== "member" && (
          <Chip
            size="small"
            label={p.role}
            sx={{
              ml: "auto",
              height: 18,
              px: 0.8,
              fontSize: 10,
              textTransform: "capitalize",
              bgcolor: "rgba(0,0,0,0.6)",
              border: `1px solid ${EV.orange}`
            }}
          />
        )}
      </div>
    </div>
  );
}

/**
 * GroupCallParticipants (Pro, Mobile)
 *
 * Props:
 *  - participants?: Array<{ id, name, avatar, video, muted, active, role, handRaised? }>
 *  - onParticipantsChange?: (nextParticipants) => void
 *  - onBack?: () => void
 *  - onEnd?: () => void
 *  - onNavigate?: (path) => void
 */
export default function GroupCallParticipants({
  onBack,
  participants,
  onParticipantsChange,
  onEnd,
  onNavigate
}) {
  const { endCall } = useCall();
  const [localParticipants, setLocalParticipants] = useState(DEMO);
  const people = participants || localParticipants;

  const [openDrawer, setOpenDrawer] = useState(false);
  const [menuEl, setMenuEl] = useState(null);
  const [layout, setLayout] = useState("grid"); // 'grid' | 'speaker'
  const [filter, setFilter] = useState("all");  // 'all' | 'hosts' | 'muted' | 'hand'
  
  // Call controls state
  const [muted, setMuted] = useState(false);
  const [videoOn, setVideoOn] = useState(true);

  const host = useMemo(
    () => people.find((p) => p.role === "host") || people[0],
    [people]
  );
  const activeCount = useMemo(
    () => people.filter((p) => p.active).length,
    [people]
  );

  const updateParticipants = (updater) => {
    if (participants && onParticipantsChange) {
      const next = updater(participants);
      onParticipantsChange(next);
    } else {
      setLocalParticipants((prev) => updater(prev));
    }
  };

  const muteAll = () =>
    updateParticipants((prev) => prev.map((p) => ({ ...p, muted: true })));

  const promote = (id) =>
    updateParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, role: "cohost" } : p))
    );

  const remove = (id) =>
    updateParticipants((prev) => prev.filter((p) => p.id !== id));

  const toggleMuteUser = (id) =>
    updateParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, muted: !p.muted } : p))
    );

  const filteredParticipants = useMemo(
    () =>
      people.filter((p) => {
        if (filter === "all") return true;
        if (filter === "hosts") return p.role === "host" || p.role === "cohost";
        if (filter === "muted") return p.muted;
        if (filter === "hand") return p.handRaised;
        return true;
      }),
    [people, filter]
  );

  const closeMenu = () => setMenuEl(null);

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none`}</style>

      {/* Responsive container - mobile-first, scales up for larger screens */}
      <Box className="w-full h-full bg-black text-white flex flex-col" sx={{ maxWidth: { xs: '100%', sm: '600px', md: '800px', lg: '1000px' }, mx: 'auto' }}>
        {/* Header — responsive */}
        <AppBar
          elevation={0}
          position="fixed"
          sx={{ bgcolor: "rgba(0,0,0,0.75)", color: "#fff", width: "100%", maxWidth: { xs: '100%', sm: '600px', md: '800px', lg: '1000px' }, mx: 'auto' }}
        >
          <Toolbar
            className="!min-h-[56px]"
            sx={{ width: "100%", px: { xs: 1, sm: 2 } }}
          >
            <IconButton
              onClick={onBack}
              aria-label="Back"
              sx={{ color: "#fff", mr: 1 }}
            >
              <ArrowBackRoundedIcon />
            </IconButton>
            <Avatar src={host?.avatar} sx={{ width: 32, height: 32, mr: 1 }} />
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography variant="subtitle1" className="font-semibold" noWrap>
                Group Call
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <Typography variant="caption" className="text-gray-300">
                  {activeCount} speaking
                </Typography>
                <Typography variant="caption" className="text-gray-400">
                  • {people.length} in call
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
              <IconButton
                aria-label="More"
                onClick={(e) => setMenuEl(e.currentTarget)}
                sx={{ color: "#fff" }}
              >
                <MoreVertRoundedIcon />
              </IconButton>
              <IconButton
                aria-label="Participants"
                onClick={() => setOpenDrawer(true)}
                sx={{ color: "#fff" }}
              >
                <PeopleAltRoundedIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Header menu (includes speaker/grid toggle) */}
        <Menu
          anchorEl={menuEl}
          open={Boolean(menuEl)}
          onClose={closeMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              width: { xs: '90vw', sm: 360 },
              maxWidth: "calc(100vw - 16px)",
              mx: "auto",
              borderRadius: 2,
              py: 0.5
            }
          }}
        >
          {/* Layout toggle */}
          <MenuItem
            selected={layout === "grid"}
            onClick={() => {
              setLayout("grid");
              closeMenu();
            }}
          >
            <ListItemIcon>
              <PeopleAltRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Grid view" />
          </MenuItem>
          <MenuItem
            selected={layout === "speaker"}
            onClick={() => {
              setLayout("speaker");
              closeMenu();
            }}
          >
            <ListItemIcon>
              <VolumeUpRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Speaker view" />
          </MenuItem>

          <Divider sx={{ my: 0.5 }} />

          {/* Global actions */}
          <MenuItem
            onClick={() => {
              muteAll();
              closeMenu();
            }}
          >
            <ListItemIcon>
              <VolumeUpRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Mute all" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              closeMenu();
              alert("Open call chat");
            }}
          >
            <ListItemIcon>
              <ChatBubbleOutlineRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Open call chat" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              closeMenu();
              alert("Report call quality");
            }}
          >
            <ListItemIcon>
              <SignalCellularAltRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Report call quality" />
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem
            onClick={() => {
              closeMenu();
              alert("Help");
            }}
          >
            <ListItemIcon>
              <HelpOutlineRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Help" />
          </MenuItem>
        </Menu>

        {/* Scrollable grid/speaker area - responsive grid */}
        <Box
          className="flex-1 no-scrollbar"
          sx={{ overflowY: "auto", pt: "56px", pb: "88px", px: { xs: 2, sm: 3 } }}
        >
          {layout === "grid" ? (
            <Box sx={{ 
              display: 'grid', 
              gap: 2, 
              gridTemplateColumns: { 
                xs: 'repeat(2, 1fr)', 
                sm: 'repeat(3, 1fr)', 
                md: 'repeat(4, 1fr)', 
                lg: 'repeat(5, 1fr)' 
              } 
            }}>
              {people.map((p) => (
                <ParticipantTile key={p.id} p={p} />
              ))}
            </Box>
          ) : (
            <Box className="space-y-2">
              <Box className="rounded-2xl overflow-hidden border border-white/20">
                <ParticipantTile p={host} />
              </Box>
              <Box sx={{ 
                display: 'grid', 
                gap: 2, 
                gridTemplateColumns: { 
                  xs: 'repeat(3, 1fr)', 
                  sm: 'repeat(4, 1fr)', 
                  md: 'repeat(5, 1fr)', 
                  lg: 'repeat(6, 1fr)' 
                } 
              }}>
                {people
                  .filter((p) => p.id !== host.id)
                  .map((p) => (
                    <ParticipantTile key={p.id} p={p} />
                  ))}
              </Box>
            </Box>
          )}
        </Box>

        {/* Call Controls Bar - responsive */}
        <Box
          className="fixed inset-x-0 bottom-0 flex justify-center z-10"
          sx={{ pb: "env(safe-area-inset-bottom)" }}
        >
          <Box className="w-full px-3 pb-3" sx={{ maxWidth: { xs: '100%', sm: '600px', md: '800px', lg: '1000px' } }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: "rgba(255,255,255,0.1)",
                borderRadius: 2,
                px: 3,
                py: 2,
                backdropFilter: "blur(12px)",
                gap: 1,
                flexWrap: "wrap"
              }}
            >
              {/* Mute/Unmute */}
              <IconButton
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? "Unmute microphone" : "Mute microphone"}
                sx={{
                  color: "#fff",
                  flexShrink: 0,
                  bgcolor: muted ? "rgba(255,255,255,0.2)" : "transparent"
                }}
              >
                {muted ? <MicOffRoundedIcon /> : <MicNoneRoundedIcon />}
              </IconButton>

              {/* Video On/Off */}
              <IconButton
                onClick={() => setVideoOn((v) => !v)}
                aria-label={videoOn ? "Turn camera off" : "Turn camera on"}
                sx={{
                  color: "#fff",
                  flexShrink: 0,
                  bgcolor: !videoOn ? "rgba(255,255,255,0.2)" : "transparent"
                }}
              >
                {videoOn ? <VideocamRoundedIcon /> : <VideocamOffRoundedIcon />}
              </IconButton>

              {/* Speaker */}
              <IconButton
                aria-label="Speaker"
                sx={{ color: "#fff", flexShrink: 0 }}
              >
                <VolumeUpRoundedIcon />
              </IconButton>

              {/* Chat */}
              <IconButton
                onClick={() => {
                  onNavigate?.("/conversation/new");
                }}
                aria-label="Open chat"
                sx={{ color: "#fff", flexShrink: 0 }}
              >
                <ChatBubbleOutlineRoundedIcon />
              </IconButton>

              {/* End Call - Prominent */}
              <IconButton
                onClick={() => {
                  endCall(); // End call in global context
                  onEnd?.(); // Call onEnd callback
                  // Navigate back after a brief delay
                  setTimeout(() => {
                    onNavigate?.(-1);
                  }, 100);
                }}
                aria-label="End call"
                sx={{
                  color: "#fff",
                  bgcolor: "#e53935",
                  "&:hover": { bgcolor: "#c62828" },
                  "&:active": { bgcolor: "#b71c1c", transform: "scale(0.95)" },
                  width: "3rem",
                  height: "3rem",
                  flexShrink: 0,
                  transition: "all 0.2s ease"
                }}
              >
                <CallEndRoundedIcon sx={{ fontSize: 24 }} />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Participants Drawer (bottom sheet) */}
        <Drawer
          anchor="bottom"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxWidth: { xs: '100%', sm: '600px', md: '800px' },
              mx: "auto"
            }
          }}
        >
          <Box className="p-3">
            {/* handle bar */}
            <div
              className="w-10 h-1 rounded-full mx-auto mb-2"
              style={{ background: EV.light }}
            />
            {/* header row */}
            <div className="flex items-center justify-between mb-2">
              <Typography variant="subtitle1" className="font-semibold">
                Participants
              </Typography>
              <Chip
                size="small"
                label={people.length}
                sx={{ bgcolor: EV.light }}
              />
            </div>

            {/* Filters: All / Hosts / Muted / Hand raised */}
            <Box className="flex gap-1 mb-2">
              <Chip
                label="All"
                size="small"
                color={filter === "all" ? "primary" : "default"}
                onClick={() => setFilter("all")}
              />
              <Chip
                label="Hosts"
                size="small"
                color={filter === "hosts" ? "primary" : "default"}
                onClick={() => setFilter("hosts")}
              />
              <Chip
                label="Muted"
                size="small"
                color={filter === "muted" ? "primary" : "default"}
                onClick={() => setFilter("muted")}
              />
              <Chip
                label="Hand raised"
                size="small"
                color={filter === "hand" ? "primary" : "default"}
                onClick={() => setFilter("hand")}
              />
            </Box>

            {/* Filtered list */}
            <List className="no-scrollbar" sx={{ maxHeight: 360, overflowY: "auto" }}>
              {filteredParticipants.map((p) => (
                <ListItem
                  key={p.id}
                  secondaryAction={
                    <div className="flex items-center gap-1">
                      <Button
                        size="small"
                        onClick={() => toggleMuteUser(p.id)}
                        startIcon={p.muted ? <VolumeUpRoundedIcon /> : <MicOffRoundedIcon />}
                        variant="outlined"
                        sx={{
                          borderColor: EV.orange,
                          color: EV.orange,
                          textTransform: "none"
                        }}
                      >
                        {p.muted ? "Unmute" : "Mute"}
                      </Button>
                      {p.role === "member" && (
                        <Button
                          size="small"
                          onClick={() => promote(p.id)}
                          startIcon={<StarRoundedIcon />}
                          variant="outlined"
                          sx={{
                            borderColor: EV.orange,
                            color: EV.orange,
                            textTransform: "none"
                          }}
                        >
                          Promote
                        </Button>
                      )}
                      <Button
                        size="small"
                        onClick={() => remove(p.id)}
                        startIcon={<RemoveCircleOutlineRoundedIcon />}
                        variant="outlined"
                        sx={{
                          borderColor: EV.orange,
                          color: EV.orange,
                          textTransform: "none"
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  }
                >
                  <ListItemAvatar>
                    <Avatar src={p.avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={<span className="font-semibold">{p.name}</span>}
                    secondary={`${p.role}${p.muted ? " • muted" : ""}${
                      !p.video ? " • video off" : ""
                    }${p.handRaised ? " • hand raised" : ""}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Box>
    </>
  );
}

/*
  ===== Tests (React Testing Library) — copy to GroupCallParticipants.test.jsx =====

  import React from 'react';
  import { render, screen } from '@testing-library/react';
  import GroupCallParticipants from './GroupCallParticipants';

  test('renders group call header and participants count', () => {
    render(<GroupCallParticipants />);
    expect(screen.getByText(/Group Call/i)).toBeInTheDocument();
    expect(screen.getByText(/in call/i)).toBeInTheDocument();
  });

  test('shows many participant tiles', () => {
    render(<GroupCallParticipants />);
    expect(screen.getByText(/Eduardo/i)).toBeInTheDocument();
    expect(screen.getByText(/Kayle/i)).toBeInTheDocument();
  });
*/
