import React, { useState, useEffect } from 'react';
import './Notification.css';

const Notification = ({ message, type = 'success', duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!isVisible) return null;

    return (
        <div className={`notification ${type}`}>
            <span className="notification-message">{message}</span>
            <button 
                className="notification-close" 
                onClick={() => {
                    setIsVisible(false);
                    if (onClose) onClose();
                }}
            >
                ×
            </button>
        </div>
    );
};

export default Notification; 