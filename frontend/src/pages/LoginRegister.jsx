import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header, NavButton } from "../components/nav";
import Footer from "../components/nav/Footer";
import FloatingInput from "../components/ui/FloatingInput";
import PasswordResetModal from "../components/ui/Modal";
import "./login_Registre.css";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function LoginRegister() {
    const [mode, setMode] = useState("login"); // "login" | "register"
    const navigate = useNavigate();

    const [loginStage, setLoginStage] = useState("show");
    const [registerStage, setRegisterStage] = useState("hidden");
    const [showReset, setShowReset] = useState(false);

    // Estados para mensajes de error
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Estados para formulario de login
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // Estados para formulario de registro (solo cliente)
    const [regNombre, setRegNombre] = useState("");
    const [regApellidos, setRegApellidos] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [regTelefono, setRegTelefono] = useState("");

    const goRegister = () => {
        if (mode === "register") return;
        setError("");
        setLoginStage("hide-left");
        setRegisterStage("appear-right");
        setMode("register");
        setTimeout(() => {
            setLoginStage("hidden");
            setRegisterStage("show");
        }, 650);
    };

    const goLogin = () => {
        if (mode === "login") return;
        setError("");
        setRegisterStage("hide-right");
        setLoginStage("appear-left");
        setMode("login");
        setTimeout(() => {
            setRegisterStage("hidden");
            setLoginStage("show");
        }, 650);
    };

    useEffect(() => {
        if (mode === "login") {
            setLoginStage("show");
            setRegisterStage("hidden");
        } else {
            setLoginStage("hidden");
            setRegisterStage("show");
        }
    }, []);

    // Función para manejar login - Auto-detecta el rol desde el backend
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: loginEmail,
                    password: loginPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Error al iniciar sesión');
            }

            if (data.ok && data.data.token) {
                const userRole = data.data.user.role;

                // Guardar token y datos en localStorage
                localStorage.setItem('aquawash_token', data.data.token);
                localStorage.setItem('aquawash_role', userRole);
                localStorage.setItem('aquawash_email', loginEmail);

                // Navegar según el rol detectado por el backend
                if (userRole === 'cliente') {
                    navigate('/customer');
                } else if (userRole === 'lavanderia') {
                    navigate('/laundry');
                } else if (userRole === 'admin') {
                    navigate('/admin');
                }
            }
        } catch (err) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    // Función para manejar registro - Solo clientes
    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const body = {
                role: 'cliente',
                nombre: regNombre,
                email: regEmail,
                password: regPassword
            };

            // Añadir campos opcionales si existen
            if (regApellidos) body.apellidos = regApellidos;
            if (regTelefono) body.telefono = regTelefono;

            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Error al registrarse');
            }

            if (data.ok && data.data.token) {
                // Guardar token y datos en localStorage
                localStorage.setItem('aquawash_token', data.data.token);
                localStorage.setItem('aquawash_role', 'cliente');
                localStorage.setItem('aquawash_email', regEmail);

                // Navegar a página de cliente
                navigate('/customer');
            }
        } catch (err) {
            setError(err.message || 'Error al registrarse');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="lr-page">
            {/* NAVBAR */}
            <Header>
                <NavButton onClick={() => navigate('/')}>
                    ← Volver al inicio
                </NavButton>
            </Header>
            <PasswordResetModal open={showReset} onClose={() => setShowReset(false)} />
            <div className={`lr-wrapper ${mode === "register" ? "is-register" : ""}`}>
                {/* BLOQUE AZUL ANIMADO */}
                <div className="black-block" aria-hidden="true" />

                {/* CONTENIDO */}
                <div className="lr-content">
                    {/* PANEL IZQUIERDO */}
                    <div className="lr-panel lr-panel-left">
                        {/* En LOGIN: muestra texto. En REGISTER: muestra form */}
                        <div className={`lr-panel-inner ${mode === "login" ? "show" : "hidden"}`}>
                            <div className="lr-side-inner">
                                <h2 className="lr-side-title-lf">¡Bienvenido!</h2>
                                <p className="lr-side-text-lf">
                                    ¿No tienes cuenta? Regístrate y empieza a pedir en tu lavandería favorita.
                                </p>

                                <button className="lr-ghost-btn-lf" onClick={goRegister} type="button">
                                    Registrate
                                </button>
                            </div>
                        </div>
                        <div className={`lr-panel-inner ${mode === "register" ? "show" : "hidden"}`}>
                            <div className={`lr-form-card ${registerStage}`}>
                                <h3 className="lr-form-title">Registrate</h3>

                                {error && (
                                    <div style={{ padding: '0.75rem', marginBottom: '1rem', borderRadius: '0.5rem', background: '#fee', color: '#c00', fontSize: '0.9rem' }}>
                                        {error}
                                    </div>
                                )}

                                <form className="lr-form" onSubmit={handleRegister}>
                                    <FloatingInput
                                        id="reg_nombre"
                                        label="Nombre *"
                                        type="text"
                                        value={regNombre}
                                        onChange={(e) => setRegNombre(e.target.value)}
                                        required
                                    />
                                    <FloatingInput
                                        id="reg_email"
                                        label="Email *"
                                        type="email"
                                        value={regEmail}
                                        onChange={(e) => setRegEmail(e.target.value)}
                                        required
                                    />
                                    <FloatingInput
                                        id="reg_pass"
                                        label="Contraseña (mín. 8 caracteres) *"
                                        type="password"
                                        value={regPassword}
                                        onChange={(e) => setRegPassword(e.target.value)}
                                        required
                                    />

                                    <FloatingInput
                                        id="reg_pass"
                                        label="Confirmar contraseña*"
                                        type="password"
                                        value={regPassword}
                                        onChange={(e) => setRegPassword(e.target.value)}
                                        required
                                    />

                                    <button className="lr-primary-btn" type="submit" disabled={loading}>
                                        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* PANEL DERECHO */}
                    <div className="lr-panel lr-panel-right">
                        {/* En LOGIN: muestra form. En REGISTER: muestra texto */}
                        <div className={`lr-panel-inner ${mode === "login" ? "show" : "hidden"}`}>
                            <div className={`lr-form-card ${loginStage}`}>
                                <h3 className="lr-form-title-rh">Inicio de sesión</h3>

                                {error && (
                                    <div style={{ padding: '0.75rem', marginBottom: '1rem', borderRadius: '0.5rem', background: '#fee', color: '#c00', fontSize: '0.9rem' }}>
                                        {error}
                                    </div>
                                )}

                                <form className="lr-form" onSubmit={handleLogin}>
                                    <FloatingInput
                                        id="login_email"
                                        label="Email"
                                        type="email"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        required
                                    />
                                    <FloatingInput
                                        id="login_pass"
                                        label="Contraseña"
                                        type="password"
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        required
                                    />
                                    <div style={{ textAlign: 'right', marginBottom: '0.5rem' }}>
                                        <button type="button" className="text-sm" style={{ color: 'var(--app-color-secondary)', textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }} onClick={() => setShowReset(true)}>
                                            ¿Has olvidado tu contraseña?
                                        </button>
                                    </div>
                                    <button className="lr-primary-btn" type="submit" disabled={loading}>
                                        {loading ? 'Iniciando sesión...' : 'Entrar'}
                                    </button>
                                </form>
                            </div>

                        </div>
                        <div className={`lr-panel-inner ${mode === "register" ? "show" : "hidden"}`}>
                            <div className="lr-side-inner">
                                <h2 className="lr-side-title-rh">¡Crea tu cuenta!</h2>
                                <p className="lr-side-text-rh">
                                    ¿Ya tienes una cuenta? Inicia sesión para continuar.
                                </p>
                                <button className="lr-ghost-btn-rh" onClick={goLogin} type="button">
                                    Inicio de sesión
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
