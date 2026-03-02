import React, { useEffect, useState } from 'react';
import './Alerta.css';


const Alerta = ({ message, type = 'success', duration = 4000, onClose, show }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
            setProgress(100);

            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev <= 0) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - (100 / (duration / 50));
                });
            }, 50);

            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => {
                    onClose?.();
                }, 300);
            }, duration);

            return () => {
                clearInterval(interval);
                clearTimeout(timer);
            };
        }
    }, [show, duration, onClose]);

    if (!show && !isVisible) return null;

    return (
        <div 
            className={`alerta alerta-${type} ${isVisible ? 'alerta-enter' : 'alerta-exit'}`}
            role="alert"
            aria-live="polite"
            aria-atomic="true"
        >
            <div className="alerta-content">
                <svg 
                    className="alerta-icon" 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span className="alerta-message">{message}</span>
            </div>
            <div className="alerta-progress-bar">
                <div 
                    className="alerta-progress" 
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

export default Alerta;
