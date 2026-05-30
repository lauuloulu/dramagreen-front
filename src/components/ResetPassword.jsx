import { useState } from 'react';
import axios from 'axios';
import { shared, BASE } from '../styles/authStyles';

export const ResetPassword = ({ onGoLogin }) => {
    const [form, setForm] = useState({ password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // Leer el token de la URL: /reset-password?token=XXXX
    const token = new URLSearchParams(window.location.search).get('token');

    const handleSubmit = async e => {
        e.preventDefault();
        if (form.password.length < 6) { setError('Mínimo 6 caracteres'); return; }
        if (form.password !== form.confirmPassword) { setError('Las contraseñas no coinciden'); return; }
        if (!token) { setError('Token inválido. Solicita un nuevo enlace.'); return; }

        setLoading(true);
        try {
            await axios.post(`${BASE}/reset-password`, null, {
                params: { token, newPassword: form.password },
            });
            setSuccess(true);
        } catch {
            setError('El enlace ha expirado o es inválido. Solicita uno nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={shared.page}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        input:focus { border-color: #355E45 !important; box-shadow: 0 0 0 3px #355E4520; }
      `}</style>

            <div style={shared.card}>
                <div style={shared.logo}>
                    <span style={shared.logoEmoji}>🔒</span>
                    <h1 style={shared.logoTitle}>Nueva contraseña</h1>
                    <p style={shared.logoSub}>Elige una contraseña segura</p>
                </div>

                {success
                    ? (
                        <div>
                            <div style={shared.success}>
                                ✅ ¡Contraseña actualizada! Ya puedes iniciar sesión.
                            </div>
                            <button
                                onClick={onGoLogin}
                                style={{ ...shared.btnPrimary, marginTop: '16px' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#2D5239'}
                                onMouseLeave={e => e.currentTarget.style.background = '#355E45'}
                            >
                                Ir al login
                            </button>
                        </div>
                    )
                    : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={shared.label}>NUEVA CONTRASEÑA</label>
                                <input
                                    type="password" placeholder="Mínimo 6 caracteres"
                                    value={form.password}
                                    onChange={e => { setForm({ ...form, password: e.target.value }); setError(''); }}
                                    style={shared.input} autoComplete="new-password"
                                />
                            </div>
                            <div>
                                <label style={shared.label}>CONFIRMAR CONTRASEÑA</label>
                                <input
                                    type="password" placeholder="Repite la contraseña"
                                    value={form.confirmPassword}
                                    onChange={e => { setForm({ ...form, confirmPassword: e.target.value }); setError(''); }}
                                    style={shared.input} autoComplete="new-password"
                                />
                            </div>

                            {error && <div style={shared.error}>⚠️ {error}</div>}

                            <button
                                type="submit" disabled={loading}
                                style={{ ...shared.btnPrimary, opacity: loading ? 0.7 : 1 }}
                                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#2D5239'; }}
                                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#355E45'; }}
                            >
                                {loading ? '⏳ Guardando...' : '🔒 Cambiar contraseña'}
                            </button>
                        </form>
                    )
                }
            </div>
        </div>
    );
};

export default ResetPassword;