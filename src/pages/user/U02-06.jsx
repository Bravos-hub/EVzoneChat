import React from 'react';
import { Box, Typography, Button } from '@mui/material';

export default function U02_06() {
  return (
    <Box className="p-4 space-y-3">
      <Typography variant="h6" className="font-semibold">Composer + Voice</Typography>
      <Box className="rounded-2xl p-4 bg-white shadow-sm">
        <Typography variant="body2">This is a placeholder for U02-06. Replace with the real UI.</Typography>
      </Box>
      <Button variant="contained" sx={{ bgcolor: '#f77f00', '&:hover': { bgcolor: '#e06f00' } }}>Primary Action</Button>
      <Button variant="outlined" sx={{ borderColor: '#f77f00', color: '#f77f00' }}>Secondary</Button>
    </Box>
  );
}
