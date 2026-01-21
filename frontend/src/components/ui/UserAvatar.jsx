import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
};

const UserAvatar = ({ src, alt, name }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handleClick(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        function handleKey(e) {
            if (e.key === 'Escape') setOpen(false);
        }
        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleKey);
        };
    }, []);

    const initials = getInitials(name);

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                aria-haspopup="true"
                aria-expanded={open}
                aria-label={name ? `Abrir menú de ${name}` : 'Abrir menú de usuario'}
                onClick={() => setOpen((s) => !s)}
                className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center focus:ring-2 focus:ring-indigo-300"
            >
                {src ? (
                    <img src={src} alt={alt || name || 'avatar'} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-sm font-medium text-gray-700">{initials}</span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-20">
                    <ul className="py-1" role="menu" aria-label="Menú de usuario">
                        <li role="none">
                            <Link to="/customer/profile" role="menuitem" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Perfil</Link>
                        </li>
                        <li role="none">
                            <Link to="/customer/orders" role="menuitem" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Pedidos</Link>
                        </li>
                        <li role="none">
                            <Link to="/customer/settings" role="menuitem" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Ajustes</Link>
                        </li>
                        <li role="none">
                            <button type="button" role="menuitem" className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Cerrar sesión</button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserAvatar;
