import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LogineCadastro.css';
import logo from '../../assets/iconeLogo.png';
import BotaoCoral from '../../components/Botao/BotaoCoral';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const STORAGE_KEYS = {
    EMAIL: 'login_saved_email',
    PASSWORD: 'login_saved_password',
    REMEMBER: 'login_remember_me'
};

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const savedRemember = localStorage.getItem(STORAGE_KEYS.REMEMBER);
        
        if (savedRemember === 'true') {
            const savedEmail = localStorage.getItem(STORAGE_KEYS.EMAIL) || '';
            const savedPassword = localStorage.getItem(STORAGE_KEYS.PASSWORD) || '';
            
            setEmail(savedEmail);
            setPassword(savedPassword);
            setRememberMe(true);
        }
    }, []);

    const saveCredentials = () => {
        localStorage.setItem(STORAGE_KEYS.EMAIL, email);
        localStorage.setItem(STORAGE_KEYS.PASSWORD, password);
        localStorage.setItem(STORAGE_KEYS.REMEMBER, 'true');
    };

    const clearCredentials = () => {
        localStorage.removeItem(STORAGE_KEYS.EMAIL);
        localStorage.removeItem(STORAGE_KEYS.PASSWORD);
        localStorage.removeItem(STORAGE_KEYS.REMEMBER);
    };

    const handleRememberMeChange = (e) => {
        const isChecked = e.target.checked;
        setRememberMe(isChecked);
        
        if (!isChecked) {
            clearCredentials();
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = await authService.login(email, password);
            if (data.token) {
                if (rememberMe) {
                    saveCredentials();
                } else {
                    clearCredentials();
                }
                
                login(data.token);
                navigate('/home');
            } else {
                setError("Erro desconhecido. Token não recebido.");
            }
        } catch (err) {
            console.error("Login Error:", err);
            if (err.response && err.response.status === 403) {
                setError("Email ou senha inválidos.");
            } else {
                setError("Falha ao conectar com o serviço de login.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <main className="login-card">
                <header className="login-header">
                    <img src={logo} alt="Logo do Sistema de Eventos" className="login-logo" />
                    <h1 className="login-title">Login</h1>
                </header>

                <form className="login-form" onSubmit={handleSubmit}>
                    {error && <div className="error-message" style={{color: 'red', marginBottom: '10px', textAlign: 'center'}}>{error}</div>}
                    
                    <div className="input-group">
                        <label htmlFor="email" className="visually-hidden" style={{display: 'none'}}>Email do Administrador</label>
                        <input
                            type="email"
                            id="email"
                            className="input-field"
                            placeholder="Email do Administrador"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            aria-label="Email do Administrador"
                            autoComplete="email"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password" className="visually-hidden" style={{display: 'none'}}>Senha</label>
                        <input
                            type="password"
                            id="password"
                            className="input-field"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            aria-label="Senha"
                            autoComplete="current-password"
                        />
                    </div>

                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="remember"
                            className="checkbox-input"
                            checked={rememberMe}
                            onChange={handleRememberMeChange}
                        />
                        <label htmlFor="remember" className="checkbox-label">
                            Gravar senha
                        </label>
                    </div>

                    <BotaoCoral 
                        text={loading ? "Entrando..." : "Entrar"} 
                        onClick={handleSubmit} 
                        type="submit"
                        disabled={loading}
                    />
                    
                    <div className="signup-link-container">
                        <Link to="/cadastro" className="signup-link">Cadastrar-se</Link>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default LoginScreen;

