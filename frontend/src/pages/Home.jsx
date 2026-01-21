import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, Shield, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header, NavButton } from '../components/nav';
import './Home.css';

// Importa las imágenes desde assets
import img1 from "../components/assets/images/lavado_Edredon.png";
import img2 from "../components/assets/images/lavado_Express.png";
import img3 from "../components/assets/images/lavado_Kilos.png";
import img4 from "../components/assets/images/lavado_RopaHogar.png";
import img5 from "../components/assets/images/lavado_Zapatos.png";
import img6 from "../components/assets/images/planchado.png";
import img7 from "../components/assets/images/prendas_Delicadas.png";
import img8 from "../components/assets/images/recogida_Entrega.png";
import img9 from "../components/assets/images/tintoreria.png";
import logo from "../components/assets/icons/logo.jpg";


const originalCarouselData = [
    { img: img1, title: 'Lavado de Edredones', description: 'Cuidado especial para tus edredones y ropa de cama' },
    { img: img2, title: 'Servicio Express', description: 'Tu ropa lista en tiempo récord' },
    { img: img3, title: 'Lavado por Kilos', description: 'La opción más económica para grandes cantidades' },
    { img: img4, title: 'Ropa del Hogar', description: 'Cortinas, manteles y más' },
    { img: img5, title: 'Lavado de Zapatos', description: 'Limpieza profesional de calzado' },
    { img: img6, title: 'Planchado Profesional', description: 'Tu ropa impecable y lista para usar' },
    { img: img7, title: 'Prendas Delicadas', description: 'Cuidado experto para tus prendas especiales' },
    { img: img8, title: 'Recogida y Entrega', description: 'Servicio a domicilio para tu comodidad' },
    { img: img9, title: 'Tintorería', description: 'Limpieza en seco de alta calidad' }
];

function shuffleArray(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

const Home = () => {
    const [carouselData] = useState(() => shuffleArray(originalCarouselData));
    const [current, setCurrent] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    // Verificar si hay sesión activa
    useEffect(() => {
        const token = localStorage.getItem('aquawash_token');
        const role = localStorage.getItem('aquawash_role');
        const email = localStorage.getItem('aquawash_email');

        if (token && role && email) {
            setIsAuthenticated(true);
            setUserInfo({ role, email });
        }
    }, []);

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % carouselData.length);
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev - 1 + carouselData.length) % carouselData.length);
    };

    const goToSlide = (index) => {
        setCurrent(index);
    };

    const handleLogout = () => {
        localStorage.removeItem('aquawash_token');
        localStorage.removeItem('aquawash_role');
        localStorage.removeItem('aquawash_email');
        setIsAuthenticated(false);
        setUserInfo(null);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [current, carouselData.length]);

    return (
        <div className="app-container">
            {/* Navigation */}
            <Header>
                {isAuthenticated ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ color: 'var(--app-color-white)', fontSize: '0.9rem' }}>
                            Sesión iniciada como <strong>{userInfo?.role?.toUpperCase()}</strong>: {userInfo?.email}
                        </span>
                        <NavButton onClick={handleLogout}>
                            Cerrar Sesión
                        </NavButton>
                    </div>
                ) : (
                    <NavButton onClick={() => navigate('/auth/login_Registre')}>
                        Entrar
                    </NavButton>
                )}
            </Header>

            {/* Hero Section with Carousel */}
            <section className="home-hero">
                <div className="home-carousel-wrapper">
                    <div className="home-carousel-track">
                        {carouselData.map((item, index) => (
                            <div
                                key={index}
                                className={`home-carousel-slide ${index === current ? 'active' : ''}`}
                            >
                                <img src={item.img} alt="" className="home-carousel-bg" />
                                <img src={item.img} alt={item.title} className="home-carousel-img" />
                                <div className="home-carousel-overlay"></div>
                                <div className="home-carousel-content">
                                    <h1 className="home-carousel-title">{item.title}</h1>
                                    <p className="home-carousel-description">{item.description}</p>
                                    <div className="home-carousel-actions">
                                        <button onClick={() => navigate('/auth/login_Registre')} className="home-btn-cta-primary">
                                            Comenzar Ahora
                                        </button>
                                        <button className="home-btn-cta-secondary">
                                            Saber Más
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button onClick={prevSlide} className="home-carousel-btn home-carousel-btn-prev">
                        <ChevronLeft size={24} />
                    </button>

                    <button onClick={nextSlide} className="home-carousel-btn home-carousel-btn-next">
                        <ChevronRight size={24} />
                    </button>

                    <div className="home-carousel-indicators">
                        {carouselData.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`home-indicator ${index === current ? 'active' : ''}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="home-features">
                <div className="home-section-container">
                    <div className="home-section-header">
                        <h2 className="home-section-title">¿Por qué elegir AquaWash?</h2>
                        <p className="home-section-subtitle">
                            La plataforma que conecta clientes con lavanderías locales de confianza
                        </p>
                    </div>

                    <div className="home-features-grid">
                        <div className="home-feature-card">
                            <div className="home-feature-icon home-feature-icon-blue">
                                <MapPin size={24} />
                            </div>
                            <h3 className="home-feature-title">Búsqueda por Zona</h3>
                            <p className="home-feature-description">
                                Encuentra lavanderías cercanas a tu ubicación en segundos
                            </p>
                        </div>

                        <div className="home-feature-card">
                            <div className="home-feature-icon home-feature-icon-green">
                                <Clock size={24} />
                            </div>
                            <h3 className="home-feature-title">Seguimiento en Tiempo Real</h3>
                            <p className="home-feature-description">
                                Conoce el estado de tu pedido en cada momento
                            </p>
                        </div>

                        <div className="home-feature-card">
                            <div className="home-feature-icon home-feature-icon-purple">
                                <Star size={24} />
                            </div>
                            <h3 className="home-feature-title">Servicio de Calidad</h3>
                            <p className="home-feature-description">
                                Lavanderías verificadas con los mejores estándares
                            </p>
                        </div>

                        <div className="home-feature-card">
                            <div className="home-feature-icon home-feature-icon-orange">
                                <Shield size={24} />
                            </div>
                            <h3 className="home-feature-title">Soporte Garantizado</h3>
                            <p className="home-feature-description">
                                Sistema de mediación para resolver cualquier incidencia
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="home-cta-grid">
                {/* CTA para Clientes */}
                <div className="home-cta home-cta-card client">
                    <div className="home-cta-content">
                        <h2 className="home-cta-title">¿Listo para comenzar?</h2>
                        <p className="home-cta-description">
                            Únete a nuestra plataforma y descubre la forma más fácil de gestionar tu lavandería
                        </p>
                        <button onClick={() => navigate('/auth/login_Registre')} className="home-cta-button">
                            Regístrate ahora
                        </button>
                    </div>
                </div>

                {/* CTA para Empresas/Lavanderías */}
                <div className="home-cta home-cta-card business">
                    <div className="home-cta-content">
                        <h2 className="home-cta-title">¿Tienes una lavandería?</h2>
                        <p className="home-cta-description">
                            Únete a nuestro selecto grupo de lavanderías y llega a más clientes. Contacta con nosotros para formar parte de AquaWash.
                        </p>
                        <button
                            onClick={() => window.location.href = 'mailto:contacto@aquawash.com?subject=Quiero unirme como lavandería'}
                            className="home-cta-button business"
                        >
                            Contactar
                        </button>
                    </div>
                </div>
            </div>

            <footer className="app-footer">
                <div className="app-footer-content">
                    <div className="app-footer-links-row">
                        <a href="#caracteristicas" className="app-footer-link">Características</a>
                        <a href="#testimonios" className="app-footer-link">Testimonios</a>
                        <a href="#sobre-nosotros" className="app-footer-link">Sobre Nosotros</a>
                        <a href="#contacto" className="app-footer-link">Contacto</a>
                    </div>
                    <div className="app-footer-bottom">
                        <div className="app-footer-brand">
                            <img src={logo} alt="AquaWash Logo" className="app-footer-logo" />
                            <span>Conectando clientes con lavanderías locales de confianza</span>
                        </div>
                        <p>&copy; 2025 AquaWash. TFG Blanca García Alonso.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
