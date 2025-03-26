import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Paper,
    Box,
    CircularProgress,
    Alert,
    List,
    ListItem,
    ListItemText,
    Divider,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Custom theme for the profile page
const theme = createTheme({
    palette: {
        primary: {
            main: '#4CAF50', // Green color
        },
        secondary: {
            main: '#FF5722', // Orange color
        },
    },
});

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('You are not logged in.');
                    return;
                }

                const response = await axios.get('http://localhost:5000/api/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
            } catch (error) {
                console.error(error);
                setError('Failed to fetch profile data.');
            }
        };

        fetchProfile();
    }, []);

    if (error) {
        return (
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!user) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
                        Profile
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemText
                                primary="Name"
                                secondary={user.name}
                                primaryTypographyProps={{ fontWeight: 'bold' }}
                                secondaryTypographyProps={{ color: 'text.primary' }}
                            />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText
                                primary="Email"
                                secondary={user.email}
                                primaryTypographyProps={{ fontWeight: 'bold' }}
                                secondaryTypographyProps={{ color: 'text.primary' }}
                            />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText
                                primary="Phone Number"
                                secondary={user.phone_number}
                                primaryTypographyProps={{ fontWeight: 'bold' }}
                                secondaryTypographyProps={{ color: 'text.primary' }}
                            />
                        </ListItem>
                    </List>
                </Paper>
            </Container>
        </ThemeProvider>
    );
};

export default Profile;