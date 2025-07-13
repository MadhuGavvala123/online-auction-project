import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Logout.css';

function Logout() {
    const [isLoggingOut, setIsLoggingOut] = useState(true);
    const [message, setMessage] = useState('Logging out...');
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            try {
                // Clear all user data from localStorage
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                
                // Clear any other session data
                sessionStorage.clear();
                
                // Update message
                setMessage('Successfully logged out!');
                
                // Wait a moment to show success message
                setTimeout(() => {
                    setIsLoggingOut(false);
                    setMessage('Redirecting to home page...');
                    
                    // Redirect to landing page after a short delay
                    setTimeout(() => {
                        navigate('/', { replace: true });
                    }, 1500);
                }, 1000);
                
            } catch (error) {
                console.error('Logout error:', error);
                setMessage('Error during logout. Redirecting...');
                setTimeout(() => {
                    navigate('/', { replace: true });
                }, 2000);
            }
        };

        performLogout();
    }, [navigate]);

    return (
        <div className="logout-container">
            <div className="logout-card">
                <div className="logout-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                    </svg>
                </div>
                <h2 className="logout-title">Logout</h2>
                <p className="logout-message">{message}</p>
                {isLoggingOut && (
                    <div className="logout-spinner">
                        <div className="spinner"></div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Logout; 