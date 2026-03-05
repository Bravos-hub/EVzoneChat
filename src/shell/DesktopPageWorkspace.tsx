import type React from "react";
import { Box, Typography } from "@mui/material";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

interface DesktopPageWorkspaceProps {
  leftPane: React.ReactNode;
  rightPane?: React.ReactNode;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

function DesktopPagePlaceholder({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}) {
  return (
    <Box className="desktop-page-placeholder">
      <Box className="desktop-page-placeholder-inner">
        <Box sx={{ color: "text.secondary", opacity: 0.65 }}>
          {icon || <SettingsRoundedIcon sx={{ fontSize: 60 }} />}
        </Box>
        <Typography
          sx={{
            color: "text.primary",
            fontSize: { xs: "2rem", md: "2.25rem" },
            fontWeight: 500,
            lineHeight: 1.1,
            textAlign: "center",
          }}
        >
          {title}
        </Typography>
        {subtitle ? (
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "0.95rem",
              textAlign: "center",
              maxWidth: 420,
            }}
          >
            {subtitle}
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
}

export default function DesktopPageWorkspace({
  leftPane,
  rightPane,
  title,
  subtitle,
  icon,
}: DesktopPageWorkspaceProps) {
  return (
    <Box className="desktop-page-workspace">
      <Box className="desktop-page-list-pane">{leftPane}</Box>
      <Box className="desktop-page-right-pane">
        {rightPane || <DesktopPagePlaceholder title={title} subtitle={subtitle} icon={icon} />}
      </Box>
    </Box>
  );
}

