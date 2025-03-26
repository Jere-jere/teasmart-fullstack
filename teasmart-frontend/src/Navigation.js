import React, { useEffect, useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
    const [value, setValue] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    // Update the selected tab based on the current route
    useEffect(() => {
        if (location.pathname === '/responsibly-produced-tea') setValue(0);
        else if (location.pathname === '/our-teas') setValue(1);
        else if (location.pathname === '/search') setValue(2);
        else if (location.pathname === '/profile') setValue(3);
    }, [location.pathname]);

    const handleNavigation = (newValue) => {
        setValue(newValue);
        if (newValue === 0) navigate('/responsibly-produced-tea');
        else if (newValue === 1) navigate('/our-teas');
        else if (newValue === 2) navigate('/search');
        else if (newValue === 3) navigate('/profile');
    };

    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => handleNavigation(newValue)}
            >
                <BottomNavigationAction label="Home" icon={<HomeIcon />} />
                <BottomNavigationAction label="Our Teas" icon={<LocalCafeIcon />} />
                <BottomNavigationAction label="Search" icon={<SearchIcon />} />
                <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
            </BottomNavigation>
        </Paper>
    );
};

export default Navigation;