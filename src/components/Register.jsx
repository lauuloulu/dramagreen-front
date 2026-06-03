import { useState } from 'react';
import api from '../Api';

export const Register = ({ onGoLogin }) => {
    const [form, setForm] = useState({ name: '', surname: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const validate = () => {
        if (!form.name.trim()) return 'El nombre es obligatorio';
        if (!form.surname.trim()) return 'El apellido es obligatorio';
        if (!form.email.includes('@')) return 'Introduce un email válido';
        if (form.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
        if (form.password !== form.confirmPassword) return 'Las contraseñas no coinciden';
        return '';
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const err = validate();
        if (err) { setError(err); return; }

        setLoading(true);
        try {
            const { data } = await api.post(`/auth/register`, {
                name: form.name,
                surname: form.surname,
                email: form.email,
                password: form.password,
            });
            setSuccess(`¡Bienvenida, ${data.name}! Tu usuario es "${data.username}". Revisa tu email y accede al login.`);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear la cuenta');
        } finally {
            setLoading(false);
        }
    };

    const previewUsername = form.name && form.surname
        ? (form.name.charAt(0) + form.surname).toLowerCase().replaceAll(/[^a-z0-9]/g, '')
        : '';

    return (
        <div className="auth-page">
            <div className="auth-card" style={{ maxWidth: '440px' }}>

                {/* Logo */}
                <div className="auth-logo">
                    <span className="auth-logo__emoji">🌱</span>
                    <h1 className="auth-logo__title">Crear cuenta</h1>
                    <p className="auth-logo__sub">Únete a DramaGreen</p>
                </div>

                {success ? (
                    <div>
                        <div className="alert alert--success">✅ {success}</div>
                        <button onClick={onGoLogin} className="btn btn--primary" style={{ marginTop: '16px' }}>
                            Ir al login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="form">

                        {/* Nombre + apellido */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Nombre</label>
                                <input
                                    name="name" placeholder="Nombre"
                                    value={form.name} onChange={handleChange}
                                    className="form-input" autoComplete="given-name"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Apellido</label>
                                <input
                                    name="surname" placeholder="Apellido"
                                    value={form.surname} onChange={handleChange}
                                    className="form-input" autoComplete="family-name"
                                />
                            </div>
                        </div>

                        {/* Preview username */}
                        {previewUsername && (
                            <div style={{
                                background: '#F7F3EE', borderRadius: '10px',
                                padding: '8px 14px', fontSize: '13px', color: '#666',
                            }}>
                                Tu usuario será: <strong style={{ color: '#355E45' }}>@{previewUsername}</strong>
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                name="email" type="email" placeholder="laura@ejemplo.com"
                                value={form.email} onChange={handleChange}
                                className="form-input" autoComplete="email"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Contraseña</label>
                            <input
                                name="password" type="password" placeholder="Mínimo 6 caracteres"
                                value={form.password} onChange={handleChange}
                                className="form-input" autoComplete="new-password"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirmar contraseña</label>
                            <input
                                name="confirmPassword" type="password" placeholder="Repite la contraseña"
                                value={form.confirmPassword} onChange={handleChange}
                                className="form-input" autoComplete="new-password"
                            />
                        </div>

                        {error && <div className="alert alert--error">⚠️ {error}</div>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn--primary"
                        >
                            {loading ? '⏳ Creando cuenta...' : '🌿 Crear cuenta'}
                        </button>

                        <div style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '14px', color: '#888' }}>¿Ya tienes cuenta? </span>
                            <span className="auth-link" onClick={onGoLogin}>Inicia sesión</span>
                        </div>

                    </form>
                )}
            </div>
        </div>
    );
};

export default Register;