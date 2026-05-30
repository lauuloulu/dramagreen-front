import { useState } from 'react';
import axios from 'axios';
import { shared, BASE } from '../styles/authStyles';

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
            const { data } = await axios.post(`${BASE}/register`, {
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

    // Preview del username generado
    const previewUsername = form.name && form.surname
        ? (form.name.charAt(0) + form.surname).toLowerCase().replaceAll(/[^a-z0-9]/g, '')
        : '';

    return (
        <div style={shared.page}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        input:focus { border-color: #355E45 !important; box-shadow: 0 0 0 3px #355E4520; }
      `}</style>

            <div style={{ ...shared.card, maxWidth: '440px' }}>
                <div style={shared.logo}>
                    <span style={shared.logoEmoji}>🌱</span>
                    <h1 style={shared.logoTitle}>Crear cuenta</h1>
                    <p style={shared.logoSub}>Únete a DramaGreen</p>
                </div>

                {success
                    ? (
                        <div>
                            <div style={shared.success}>✅ {success}</div>
                            <button
                                onClick={onGoLogin}
                                style={shared.btnPrimary}
                                onMouseEnter={e => e.currentTarget.style.background = '#2D5239'}
                                onMouseLeave={e => e.currentTarget.style.background = '#355E45'}
                            >
                                Ir al login
                            </button>
                        </div>
                    )
                    : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                            {/* Nombre + apellido en fila */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={shared.label}>NOMBRE</label>
                                    <input
                                        name="name" placeholder="Laura"
                                        value={form.name} onChange={handleChange}
                                        style={shared.input} autoComplete="given-name"
                                    />
                                </div>
                                <div>
                                    <label style={shared.label}>APELLIDO</label>
                                    <input
                                        name="surname" placeholder="Prat"
                                        value={form.surname} onChange={handleChange}
                                        style={shared.input} autoComplete="family-name"
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

                            <div>
                                <label style={shared.label}>EMAIL</label>
                                <input
                                    name="email" type="email" placeholder="laura@ejemplo.com"
                                    value={form.email} onChange={handleChange}
                                    style={shared.input} autoComplete="email"
                                />
                            </div>

                            <div>
                                <label style={shared.label}>CONTRASEÑA</label>
                                <input
                                    name="password" type="password" placeholder="Mínimo 6 caracteres"
                                    value={form.password} onChange={handleChange}
                                    style={shared.input} autoComplete="new-password"
                                />
                            </div>

                            <div>
                                <label style={shared.label}>CONFIRMAR CONTRASEÑA</label>
                                <input
                                    name="confirmPassword" type="password" placeholder="Repite la contraseña"
                                    value={form.confirmPassword} onChange={handleChange}
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
                                {loading ? '⏳ Creando cuenta...' : '🌿 Crear cuenta'}
                            </button>

                            <div style={{ textAlign: 'center' }}>
                                <span style={{ fontSize: '14px', color: '#888' }}>¿Ya tienes cuenta? </span>
                                <span style={shared.link} onClick={onGoLogin}>Inicia sesión</span>
                            </div>
                        </form>
                    )
                }
            </div>
        </div>
    );
};

export default Register;