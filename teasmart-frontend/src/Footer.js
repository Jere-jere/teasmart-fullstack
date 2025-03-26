import React from 'react';
import { Box, Typography, IconButton, Container, Link } from '@mui/material';
import { Facebook, Twitter, Instagram } from '@mui/icons-material';

const Footer = () => {
    return (
        <Box
            sx={{
                position: 'relative',
                overflow: 'hidden',
                height: '200px',
                width: '100%',
                textAlign: 'center',
                padding: 4,
                backgroundColor: 'white',
                color: 'black',
                borderTop: '1px solid #ddd',
            }}
        >
            <Container maxWidth="lg">
                {/* Follow Us Section */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start', // Align items to the left
                        gap: 2,
                    }}
                >
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        Follow Us
                    </Typography>

                    {/* Social Media Icons */}
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1.5, // Reduce spacing
                        }}
                    >
                        <IconButton
                            href="#"
                            target="_blank"
                            sx={{ color: '#333', '&:hover': { color: '#1877F2' } }} // Facebook blue
                        >
                            <Facebook fontSize="medium" />
                        </IconButton>
                        <IconButton
                            href="#"
                            target="_blank"
                            sx={{ color: '#333', '&:hover': { color: '#1DA1F2' } }} // Twitter blue
                        >
                            <Twitter fontSize="medium" />
                        </IconButton>
                        <IconButton
                            href="#"
                            target="_blank"
                            sx={{ color: '#333', '&:hover': { color: '#E1306C' } }} // Instagram pink
                        >
                            <Instagram fontSize="medium" />
                        </IconButton>
                    </Box>
                </Box>

                {/* Footer Bottom */}
                <Box
                    sx={{
                        marginTop: 4,
                        paddingTop: 2,
                        borderTop: '1px solid #ddd',
                        color: '#666',
                        textAlign: 'center', // Center this section
                    }}
                >
                    <Typography variant="body2">
                        © {new Date().getFullYear()} ENS 1:519. All rights reserved.
                    </Typography>
                    <Typography variant="body2" sx={{ marginTop: 1 }}>
                        <Link
                            href="#"
                            sx={{
                                color: '#666',
                                textDecoration: 'none',
                                '&:hover': { color: '#333' },
                                display: 'inline-block', // Ensure visibility
                                marginRight: 1,
                            }}
                        >
                            Privacy Policy
                        </Link>
                        |
                        <Link
                            href="#"
                            sx={{
                                color: '#666',
                                textDecoration: 'none',
                                '&:hover': { color: '#333' },
                                display: 'inline-block', // Ensure visibility
                                marginLeft: 1,
                            }}
                        >
                            Terms of Service
                        </Link>
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
