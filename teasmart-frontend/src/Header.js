import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu'; // Import menu icon for mobile view

const Header = ({ isLoggedIn, onLogout }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // Handle logout
    const handleLogout = () => {
        onLogout(); // Call the onLogout function passed from App.js
        navigate('/login');
    };

    return (
        <AppBar 
            position="fixed" // Change from 'static' to 'fixed'
            sx={{ 
                backgroundColor: '#2E7D32', 
                boxShadow: 'none',
                zIndex: (theme) => theme.zIndex.drawer + 1, // Ensure the header is above other content
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between', padding: '0 24px' }}>
                {/* Left side: Logo and title */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h4" component="div" sx={{ fontFamily: 'Playfair Display, serif', fontWeight: 'bold', letterSpacing: '1px' }}>
                        TEASMART
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontFamily: 'Roboto, sans-serif', color: '#E0E0E0', fontStyle: 'italic' }}>
                        Sip the Future
                    </Typography>
                </Box>

                {/* Right side: Navigation links */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
                    {/* About Us Dropdown */}
                    <Button
                        color="inherit"
                        aria-controls="about-us-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                        sx={{ textTransform: 'none', fontSize: '16px', '&:hover': { backgroundColor: '#1B5E20' } }}
                    >
                        About Us
                    </Button>
                    <Menu
                        id="about-us-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        MenuListProps={{ sx: { backgroundColor: '#2E7D32', color: '#FFF' } }}
                    >
                        <MenuItem onClick={handleClose} sx={{ '&:hover': { backgroundColor: '#1B5E20' } }}>Our Story</MenuItem>
                        <MenuItem onClick={handleClose} sx={{ '&:hover': { backgroundColor: '#1B5E20' } }}>Our Team</MenuItem>
                        <MenuItem onClick={handleClose} sx={{ '&:hover': { backgroundColor: '#1B5E20' } }}>Our Values</MenuItem>
                        <MenuItem onClick={handleClose} sx={{ '&:hover': { backgroundColor: '#1B5E20' } }}>Sustainability</MenuItem>
                        <MenuItem onClick={handleClose} sx={{ '&:hover': { backgroundColor: '#1B5E20' } }}>Certifications</MenuItem>
                    </Menu>

                    <Button color="inherit" component={Link} to="/our-teas" sx={{ textTransform: 'none', fontSize: '16px', '&:hover': { backgroundColor: '#1B5E20' } }}>
                        Our Teas
                    </Button>
                    <Button color="inherit" component={Link} to="/tenders" sx={{ textTransform: 'none', fontSize: '16px', '&:hover': { backgroundColor: '#1B5E20' } }}>
                        Tenders
                    </Button>
                    <Button color="inherit" component={Link} to="/news-events" sx={{ textTransform: 'none', fontSize: '16px', '&:hover': { backgroundColor: '#1B5E20' } }}>
                        News & Events
                    </Button>
                    <Button color="inherit" component={Link} to="/contact-us" sx={{ textTransform: 'none', fontSize: '16px', '&:hover': { backgroundColor: '#1B5E20' } }}>
                        Contact Us
                    </Button>

                    {/* Conditionally render Login or Logout button */}
                    {isLoggedIn ? (
                        <Button 
                            color="inherit" 
                            onClick={handleLogout} 
                            sx={{ textTransform: 'none', fontSize: '16px', '&:hover': { backgroundColor: '#1B5E20' } }}
                        >
                            Logout
                        </Button>
                    ) : (
                        <Button 
                            color="inherit" 
                            onClick={() => navigate('/login')} 
                            sx={{ textTransform: 'none', fontSize: '16px', '&:hover': { backgroundColor: '#1B5E20' } }}
                        >
                            Login
                        </Button>
                    )}
                </Box>

                {/* Mobile menu button (hidden on larger screens) */}
                <IconButton
                    color="inherit"
                    sx={{ display: { xs: 'block', md: 'none' } }}
                    onClick={handleClick}
                >
                    <MenuIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default Header;