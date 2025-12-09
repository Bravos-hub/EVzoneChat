import React from "react";
import { Box, Avatar } from "@mui/material";
import { EV_COLORS } from "../utils/constants";
import type { PromoItem } from "../types";

interface PromoRingAvatarProps {
  entity?: {
    promos?: PromoItem[];
    avatar?: string;
    muted?: boolean;
  };
  accentColor?: string;
  onClick?: (e?: React.MouseEvent) => void;
  size?: number;
  avatarSrc?: string;
}

// Build a WhatsApp-like segmented ring: one arc per ACTIVE promo with small gaps,
// unseen promos in accent color, seen promos in light grey. Fully viewed = full grey ring.
function buildRingGradient(promos: PromoItem[], accentColor: string): string {
  const activePromos = promos.filter((p) => !p.seen);
  const totalActive = activePromos.length;
  const totalPromos = promos.length;
  
  if (!totalPromos) return "none";
  if (promos.every((p) => p.seen)) {
    return `conic-gradient(${EV_COLORS.grey} 0deg 360deg)`;
  }
  if (totalActive === 1) {
    return `conic-gradient(${accentColor} 0deg 360deg)`;
  }
  
  const baseArc = 360 / totalActive;
  const segArc = baseArc * 0.65;
  const gapArc = baseArc - segArc;
  let currentAngle = 0;
  const parts: string[] = [];
  
  activePromos.forEach(() => {
    const color = accentColor;
    const start = currentAngle;
    const end = start + segArc;
    parts.push(`${color} ${start}deg ${end}deg`);
    currentAngle = end + gapArc;
  });
  
  return `conic-gradient(${parts.join(", ")})`;
}

/**
 * PromoRingAvatar - Global component for avatars with promo status rings
 */
const PromoRingAvatar: React.FC<PromoRingAvatarProps> = ({ 
  entity, 
  accentColor, 
  onClick, 
  size = 40,
  avatarSrc 
}) => {
  // Support both entity object and direct props
  const promos = entity?.promos || [];
  const avatar = avatarSrc || entity?.avatar;
  const muted = entity?.muted || false;
  
  const activePromos = promos.filter((p) => !p.seen);
  const hasActivePromos = activePromos.length > 0;
  const hasAnyPromos = promos.length > 0;
  
  const showRing = hasActivePromos || (hasAnyPromos && promos.every((p) => p.seen));
  const gradient = showRing ? buildRingGradient(promos, accentColor || EV_COLORS.green) : "none";
  const avatarSize = showRing ? size * 0.73 : size * 0.92;
  const padding = showRing ? size * 0.015 : 0;

  return (
    <Box
      onClick={onClick}
      sx={{
        width: size,
        height: size,
        borderRadius: "999px",
        backgroundImage: gradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: padding,
        transition: "all 0.2s ease",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <Avatar
        src={avatar}
        sx={{
          width: avatarSize,
          height: avatarSize,
          border: showRing ? "2px solid #000" : "none",
          opacity: muted ? 0.4 : 1,
        }}
      />
    </Box>
  );
};

export default PromoRingAvatar;
