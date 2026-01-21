import React from "react";

const NavButton = ({ children, onClick, type = "button", ...props }) => (
    <button
        className="app-btn-nav"
        onClick={onClick}
        type={type}
        {...props}
    >
        {children}
    </button>
);

export default NavButton;
