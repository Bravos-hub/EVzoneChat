import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Dialog,
  Button
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

/**
 * U03-07 — MediaViewerFS
 * Full-screen viewer for { type: 'image'|'video'|'audio'|'doc', src, title?, meta? }
 * Actions: Save, Share, Delete (callbacks)
 */
export default function MediaViewerFS({ open, item = { type: 'image', src: '' }, onClose, onSave, onShare, onDelete }) {
  const { type, src, title, meta } = item || {};

  const renderBody = () => {
    if (type === 'image') return (
      <Box className="w-full h-full grid place-items-center bg-black">
        <img alt={title || 'image'} src={src} className="max-w-full max-h-full object-contain" />
      </Box>
    );
    if (type === 'video') return (
      <Box className="w-full h-full bg-black grid place-items-center">
        <video src={src} controls className="w-full h-full" style={{ maxHeight: '100%', maxWidth: '100%' }} />
      </Box>
    );
    if (type === 'audio') return (
      <Box className="w-full h-full bg-black grid place-items-center">
        <audio src={src} controls className="w-[92%]" />
      </Box>
    );
    // doc (e.g., PDF)
    return (
      <Box className="w-full h-full bg-black">
        <object data={src} type="application/pdf" width="100%" height="100%">
          <Box className="text-white p-4">Preview not available. <a href={src} className="underline">Open</a></Box>
        </object>
      </Box>
    );
  };

  return (
    <Dialog open={open} fullScreen onClose={onClose}>
      {/* Hide scrollbars visually */}
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      {/* Header */}
      <AppBar elevation={0} position="static" sx={{ bgcolor: '#000', color: '#fff' }}>
        <Toolbar className="!min-h-[56px]" sx={{ px: { xs: 1.5, sm: 3 } }}>
          <IconButton onClick={onClose} aria-label="Close" sx={{ color: '#fff', padding: { xs: '6px', sm: '8px' } }}>
            <CloseRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </IconButton>
          <Typography variant="h6" className="font-bold" sx={{ fontSize: { xs: '16px', sm: '18px' }, ml: { xs: 0.5, sm: 1 }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: { xs: '60%', sm: '70%' } }}>{title || 'Media'}</Typography>
          <Box sx={{ flexGrow: 1 }} />
          {meta && <Typography variant="caption" sx={{ fontSize: { xs: '10px', sm: '12px' }, opacity: 0.8, mr: { xs: 1, sm: 2 }, display: { xs: 'none', sm: 'block' } }}>{meta}</Typography>}
        </Toolbar>
      </AppBar>

      {/* Body */}
      <Box className="flex-1" sx={{ height: '100%', overflow: 'hidden' }}>
        {renderBody()}
      </Box>

      {/* Actions */}
      <Box className="fixed inset-x-0 bottom-0 z-10 flex justify-center" sx={{ pb: 'env(safe-area-inset-bottom)' }}>
        <Box className="w-full mx-auto bg-white/95 backdrop-blur border-t" sx={{ borderColor: EV.light, px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
          <div className="grid grid-cols-3" style={{ gap: '8px' }}>
            <Button onClick={()=>onSave?.(item)} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none', fontSize: { xs: '12px', sm: '14px' }, py: { xs: 0.75, sm: 1 } }}>Save</Button>
            <Button onClick={()=>onShare?.(item)} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none', fontSize: { xs: '12px', sm: '14px' }, py: { xs: 0.75, sm: 1 } }}>Share</Button>
            <Button onClick={()=>onDelete?.(item)} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', fontSize: { xs: '12px', sm: '14px' }, py: { xs: 0.75, sm: 1 }, '&:hover': { bgcolor: '#e06f00' } }}>Delete</Button>
          </div>
        </Box>
      </Box>
    </Dialog>
  );
}
