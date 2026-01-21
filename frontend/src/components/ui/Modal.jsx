import React from 'react';

export default function PasswordResetModal({ open, onClose }) {
    if (!open) return null;
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: '1rem', padding: '2rem', minWidth: '320px', boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--app-color-primary)' }}>Recuperar contraseña</h3>
                <form onSubmit={e => { e.preventDefault(); onClose(); }}>
                    <label htmlFor="reset_email" style={{ display: 'block', marginBottom: '0.5rem' }}>Introduce tu email:</label>
                    <input id="reset_email" type="email" required style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--app-color-accent)', marginBottom: '1rem' }} />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--app-color-secondary)', cursor: 'pointer' }}>Cancelar</button>
                        <button type="submit" style={{ background: 'var(--app-color-primary)', color: '#fff', border: 'none', borderRadius: '0.5rem', padding: '0.5rem 1.5rem', cursor: 'pointer' }}>Enviar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
