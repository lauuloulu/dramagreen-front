import { useState } from 'react';
import axios from 'axios';
import { BASE } from '../styles/authStyles';

export const Login = ({ onLoginSuccess, onGoRegister, onGoForgot }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      setError('Introduce tu usuario y contraseña');
      return;
    }
    setLoading(true);
    const token = btoa(`${credentials.username}:${credentials.password}`);
    try {
      const response = await axios.get(`${BASE}/me`, {
        headers: { Authorization: `Basic ${token}` },
      });
      localStorage.setItem('auth_token', token);
      localStorage.setItem('username', credentials.username);
      localStorage.setItem('role', response.data.roles?.[0]?.authority || 'USER');
      axios.defaults.headers.common['Authorization'] = `Basic ${token}`;
      onLoginSuccess();
    } catch {
      setError('Credenciales incorrectas. La planta llora. 💧');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo">
          <span className="auth-logo__emoji">🌿</span>
          <h1 className="auth-logo__title">DramaGreen</h1>
          <p className="auth-logo__sub">Tu jardín interior te espera</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label className="form-label">Usuario</label>
            <input
              name="username"
              placeholder="Tu nombre de usuario"
              value={credentials.username}
              onChange={handleChange}
              className="form-input"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              name="password"
              type="password"
              placeholder="Tu contraseña"
              value={credentials.password}
              onChange={handleChange}
              className="form-input"
              autoComplete="current-password"
            />
          </div>

          {error && <div className="alert alert--error">⚠️ {error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="btn btn--primary"
          >
            {loading ? '⏳ Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* ¿Olvidaste contraseña? */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <span className="auth-link" onClick={onGoForgot}>
            ¿Olvidaste tu contraseña?
          </span>
        </div>

        {/* Divider */}
        <div className="auth-divider">
          <div className="auth-divider__line"/>
          <span>o</span>
          <div className="auth-divider__line"/>
        </div>

        {/* Registro */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '14px', color: '#888' }}>¿No tienes cuenta? </span>
          <span className="auth-link" onClick={onGoRegister}>Regístrate</span>
        </div>

      </div>
    </div>
  );
};

export default Login;