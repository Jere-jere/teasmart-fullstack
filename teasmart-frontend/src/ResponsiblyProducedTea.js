import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Container } from '@mui/material';
import WeatherIcon from '@mui/icons-material/WbSunny';
import BookIcon from '@mui/icons-material/MenuBook';
import RecommendationsIcon from '@mui/icons-material/ThumbsUpDown'; // New icon for recommendations
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Features = () => {
    const [features, setFeatures] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/features');
                setFeatures(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const iconMap = {
        'Weather Insights': <WeatherIcon sx={{ fontSize: 60, color: '#2E7D32' }} />,
        'Educational Materials': <BookIcon sx={{ fontSize: 60, color: '#2E7D32' }} />,
        'Personalized Recommendations': <RecommendationsIcon sx={{ fontSize: 60, color: '#2E7D32' }} />, // New icon
    };

    const handleCardClick = (title) => {
        if (title === 'Personalized Recommendations') {
            navigate('/personalized-recommendations'); // Navigate to the personalized recommendations form
        } else {
            navigate(`/feature/${title}`); // Navigate to other feature interaction pages
        }
    };

    return (
        <Box sx={{ py: 6, backgroundColor: '#F5F5F5' }}>
            <Container>
                <Typography variant="h5" sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}>
                    Features
                </Typography>
                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card 
                                sx={{ textAlign: 'center', height: '100%', cursor: 'pointer' }} 
                                onClick={() => handleCardClick(feature.title)} // Add onClick handler
                            >
                                <CardContent>
                                    {iconMap[feature.title]}
                                    <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 2 }}>
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Features;