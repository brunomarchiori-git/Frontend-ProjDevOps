import React, { useEffect, useRef } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, children, title, variant = 'default' }) => {
    const modalRef = useRef(null);
    const closeButtonRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                if (modalRef.current) {
                    const firstInput = modalRef.current.querySelector(
                        'input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'
                    );

                    if (firstInput) {
                        firstInput.focus();
                    } else {
                        closeButtonRef.current?.focus();
                    }
                }
            }, 100);
        }
    }, [isOpen]);

    const handleTabKey = (e) => {
        if (e.key !== 'Tab') return;
        
        const focusableElements = modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (!focusableElements || focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    };

    if (!isOpen) return null;

    const isShowcase = variant === 'showcase';

    return (
        <div 
            className="modal-overlay" 
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onKeyDown={handleTabKey}
        >
            <div 
                ref={modalRef}
                className={`modal-content ${isShowcase ? 'modal-showcase' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                {isShowcase ? (
                    <>
                        <button 
                            ref={closeButtonRef}
                            className="modal-close-showcase" 
                            onClick={onClose}
                            aria-label="Fechar modal"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                        <div className="modal-showcase-body">
                            {children}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="modal-header">
                            {title && <h2 id="modal-title" className="modal-title">{title}</h2>}
                            <button 
                                ref={closeButtonRef}
                                className="modal-close" 
                                onClick={onClose}
                                aria-label="Fechar modal"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            {children}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Modal;

