// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" />; // Redirect to login if no token
    }

    return children; // Allow access to the protected component
};

export default ProtectedRoute;