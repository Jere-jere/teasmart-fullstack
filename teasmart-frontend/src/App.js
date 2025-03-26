import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Header';
import Mission from './Mission'; // Import the Mission component
import ResponsiblyProducedTea from './ResponsiblyProducedTea';
import Navigation from './Navigation';
import Footer from './Footer';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';
import ProtectedRoute from './ProtectedRoute';
import ChatComponent from './ChatComponent'; // Import the ChatComponent
import Features from './Features'; // Import the new Features component
import FeatureInteraction from './FeatureInteraction'; // Import FeatureInteraction component
import NewsEvents from './NewsEvents'; // Import the NewsEvents component
import RecommendationsForm from './RecommendationsForm'; // Import the new RecommendationsForm component
import { Box } from '@mui/material'; // Import Box for layout

const theme = createTheme({
    palette: {
        primary: {
            main: '#4CAF50', // Green color for the header
        },
    },
});

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

    // Check if the user is logged in on app load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    // Function to handle login
    //const handleLogin = () => {
      //  setIsLoggedIn(true);
  //  };

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <Router>
                <div style={{ position: 'relative', minHeight: '100vh', overflowX: 'hidden' }}> {/* Prevent horizontal scrolling */}
                    <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
                    <Mission /> {/* Mission component is now fixed below the header */}
                    <Box sx={{ paddingTop: '214px' }}> {/* Adjust padding to account for Header (64px) + Mission (150px) */}
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={
                                <>
                                    <Box sx={{ marginTop: '40px' }}> {/* Add margin to separate Mission and other components */}
                                        <ResponsiblyProducedTea />
                                    </Box>
                                </>
                            } />

                            <Route path="/responsibly-produced-tea" element={
                                <>
                                    <Box sx={{ marginTop: '40px' }}>
                                        <ResponsiblyProducedTea />
                                    </Box>
                                </>
                            } />

                            {/* Pass setIsLoggedIn to Login */}
                            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                            <Route path="/register" element={<Register />} />

                            {/* Protected Routes */}
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute isLoggedIn={isLoggedIn}>
                                        <Profile />
                                    </ProtectedRoute>
                                }
                            />

                            {/* New Route for Features */}
                            <Route path="/features" element={
                                <>
                                    <Box sx={{ marginTop: '40px' }}> {/* Add margin to separate Mission and Features */}
                                        <Features />
                                    </Box>
                                </>
                            } />

                            {/* Route for Feature Interaction */}
                            <Route path="/feature/:title" element={<FeatureInteraction />} />

                            {/* New Route for Personalized Recommendations */}
                            <Route path="/personalized-recommendations" element={
                                <>
                                    <Box sx={{ marginTop: '40px' }}> {/* Add margin to separate Mission and RecommendationsForm */}
                                        <RecommendationsForm />
                                    </Box>
                                </>
                            } />

                            {/* New Route for News & Events */}
                            <Route path="/news-events" element={
                                <>
                                    <Box sx={{ marginTop: '40px' }}> {/* Add margin to separate Mission and NewsEvents */}
                                        <NewsEvents />
                                    </Box>
                                </>
                            } />

                            {/* Default Route (Redirect to Home) */}
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </Box>
                    <Footer />
                    <Navigation />

                    {/* Add the ChatComponent here (global chat widget) */}
                    <div style={{
                        position: 'fixed', // Fix the chat widget to the bottom-right corner
                        bottom: '20px',
                        right: '20px',
                        zIndex: 1000, // Ensure it appears above other elements
                        maxWidth: '100%', // Ensure it doesn't exceed the viewport width
                        overflowX: 'hidden', // Prevent horizontal overflow
                    }}>
                        <ChatComponent />
                    </div>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;