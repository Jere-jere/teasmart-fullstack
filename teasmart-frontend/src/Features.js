import React, { useState, useEffect } from "react";
import axios from "axios";
import FeatureInteraction from "./FeatureInteraction";

const Features = () => {
    const [features, setFeatures] = useState([]);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/features")
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setFeatures(response.data);
                } else {
                    console.error("Unexpected API response:", response.data);
                    setError("Invalid feature data received.");
                }
            })
            .catch((error) => {
                console.error("Error fetching features:", error);
                setError("Failed to load features. Please try again.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Features</h1>

            {/* Show loading message while fetching data */}
            {loading && <p style={{ textAlign: "center" }}>Loading features...</p>}

            {/* Show error message if API fails */}
            {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}

            {/* Feature List */}
            {!loading && !error && features.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            style={{
                                padding: "20px",
                                border: "1px solid #ccc",
                                borderRadius: "10px",
                                cursor: "pointer",
                                textAlign: "center",
                                backgroundColor: "#fff",
                                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                            }}
                            onClick={() => setSelectedFeature(feature)}
                        >
                            <h3>{feature?.title || "No Title"}</h3>
                            <p>{feature?.description || "No Description available"}</p>
                        </div>
                    ))}
                </div>
            ) : (
                !loading && <p style={{ textAlign: "center" }}>No features available.</p>
            )}

            {/* Show Feature Interaction when a feature is clicked */}
            {selectedFeature && <FeatureInteraction feature={selectedFeature} />}
        </div>
    );
};

export default Features;
