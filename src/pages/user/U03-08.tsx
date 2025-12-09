import { useMemo, useState } from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Chip,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  Avatar
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

const EV = { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" };

const DEMO = [
  { id: 'i1', type: 'image', src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=400&auto=format&fit=crop', by: { name:'Leslie', avatar:'https://i.pravatar.cc/100?img=5' } },
  { id: 'v1', type: 'video', src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm', thumb: 'https://images.unsplash.com/photo-1526178611301-1e3f6dc1f1ae?q=80&w=400&auto=format&fit=crop', by: { name:'You', avatar:'https://i.pravatar.cc/100?img=2' } },
  { id: 'd1', type: 'doc', src: '/sample.pdf', thumb: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=400&auto=format&fit=crop', by: { name:'Support', avatar:'https://i.pravatar.cc/100?img=8' } },
  { id: 'i2', type: 'image', src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=400&auto=format&fit=crop', by: { name:'Cohen', avatar:'https://i.pravatar.cc/100?img=12' } },
];

/**
 * U03-08 — ConversationGallery
 * Filter by type and open item via onOpen(item)
 */
export default function ConversationGallery({ onBack, items = DEMO, onOpen }) {
  const muiTheme = useMuiTheme();
  const [filter, setFilter] = useState('All');
  const types = ['All','Images','Videos','Audio','Docs'];

  const list = useMemo(() => {
    if (filter === 'All') return items;
    if (filter === 'Images') return items.filter(i => i.type === 'image');
    if (filter === 'Videos') return items.filter(i => i.type === 'video');
    if (filter === 'Audio') return items.filter(i => i.type === 'audio');
    if (filter === 'Docs') return items.filter(i => i.type === 'doc');
    return items;
  }, [filter, items]);

  return (
    <>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <Box className="w-full h-full mx-auto flex flex-col" sx={{ bgcolor: 'background.paper' }}>
        <AppBar elevation={0} position="static" sx={{ bgcolor:'background.paper', color:'text.primary', borderBottom:`1px solid ${muiTheme.palette.divider}` }}>
          <Toolbar className="!min-h-[56px]" sx={{ px: { xs: 1.5, sm: 3 } }}>
            <IconButton onClick={onBack} aria-label="Back" sx={{ color: 'text.primary', padding: { xs: '6px', sm: '8px' } }}>
              <ArrowBackRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <Typography variant="h6" className="font-bold" sx={{ color: 'text.primary', fontSize: { xs: '16px', sm: '18px' }, ml: { xs: 0.5, sm: 1 } }}>Media</Typography>
          </Toolbar>
        </AppBar>

        {/* filters */}
        <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
          <div className="flex gap-2 flex-wrap" style={{ gap: '8px' }}>
            {types.map(t => (
              <Chip 
                key={t} 
                label={t} 
                onClick={()=>setFilter(t)}
                sx={{ 
                  bgcolor: filter===t?EV.green:'background.default', 
                  color: filter===t?'#fff':'text.primary', 
                  fontSize: { xs: '11px', sm: '12px' },
                  height: { xs: 24, sm: 28 },
                  '&:hover':{ bgcolor: filter===t?'#02b37b':'action.hover' } 
                }} 
              />
            ))}
          </div>
        </Box>

        {/* grid */}
        <Box className="flex-1 no-scrollbar" sx={{ overflowY:'auto' }}>
          <Grid container spacing={{ xs: 1, sm: 1.2 }} sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
            {list.map((it) => (
              <Grid item xs={4} key={it.id}>
                <Card elevation={0} sx={{ borderRadius: 2, overflow:'hidden', border:`1px solid ${muiTheme.palette.divider}`, bgcolor: 'background.paper' }}>
                  <CardActionArea onClick={()=>onOpen?.(it)}>
                    <CardMedia component="img" src={it.thumb || it.src} alt="thumb" sx={{ height: { xs: '5rem', sm: '6.125rem' }, objectFit:'cover' }} />
                    <div className="absolute bottom-1 left-1 inline-flex items-center gap-1 bg-black/60 text-white rounded-full" style={{ fontSize: '10px', padding: '2px 6px' }}>
                      <Avatar src={it.by?.avatar} sx={{ width: { xs: '0.75rem', sm: '0.875rem' }, height: { xs: '0.75rem', sm: '0.875rem' } }} />
                      <span>{it.type}</span>
                    </div>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
}
