import type React from 'react';
import { Box, Typography, Button } from '@mui/material';

export default function U02_06() {
  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, '& > * + *': { mt: { xs: 2, sm: 3 } } }}>
      <Typography variant="h6" className="font-semibold" sx={{ fontSize: { xs: '16px', sm: '18px' } }}>Composer + Voice</Typography>
      <Box className="rounded-2xl bg-white shadow-sm" sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Typography variant="body2" sx={{ fontSize: { xs: '13px', sm: '14px' } }}>This is a placeholder for U02-06. Replace with the real UI.</Typography>
      </Box>
      <Button variant="contained" sx={{ bgcolor: '#f77f00', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.75, sm: 1 }, '&:hover': { bgcolor: '#e06f00' } }}>Primary Action</Button>
      <Button variant="outlined" sx={{ borderColor: '#f77f00', color: '#f77f00', fontSize: { xs: '13px', sm: '14px' }, py: { xs: 0.75, sm: 1 } }}>Secondary</Button>
    </Box>
  );
}
