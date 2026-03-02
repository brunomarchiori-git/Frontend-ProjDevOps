import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen/LoginScreen';
import CadastroAdminScreen from './screens/CadastroAdminScreen/CadastroAdminScreen';
import HomeScreen from './screens/HomeScreen/HomeScreen';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/cadastro" element={<CadastroAdminScreen />} />
          <Route path="/home" element={<HomeScreen />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

