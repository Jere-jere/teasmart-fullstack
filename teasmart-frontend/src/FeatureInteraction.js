import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const FeatureInteraction = () => {
    const { title } = useParams();
    const [feature, setFeature] = useState(null);
    const [input, setInput] = useState('');
    const [location, setLocation] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [suggestions, setSuggestions] = useState([]); // State for autocomplete suggestions
    const [searchResults, setSearchResults] = useState([]); // State for search results
    const [tutorials, setTutorials] = useState([]); // State for tutorials
    const [searchPerformed, setSearchPerformed] = useState(false); // State to track if search is performed

    const locationInputRef = useRef(null);

    // Fetch the feature data based on the title
    useEffect(() => {
        const fetchFeature = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/features');
                const features = response.data;
                const selectedFeature = features.find(f => f.title === decodeURIComponent(title));
                if (selectedFeature) {
                    setFeature(selectedFeature);
                } else {
                    setError('Feature not found');
                }
            } catch (error) {
                console.error('Error fetching feature data:', error);
                setError('Failed to fetch feature data');
            }
        };

        fetchFeature();
    }, [title]);

    // Fetch tutorials and educational materials
    useEffect(() => {
        if (feature?.title === 'Educational Materials') {
            const fetchTutorialsAndMaterials = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/api/educational-materials');
                    setTutorials(response.data.tutorials); // Set tutorials
                } catch (error) {
                    console.error('Error fetching tutorials and materials:', error);
                    setError('Failed to fetch tutorials and materials');
                }
            };

            fetchTutorialsAndMaterials();
        }
    }, [feature]);

    // Fetch autocomplete suggestions
    const fetchSuggestions = async (query) => {
        if (query.trim() === '') {
            setSuggestions([]);
            return;
        }
        try {
            const response = await axios.get('http://localhost:5000/api/educational-materials/suggestions', {
                params: { query },
            });
            setSuggestions(response.data.suggestions);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInput(value);
        fetchSuggestions(value); // Fetch suggestions as the user types

        // Clear search results and reset search performed state if the search bar is empty
        if (value.trim() === '') {
            setSearchResults([]);
            setSearchPerformed(false);
        }
    };

    const handleLocationChange = (e) => {
        setLocation(e.target.value);
    };

    const handleSubmit = async () => {
        if (feature?.title === 'Weather Insights' && !location.trim()) {
            setError('Please enter a location.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);
        setSearchResults([]); // Clear previous search results

        try {
            let response;
            switch (feature?.title) {
                case 'Weather Insights':
                    response = await axios.get('http://localhost:5000/api/weather', {
                        params: { location },
                    });

                    if (response.data.error) {
                        setError(response.data.error);
                        setLocation('');
                    } else {
                        const weather = response.data;
                        const formattedWeather = (
                            <div style={{ textAlign: 'left' }}>
                                <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                                    Weather in {weather.location}:
                                </p>
                                <p>
                                    <span role="img" aria-label="weather" style={{ color: '#4CAF50' }}>🌤️</span> {weather.description}
                                </p>
                                <p>
                                    <span role="img" aria-label="temperature" style={{ color: '#FF5722' }}>🌡️</span> Temperature: <span style={{ color: '#FF5722', fontWeight: 'bold' }}>{weather.temperature}°C</span>
                                </p>
                                <p>
                                    <span role="img" aria-label="humidity" style={{ color: '#2196F3' }}>💧</span> Humidity: <span style={{ color: '#2196F3', fontWeight: 'bold' }}>{weather.humidity}%</span>
                                </p>
                                <p>
                                    <span role="img" aria-label="wind" style={{ color: '#9C27B0' }}>🌬️</span> Wind Speed: <span style={{ color: '#9C27B0', fontWeight: 'bold' }}>{weather.windSpeed} m/s</span>
                                </p>
                            </div>
                        );
                        setResult(formattedWeather);
                    }
                    break;

                case 'Educational Materials':
                    response = await axios.get('http://localhost:5000/api/educational-materials', {
                        params: { search: input },
                    });
                    if (response.data.error) {
                        setError(response.data.error); // Handle backend errors
                    } else {
                        // Filter tutorials and guides based on the search keyword
                        const filteredTutorials = tutorials.filter(tutorial =>
                            tutorial.title.toLowerCase().includes(input.toLowerCase()) ||
                            tutorial.description.toLowerCase().includes(input.toLowerCase())
                        );

                        const filteredGuides = response.data.results.filter(guide =>
                            guide.title.toLowerCase().includes(input.toLowerCase()) ||
                            guide.description.toLowerCase().includes(input.toLowerCase())
                        );

                        // Combine filtered tutorials and guides into a single search results list
                        const combinedResults = [
                            ...filteredTutorials.map(tutorial => ({ ...tutorial, type: 'Tutorial' })),
                            ...filteredGuides.map(guide => ({ ...guide, type: 'Guide' })),
                        ];
                        setSearchResults(combinedResults); // Display filtered search results
                    }
                    setSearchPerformed(true); // Set search performed state to true
                    break;

                default:
                    setResult('Feature not implemented');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error: Unable to process request. Please try again.');
            setLocation('');
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = () => {
        setError(null);
        setResult(null);
        setLocation('');
        if (locationInputRef.current) {
            locationInputRef.current.focus();
        }
    };

    if (error) {
        return (
            <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
                <h2>{feature?.title || 'Error'}</h2>
                <p style={{ color: 'red' }}>{error}</p>
                <button
                    onClick={handleRetry}
                    disabled={loading}
                    style={{
                        marginTop: '10px',
                        padding: '5px 10px',
                        backgroundColor: loading ? '#ccc' : '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!feature) {
        return <div style={{ padding: '20px' }}>Loading...</div>;
    }

    return (
        <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>

            {feature.title === 'Weather Insights' ? (
                <>
                    <input
                        type="text"
                        value={location}
                        onChange={handleLocationChange}
                        placeholder="Enter location (e.g., Nairobi)"
                        style={{ marginBottom: '10px' }}
                        ref={locationInputRef}
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{
                            marginTop: '10px',
                            padding: '5px 10px',
                            backgroundColor: loading ? '#ccc' : '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {loading ? (
                            <>
                                <span>Processing...</span>
                                <span style={{ marginLeft: '8px' }}>🌀</span>
                            </>
                        ) : (
                            'Submit'
                        )}
                    </button>
                </>
            ) : feature.title === 'Educational Materials' ? (
                <>
                    {/* Search Bar */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                        <div style={{ position: 'relative', width: '30%' }}>
                            <input
                                type="text"
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Search educational materials"
                                style={{ 
                                    width: '100%', 
                                    padding: '5px 40px 5px 10px', // Added padding on the right for the icon
                                    borderRadius: '5px', 
                                    border: '1px solid #ccc',
                                    fontSize: '14px',
                                    boxSizing: 'border-box',
                                }}
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                style={{
                                    position: 'absolute',
                                    right: '0',
                                    top: '0',
                                    height: '100%',
                                    width: '40px', // Width of the icon background
                                    backgroundColor: loading ? '#ccc' : '#007bff',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '0 5px 5px 0', // Rounded corners on the right side
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                🔍
                            </button>
                            {suggestions.length > 0 && (
                                <ul style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    right: 0,
                                    backgroundColor: '#fff',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    zIndex: 1000,
                                    margin: 0,
                                    padding: 0,
                                    listStyle: 'none',
                                    maxHeight: '150px',
                                    overflowY: 'auto',
                                }}>
                                    {suggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            onClick={() => {
                                                setInput(suggestion);
                                                setSuggestions([]);
                                            }}
                                            style={{ padding: '5px 10px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                                        >
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Search Results Section */}
                    {searchPerformed && (
                        <div style={{ marginTop: '2px' }}>
                            <h3>Search Results</h3>
                            {searchResults.length > 0 ? (
                                <>
                                    {/* Tutorials Section */}
                                    <h4>Tutorials</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '10px' }}>
                                        {searchResults
                                            .filter(result => result.type === 'Tutorial')
                                            .map((result, index) => (
                                                <div key={index} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', backgroundColor: '#fff' }}>
                                                    <h4>{result.title}</h4>
                                                    <p>{result.description}</p>
                                                    <iframe
                                                        width="100%"
                                                        height="100"
                                                        src={result.videoUrl}
                                                        title={result.title}
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                </div>
                                            ))}
                                    </div>

                                    {/* Guides Section */}
                                    <h4>Guides</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '10px' }}>
                                        {searchResults
                                            .filter(result => result.type === 'Guide')
                                            .map((result, index) => (
                                                <div key={index} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', backgroundColor: '#fff' }}>
                                                    <h4>{result.title}</h4>
                                                    <p>{result.description}</p>
                                                    <a href={result.link} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>
                                                        Download
                                                    </a>
                                                </div>
                                            ))}
                                    </div>
                                </>
                            ) : (
                                <p>No results found for your search.</p>
                            )}
                        </div>
                    )}
                </>
            ) : null}

            {result && (
                <div style={{ marginTop: '20px', textAlign: 'left' }}>
                    {result}
                </div>
            )}
        </div>
    );
};

export default FeatureInteraction;