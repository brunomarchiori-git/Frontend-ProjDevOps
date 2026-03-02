import React, { useEffect, useRef } from 'react';
import './SucessoCadastroModal.css';

const SucessoCadastroModal = ({ show, title, message, buttonText, onConfirm }) => {
    const buttonRef = useRef(null);

    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                buttonRef.current?.focus();
            }, 100);
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [show]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onConfirm?.();
        }
    };

    if (!show) return null;

    return (
        <div 
            className="sucesso-cadastro-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sucesso-cadastro-modal-title"
            aria-describedby="sucesso-cadastro-modal-message"
        >
            <div className="sucesso-cadastro-modal-card">
                <div className="sucesso-cadastro-modal-icon">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="48" 
                        height="48" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="16 10 10.5 15.5 8 13"></polyline>
                    </svg>
                </div>

                <h2 id="sucesso-cadastro-modal-title" className="sucesso-cadastro-modal-title">
                    {title}
                </h2>
                <p id="sucesso-cadastro-modal-message" className="sucesso-cadastro-modal-message">
                    {message}
                </p>

                <button 
                    ref={buttonRef}
                    className="sucesso-cadastro-modal-button"
                    onClick={onConfirm}
                    onKeyDown={handleKeyDown}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default SucessoCadastroModal;
