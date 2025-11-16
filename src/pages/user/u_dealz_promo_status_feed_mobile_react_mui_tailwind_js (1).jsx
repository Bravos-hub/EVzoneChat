import React, { useMemo, useState, useEffect } from "react";
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

// Build a WhatsApp-like segmented ring: one arc per promo with small gaps,
// unseen promos in EV green, seen promos in light grey. Fully viewed = full grey ring.
// For single promo: solid green ring
// For multiple promos: broken/dashed segments (one per promo)
function buildRingGradient(promos) {
  const total = promos.length;
  if (!total) return "none";

  // If all promos seen, full grey ring
  if (promos.every((p) => p.seen)) {
    return `conic-gradient(${EV.grey} 0deg 360deg)`;
  }

  // Single promo: solid green ring (full circle)
  if (total === 1 && !promos[0].seen) {
    return `conic-gradient(${EV.green} 0deg 360deg)`;
  }

  // Multiple promos: broken/dashed segments
  // Each promo gets a segment, with gaps between them
  const baseArc = 360 / total;
  const segArc = baseArc * 0.75; // 75% segment, 25% gap for broken effect
  const gapArc = baseArc - segArc;
  let currentAngle = 0;
  const parts = [];

  promos.forEach((promo) => {
    const color = promo.seen ? "rgba(166,166,166,0.6)" : EV.green;
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

function PromoRingAvatar({ entity }) {
  const promos = entity.promos || [];
  const hasPromos = promos.length > 0;
  const gradient = hasPromos ? buildRingGradient(promos) : "none";

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
        p: hasPromos ? 0.8 : 0,
      }}
    >
      <Avatar
        src={entity.avatar}
        sx={{
          width: hasPromos ? 38 : 48,
          height: hasPromos ? 38 : 48,
          border: hasPromos ? "2px solid #000" : "none",
          opacity: entity.muted ? 0.4 : 1,
        }}
      />
    </Box>
  );
}

export default function DealzPromoStatusFeed({ onBack }) {
  const [viewFilter, setViewFilter] = useState("contacts"); // 'contacts' | 'all'
  const [data, setData] = useState(DEMO_DEALZ);
  const [selectedId, setSelectedId] = useState(null); // entity in drawer
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTargetId, setSettingsTargetId] = useState(null);
  const [promoFilter, setPromoFilter] = useState("new"); // 'new' | 'all' | 'archived'
  const [activePromo, setActivePromo] = useState(null); // { entityId, promoId }
  const [autoAdvance, setAutoAdvance] = useState(true);

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

    const sortedOthers = [...others].sort((a, b) => {
      const aActive = a.promos.some((p) => !p.seen) ? 1 : 0;
      const bActive = b.promos.some((p) => !p.seen) ? 1 : 0;
      if (bActive !== aActive) return bActive - aActive;
      const aFollow = a.followed ? 1 : 0;
      const bFollow = b.followed ? 1 : 0;
      if (bFollow !== aFollow) return bFollow - aFollow;
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
    if (!entity.promos.length) return;
    setSelectedId(entity.id);
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

  const getActivePromo = () => {
    if (!activePromo) return null;
    const entity = data.find((e) => e.id === activePromo.entityId);
    if (!entity) return null;
    const promo = entity.promos.find((p) => p.id === activePromo.promoId);
    if (!promo) return null;
    return { entity, promo };
  };

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
  }, [activePromo, autoAdvance, data]);

  const mine = sortedEntities.find((e) => e.isMe) || null;

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none`}</style>

      <Box className="w-full h-full bg-[var(--ev-light)] flex justify-center">
        <Box className="w-full max-w-[390px] flex flex-col">
          {/* Header */}
          <AppBar elevation={0} position="fixed" sx={{ bgcolor: EV.green, color: "#fff" }}>
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
            sx={{ flex: 1, overflowY: "auto", pt: "56px", pb: 10, px: 2 }}
          >
            {/* Filter row */}
            <Box className="flex items-center justify-between mt-2 mb-2">
              <Stack direction="row" spacing={1}>
                <Chip
                  label="Contacts"
                  size="small"
                  color={viewFilter === "contacts" ? "primary" : "default"}
                  onClick={() => setViewFilter("contacts")}
                />
                <Chip
                  label="All"
                  size="small"
                  color={viewFilter === "all" ? "primary" : "default"}
                  onClick={() => setViewFilter("all")}
                />
              </Stack>
            </Box>

            {/* My Dealz */}
            {mine && (
              <>
                <Typography
                  variant="caption"
                  sx={{ color: EV.grey, mb: 0.5, display: "block" }}
                >
                  My Dealz
                </Typography>
                <ListItem
                  button
                  onClick={() => openEntityDrawer(mine)}
                >
                  <ListItemAvatar>
                    <PromoRingAvatar entity={mine} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" className="font-semibold">
                        {mine.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ color: EV.grey }}>
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
                  >
                    <MoreHorizRoundedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </ListItem>
                <Divider sx={{ my: 1 }} />
              </>
            )}

            {/* New Dealz */}
            {newEntities.length > 0 && (
              <>
                <Typography
                  variant="caption"
                  sx={{ color: EV.grey, mb: 0.5, display: "block" }}
                >
                  New Dealz
                </Typography>
                <List className="no-scrollbar">
                  {newEntities.map((entity) => {
                    const unseen = entity.promos.filter((p) => !p.seen).length;
                    const subtitle = `${unseen} new promo${unseen > 1 ? "s" : ""}`;
                    const primaryModule = getPrimaryModule(entity);
                    return (
                      <ListItem
                        key={entity.id}
                        button
                        onClick={() => openEntityDrawer(entity)}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              openSettingsForEntity(entity.id);
                            }}
                          >
                            <MoreHorizRoundedIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        }
                      >
                        <ListItemAvatar>
                          <PromoRingAvatar entity={entity} />
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
                                    bgcolor: EV.light,
                                    fontSize: 10,
                                    height: 20,
                                  }}
                                />
                              )}
                              <Typography
                                variant="body2"
                                className="font-semibold"
                              >
                                {entity.name}
                              </Typography>
                            </Stack>
                          }
                          secondary={
                            <Typography
                              variant="caption"
                              sx={{ color: EV.green }}
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
                <Divider sx={{ my: 1 }} />
                <Typography
                  variant="caption"
                  sx={{ color: EV.grey, mb: 0.5, display: "block" }}
                >
                  Viewed Dealz
                </Typography>
                <List className="no-scrollbar">
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
                        secondaryAction={
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              openSettingsForEntity(entity.id);
                            }}
                          >
                            <MoreHorizRoundedIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        }
                      >
                        <ListItemAvatar>
                          <PromoRingAvatar entity={entity} />
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
                                    bgcolor: EV.light,
                                    fontSize: 10,
                                    height: 20,
                                  }}
                                />
                              )}
                              <Typography
                                variant="body2"
                                className="font-semibold"
                                sx={{ color: EV.grey }}
                              >
                                {entity.name}
                              </Typography>
                            </Stack>
                          }
                          secondary={
                            <Typography
                              variant="caption"
                              sx={{ color: EV.grey }}
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

            <Typography variant="caption" sx={{ color: EV.grey, mt: 0.5 }}>
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
                background:
                  "linear-gradient(to top, rgba(255,255,255,0.96), rgba(255,255,255,0.86))",
              }}
            >
              <Typography variant="caption" className="block text-center text-gray-600">
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
              style={{ background: EV.light }}
            />
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Avatar src={selected.avatar} sx={{ width: 40, height: 40 }} />
              <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                <Typography variant="subtitle2" className="font-semibold" noWrap>
                  {selected.name}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
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
                  bgcolor: selected.followed ? EV.orange : "transparent",
                  color: selected.followed ? "#fff" : EV.orange,
                  borderColor: EV.orange,
                  "&:hover": selected.followed
                    ? { bgcolor: "#e06f00" }
                    : { borderColor: EV.orange, bgcolor: "rgba(247,127,0,0.08)" },
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
                color={promoFilter === "new" ? "primary" : "default"}
                onClick={() => setPromoFilter("new")}
              />
              <Chip
                label="All"
                size="small"
                color={promoFilter === "all" ? "primary" : "default"}
                onClick={() => setPromoFilter("all")}
              />
              <Chip
                label="Archived"
                size="small"
                color={promoFilter === "archived" ? "primary" : "default"}
                onClick={() => setPromoFilter("archived")}
              />
            </Box>

            <Divider sx={{ mb: 1 }} />

            {filteredPromos.length === 0 ? (
              <Typography variant="caption" sx={{ color: EV.grey }}>
                No {promoFilter === "archived" ? "archived" : "new"} promos for this channel.
              </Typography>
            ) : (
              <List className="no-scrollbar" sx={{ maxHeight: 360, overflowY: "auto" }}>
                {filteredPromos.map((p) => (
                  <ListItem
                    key={p.id}
                    alignItems="flex-start"
                    secondaryAction={
                      <Button
                        size="small"
                        variant="contained"
                        sx={{
                          textTransform: "none",
                          bgcolor: p.live ? EV.green : EV.orange,
                        }}
                        onClick={() => markPromoSeenAndOpenDetail(selected.id, p)}
                      >
                        {p.type === "live" ? "Join" : "View"}
                      </Button>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{ bgcolor: p.type === "live" ? EV.green : EV.orange }}
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
                          sx={{ color: p.seen ? EV.grey : "inherit" }}
                        >
                          {p.title}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="caption" sx={{ display: "block" }}>
                            Module: {p.module}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              opacity: 0.8,
                              color: p.seen ? EV.grey : "inherit",
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
          },
        }}
      >
        <Box className="p-3">
          <div
            className="w-10 h-1 rounded-full mx-auto mb-2"
            style={{ background: EV.light }}
          />
          <Typography variant="subtitle2" className="font-semibold" sx={{ mb: 0.5 }}>
            View settings
          </Typography>
          <Typography variant="caption" sx={{ color: EV.grey, mb: 1.5, display: "block" }}>
            Control how Dealz promo statuses behave for you.
          </Typography>

          <Stack spacing={1.5}>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={viewFilter === "contacts"}
                  onChange={(e) => setViewFilter(e.target.checked ? "contacts" : "all")}
                />
              }
              label="Show only contacts in promo list"
            />

            {settingsEntity ? (
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={settingsEntity.muted}
                    onChange={() => handleToggleMute(settingsEntity.id)}
                  />
                }
                label={`Mute promos from ${settingsEntity.name}`}
              />
            ) : (
              <Typography variant="caption" sx={{ color: EV.grey }}>
                Open a channel and use its 3-dots to select it here.
              </Typography>
            )}

            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={autoAdvance}
                  onChange={(e) => setAutoAdvance(e.target.checked)}
                />
              }
              label="Auto-advance promos (cycle like statuses)"
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
                bgcolor: EV.green,
                color: "#fff",
                borderRadius: 999,
                px: 3,
                "&:hover": { bgcolor: "#02b47c" },
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
                      sx={{ bgcolor: EV.orange, color: "#fff", fontWeight: 700 }}
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
                        sx={{ fontSize: 72, color: EV.green }}
                      />
                    ) : (
                      <CampaignRoundedIcon
                        sx={{ fontSize: 72, color: EV.orange }}
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
                      bgcolor: isLive ? EV.green : EV.orange,
                      textTransform: "none",
                      borderRadius: 999,
                      "&:hover": { bgcolor: isLive ? "#02b47c" : "#e06f00" },
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
