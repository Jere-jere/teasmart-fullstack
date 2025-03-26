import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Paper,
    Grid,
    Link,
    Snackbar,
    Alert,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Custom theme for the registration page
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

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(''); // State for phone number
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false); // For success message
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validate password length
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        // Validate phone number format
        const phoneRegex = /^(07\d{8}|\+254\d{9})$/;
        if (!phoneRegex.test(phoneNumber)) {
            setError('Invalid phone number format. It should start with 07 or +254.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password,
                phoneNumber, // Include phone number in the request
            });

            if (response.status === 201) {
                // Save the token to localStorage
                localStorage.setItem('token', response.data.token);

                // Show success message
                setSuccess(true);

                // Redirect to the profile page after a short delay
                setTimeout(() => {
                    navigate('/profile');
                }, 2000); // Redirect after 2 seconds
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
            console.error(err);
        }
    };

    const handleCloseError = () => {
        setError('');
    };

    const handleCloseSuccess = () => {
        setSuccess(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <Paper
                    elevation={3}
                    sx={{
                        marginTop: 8,
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Register
                    </Typography>
                    {error && (
                        <Snackbar
                            open={!!error}
                            autoHideDuration={6000}
                            onClose={handleCloseError}
                        >
                            <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                                {error}
                            </Alert>
                        </Snackbar>
                    )}
                    {success && (
                        <Snackbar
                            open={success}
                            autoHideDuration={6000}
                            onClose={handleCloseSuccess}
                        >
                            <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                                Registration successful! Redirecting to profile...
                            </Alert>
                        </Snackbar>
                    )}
                    <Box component="form" onSubmit={handleRegister} sx={{ width: '100%', mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Full Name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="phoneNumber"
                            label="Phone Number"
                            name="phoneNumber"
                            autoComplete="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    Already have an account? Sign In
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Container>
        </ThemeProvider>
    );
};

export default Register;