import express from 'express';
import multer from 'multer';
import axios from 'axios';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { getTeaData } from '../controllers/teaController.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

// Fetch tea data
router.get('/tea', getTeaData);

// Mock data for features
const features = [
    {
        title: 'Personalized Recommendations',
        description: 'Get tailored advice based on your farm data and preferences.',
    }, 
    {
        title: 'Educational Materials',
        description: 'Access guides, tutorials, and best practices for tea farming.',
    },
    {
        title: 'Weather Insights',
        description: 'Get hyper-local weather forecasts and climate advice.',
    },
];

// Mock data for educational materials
const educationalMaterials = [
    {
        title: 'Guide to Tea Farming',
        description: 'A comprehensive guide to growing and harvesting tea.',
        link: 'https://jiffygroup.com/wp-content/uploads/2023/11/Online_Jiffy_TEA_Whitepaper_A4_RD231109.pdf',
    },
    {
        title: 'Best Practices for Soil Health',
        description: 'Learn how to maintain healthy soil for better crop yields.',
        link: 'https://farmlandinfo.org/wp-content/uploads/sites/2/2024/01/ISAP-an-introduction-soil-health-practices.pdf',
    },
    {
        title: 'Pest Control in Tea Farms',
        description: 'Effective methods to control pests in tea plantations.',
        link: 'http://example.com/pest-control-tea-farms.pdf',
    },
    {
        title: 'Organic Fertilizers for Tea Plants',
        description: 'A guide to using organic fertilizers for healthier tea plants.',
        link: 'http://example.com/organic-fertilizers-tea.pdf',
    },
];

// Mock data for tutorials (short videos)
const tutorials = [
    {
        title: 'Introduction to Tea Farming',
        description: 'Learn the basics of tea farming.',
        videoUrl: 'https://www.youtube.com/embed/VIDEO_ID_1',
    },
    {
        title: 'Advanced Pest Control Techniques',
        description: 'Discover advanced methods to control pests in tea plantations.',
        videoUrl: 'https://www.youtube.com/embed/VIDEO_ID_2',
    },
    {
        title: 'Organic Fertilizers for Tea Plants',
        description: 'A guide to using organic fertilizers for healthier tea plants.',
        videoUrl: 'https://www.youtube.com/embed/VIDEO_ID_3',
    },
];

// API endpoint to fetch features
router.get('/features', (req, res) => {
    res.json(features);
});

// OpenWeatherMap API key
const OPENWEATHERMAP_API_KEY = '7b4b0ed8ce3e24042ecc81b6725cebd9';

// API endpoint for weather insights
router.get('/weather', async (req, res) => {
    try {
        const location = req.query.location || 'Nairobi';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;

        const response = await axios.get(apiUrl);

        if (response.data.cod === '404') {
            return res.status(404).json({ error: 'Location not found. Please enter a valid city name.' });
        }

        const weather = {
            location: response.data.name,
            temperature: response.data.main.temp,
            description: response.data.weather[0].description,
            humidity: response.data.main.humidity,
            windSpeed: response.data.wind.speed,
        };

        res.json(weather);
    } catch (error) {
        console.error('Error fetching weather data:', error);

        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: 'Location not found. Please enter a valid city name.' });
        }

        res.status(500).json({ error: 'Failed to fetch weather data. Please try again later.' });
    }
});

// API endpoint for educational materials
router.get('/educational-materials', (req, res) => {
    try {
        const { search } = req.query;
        let results = educationalMaterials;

        if (search) {
            const searchLower = search.toLowerCase();
            results = educationalMaterials.filter(
                (material) =>
                    material.title.toLowerCase().includes(searchLower) ||
                    material.description.toLowerCase().includes(searchLower)
            );
        }

        res.json({
            tutorials,
            results,
        });
    } catch (error) {
        console.error('Error fetching educational materials:', error);
        res.status(500).json({ error: 'Failed to fetch educational materials' });
    }
});

// API endpoint for personalized recommendations
router.post('/recommend', async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = [
            'temperature', 'humidity', 'moisture', 'ph', 'soilType', 'teaType',
            'nitrogen', 'potassium', 'phosphorous', 'sizeOfLand',
            'kilosProduced', 'numberOfBushes', 'numberOfBags'
        ];
        
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                error: 'Missing required fields',
                missingFields
            });
        }

        const {
            temperature,
            humidity,
            moisture,
            ph,
            soilType,
            teaType,
            nitrogen,
            potassium,
            phosphorous,
            sizeOfLand,
            kilosProduced,
            numberOfBushes,
            numberOfBags
        } = req.body;

        // Convert tea type naming for consistency
        const processedTeaType = teaType === 'Oolong' ? 'Colong' : teaType;

        // Prepare properly formatted input data
        const inputData = {
            Temperature: parseFloat(temperature),
            Humidity: parseFloat(humidity) / 100,  // Convert from percentage to decimal
            Moisture: parseFloat(moisture) / 100,  // Convert from percentage to decimal
            pH: parseFloat(ph),
            'Soil Type': soilType,
            'Tea Type': processedTeaType,
            Nitrogen: parseFloat(nitrogen),
            Potassium: parseFloat(potassium),
            Phosphorous: parseFloat(phosphorous),
            'Size of land': parseFloat(sizeOfLand),
            'Kilos Produced': parseFloat(kilosProduced),
            'Number of Bushes': parseInt(numberOfBushes),
            'Number of Bags': parseInt(numberOfBags)
        };

        // Get absolute path to Python script
        const pythonScriptPath = path.join(__dirname, '..', '..', 'ml-model', 'predict.py');
        
        // Verify Python script exists
        if (!fs.existsSync(pythonScriptPath)) {
            throw new Error(`Python script not found at: ${pythonScriptPath}`);
        }

        // Stringify with proper JSON formatting
        const inputDataString = JSON.stringify(inputData);
        
        // Debug logs
        console.log('Python script path:', pythonScriptPath);
        console.log('Sending to Python:', inputDataString);

        // Execute Python script using spawn instead of exec
        const pythonProcess = spawn('python', [pythonScriptPath, inputDataString]);

        let stdout = '';
        let stderr = '';

        pythonProcess.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error('Python script failed:', stderr);
                return res.status(500).json({
                    error: 'Python script execution failed',
                    details: stderr,
                    type: 'execution_error'
                });
            }

            try {
                const result = JSON.parse(stdout);
                
                if (result.status === 'error') {
                    console.error('Python error:', result.message);
                    return res.status(400).json({
                        error: 'Recommendation failed',
                        details: result.message,
                        type: 'recommendation_error'
                    });
                }

                // Successful recommendation
                res.json({
                    status: 'success',
                    recommended_fertilizer: result.recommended_fertilizer,
                    input_features: result.input_features
                });
            } catch (parseError) {
                console.error('Parse error:', parseError);
                res.status(500).json({
                    error: 'Failed to parse recommendation',
                    details: stdout,
                    type: 'parse_error'
                });
            }
        });

    } catch (error) {
        console.error('Recommendation error:', error);
        res.status(500).json({
            error: 'Server error',
            details: error.message,
            type: 'server_error'
        });
    }
});

export default router;