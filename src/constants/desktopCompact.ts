export const DESKTOP_COMPACT = {
  toolbarHeight: 52,
  titleXL: "2.05rem",
  titleLG: "1.7rem",
  searchHeight: 44,
  searchIcon: 20,
  chipHeight: 26,
  listRowVPadding: 0.85,
  avatarRow: 44,
  nameFont: "0.98rem",
  metaFont: "0.84rem",
  subMetaFont: "0.68rem",
  infoButton: 26,
  quickActionCircleMobile: 56,
  quickActionCircleDesktop: 74,
  quickActionLabelMobile: "0.72rem",
  quickActionLabelDesktop: "0.94rem",
} as const;

export function isDesktopCompact(layoutMode?: string): boolean {
  return layoutMode === "desktop";
}

