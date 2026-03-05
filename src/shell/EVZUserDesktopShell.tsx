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
import DesktopPageWorkspace from "./DesktopPageWorkspace";
import { useCall } from "../context/CallContext";
import { isValidChatChannel } from "../constants/chatChannels";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PermMediaRoundedIcon from "@mui/icons-material/PermMediaRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import DoNotDisturbOnRoundedIcon from "@mui/icons-material/DoNotDisturbOnRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

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
      className="desktop-shell desktop-wa-compact"
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
  const pageWorkspace = (
    Component: React.ComponentType<any>,
    title: string,
    icon: React.ReactNode,
    extraProps: Record<string, any> = {}
  ) => (
    <DesktopPageWorkspace
      title={title}
      icon={icon}
      leftPane={<RouteWrapper Component={Component} layoutMode="desktop" {...extraProps} />}
    />
  );

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

          <Route path="/search" element={pageWorkspace(Search, "Search", <SearchRoundedIcon sx={{ fontSize: 64 }} />)} />
          <Route path="/media" element={pageWorkspace(Media, "Media", <PermMediaRoundedIcon sx={{ fontSize: 64 }} />)} />
          <Route path="/dealz" element={pageWorkspace(Dealz, "Dealz", <ShoppingBagRoundedIcon sx={{ fontSize: 64 }} />)} />
          <Route path="/settings" element={pageWorkspace(Settings, "Settings", <SettingsRoundedIcon sx={{ fontSize: 64 }} />)} />
          <Route path="/security" element={pageWorkspace(Security, "Security", <ShieldRoundedIcon sx={{ fontSize: 64 }} />)} />
          <Route path="/create-channel" element={pageWorkspace(CreateChannel, "Create Group", <GroupAddRoundedIcon sx={{ fontSize: 64 }} />)} />
          <Route path="/invite" element={pageWorkspace(Invite, "Invite", <QrCode2RoundedIcon sx={{ fontSize: 64 }} />)} />
          <Route path="/theme" element={pageWorkspace(Theme, "Theme", <BrushRoundedIcon sx={{ fontSize: 64 }} />)} />
          <Route path="/language" element={pageWorkspace(Language, "Language", <TranslateRoundedIcon sx={{ fontSize: 64 }} />)} />
          <Route path="/dnd" element={pageWorkspace(DND, "Do Not Disturb", <DoNotDisturbOnRoundedIcon sx={{ fontSize: 64 }} />)} />
          <Route path="/safety" element={pageWorkspace(Safety, "Safety Center", <ShieldRoundedIcon sx={{ fontSize: 64 }} />)} />
          <Route path="/profile" element={pageWorkspace(Profile, "Profile", <PersonRoundedIcon sx={{ fontSize: 64 }} />)} />
          <Route path="/help" element={pageWorkspace(Help, "Help", <HelpOutlineRoundedIcon sx={{ fontSize: 64 }} />)} />

          <Route
            path="/meetings"
            element={pageWorkspace(MyMeetings, "My Meetings", <CalendarMonthRoundedIcon sx={{ fontSize: 64 }} />, {
              registry,
            })}
          />
          <Route
            path="/meetings/book"
            element={pageWorkspace(MeetingBooking, "Schedule Meeting", <CalendarMonthRoundedIcon sx={{ fontSize: 64 }} />, {
              registry,
            })}
          />
          <Route
            path="/meetings/:id"
            element={pageWorkspace(MeetingDetails, "Meeting Details", <CalendarMonthRoundedIcon sx={{ fontSize: 64 }} />, {
              registry,
            })}
          />
          <Route
            path="/meetings/book/:slug"
            element={pageWorkspace(PublicBooking, "Public Booking", <CalendarMonthRoundedIcon sx={{ fontSize: 64 }} />, {
              registry,
            })}
          />
          <Route
            path="/meetings/confirm/:id"
            element={pageWorkspace(MeetingConfirmation, "Meeting Confirmed", <CalendarMonthRoundedIcon sx={{ fontSize: 64 }} />, {
              registry,
            })}
          />
          <Route
            path="/meetings/availability"
            element={pageWorkspace(MyAvailability, "Availability", <CalendarMonthRoundedIcon sx={{ fontSize: 64 }} />, {
              registry,
            })}
          />

          <Route path="/call" element={<RouteWrapper Component={Call} layoutMode="desktop" />} />
          <Route path="/group-call" element={<RouteWrapper Component={GroupCallParticipants} layoutMode="desktop" />} />
          <Route path="/call/participants" element={<RouteWrapper Component={GroupCallParticipants} layoutMode="desktop" />} />
          <Route path="/meetings/live/:id" element={<RouteWrapper Component={LiveMeeting} registry={registry} layoutMode="desktop" />} />
        </Routes>
      </DesktopFrame>
    </HashRouter>
  );
}
