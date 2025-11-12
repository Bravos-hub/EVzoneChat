import React, { useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Chip,
  Button
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PanToolAltRoundedIcon from "@mui/icons-material/PanToolAltRounded";
import TagFacesRoundedIcon from "@mui/icons-material/TagFacesRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

/**
 * U06-16 — Reactions & Raise Hand
 * Overlay for quick reactions (👍 ❤️ 😂 👏 🎉) and Raise Hand toggle.
 */
export default function InCallReactions({ onBack, remote = { name:'Group Call' }, onSendReaction, onRaise }) {
  const emojis = useMemo(()=> ['👍','❤️','😂','👏','🎉'], []);
  const [raised, setRaised] = useState(false);
  const [bursts, setBursts] = useState([]); // { id, emoji, left }

  const send = (e) => {
    const id = Date.now() + Math.random();
    const left = 12 + Math.floor(Math.random()*76); // %
    setBursts((prev)=> [...prev, { id, emoji: e, left }]);
    setTimeout(()=> setBursts((prev)=> prev.filter(b=> b.id!==id)), 1200);
    onSendReaction?.(e);
  };

  const toggleRaise = () => { const v = !raised; setRaised(v); onRaise?.(v); };

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar{display:none}
        .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
        @keyframes floatUp { from { transform: translateY(0); opacity:1 } to { transform: translateY(-140px); opacity:0 } }
      `}</style>

      <Box className="w-full h-full max-w-sm mx-auto bg-black text-white flex flex-col relative">
        {/* Header */}
        <AppBar elevation={0} position="static" sx={{ bgcolor:'rgba(0,0,0,0.55)', color:'#fff' }}>
          <Toolbar className="!min-h-[56px]">
            <IconButton onClick={onBack} aria-label="Back" sx={{ color:'#fff' }}><ArrowBackRoundedIcon /></IconButton>
            <Typography variant="h6" className="font-bold">Reactions</Typography>
          </Toolbar>
        </AppBar>

        {/* Video placeholder */}
        <Box className="flex-1 relative">
          <video className="absolute inset-0 w-full h-full object-cover" muted loop autoPlay playsInline>
            <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" type="video/webm" />
          </video>
          {/* floating bursts */}
          {bursts.map(b => (
            <div key={b.id} className="absolute bottom-20 text-2xl" style={{ left: `${b.left}%`, animation: 'floatUp 1.2s ease-out forwards' }}>{b.emoji}</div>
          ))}
        </Box>

        {/* Bottom bar */}
        <Box className="fixed inset-x-0 bottom-0 z-10 flex justify-center" sx={{ pb: 'env(safe-area-inset-bottom)' }}>
          <Box className="w-full max-w-sm px-3 pb-3">
            <div className="bg-white/10 rounded-2xl px-3 py-2 backdrop-blur text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {emojis.map(em => (
                    <Button key={em} onClick={()=>send(em)} variant="outlined" sx={{ minWidth: 44, borderColor: EV.orange, color: '#fff', '&:hover':{ borderColor: '#e06f00', bgcolor:'rgba(0,0,0,0.1)' } }}>{em}</Button>
                  ))}
                </div>
                <Button onClick={toggleRaise} startIcon={<PanToolAltRoundedIcon/>} variant={raised? 'contained':'outlined'}
                        sx={{ bgcolor: raised? EV.orange: 'transparent', color:'#fff', borderColor: EV.orange, textTransform:'none', '&:hover':{ bgcolor: raised? '#e06f00':'rgba(0,0,0,0.1)' } }}>
                  {raised? 'Lower hand' : 'Raise hand'}
                </Button>
              </div>
            </div>
          </Box>
        </Box>
      </Box>
    </>
  );
}
