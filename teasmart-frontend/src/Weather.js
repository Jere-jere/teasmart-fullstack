import React from 'react';
import { Box, Typography } from '@mui/material';

const Weather = () => {
    return (
        <Box sx={{ textAlign: 'center', padding: 2, backgroundColor: '#d1e8d1' }}>
            <Typography variant="body1">
                24°C Mostly cloudy
            </Typography>
        </Box>
    );
};

export default Weather;