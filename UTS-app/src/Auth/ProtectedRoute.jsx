import React  from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const userEmail = localStorage.getItem('userEmail');
    return (
        userEmail ? children : <Navigate to='/' />
    )

};

export default ProtectedRoute