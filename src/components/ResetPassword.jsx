import { useState } from 'react';
import api from '../Api';
import { BASE } from '../styles/authStyles';

export const ResetPassword = ({ onGoLogin }) => {
    const [form, setForm] = useState({ password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const token = new URLSearchParams(window.location.search).get('token');

    const handleSubmit = async e => {
        e.preventDefault();
        if (form.password.length < 6) { setError('Mínimo 6 caracteres'); return; }
        if (form.password !== form.confirmPassword) { setError('Las contraseñas no coinciden'); return; }
        if (!token) { setError('Token inválido. Solicita un nuevo enlace.'); return; }

        setLoading(true);
        try {
            await api.post(`${BASE}/reset-password`, null, {
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
        <div className="auth-page">
            <div className="auth-card">

                {/* Logo */}
                <div className="auth-logo">
                    <span className="auth-logo__emoji">🔒</span>
                    <h1 className="auth-logo__title">Nueva contraseña</h1>
                    <p className="auth-logo__sub">Elige una contraseña segura</p>
                </div>

                {success ? (
                    <div>
                        <div className="alert alert--success">
                            ✅ ¡Contraseña actualizada! Ya puedes iniciar sesión.
                        </div>
                        <button
                            onClick={onGoLogin}
                            className="btn btn--primary"
                            style={{ marginTop: '16px' }}
                        >
                            Ir al login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="form">

                        <div className="form-group">
                            <label className="form-label">Nueva contraseña</label>
                            <input
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                value={form.password}
                                onChange={e => { setForm({ ...form, password: e.target.value }); setError(''); }}
                                className="form-input"
                                autoComplete="new-password"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirmar contraseña</label>
                            <input
                                type="password"
                                placeholder="Repite la contraseña"
                                value={form.confirmPassword}
                                onChange={e => { setForm({ ...form, confirmPassword: e.target.value }); setError(''); }}
                                className="form-input"
                                autoComplete="new-password"
                            />
                        </div>

                        {error && <div className="alert alert--error">⚠️ {error}</div>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn--primary"
                        >
                            {loading ? '⏳ Guardando...' : '🔒 Cambiar contraseña'}
                        </button>

                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;