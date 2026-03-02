import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../LoginScreen/LogineCadastro.css';
import logo from '../../assets/iconeLogo.png';
import BotaoCoral from '../../components/Botao/BotaoCoral';
import SucessoCadastroModal from '../../components/SucessoCadastroModal/SucessoCadastroModal';
import authService from '../../services/authService';

const CadastroAdminScreen = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        setLoading(true);
        try {
            await authService.register(nome, email, password);
            setShowSuccessModal(true);
        } catch (err) {
            console.error("Registration Error:", err);
            if (err.response && err.response.data) {
                setError(typeof err.response.data === 'string' ? err.response.data : "Falha ao cadastrar. Verifique os dados.");
            } else {
                setError("Erro ao conectar com o serviço de cadastro.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessConfirm = () => {
        setShowSuccessModal(false);
        navigate('/');
    };

    return (
        <div className="login-container">
            <main className="login-card">
                <Link to="/" className="back-icon" aria-label="Voltar para login">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </Link>
                <header className="login-header">
                    <img src={logo} alt="Logo do Sistema de Eventos" className="login-logo" />
                    <h1 className="login-title">Cadastro</h1>
                </header>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="nome" className="visually-hidden" style={{display: 'none'}}>Nome do Administrador</label>
                        <input
                            type="text"
                            id="nome"
                            className="input-field"
                            placeholder="Nome do Administrador"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                            aria-label="Nome do Administrador"
                        />
                    </div>

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
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="confirmPassword" className="visually-hidden" style={{display: 'none'}}>Confirmar Senha</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="input-field"
                            placeholder="Confirmar Senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            aria-label="Confirmar Senha"
                        />
                    </div>

                    {error && <div style={{color: 'red', textAlign: 'center', fontSize: '0.9rem', marginBottom: '10px'}}>{error}</div>}

                    <BotaoCoral 
                        text={loading ? "Cadastrando..." : "Efetuar cadastro"} 
                        type="submit" 
                        disabled={loading}
                    />
                    
                </form>
            </main>

            <SucessoCadastroModal
                show={showSuccessModal}
                title="Parabéns!"
                message="Sua conta foi criada com sucesso."
                buttonText="Voltar para a tela de login"
                onConfirm={handleSuccessConfirm}
            />
        </div>
    );
};

export default CadastroAdminScreen;

