import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Container,
    Grid,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    CircularProgress,
    Card,
    CardContent,
    Snackbar,
    IconButton,
} from '@mui/material';
import { Close, Thermostat, Opacity, Grass, Science, Scale } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';

const theme = createTheme({
    palette: {
        primary: {
            main: '#4CAF50', // Green
        },
        secondary: {
            main: '#FFC107', // Amber
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
        h4: {
            fontWeight: 'bold',
        },
    },
});

const FertilizerRecommendationForm = () => {
    const [formData, setFormData] = useState({
        temperature: '',
        humidity: '',
        moisture: '',
        ph: '',
        soilType: '',
        teaType: '',
        nitrogen: '',
        potassium: '',
        phosphorous: '',
        sizeOfLand: '',
        kilosProduced: '',
        numberOfBushes: '',
        numberOfBags: ''
    });

    const [recommendation, setRecommendation] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    // Dropdown options
    const soilTypes = ['Clay', 'Loam', 'Sandy'];
    const teaTypes = ['Black', 'Green','Oolong',];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const numericFields = [
            'temperature', 'humidity', 'moisture', 'ph', 
            'nitrogen', 'potassium', 'phosphorous', 
            'sizeOfLand', 'kilosProduced', 'numberOfBushes', 'numberOfBags'
        ];

        numericFields.forEach(field => {
            if (!formData[field] || isNaN(formData[field])) {
                newErrors[field] = 'Please enter a valid number';
            }
        });

        if (!formData.soilType) newErrors.soilType = 'Soil type is required';
        if (!formData.teaType) newErrors.teaType = 'Tea type is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
// Update the handleSubmit function
const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setRecommendation('');

    try {
        // Convert humidity/moisture to percentage (0-100) for the API
        const apiData = {
            ...formData,
            humidity: formData.humidity * 100,
            moisture: formData.moisture * 100
        };

        const response = await axios.post('http://localhost:5000/api/recommend', apiData);
        
        if (response.data.status === 'success') {
            setRecommendation(response.data.recommended_fertilizer);
        } else {
            setError(response.data.error || 'Failed to get recommendation');
            setSnackbarOpen(true);
        }
    } catch (error) {
        const errorMsg = error.response?.data?.error || 
                        error.message || 
                        'Failed to get fertilizer recommendation';
        setError(errorMsg);
        setSnackbarOpen(true);
    } finally {
        setLoading(false);
    }
};

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md">
                <Box sx={{ mt: 4, mb: 4 }}>
                    <Typography variant="h4" gutterBottom align="center" color="primary">
                        TeaSmart Fertilizer Recommendation Model
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom align="center">
                        Enter your farm details to get the optimal fertilizer recommendation
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            {/* Environmental Conditions */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Environmental Conditions
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Temperature (°C)(10-40)"
                                    name="temperature"
                                    type="number"
                                    value={formData.temperature}
                                    onChange={handleChange}
                                    error={!!errors.temperature}
                                    helperText={errors.temperature}
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: <Thermostat color="action" sx={{ mr: 1 }} />,
                                    }}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Humidity (0-100)"
                                    name="humidity"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="1"
                                    value={formData.humidity}
                                    onChange={handleChange}
                                    error={!!errors.humidity}
                                    helperText={errors.humidity}
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: <Opacity color="action" sx={{ mr: 1 }} />,
                                    }}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Soil Moisture (0-100)"
                                    name="moisture"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="1"
                                    value={formData.moisture}
                                    onChange={handleChange}
                                    error={!!errors.moisture}
                                    helperText={errors.moisture}
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: <Grass color="action" sx={{ mr: 1 }} />,
                                    }}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Soil pH (3-9)"
                                    name="ph"
                                    type="number"
                                    step="0.1"
                                    value={formData.ph}
                                    onChange={handleChange}
                                    error={!!errors.ph}
                                    helperText={errors.ph}
                                    variant="outlined"
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth error={!!errors.soilType}>
                                    <InputLabel>Soil Type</InputLabel>
                                    <Select
                                        name="soilType"
                                        value={formData.soilType}
                                        onChange={handleChange}
                                        label="Soil Type"
                                        required
                                    >
                                        {soilTypes.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.soilType && (
                                        <Typography variant="body2" color="error">
                                            {errors.soilType}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>

                            {/* Tea Information */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Tea Information
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth error={!!errors.teaType}>
                                    <InputLabel>Tea Type</InputLabel>
                                    <Select
                                        name="teaType"
                                        value={formData.teaType}
                                        onChange={handleChange}
                                        label="Tea Type"
                                        required
                                    >
                                        {teaTypes.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.teaType && (
                                        <Typography variant="body2" color="error">
                                            {errors.teaType}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Farm Size (acres)"
                                    name="sizeOfLand"
                                    type="number"
                                    step="0.1"
                                    value={formData.sizeOfLand}
                                    onChange={handleChange}
                                    error={!!errors.sizeOfLand}
                                    helperText={errors.sizeOfLand}
                                    variant="outlined"
                                    required
                                />
                            </Grid>

                            {/* Nutrient Levels */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Soil Nutrient Levels (ppm)
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Nitrogen"
                                    name="nitrogen"
                                    type="number"
                                    value={formData.nitrogen}
                                    onChange={handleChange}
                                    error={!!errors.nitrogen}
                                    helperText={errors.nitrogen}
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: <Science color="action" sx={{ mr: 1 }} />,
                                    }}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Potassium"
                                    name="potassium"
                                    type="number"
                                    value={formData.potassium}
                                    onChange={handleChange}
                                    error={!!errors.potassium}
                                    helperText={errors.potassium}
                                    variant="outlined"
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Phosphorous"
                                    name="phosphorous"
                                    type="number"
                                    value={formData.phosphorous}
                                    onChange={handleChange}
                                    error={!!errors.phosphorous}
                                    helperText={errors.phosphorous}
                                    variant="outlined"
                                    required
                                />
                            </Grid>

                            {/* Production Information */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Production Information
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Kilos Produced"
                                    name="kilosProduced"
                                    type="number"
                                    value={formData.kilosProduced}
                                    onChange={handleChange}
                                    error={!!errors.kilosProduced}
                                    helperText={errors.kilosProduced}
                                    variant="outlined"
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Number of Bushes"
                                    name="numberOfBushes"
                                    type="number"
                                    value={formData.numberOfBushes}
                                    onChange={handleChange}
                                    error={!!errors.numberOfBushes}
                                    helperText={errors.numberOfBushes}
                                    variant="outlined"
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Fertilizer Bags Used"
                                    name="numberOfBags"
                                    type="number"
                                    value={formData.numberOfBags}
                                    onChange={handleChange}
                                    error={!!errors.numberOfBags}
                                    helperText={errors.numberOfBags}
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: <Scale color="action" sx={{ mr: 1 }} />,
                                    }}
                                    required
                                />
                            </Grid>

                            {/* Submit Button */}
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    disabled={loading}
                                    size="large"
                                    sx={{ py: 2 }}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Get Fertilizer Recommendation'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>

                    {/* Recommendation Result */}
                    {recommendation && (
                        <Box sx={{ mt: 4 }}>
                            <Card variant="outlined" sx={{ borderColor: 'primary.main' }}>
                                <CardContent>
                                    <Typography variant="h5" color="primary" gutterBottom>
                                        Recommended Fertilizer
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'green' }}>
                                        {recommendation}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 2 }}>
                                        Based on your farm's conditions, this fertilizer will optimize your tea production.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    )}
                </Box>

                {/* Error Snackbar */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    message={error}
                    action={
                        <IconButton size="small" color="inherit" onClick={handleCloseSnackbar}>
                            <Close fontSize="small" />
                        </IconButton>
                    }
                />
            </Container>
        </ThemeProvider>
    );
};

export default FertilizerRecommendationForm;