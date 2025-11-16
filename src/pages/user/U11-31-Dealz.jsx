import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { useTheme } from "../../context/ThemeContext";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Divider,
  Dialog,
  FormControlLabel,
  Switch
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import PlayCircleFilledWhiteRoundedIcon from "@mui/icons-material/PlayCircleFilledWhiteRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

// Demo data for Dealz promo status rings
const DEMO_DEALZ = [
  {
    id: "u1",
    name: "Leslie Alexander",
    avatar: "https://i.pravatar.cc/100?img=5",
    isContact: true,
    followed: true,
    muted: false,
    promos: [
      {
        id: "p1",
        type: "promo-ad",
        title: "Flash Sale — EV Accessories",
        module: "E-Commerce",
        live: false,
        createdAt: "10m ago",
        seen: false,
      },
      {
        id: "p2",
        type: "live",
        title: "Charging Live Q&A",
        module: "Charging",
        live: true,
        createdAt: "Now",
        seen: false,
      },
    ],
  },
  {
    id: "u2",
    name: "Charging Dealz Channel",
    avatar: "https://i.pravatar.cc/100?img=12",
    isContact: false,
    followed: true,
    muted: false,
    promos: [
      {
        id: "p3",
        type: "promo-ad",
        title: "Super Off-Peak Rates",
        module: "Charging",
        live: false,
        createdAt: "30m ago",
        seen: false,
      },
    ],
  },
  {
    id: "u3",
    name: "Seller Hub",
    avatar: "https://i.pravatar.cc/100?img=8",
    isContact: false,
    followed: false,
    muted: false,
    promos: [
      {
        id: "p4",
        type: "live",
        title: "Seller Bootcamp Live",
        module: "E-Commerce",
        live: true,
        createdAt: "Live",
        seen: false,
      },
      {
        id: "p5",
        type: "promo-ad",
        title: "Free Listing Weekend",
        module: "E-Commerce",
        live: false,
        createdAt: "1h ago",
        seen: true,
      },
      {
        id: "p6",
        type: "live",
        title: "Live Seller Q&A",
        module: "E-Commerce",
        live: true,
        createdAt: "Starts soon",
        seen: false,
      },
    ],
  },
  {
    id: "u4",
    name: "My Dealz",
    avatar: "https://i.pravatar.cc/100?img=3",
    isContact: true,
    followed: true,
    muted: false,
    promos: [],
    isMe: true,
  },
];

// Build a WhatsApp-like segmented ring: one arc per ACTIVE promo with small gaps,
// unseen promos in accent color, seen promos in light grey. Fully viewed = full grey ring.
// For single active promo: solid accent color ring
// For multiple active promos: broken/dashed segments (one per active promo)
// Only counts active promos (Promo Ads and Live Sessions that are not seen)
function buildRingGradient(promos, accentColor) {
  // Filter to only active (unseen) promos - both Promo Ads and Live Sessions count
  const activePromos = promos.filter((p) => !p.seen);
  const totalActive = activePromos.length;
  const totalPromos = promos.length;
  
  // No promos at all
  if (!totalPromos) return "none";

  // If all promos seen, full grey ring
  if (promos.every((p) => p.seen)) {
    return `conic-gradient(${EV.grey} 0deg 360deg)`;
  }

  // Single active promo: solid accent color ring (full circle) - like WhatsApp status
  if (totalActive === 1) {
    return `conic-gradient(${accentColor} 0deg 360deg)`;
  }

  // Multiple active promos: broken/dashed segments
  // Each active promo gets a segment, with gaps between them
  // This creates the "broken ring" effect matching the number of active promos
  // The number of segments = number of active promos (both Promo Ads and Live Sessions)
  const baseArc = 360 / totalActive;
  const segArc = baseArc * 0.65; // 65% segment, 35% gap for clear broken effect
  const gapArc = baseArc - segArc;
  let currentAngle = 0;
  const parts = [];

  activePromos.forEach((promo) => {
    // All active promos use accent color (green)
    const color = accentColor;
    const start = currentAngle;
    const end = start + segArc;
    parts.push(`${color} ${start}deg ${end}deg`);
    currentAngle = end + gapArc;
  });

  return `conic-gradient(${parts.join(", ")})`;
}

function sortPromosForDisplay(promos) {
  // Live, unseen first, then unseen promo-ads, then seen promos
  return [...promos].sort((a, b) => {
    const score = (p) => (p.seen ? 0 : 2) + (p.type === "live" ? 1 : 0);
    return score(b) - score(a);
  });
}

function getPrimaryModule(entity) {
  const promos = sortPromosForDisplay(entity.promos || []);
  return promos[0]?.module || null;
}

function PromoRingAvatar({ entity, accentColor }) {
  const promos = entity.promos || [];
  // Count active promos (both Promo Ads and Live Sessions that are not seen)
  const activePromos = promos.filter((p) => !p.seen);
  const hasActivePromos = activePromos.length > 0;
  const hasAnyPromos = promos.length > 0;
  
  // Show ring if there are any active promos OR if all are seen (grey ring)
  const showRing = hasActivePromos || (hasAnyPromos && promos.every((p) => p.seen));
  const gradient = showRing ? buildRingGradient(promos, accentColor) : "none";

  return (
    <Box
      sx={{
        width: 52,
        height: 52,
        borderRadius: "999px",
        backgroundImage: gradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: showRing ? 0.8 : 0,
        transition: "all 0.2s ease",
      }}
    >
      <Avatar
        src={entity.avatar}
        sx={{
          width: showRing ? 38 : 48,
          height: showRing ? 38 : 48,
          border: showRing ? "2px solid #000" : "none",
          opacity: entity.muted ? 0.4 : 1,
        }}
      />
    </Box>
  );
}

export default function DealzPromoStatusFeed({ onBack }) {
  const muiTheme = useMuiTheme();
  const { accentColor, actualMode } = useTheme();
  const [viewFilter, setViewFilter] = useState("contacts"); // 'contacts' | 'all'
  const [data, setData] = useState(DEMO_DEALZ);
  const [selectedId, setSelectedId] = useState(null); // entity in drawer
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTargetId, setSettingsTargetId] = useState(null);
  const [promoFilter, setPromoFilter] = useState("new"); // 'new' | 'all' | 'archived'
  const [activePromo, setActivePromo] = useState(null); // { entityId, promoId }
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [createPromoOpen, setCreatePromoOpen] = useState(false);
  const [newPromoType, setNewPromoType] = useState("promo-ad"); // 'promo-ad' | 'live'
  const [newPromoTitle, setNewPromoTitle] = useState("");
  const [newPromoModule, setNewPromoModule] = useState("E-Commerce");

  const selected = useMemo(
    () => data.find((e) => e.id === selectedId) || null,
    [data, selectedId]
  );

  const settingsEntity = useMemo(
    () =>
      data.find((e) => e.id === settingsTargetId) ||
      data.find((e) => e.id === selectedId) ||
      null,
    [data, settingsTargetId, selectedId]
  );

  const sortedEntities = useMemo(() => {
    const base = viewFilter === "contacts" ? data.filter((d) => d.isContact) : data;
    const mine = base.find((e) => e.isMe);
    const others = base.filter((e) => !e.isMe && !e.muted);

    // Ranking logic:
    // 1. Entities with active promos (unseen) are always ranked first
    // 2. Among entities with active promos, followed ones come first
    // 3. Among entities without active promos, followed ones come first
    // 4. Then alphabetical by name
    const sortedOthers = [...others].sort((a, b) => {
      // Count active promos (both Promo Ads and Live Sessions that are unseen)
      const aActiveCount = a.promos.filter((p) => !p.seen).length;
      const bActiveCount = b.promos.filter((p) => !p.seen).length;
      const aHasActive = aActiveCount > 0;
      const bHasActive = bActiveCount > 0;

      // Priority 1: Entities with active promos always rank higher
      if (bHasActive !== aHasActive) {
        return bHasActive ? 1 : -1;
      }

      // Priority 2: If both have active promos, rank by:
      //   - Followed status first
      //   - Then by number of active promos (more active = higher rank)
      if (aHasActive && bHasActive) {
      const aFollow = a.followed ? 1 : 0;
      const bFollow = b.followed ? 1 : 0;
      if (bFollow !== aFollow) return bFollow - aFollow;
        // More active promos = higher rank
        if (bActiveCount !== aActiveCount) return bActiveCount - aActiveCount;
      }

      // Priority 3: Followed entities rank higher (for entities without active promos)
      const aFollow = a.followed ? 1 : 0;
      const bFollow = b.followed ? 1 : 0;
      if (bFollow !== aFollow) return bFollow - aFollow;

      // Priority 4: Alphabetical by name
      return a.name.localeCompare(b.name);
    });

    return mine ? [mine, ...sortedOthers] : sortedOthers;
  }, [data, viewFilter]);

  const newEntities = useMemo(
    () =>
      sortedEntities.filter(
        (e) => !e.isMe && e.promos.length && e.promos.some((p) => !p.seen)
      ),
    [sortedEntities]
  );

  const viewedEntities = useMemo(
    () =>
      sortedEntities.filter(
        (e) => !e.isMe && e.promos.length && e.promos.every((p) => p.seen)
      ),
    [sortedEntities]
  );

  const filteredPromos = useMemo(() => {
    if (!selected) return [];
    const sorted = sortPromosForDisplay(selected.promos || []);
    if (promoFilter === "all") return sorted;
    if (promoFilter === "new") return sorted.filter((p) => !p.seen);
    return sorted.filter((p) => p.seen);
  }, [selected, promoFilter]);

  const handleToggleFollow = (id) => {
    setData((prev) =>
      prev.map((d) => (d.id === id ? { ...d, followed: !d.followed } : d))
    );
  };

  const handleToggleMute = (id) => {
    setData((prev) =>
      prev.map((d) => (d.id === id ? { ...d, muted: !d.muted } : d))
    );
  };

  const clearAllSeenPromos = () => {
    setData((prev) =>
      prev.map((e) => ({
        ...e,
        promos: e.promos.map((p) => ({ ...p, seen: true })),
      }))
    );
  };

  const openEntityDrawer = (entity) => {
    // If it's "My Dealz" and has no promos, open create dialog instead
    if (entity.isMe && !entity.promos.length) {
      setCreatePromoOpen(true);
      return;
    }
    if (!entity.promos.length) return;
    setSelectedId(entity.id);
  };

  const handleCreatePromo = () => {
    if (!newPromoTitle.trim()) return;
    
    const mine = data.find((e) => e.isMe);
    if (!mine) return;

    const newPromo = {
      id: `p${Date.now()}`,
      type: newPromoType,
      title: newPromoTitle,
      module: newPromoModule,
      live: newPromoType === "live",
      createdAt: "Now",
      seen: false,
    };

    setData((prev) =>
      prev.map((e) =>
        e.isMe
          ? {
              ...e,
              promos: [...e.promos, newPromo],
            }
          : e
      )
    );

    // Reset form and close dialog
    setNewPromoTitle("");
    setNewPromoType("promo-ad");
    setNewPromoModule("E-Commerce");
    setCreatePromoOpen(false);
    
    // Open the drawer to show the new promo
    setSelectedId(mine.id);
  };

  const openSettingsForEntity = (id) => {
    setSettingsTargetId(id);
    setSettingsOpen(true);
  };

  const markPromoSeenAndOpenDetail = (entityId, promo) => {
    setData((prev) =>
      prev.map((e) =>
        e.id === entityId
          ? {
              ...e,
              promos: e.promos.map((p) =>
                p.id === promo.id ? { ...p, seen: true } : p
              ),
            }
          : e
      )
    );
    setActivePromo({ entityId, promoId: promo.id });
  };

  const closePromoDetail = () => setActivePromo(null);

  const getActivePromo = useCallback(() => {
    if (!activePromo) return null;
    const entity = data.find((e) => e.id === activePromo.entityId);
    if (!entity) return null;
    const promo = entity.promos.find((p) => p.id === activePromo.promoId);
    if (!promo) return null;
    return { entity, promo };
  }, [activePromo, data]);

  // Auto-advance while in promo detail
  useEffect(() => {
    if (!activePromo || !autoAdvance) return;
    const timer = setTimeout(() => {
      const active = getActivePromo();
      if (!active) return;
      const { entity, promo } = active;
      const promosSorted = sortPromosForDisplay(entity.promos || []);
      const idx = promosSorted.findIndex((p) => p.id === promo.id);
      if (idx === -1 || idx + 1 >= promosSorted.length) {
        setActivePromo(null);
        return;
      }
      const next = promosSorted[idx + 1];
      setData((prev) =>
        prev.map((e) =>
          e.id === entity.id
            ? {
                ...e,
                promos: e.promos.map((p) =>
                  p.id === next.id ? { ...p, seen: true } : p
                ),
              }
            : e
        )
      );
      setActivePromo({ entityId: entity.id, promoId: next.id });
    }, 6000);
    return () => clearTimeout(timer);
  }, [activePromo, autoAdvance, getActivePromo]);

  const mine = sortedEntities.find((e) => e.isMe) || null;

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none`}</style>

      <Box 
        className="w-full h-full flex justify-center"
        sx={{ 
          bgcolor: actualMode === 'dark' ? '#121212' : EV.light,
          minHeight: '100vh'
        }}
      >
        <Box className="w-full max-w-[390px] flex flex-col">
          {/* Header */}
          <AppBar elevation={0} position="fixed" sx={{ bgcolor: accentColor, color: "#fff" }}>
            <Toolbar
              className="!min-h-[56px]"
              sx={{ width: "100%", maxWidth: 390, mx: "auto", px: 1 }}
            >
              <IconButton
                onClick={onBack}
                aria-label="Back"
                sx={{ color: "#fff", mr: 1 }}
              >
                <ArrowBackRoundedIcon />
              </IconButton>
              <CampaignRoundedIcon sx={{ mr: 1 }} />
              <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                <Typography variant="subtitle1" className="font-semibold" noWrap>
                  Dealz promo status
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Promo Ads & Live Sessions
                </Typography>
              </Box>
              <IconButton
                size="small"
                sx={{ color: "#fff" }}
                onClick={() => {
                  setSettingsTargetId(null);
                  setSettingsOpen(true);
                }}
              >
                <MoreVertRoundedIcon />
              </IconButton>
            </Toolbar>
          </AppBar>

          {/* Content */}
          <Box
            className="no-scrollbar"
            sx={{ 
              flex: 1, 
              overflowY: "auto", 
              pt: "56px", 
              pb: 10, 
              px: 2,
              bgcolor: actualMode === 'dark' ? '#121212' : EV.light
            }}
          >
            {/* Filter row */}
            <Box className="flex items-center justify-between mt-2 mb-2">
              <Stack direction="row" spacing={1}>
                <Chip
                  label="Contacts"
                  size="small"
                  onClick={() => setViewFilter("contacts")}
                  sx={{
                    bgcolor: viewFilter === "contacts" ? accentColor : (actualMode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
                    color: viewFilter === "contacts" ? "#fff" : muiTheme.palette.text.primary,
                    "&:hover": {
                      bgcolor: viewFilter === "contacts" ? accentColor : (actualMode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'),
                    }
                  }}
                />
                <Chip
                  label="All"
                  size="small"
                  onClick={() => setViewFilter("all")}
                  sx={{
                    bgcolor: viewFilter === "all" ? accentColor : (actualMode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
                    color: viewFilter === "all" ? "#fff" : muiTheme.palette.text.primary,
                    "&:hover": {
                      bgcolor: viewFilter === "all" ? accentColor : (actualMode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'),
                    }
                  }}
                />
              </Stack>
            </Box>

            {/* My Dealz */}
            {mine && (
              <>
                <Typography
                  variant="caption"
                  sx={{ color: muiTheme.palette.text.secondary, mb: 0.5, display: "block" }}
                >
                  My Dealz
                </Typography>
                <ListItem
                  button
                  onClick={() => openEntityDrawer(mine)}
                  sx={{
                    bgcolor: actualMode === 'dark' ? 'rgba(255,255,255,0.03)' : muiTheme.palette.background.paper,
                    borderRadius: 1,
                    mb: 0.5,
                    color: muiTheme.palette.text.primary,
                    "&:hover": {
                      bgcolor: actualMode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                    }
                  }}
                >
                  <ListItemAvatar>
                    <PromoRingAvatar entity={mine} accentColor={accentColor} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" className="font-semibold" sx={{ color: muiTheme.palette.text.primary }}>
                        {mine.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ color: muiTheme.palette.text.secondary }}>
                        {mine.promos.length
                          ? `${mine.promos.length} promo${mine.promos.length > 1 ? "s" : ""}`
                          : "Tap to add your promo"}
                      </Typography>
                    }
                  />
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      openSettingsForEntity(mine.id);
                    }}
                    sx={{ color: muiTheme.palette.text.secondary }}
                  >
                    <MoreHorizRoundedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </ListItem>
                <Divider sx={{ my: 1, borderColor: muiTheme.palette.divider }} />
              </>
            )}

            {/* New Dealz */}
            {newEntities.length > 0 && (
              <>
                <Typography
                  variant="caption"
                  sx={{ color: muiTheme.palette.text.secondary, mb: 0.5, display: "block" }}
                >
                  New Dealz
                </Typography>
                <List className="no-scrollbar" sx={{ bgcolor: 'transparent' }}>
                  {newEntities.map((entity) => {
                    const unseen = entity.promos.filter((p) => !p.seen).length;
                    const subtitle = `${unseen} new promo${unseen > 1 ? "s" : ""}`;
                    const primaryModule = getPrimaryModule(entity);
                    return (
                      <ListItem
                        key={entity.id}
                        button
                        onClick={() => openEntityDrawer(entity)}
                        sx={{
                          bgcolor: actualMode === 'dark' ? 'rgba(255,255,255,0.03)' : muiTheme.palette.background.paper,
                          borderRadius: 1,
                          mb: 0.5,
                          color: muiTheme.palette.text.primary,
                          "&:hover": {
                            bgcolor: actualMode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                          }
                        }}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              openSettingsForEntity(entity.id);
                            }}
                            sx={{ color: muiTheme.palette.text.secondary }}
                          >
                            <MoreHorizRoundedIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        }
                      >
                        <ListItemAvatar>
                          <PromoRingAvatar entity={entity} accentColor={accentColor} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Stack
                              direction="row"
                              spacing={0.5}
                              alignItems="center"
                            >
                              {primaryModule && (
                                <Chip
                                  size="small"
                                  label={primaryModule}
                                  sx={{
                                    bgcolor: actualMode === 'dark' ? 'rgba(255,255,255,0.1)' : EV.light,
                                    fontSize: 10,
                                    height: 20,
                                    color: muiTheme.palette.text.primary,
                                  }}
                                />
                              )}
                              <Typography
                                variant="body2"
                                className="font-semibold"
                                sx={{ color: muiTheme.palette.text.primary }}
                              >
                                {entity.name}
                              </Typography>
                            </Stack>
                          }
                          secondary={
                            <Typography
                              variant="caption"
                              sx={{ color: accentColor }}
                            >
                              {subtitle}
                            </Typography>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </>
            )}

            {/* Viewed Dealz */}
            {viewedEntities.length > 0 && (
              <>
                <Divider sx={{ my: 1, borderColor: muiTheme.palette.divider }} />
                <Typography
                  variant="caption"
                  sx={{ color: muiTheme.palette.text.secondary, mb: 0.5, display: "block" }}
                >
                  Viewed Dealz
                </Typography>
                <List className="no-scrollbar" sx={{ bgcolor: 'transparent' }}>
                  {viewedEntities.map((entity) => {
                    const primaryModule = getPrimaryModule(entity);
                    const subtitle = `${entity.promos.length} promo${
                      entity.promos.length > 1 ? "s" : ""
                    } (viewed)`;
                    return (
                      <ListItem
                        key={entity.id}
                        button
                        onClick={() => openEntityDrawer(entity)}
                        sx={{
                          bgcolor: actualMode === 'dark' ? 'rgba(255,255,255,0.03)' : muiTheme.palette.background.paper,
                          borderRadius: 1,
                          mb: 0.5,
                          color: muiTheme.palette.text.primary,
                          "&:hover": {
                            bgcolor: actualMode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                          }
                        }}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              openSettingsForEntity(entity.id);
                            }}
                            sx={{ color: muiTheme.palette.text.secondary }}
                          >
                            <MoreHorizRoundedIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        }
                      >
                        <ListItemAvatar>
                          <PromoRingAvatar entity={entity} accentColor={accentColor} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Stack
                              direction="row"
                              spacing={0.5}
                              alignItems="center"
                            >
                              {primaryModule && (
                                <Chip
                                  size="small"
                                  label={primaryModule}
                                  sx={{
                                    bgcolor: actualMode === 'dark' ? 'rgba(255,255,255,0.1)' : EV.light,
                                    fontSize: 10,
                                    height: 20,
                                    color: muiTheme.palette.text.primary,
                                  }}
                                />
                              )}
                              <Typography
                                variant="body2"
                                className="font-semibold"
                                sx={{ color: muiTheme.palette.text.secondary }}
                              >
                                {entity.name}
                              </Typography>
                            </Stack>
                          }
                          secondary={
                            <Typography
                              variant="caption"
                              sx={{ color: muiTheme.palette.text.secondary }}
                            >
                              {subtitle}
                            </Typography>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </>
            )}

            <Typography variant="caption" sx={{ color: muiTheme.palette.text.secondary, mt: 0.5 }}>
              Green ring = unseen promos. Grey segments = seen promos. Fully grey ring =
              all promos viewed.
            </Typography>
          </Box>

          {/* Bottom hint */}
          <Box
            sx={{
              position: "fixed",
              left: 0,
              right: 0,
              bottom: 0,
              pb: "env(safe-area-inset-bottom)",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: 390,
                mx: "auto",
                px: 3,
                pb: 2.5,
                bgcolor: actualMode === 'dark' 
                  ? 'rgba(30,30,30,0.95)' 
                  : 'rgba(255,255,255,0.96)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography 
                variant="caption" 
                className="block text-center"
                sx={{ color: muiTheme.palette.text.secondary }}
              >
                Follow channels or people to keep their future Dealz at the top.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Drawer: promos for selected entity */}
      <Drawer
        anchor="bottom"
        open={!!selected}
        onClose={() => setSelectedId(null)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxWidth: 390,
            mx: "auto",
          },
        }}
      >
        {selected && (
          <Box className="p-3">
            <div
              className="w-10 h-1 rounded-full mx-auto mb-2"
              style={{ background: actualMode === 'dark' ? 'rgba(255,255,255,0.2)' : EV.light }}
            />
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Avatar src={selected.avatar} sx={{ width: 40, height: 40 }} />
              <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                <Typography variant="subtitle2" className="font-semibold" noWrap sx={{ color: muiTheme.palette.text.primary }}>
                  {selected.name}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, color: muiTheme.palette.text.secondary }}>
                  {selected.promos.length} promo
                  {selected.promos.length !== 1 ? "s" : ""}
                </Typography>
              </Box>
              <Button
                size="small"
                variant={selected.followed ? "contained" : "outlined"}
                startIcon={<FavoriteRoundedIcon sx={{ fontSize: 16 }} />}
                sx={{
                  textTransform: "none",
                  bgcolor: selected.followed ? accentColor : "transparent",
                  color: selected.followed ? "#fff" : accentColor,
                  borderColor: accentColor,
                  "&:hover": selected.followed
                    ? { bgcolor: accentColor, opacity: 0.9 }
                    : { borderColor: accentColor, bgcolor: actualMode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' },
                }}
                onClick={() => handleToggleFollow(selected.id)}
              >
                {selected.followed ? "Following" : "Follow"}
              </Button>
            </Stack>

            {/* New / All / Archived filter inside drawer */}
            <Box className="flex gap-1 mb: 1">
              <Chip
                label="New"
                size="small"
                onClick={() => setPromoFilter("new")}
                sx={{
                  bgcolor: promoFilter === "new" ? accentColor : (actualMode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
                  color: promoFilter === "new" ? "#fff" : muiTheme.palette.text.primary,
                  "&:hover": {
                    bgcolor: promoFilter === "new" ? accentColor : (actualMode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'),
                  }
                }}
              />
              <Chip
                label="All"
                size="small"
                onClick={() => setPromoFilter("all")}
                sx={{
                  bgcolor: promoFilter === "all" ? accentColor : (actualMode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
                  color: promoFilter === "all" ? "#fff" : muiTheme.palette.text.primary,
                  "&:hover": {
                    bgcolor: promoFilter === "all" ? accentColor : (actualMode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'),
                  }
                }}
              />
              <Chip
                label="Archived"
                size="small"
                onClick={() => setPromoFilter("archived")}
                sx={{
                  bgcolor: promoFilter === "archived" ? accentColor : (actualMode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
                  color: promoFilter === "archived" ? "#fff" : muiTheme.palette.text.primary,
                  "&:hover": {
                    bgcolor: promoFilter === "archived" ? accentColor : (actualMode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'),
                  }
                }}
              />
            </Box>

            <Divider sx={{ mb: 1 }} />

            {/* Create Promo button for "My Dealz" */}
            {selected?.isMe && (
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={() => {
                  setSelectedId(null);
                  setCreatePromoOpen(true);
                }}
                sx={{
                  mb: 2,
                  textTransform: "none",
                  bgcolor: accentColor,
                  color: "#fff",
                  borderRadius: 2,
                  py: 1.5,
                  "&:hover": { bgcolor: accentColor, opacity: 0.9 },
                }}
              >
                Create Promo
              </Button>
            )}

            {filteredPromos.length === 0 ? (
              <Typography variant="caption" sx={{ color: muiTheme.palette.text.secondary }}>
                No {promoFilter === "archived" ? "archived" : "new"} promos for this channel.
              </Typography>
            ) : (
              <List className="no-scrollbar" sx={{ maxHeight: 360, overflowY: "auto" }}>
                {filteredPromos.map((p) => (
                  <ListItem
                    key={p.id}
                    alignItems="flex-start"
                    sx={{
                      bgcolor: actualMode === 'dark' ? 'rgba(255,255,255,0.03)' : muiTheme.palette.background.paper,
                      borderRadius: 1,
                      mb: 0.5,
                      color: muiTheme.palette.text.primary,
                      "&:hover": {
                        bgcolor: actualMode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                      }
                    }}
                    secondaryAction={
                      <Button
                        size="small"
                        variant="contained"
                        sx={{
                          textTransform: "none",
                          bgcolor: accentColor,
                        }}
                        onClick={() => markPromoSeenAndOpenDetail(selected.id, p)}
                      >
                        {p.type === "live" ? "Join" : "View"}
                      </Button>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{ bgcolor: accentColor }}
                      >
                        {p.type === "live" ? (
                          <PlayCircleFilledWhiteRoundedIcon />
                        ) : (
                          <CampaignRoundedIcon />
                        )}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle2"
                          className="font-semibold"
                          sx={{ color: p.seen ? muiTheme.palette.text.secondary : muiTheme.palette.text.primary }}
                        >
                          {p.title}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="caption" sx={{ display: "block", color: muiTheme.palette.text.secondary }}>
                            Module: {p.module}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              opacity: 0.8,
                              color: p.seen ? muiTheme.palette.text.secondary : muiTheme.palette.text.secondary,
                            }}
                          >
                            {p.type === "live" ? "Live session" : "Promo ad"} • {p.createdAt}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}
      </Drawer>

      {/* View Settings sheet */}
      <Drawer
        anchor="bottom"
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxWidth: 390,
            mx: "auto",
            bgcolor: actualMode === 'dark' ? '#1e1e1e' : muiTheme.palette.background.paper,
            color: muiTheme.palette.text.primary,
          },
        }}
      >
        <Box className="p-3">
          <div
            className="w-10 h-1 rounded-full mx-auto mb-2"
            style={{ background: actualMode === 'dark' ? 'rgba(255,255,255,0.2)' : EV.light }}
          />
          <Typography variant="subtitle2" className="font-semibold" sx={{ mb: 0.5, color: muiTheme.palette.text.primary }}>
            View settings
          </Typography>
          <Typography variant="caption" sx={{ color: muiTheme.palette.text.secondary, mb: 1.5, display: "block" }}>
            Control how Dealz promo statuses behave for you.
          </Typography>

          <Stack spacing={1.5}>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={viewFilter === "contacts"}
                  onChange={(e) => setViewFilter(e.target.checked ? "contacts" : "all")}
                  color="primary"
                />
              }
              label={<Typography sx={{ color: muiTheme.palette.text.primary }}>Show only contacts in promo list</Typography>}
            />

            {settingsEntity ? (
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={settingsEntity.muted}
                    onChange={() => handleToggleMute(settingsEntity.id)}
                    color="primary"
                  />
                }
                label={<Typography sx={{ color: muiTheme.palette.text.primary }}>Mute promos from {settingsEntity.name}</Typography>}
              />
            ) : (
              <Typography variant="caption" sx={{ color: muiTheme.palette.text.secondary }}>
                Open a channel and use its 3-dots to select it here.
              </Typography>
            )}

            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={autoAdvance}
                  onChange={(e) => setAutoAdvance(e.target.checked)}
                  color="primary"
                />
              }
              label={<Typography sx={{ color: muiTheme.palette.text.primary }}>Auto-advance promos (cycle like statuses)</Typography>}
            />

            <Button
              variant="outlined"
              color="error"
              size="small"
              sx={{ textTransform: "none", alignSelf: "flex-start" }}
              onClick={clearAllSeenPromos}
            >
              Clear all rings (mark promos as seen)
            </Button>
          </Stack>

          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              onClick={() => setSettingsOpen(false)}
              sx={{
                textTransform: "none",
                bgcolor: accentColor,
                color: "#fff",
                borderRadius: 999,
                px: 3,
                "&:hover": { bgcolor: accentColor, opacity: 0.9 },
              }}
            >
              Done
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Promo detail viewer */}
      <Dialog
        fullScreen
        open={!!activePromo}
        onClose={closePromoDetail}
        PaperProps={{ sx: { bgcolor: "#000" } }}
      >
        {(() => {
          const active = getActivePromo();
          if (!active) return null;
          const { entity, promo } = active;
          const isLive = promo.type === "live";
          return (
            <Box className="w-full h-full flex flex-col">
              <AppBar
                elevation={0}
                position="static"
                sx={{ bgcolor: "rgba(0,0,0,0.85)", color: "#fff" }}
              >
                <Toolbar sx={{ width: "100%", maxWidth: 390, mx: "auto", px: 1 }}>
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={closePromoDetail}
                    aria-label="close"
                    sx={{ mr: 1 }}
                  >
                    <CloseRoundedIcon />
                  </IconButton>
                  <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                    <Typography variant="subtitle1" className="font-semibold" noWrap>
                      {promo.title}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                      {entity.name} • {promo.module}
                    </Typography>
                  </Box>
                  {isLive && (
                    <Chip
                      label="LIVE"
                      size="small"
                      sx={{ bgcolor: accentColor, color: "#fff", fontWeight: 700 }}
                    />
                  )}
                </Toolbar>
              </AppBar>

              <Box className="flex-1 flex flex-col items-center justify-center px-4">
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    borderRadius: 3,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.12)",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      height: 200,
                      bgcolor: "rgba(255,255,255,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isLive ? (
                      <PlayCircleFilledWhiteRoundedIcon
                        sx={{ fontSize: 72, color: accentColor }}
                      />
                    ) : (
                      <CampaignRoundedIcon
                        sx={{ fontSize: 72, color: accentColor }}
                      />
                    )}
                  </Box>
                  <Box sx={{ p: 1.5, bgcolor: "rgba(0,0,0,0.65)", color: "#fff" }}>
                    <Typography variant="subtitle2" className="font-semibold" sx={{ mb: 0.5 }}>
                      {promo.title}
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block", mb: 0.25 }}>
                      Module: {promo.module}
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block", opacity: 0.85 }}>
                      {promo.type === "live" ? "Live session" : "Promo ad"} • {promo.createdAt}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255,255,255,0.75)", textAlign: "center", mb: 2 }}
                >
                  This is a demo promo detail viewer. In production, show actual promo media
                  (image/video) and deep-link into the product, channel or live session.
                </Typography>

                <Stack direction="row" spacing={1} sx={{ width: "100%", maxWidth: 360 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      bgcolor: accentColor,
                      textTransform: "none",
                      borderRadius: 999,
                      "&:hover": { bgcolor: accentColor, opacity: 0.9 },
                    }}
                  >
                    {isLive ? "Join live session" : "Open promo"}
                  </Button>
                </Stack>
              </Box>
            </Box>
          );
        })()}
      </Dialog>

      {/* Create Promo Dialog */}
      <Dialog
        open={createPromoOpen}
        onClose={() => {
          setCreatePromoOpen(false);
          setNewPromoTitle("");
          setNewPromoType("promo-ad");
          setNewPromoModule("E-Commerce");
        }}
        PaperProps={{
          sx: {
            maxWidth: 390,
            width: "90vw",
            borderRadius: 3,
            bgcolor: muiTheme.palette.background.paper,
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" className="font-semibold" sx={{ mb: 2, color: muiTheme.palette.text.primary }}>
            Create Promo
          </Typography>

          <Stack spacing={2}>
            <TextField
              select
              label="Promo Type"
              value={newPromoType}
              onChange={(e) => setNewPromoType(e.target.value)}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: muiTheme.palette.text.primary,
                },
                "& .MuiInputLabel-root": {
                  color: muiTheme.palette.text.secondary,
                },
              }}
            >
              <MenuItem value="promo-ad">Promo Ad</MenuItem>
              <MenuItem value="live">Live Session</MenuItem>
            </TextField>

            <TextField
              label="Title"
              value={newPromoTitle}
              onChange={(e) => setNewPromoTitle(e.target.value)}
              placeholder="Enter promo title..."
              fullWidth
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: muiTheme.palette.text.primary,
                },
                "& .MuiInputLabel-root": {
                  color: muiTheme.palette.text.secondary,
                },
              }}
            />

            <TextField
              select
              label="Module"
              value={newPromoModule}
              onChange={(e) => setNewPromoModule(e.target.value)}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: muiTheme.palette.text.primary,
                },
                "& .MuiInputLabel-root": {
                  color: muiTheme.palette.text.secondary,
                },
              }}
            >
              <MenuItem value="E-Commerce">E-Commerce</MenuItem>
              <MenuItem value="Charging">Charging</MenuItem>
              <MenuItem value="Rides">Rides</MenuItem>
              <MenuItem value="School">School</MenuItem>
              <MenuItem value="Marketplace">Marketplace</MenuItem>
            </TextField>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setCreatePromoOpen(false);
                  setNewPromoTitle("");
                  setNewPromoType("promo-ad");
                  setNewPromoModule("E-Commerce");
                }}
                sx={{
                  textTransform: "none",
                  borderColor: muiTheme.palette.divider,
                  color: muiTheme.palette.text.primary,
                }}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handleCreatePromo}
                disabled={!newPromoTitle.trim()}
                sx={{
                  textTransform: "none",
                  bgcolor: accentColor,
                  color: "#fff",
                  "&:hover": { bgcolor: accentColor, opacity: 0.9 },
                  "&:disabled": { opacity: 0.5 },
                }}
              >
                Create
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Dialog>
    </>
  );
}

/*
  ===== Tests (React Testing Library) — copy to DealzPromoStatusFeed.test.jsx =====

  import React from 'react';
  import { render, screen } from '@testing-library/react';
  import DealzPromoStatusFeed from './DealzPromoStatusFeed';

  test('renders Dealz promo status header', () => {
    render(<DealzPromoStatusFeed />);
    expect(screen.getByText(/Dealz promo status/i)).toBeInTheDocument();
  });
*/
