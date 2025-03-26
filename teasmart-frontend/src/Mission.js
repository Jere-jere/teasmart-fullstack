import React, { useState, useEffect } from 'react';
import { Box, Typography, Container } from '@mui/material';

const slides = [
  {
    image: '/assets/img/tea2.jpg',
    title: 'Welcome to Teasmart',
    subtitle: 'A world-leading Ai-driven advisory & E-learning platform.',
  },
  {
    image: '/assets/img/tea3.jpg',
    title: "Connecting Kenya's Tea Farmers to the World",
    subtitle: 'Giving opportunities to small tea shareholders and local farmers.',
  },
  {
    image: '/assets/img/tea4.jpg',
    title: "Producing the World's Best Cup of Tea",
    subtitle: 'Our main mission is to produce what is best for our customers.',
  },
  {
    image: '/assets/img/tea.jpg',
    title: 'Empowering Tea Farmers with AI Insights',
    subtitle: 'Actionable insights to improve your yield and sustainability.',
  },
];

const Mission = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    console.log('✅ Mission component has been mounted.'); // Debug log

    // Automatically change the slide every 5 seconds
    const interval = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);

    // Cleanup the interval on component unmount
    return () => {
      console.log('❌ Mission component unmounted.');
      clearInterval(interval);
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed', // Make the component fixed
        top: '64px', // Position it below the header (header height is 64px)
        left: 0,
        right: 0,
        zIndex: 1000, // Ensure it stays above other content
        overflow: 'hidden',
        height: '125px',
        width: '100%',
      }}
    >
      {/* Slides Container */}
      <Box
        sx={{
          display: 'flex',
          width: `${slides.length * 100}%`,
          transform: `translateX(-${currentSlideIndex * (100 / slides.length)}%)`,
          transition: 'transform 1s ease-in-out',
        }}
      >
        {slides.map((slide, index) => (
          <Box
            key={index}
            sx={{
              width: `${100 / slides.length}%`,
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '125px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              position: 'relative', // Required for the overlay
            }}
          >
            {/* Semi-transparent overlay */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Black with 50% opacity
              }}
            />

            {/* Text container */}
            <Container sx={{ position: 'relative', zIndex: 1 }}> {/* Ensure text is above the overlay */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  color: 'white',
                }}
              >
                {slide.title}
              </Typography>
              <Typography
                variant="body2" // Smaller font size
                sx={{
                  mb: 3,
                  color: 'white',
                  fontStyle: 'italic', // Italic text
                }}
              >
                {slide.subtitle}
              </Typography>
            </Container>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Mission;