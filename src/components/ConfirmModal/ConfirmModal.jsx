import React, { useEffect, useRef } from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = "Confirmar exclusão",
    message,
    confirmText = "Sim, excluir",
    cancelText = "Cancelar"
}) => {
    const confirmButtonRef = useRef(null);
    const cancelButtonRef = useRef(null);

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
                cancelButtonRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === cancelButtonRef.current) {
                    e.preventDefault();
                    confirmButtonRef.current.focus();
                }
            } else {
                if (document.activeElement === confirmButtonRef.current) {
                    e.preventDefault();
                    cancelButtonRef.current.focus();
                }
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="confirm-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            aria-describedby="confirm-modal-message"
            onClick={onClose}
        >
            <div 
                className="confirm-modal-card"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={handleKeyDown}
            >
                <div className="confirm-modal-header">
                    <h2 id="confirm-modal-title" className="confirm-modal-title">{title}</h2>
                </div>
                
                <div className="confirm-modal-body">
                    <p id="confirm-modal-message" className="confirm-modal-message">
                        {message}
                    </p>
                </div>

                <div className="confirm-modal-actions">
                    <button 
                        ref={cancelButtonRef}
                        className="confirm-modal-cancel"
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>
                    <button 
                        ref={confirmButtonRef}
                        className="confirm-modal-confirm"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
