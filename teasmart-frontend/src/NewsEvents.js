// src/pages/NewsEvents.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { motion } from 'framer-motion'; // Import Framer Motion

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2, // Stagger animations for child elements
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const NewsEvents = () => {
    // State to store news and events
    const [news, setNews] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch news and events from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch news
                const newsResponse = await fetch('http://localhost:5000/api/news');
                if (!newsResponse.ok) {
                    throw new Error('Failed to fetch news');
                }
                const newsData = await newsResponse.json();
                setNews(newsData);

                // Fetch events
                const eventsResponse = await fetch('http://localhost:5000/api/events');
                if (!eventsResponse.ok) {
                    throw new Error('Failed to fetch events');
                }
                const eventsData = await eventsResponse.json();
                setEvents(eventsData);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography color="error">Error: {error}</Typography>;
    }

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                News & Events
            </Typography>

            {/* News Section */}
            <Typography variant="h5" gutterBottom>
                Trending News
            </Typography>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <List>
                    {news.map((item) => (
                        <motion.div key={item.id} variants={itemVariants}>
                            <ListItem>
                                <ListItemText primary={item.title} secondary={item.description} />
                            </ListItem>
                            <Divider />
                        </motion.div>
                    ))}
                </List>
            </motion.div>

            {/* Events Section */}
            <Typography variant="h5" gutterBottom>
                Upcoming Events
            </Typography>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <List>
                    {events.map((item) => (
                        <motion.div key={item.id} variants={itemVariants}>
                            <ListItem>
                                <ListItemText
                                    primary={item.title}
                                    secondary={`Date: ${new Date(item.event_date).toLocaleDateString()} | Location: ${item.location}`}
                                />
                            </ListItem>
                            <Divider />
                        </motion.div>
                    ))}
                </List>
            </motion.div>
        </Box>
    );
};

export default NewsEvents;