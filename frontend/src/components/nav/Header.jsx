import React from 'react';
import '../layout/Layout.css';
import NavButton from './NavButton';
import logo from '../assets/icons/logo.jpg';

const Header = ({ children }) => (
    <nav className="app-nav">
        <div className="app-nav-content">
            <div className="app-logo-wrapper">
                <img src={logo} alt="AquaWash Logo" className="app-logo-icon" />
                <span className="app-logo">AquaWash</span>
            </div>
            <div className="app-nav-buttons">
                {children}
            </div>
        </div>
    </nav>
);

export default Header;
