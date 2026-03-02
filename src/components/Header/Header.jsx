import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './Header.css';
import logo from '../../assets/iconeLogo.png';

const Header = ({ onSearch, onNewEvent }) => {
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { logout } = useAuth();
    const { toggleTheme, isDark } = useTheme();
    const navigate = useNavigate();
    const userMenuRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsUserMenuOpen(false);
    };

    const handleToggleTheme = () => {
        toggleTheme();
        setIsUserMenuOpen(false);
    };

    const handleSearch = () => {
        onSearch({ location, date });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };

        if (isUserMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isUserMenuOpen]);

    return (
        <header className="header">
            <div className="header-content">
                <div className="header-logo">
                    <img src={logo} alt="Logo do Sistema de Eventos" />
                </div>

                <div className="header-search" role="search">
                    <div className="search-field">
                        <label htmlFor="search-location" className="search-label">Localização</label>
                        <input
                            type="text"
                            id="search-location"
                            className="search-input"
                            placeholder="Buscar destino"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            onKeyPress={handleKeyPress}
                            aria-label="Buscar por localização"
                        />
                    </div>
                    <div className="search-divider"></div>
                    <div className="search-field">
                        <label htmlFor="search-date" className="search-label">Data</label>
                        <input
                            type="date"
                            id="search-date"
                            className="search-input search-input-date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            onKeyPress={handleKeyPress}
                            aria-label="Buscar por data"
                        />
                    </div>
                    <button 
                        className="search-button" 
                        onClick={handleSearch}
                        aria-label="Buscar eventos"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                </div>

                <div className="header-actions">
                    <div className="user-menu-container" ref={userMenuRef}>
                        <button 
                            className="user-avatar-button" 
                            onClick={toggleUserMenu}
                            aria-label="Menu do usuário"
                            aria-expanded={isUserMenuOpen}
                            aria-haspopup="true"
                            title="Menu do usuário"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="8" r="4"></circle>
                                <path d="M20 21a8 8 0 1 0-16 0"></path>
                            </svg>
                        </button>

                        {isUserMenuOpen && (
                            <div className="user-dropdown-menu" role="menu">
                                <button 
                                    className="user-dropdown-item" 
                                    onClick={handleToggleTheme}
                                    role="menuitem"
                                >
                                    {isDark ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="5"></circle>
                                            <line x1="12" y1="1" x2="12" y2="3"></line>
                                            <line x1="12" y1="21" x2="12" y2="23"></line>
                                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                            <line x1="1" y1="12" x2="3" y2="12"></line>
                                            <line x1="21" y1="12" x2="23" y2="12"></line>
                                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                        </svg>
                                    )}
                                    <span>{isDark ? 'Modo claro' : 'Modo escuro'}</span>
                                </button>

                                <button 
                                    className="user-dropdown-item" 
                                    onClick={handleLogout}
                                    role="menuitem"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                        <polyline points="16 17 21 12 16 7"></polyline>
                                        <line x1="21" y1="12" x2="9" y2="12"></line>
                                    </svg>
                                    <span>Sair</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <button 
                        className="header-new-event" 
                        onClick={onNewEvent}
                        aria-label="Criar novo evento"
                    >
                        Novo Evento
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;

