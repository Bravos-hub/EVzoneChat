import type React from "react";
import { useState } from "react";
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import BrushRoundedIcon from "@mui/icons-material/BrushRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import DesktopChatWorkspace from "./DesktopChatWorkspace";
import { useCall } from "../context/CallContext";
import { isValidChatChannel } from "../constants/chatChannels";

const navMap: Record<string, string> = {
  inbox: "/inbox",
  calls: "/call",
  dealz: "/dealz",
  events: "/meetings",
  settings: "/settings",
};

const Screen = ({ title }) => (
  <Box className="p-4 space-y-3">
    <Typography variant="h6" className="font-semibold">
      {title}
    </Typography>
    <Box className="rounded-2xl p-4 shadow-sm" sx={{ bgcolor: "background.paper" }}>
      <Typography variant="body2" sx={{ color: "text.primary" }}>
        Placeholder content for {title}.
      </Typography>
    </Box>
  </Box>
);

function getComponent(registry, id, fallback) {
  const Component = registry?.[id];
  if (Component) return Component;
  return fallback || (() => <Screen title={id || "Page"} />);
}

function useDesktopTabFromLocation() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/call") || pathname.startsWith("/group-call")) return "calls";
  if (pathname.startsWith("/meetings")) return "events";
  if (pathname.startsWith("/dealz")) return "dealz";
  if (pathname.startsWith("/settings") || pathname.startsWith("/security")) return "settings";
  return "inbox";
}

function DesktopRail() {
  const muiTheme = useMuiTheme();
  const navigate = useNavigate();
  const activeTab = useDesktopTabFromLocation();
  const [menuEl, setMenuEl] = useState<null | HTMLElement>(null);

  const menuOpen = Boolean(menuEl);
  const openMenu = (event: React.MouseEvent<HTMLElement>) => setMenuEl(event.currentTarget);
  const closeMenu = () => setMenuEl(null);
  const go = (path: string) => {
    closeMenu();
    navigate(path);
  };

  const navItems = [
    { key: "inbox", label: "Inbox", icon: <ChatBubbleOutlineRoundedIcon /> },
    { key: "calls", label: "Calls", icon: <PhoneRoundedIcon /> },
    { key: "dealz", label: "Dealz", icon: <ShoppingBagRoundedIcon /> },
    { key: "events", label: "Events", icon: <EventAvailableRoundedIcon /> },
    { key: "settings", label: "Settings", icon: <SettingsRoundedIcon /> },
  ];

  return (
    <Box className="desktop-rail" sx={{ borderRight: `1px solid ${muiTheme.palette.divider}` }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
        <Tooltip title="EVzone" placement="right">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: "primary.main",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "17px",
            }}
          >
            E
          </Box>
        </Tooltip>

        {navItems.map((item) => (
          <Tooltip key={item.key} title={item.label} placement="right">
            <IconButton
              onClick={() => navigate(navMap[item.key])}
              sx={{
                color: activeTab === item.key ? "primary.main" : "text.secondary",
                bgcolor: activeTab === item.key ? "action.selected" : "transparent",
                width: 44,
                height: 44,
                borderRadius: 2,
              }}
            >
              {item.key === "inbox" ? (
                <Badge
                  color="error"
                  badgeContent={3}
                  overlap="circular"
                  sx={{
                    "& .MuiBadge-badge": {
                      right: -4,
                      top: -2,
                      fontSize: "10px",
                      minWidth: "16px",
                      height: "16px",
                    },
                  }}
                >
                  {item.icon}
                </Badge>
              ) : (
                item.icon
              )}
            </IconButton>
          </Tooltip>
        ))}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
        <Tooltip title="More" placement="right">
          <IconButton
            onClick={openMenu}
            sx={{
              color: "text.secondary",
              width: 44,
              height: 44,
              borderRadius: 2,
            }}
          >
            <MoreHorizRoundedIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Menu
        anchorEl={menuEl}
        open={menuOpen}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "center", horizontal: "right" }}
        transformOrigin={{ vertical: "center", horizontal: "left" }}
        PaperProps={{
          sx: {
            width: 260,
            borderRadius: 2,
            py: 0.5,
            "& .MuiMenuItem-root": {
              color: "text.primary",
            },
          },
        }}
      >
        <MenuItem onClick={() => go("/new-message")}>
          <ListItemIcon>
            <AddRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="New message" />
        </MenuItem>
        <MenuItem onClick={() => go("/create-channel")}>
          <ListItemIcon>
            <GroupAddRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Create group / channel" />
        </MenuItem>
        <MenuItem onClick={() => go("/invite")}>
          <ListItemIcon>
            <QrCode2RoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Invite via QR" />
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={() => go("/profile")}>
          <ListItemIcon>
            <PersonRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </MenuItem>
        <MenuItem onClick={() => go("/theme")}>
          <ListItemIcon>
            <BrushRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Theme" />
        </MenuItem>
        <MenuItem onClick={() => go("/safety")}>
          <ListItemIcon>
            <ShieldRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Safety Center" />
        </MenuItem>
        <MenuItem onClick={() => go("/help")}>
          <ListItemIcon>
            <HelpOutlineRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Help" />
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={closeMenu}>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    </Box>
  );
}

function DesktopFrame({ children }) {
  const muiTheme = useMuiTheme();

  return (
    <Box
      className="desktop-shell"
      sx={{
        bgcolor: muiTheme.palette.background.default,
        transition: "background-color 0.3s ease",
      }}
    >
      <DesktopRail />
      <Box className="desktop-main">{children}</Box>
    </Box>
  );
}

function RouteWrapper({
  Component,
  registry,
  layoutMode = "desktop",
  ...props
}: {
  Component?: React.ComponentType<any>;
  registry?: any;
  layoutMode?: "mobile" | "desktop";
  [key: string]: any;
}): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { endCall } = useCall();

  const isConversationNewRoute = location.pathname === "/conversation/new";
  const routeParams = new URLSearchParams(location.search);
  const routeModule = routeParams.get("module");

  if (isConversationNewRoute && !isValidChatChannel(routeModule || "")) {
    const redirectParams = new URLSearchParams();
    const contacts = routeParams.get("contacts");
    const group = routeParams.get("group");
    const forward = routeParams.get("forward");

    if (contacts) redirectParams.set("contacts", contacts);
    if (group) redirectParams.set("group", group);
    if (forward) redirectParams.set("forward", forward);

    const redirectSearch = redirectParams.toString();
    return <Navigate to={`/new-message${redirectSearch ? `?${redirectSearch}` : ""}`} replace />;
  }

  const navProps: any = {
    onBack: () => navigate(-1),
    onClose: () => navigate(-1),
    onNavigate: navigate,
    onEnd: () => {
      endCall();
      navigate(-1);
    },
    location,
    onOpen: (item) => {
      if (item?.id) {
        const moduleParam = item?.module ? `?module=${encodeURIComponent(item.module)}` : "";
        navigate(`/conversation/${item.id}${moduleParam}`);
      }
    },
    onNew: () => navigate("/new-message"),
    onRefresh: () => {
      console.log("Refresh triggered");
    },
    onLiveOpen: (live) => {
      if (live?.host) {
        navigate(
          `/call?type=video&contact=${encodeURIComponent(live.host)}&state=connecting&live=${live.id}&module=${live.module || "School"}`
        );
      } else if (live?.id) {
        navigate(`/call?type=video&state=connecting&live=${live.id}`);
      }
    },
    onModuleChange: (module) => {
      console.log("Module changed to:", module);
    },
    onStart: (selected, forwardMessages, module) => {
      if (selected && selected.length > 0) {
        const params = new URLSearchParams();
        params.set("contacts", selected.join(","));
        if (selected.length > 1) params.set("group", "true");
        if (forwardMessages && forwardMessages.length > 0) params.set("forward", forwardMessages.join(","));
        if (module) params.set("module", module);
        navigate(`/conversation/new?${params.toString()}`);
      }
    },
    onOpenResult: (result) => {
      if (!result) return;

      const { type, id, name } = result;
      const nameParam = name ? `&name=${encodeURIComponent(name)}` : "";

      switch (type) {
        case "person":
          navigate(`/conversation/${id}${nameParam ? "?" + nameParam.substring(1) : ""}`);
          break;
        case "channel":
          navigate(`/conversation/${id}?type=channel${nameParam}`);
          break;
        case "group":
          navigate(`/conversation/${id}?type=group${nameParam}`);
          break;
        case "message":
          navigate(`/conversation/${id}?message=${id}${nameParam}`);
          break;
        case "thread":
          navigate(`/conversation/${id}?thread=${id}${nameParam}`);
          break;
        default:
          if (id) {
            navigate(`/conversation/${id}${nameParam ? "?" + nameParam.substring(1) : ""}`);
          }
      }
    },
  };

  if (!Component) return <Screen title="Page not found" />;
  return <Component {...navProps} {...props} registry={registry} layoutMode={layoutMode} />;
}

export default function EVZUserDesktopShell({ registry: externalRegistry = {} }) {
  const registry = externalRegistry;
  const Inbox = getComponent(registry, "U01-03", () => <Screen title="Messages" />);
  const Search = getComponent(registry, "U03-09", () => <Screen title="Search" />);
  const Call = getComponent(registry, "U04-10", () => <Screen title="Calls" />);
  const GroupCallParticipants = getComponent(registry, "U04-11", () => <Screen title="Group Call Participants" />);
  const Media = getComponent(registry, "U03-08", () => <Screen title="Media" />);
  const Dealz = getComponent(registry, "U11-31", () => <Screen title="Dealz" />);
  const Settings = getComponent(registry, "U10-29", () => <Screen title="Settings" />);
  const Security = getComponent(registry, "U10-28", () => <Screen title="Security" />);
  const CreateChannel = getComponent(registry, "U08-22", () => <Screen title="Create group / channel" />);
  const Invite = getComponent(registry, "U08-24", () => <Screen title="Scan QR / Invite link" />);
  const Theme = getComponent(registry, "U10-30", () => <Screen title="Theme" />);
  const Language = getComponent(registry, "U10-29", () => <Screen title="Language" />);
  const DND = getComponent(registry, "U09-27", () => <Screen title="Quiet hours / DND" />);
  const Safety = getComponent(registry, "U12-34", () => <Screen title="Safety Center" />);
  const Profile = getComponent(registry, "U09-25", () => <Screen title="Profile" />);
  const NewMessage = getComponent(registry, "U02-04", () => <Screen title="New Message" />);
  const Conversation = getComponent(registry, "U02-05", () => <Screen title="Conversation" />);
  const Help = getComponent(registry, "U12-34", () => <Screen title="Help Center" />);

  const MeetingBooking = getComponent(registry, "U-M1", () => <Screen title="Book Meeting" />);
  const MyMeetings = getComponent(registry, "U-M2", () => <Screen title="My Meetings" />);
  const MeetingDetails = getComponent(registry, "U-M3", () => <Screen title="Meeting Details" />);
  const PublicBooking = getComponent(registry, "U-M4", () => <Screen title="Book Time" />);
  const MeetingConfirmation = getComponent(registry, "U-M5", () => <Screen title="Meeting Confirmed" />);
  const MyAvailability = getComponent(registry, "U-M6", () => <Screen title="My Availability" />);
  const LiveMeeting = getComponent(registry, "U-M7", () => <Screen title="Live Meeting" />);

  return (
    <HashRouter>
      <DesktopFrame>
        <Routes>
          <Route path="/" element={<Navigate to="/inbox" replace />} />

          <Route
            path="/inbox"
            element={
              <DesktopChatWorkspace
                listPane={<RouteWrapper Component={Inbox} layoutMode="desktop" />}
                showPlaceholder
              />
            }
          />
          <Route
            path="/conversation/:id"
            element={
              <DesktopChatWorkspace
                listPane={<RouteWrapper Component={Inbox} layoutMode="desktop" />}
                rightPane={<RouteWrapper Component={Conversation} layoutMode="desktop" />}
              />
            }
          />
          <Route
            path="/conversation/new"
            element={
              <DesktopChatWorkspace
                listPane={<RouteWrapper Component={Inbox} layoutMode="desktop" />}
                rightPane={<RouteWrapper Component={Conversation} layoutMode="desktop" />}
              />
            }
          />
          <Route
            path="/new-message"
            element={
              <DesktopChatWorkspace
                listPane={<RouteWrapper Component={Inbox} layoutMode="desktop" />}
                rightPane={<RouteWrapper Component={NewMessage} layoutMode="desktop" />}
              />
            }
          />

          <Route path="/search" element={<RouteWrapper Component={Search} layoutMode="desktop" />} />
          <Route path="/media" element={<RouteWrapper Component={Media} layoutMode="desktop" />} />
          <Route path="/dealz" element={<RouteWrapper Component={Dealz} layoutMode="desktop" />} />
          <Route path="/settings" element={<RouteWrapper Component={Settings} layoutMode="desktop" />} />
          <Route path="/security" element={<RouteWrapper Component={Security} layoutMode="desktop" />} />
          <Route path="/create-channel" element={<RouteWrapper Component={CreateChannel} layoutMode="desktop" />} />
          <Route path="/invite" element={<RouteWrapper Component={Invite} layoutMode="desktop" />} />
          <Route path="/theme" element={<RouteWrapper Component={Theme} layoutMode="desktop" />} />
          <Route path="/language" element={<RouteWrapper Component={Language} layoutMode="desktop" />} />
          <Route path="/dnd" element={<RouteWrapper Component={DND} layoutMode="desktop" />} />
          <Route path="/safety" element={<RouteWrapper Component={Safety} layoutMode="desktop" />} />
          <Route path="/profile" element={<RouteWrapper Component={Profile} layoutMode="desktop" />} />
          <Route path="/help" element={<RouteWrapper Component={Help} layoutMode="desktop" />} />

          <Route path="/meetings" element={<RouteWrapper Component={MyMeetings} registry={registry} layoutMode="desktop" />} />
          <Route path="/meetings/book" element={<RouteWrapper Component={MeetingBooking} registry={registry} layoutMode="desktop" />} />
          <Route path="/meetings/:id" element={<RouteWrapper Component={MeetingDetails} registry={registry} layoutMode="desktop" />} />
          <Route path="/meetings/book/:slug" element={<RouteWrapper Component={PublicBooking} registry={registry} layoutMode="desktop" />} />
          <Route path="/meetings/confirm/:id" element={<RouteWrapper Component={MeetingConfirmation} registry={registry} layoutMode="desktop" />} />
          <Route path="/meetings/availability" element={<RouteWrapper Component={MyAvailability} registry={registry} layoutMode="desktop" />} />

          <Route path="/call" element={<RouteWrapper Component={Call} layoutMode="desktop" />} />
          <Route path="/group-call" element={<RouteWrapper Component={GroupCallParticipants} layoutMode="desktop" />} />
          <Route path="/call/participants" element={<RouteWrapper Component={GroupCallParticipants} layoutMode="desktop" />} />
          <Route path="/meetings/live/:id" element={<RouteWrapper Component={LiveMeeting} registry={registry} layoutMode="desktop" />} />
        </Routes>
      </DesktopFrame>
    </HashRouter>
  );
}
