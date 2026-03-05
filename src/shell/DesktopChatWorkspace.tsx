import type React from "react";
import { Box, Typography } from "@mui/material";
import LockRoundedIcon from "@mui/icons-material/LockRounded";

interface DesktopChatWorkspaceProps {
  listPane: React.ReactNode;
  rightPane?: React.ReactNode;
  showPlaceholder?: boolean;
}

function DesktopInboxPlaceholder() {
  return (
    <Box className="desktop-chat-placeholder">
      <Box className="desktop-chat-placeholder-inner">
        <Typography
          variant="h4"
          sx={{
            fontSize: "34px",
            fontWeight: 600,
            color: "text.primary",
            mb: 1.5,
            textAlign: "center",
          }}
        >
          EVzone Web
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            maxWidth: 420,
            textAlign: "center",
            mb: 2.5,
          }}
        >
          Select a conversation from the list to start messaging on desktop.
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
          <LockRoundedIcon sx={{ fontSize: 18 }} />
          <Typography variant="caption" sx={{ fontSize: "12px" }}>
            Messages are end-to-end encrypted.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default function DesktopChatWorkspace({
  listPane,
  rightPane,
  showPlaceholder = false,
}: DesktopChatWorkspaceProps) {
  return (
    <Box className="desktop-chat-workspace">
      <Box className="desktop-chat-list-pane">{listPane}</Box>
      <Box className="desktop-chat-right-pane">{showPlaceholder ? <DesktopInboxPlaceholder /> : rightPane}</Box>
    </Box>
  );
}
