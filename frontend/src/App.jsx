import React, { createContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import LoginRegister from './pages/LoginRegister';

// Páginas placeholder
const CustomerPage = () => (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Panel de Cliente</h1>
        <p>Esta página está en desarrollo</p>
    </div>
);

const LaundryPage = () => (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Panel de Lavandería</h1>
        <p>Esta página está en desarrollo</p>
    </div>
);

const AdminPage = () => (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Panel de Administrador</h1>
        <p>Esta página está en desarrollo</p>
    </div>
);

// Contexto de autenticación
export const AuthContext = createContext();

function App() {
    const [user, setUser] = useState(null);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('aquawash_token');
        localStorage.removeItem('aquawash_role');
        localStorage.removeItem('aquawash_email');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth/login_Registre" element={<LoginRegister />} />
                    <Route path="/customer" element={<CustomerPage />} />
                    <Route path="/laundry" element={<LaundryPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;
