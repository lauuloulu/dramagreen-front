import { useState } from 'react';
import axios from 'axios';
import { shared, BASE } from '../styles/authStyles';

export const ForgotPassword = ({ onGoLogin }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();
        if (!email.includes('@')) { setError('Introduce un email válido'); return; }

        setLoading(true);
        setError('');
        try {
            await axios.post(`${BASE}/forgot-password`, null, { params: { email } });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al enviar el email');
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
                    <span style={shared.logoEmoji}>🔑</span>
                    <h1 style={shared.logoTitle}>Recuperar contraseña</h1>
                    <p style={shared.logoSub}>Te enviaremos un enlace a tu email</p>
                </div>

                {success
                    ? (
                        <div>
                            <div style={shared.success}>
                                ✅ ¡Email enviado! Revisa tu bandeja de entrada y sigue las instrucciones.
                            </div>
                            <button
                                onClick={onGoLogin}
                                style={{ ...shared.btnPrimary, marginTop: '16px' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#2D5239'}
                                onMouseLeave={e => e.currentTarget.style.background = '#355E45'}
                            >
                                Volver al login
                            </button>
                        </div>
                    )
                    : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={shared.label}>TU EMAIL</label>
                                <input
                                    type="email"
                                    placeholder="laura@ejemplo.com"
                                    value={email}
                                    onChange={e => { setEmail(e.target.value); setError(''); }}
                                    style={shared.input}
                                    autoComplete="email"
                                />
                            </div>

                            {error && <div style={shared.error}>⚠️ {error}</div>}

                            <button
                                type="submit" disabled={loading}
                                style={{ ...shared.btnPrimary, opacity: loading ? 0.7 : 1 }}
                                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#2D5239'; }}
                                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#355E45'; }}
                            >
                                {loading ? '⏳ Enviando...' : '📧 Enviar enlace'}
                            </button>

                            <div style={{ textAlign: 'center' }}>
                                <span style={shared.link} onClick={onGoLogin}>← Volver al login</span>
                            </div>
                        </form>
                    )
                }
            </div>
        </div>
    );
};

export default ForgotPassword;