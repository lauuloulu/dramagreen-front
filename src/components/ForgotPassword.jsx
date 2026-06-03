import { useState } from 'react';
import api from '../Api';

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
            await api.post(`/auth/forgot-password`, null, { params: { email } });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al enviar el email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                {/* Logo */}
                <div className="auth-logo">
                    <span className="auth-logo__emoji">🔑</span>
                    <h1 className="auth-logo__title">Recuperar contraseña</h1>
                    <p className="auth-logo__sub">Te enviaremos un enlace a tu email</p>
                </div>

                {success ? (
                    <div>
                        <div className="alert alert--success">
                            ✅ ¡Email enviado! Revisa tu bandeja de entrada y sigue las instrucciones.
                        </div>
                        <button
                            onClick={onGoLogin}
                            className="btn btn--primary"
                            style={{ marginTop: '16px' }}
                        >
                            Volver al login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="form">

                        <div className="form-group">
                            <label className="form-label">Tu email</label>
                            <input
                                type="email"
                                placeholder="laura@ejemplo.com"
                                value={email}
                                onChange={e => { setEmail(e.target.value); setError(''); }}
                                className="form-input"
                                autoComplete="email"
                            />
                        </div>

                        {error && <div className="alert alert--error">⚠️ {error}</div>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn--primary"
                        >
                            {loading ? '⏳ Enviando...' : '📧 Enviar enlace'}
                        </button>

                        <div style={{ textAlign: 'center' }}>
                            <span className="auth-link" onClick={onGoLogin}>← Volver al login</span>
                        </div>

                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;