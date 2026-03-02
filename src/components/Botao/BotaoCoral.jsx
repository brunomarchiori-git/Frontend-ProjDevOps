import React from 'react';
import './BotaoCoral.css';

const BotaoCoral = ({ text, onClick, type = "button", disabled = false, isLoading = false }) => {
    return (
        <button 
            type={type} 
            className="botao-coral" 
            onClick={onClick}
            disabled={disabled || isLoading}
        >
            {isLoading ? 'Carregando...' : text}
        </button>
    );
};

export default BotaoCoral;
