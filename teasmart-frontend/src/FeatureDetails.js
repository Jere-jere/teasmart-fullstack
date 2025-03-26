
import React from "react";
import { useParams } from "react-router-dom";

const FeatureDetails = () => {
    const { title } = useParams(); // Get feature title from URL

    return (
        <div style={{ padding: "20px" }}>
            <h1>{title}</h1>
            <p>Details about {title} will be displayed here.</p>
        </div>
    );
};

export default FeatureDetails;
