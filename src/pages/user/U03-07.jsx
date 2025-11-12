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
        {/* eslint-disable-next-line @next/next/no-img-element */}
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
        <Toolbar className="!min-h-[56px]">
          <IconButton onClick={onClose} aria-label="Close" sx={{ color: '#fff' }}><CloseRoundedIcon /></IconButton>
          <Typography variant="h6" className="font-bold ml-1 truncate">{title || 'Media'}</Typography>
          <Box sx={{ flexGrow: 1 }} />
          {meta && <Typography variant="caption" className="opacity-80 mr-2">{meta}</Typography>}
        </Toolbar>
      </AppBar>

      {/* Body */}
      <Box className="flex-1" sx={{ height: '100%', overflow: 'hidden' }}>
        {renderBody()}
      </Box>

      {/* Actions */}
      <Box className="fixed inset-x-0 bottom-0 z-10 flex justify-center" sx={{ pb: 'env(safe-area-inset-bottom)' }}>
        <Box className="w-full max-w-sm bg-white/95 backdrop-blur px-3 py-2 border-t" sx={{ borderColor: EV.light }}>
          <div className="grid grid-cols-3 gap-2">
            <Button onClick={()=>onSave?.(item)} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Save</Button>
            <Button onClick={()=>onShare?.(item)} variant="outlined" sx={{ borderColor: EV.orange, color: EV.orange, textTransform:'none' }}>Share</Button>
            <Button onClick={()=>onDelete?.(item)} variant="contained" sx={{ bgcolor: EV.orange, textTransform:'none', '&:hover': { bgcolor: '#e06f00' } }}>Delete</Button>
          </div>
        </Box>
      </Box>
    </Dialog>
  );
}
