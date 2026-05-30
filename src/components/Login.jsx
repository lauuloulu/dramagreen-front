import { useState } from 'react';
import axios from 'axios';
import { shared, BASE } from '../styles/authStyles';

export const Login = ({ onLoginSuccess, onGoRegister, onGoForgot }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
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
    <div style={shared.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        input:focus { border-color: #355E45 !important; box-shadow: 0 0 0 3px #355E4520; }
      `}</style>

      <div style={shared.card}>
        <div style={shared.logo}>
          <span style={shared.logoEmoji}>🌿</span>
          <h1 style={shared.logoTitle}>DramaGreen</h1>
          <p style={shared.logoSub}>Tu jardín interior te espera</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={shared.label}>USUARIO</label>
            <input
              name="username"
              placeholder="Tu nombre de usuario"
              value={credentials.username}
              onChange={handleChange}
              style={shared.input}
              autoComplete="username"
            />
          </div>
          <div>
            <label style={shared.label}>CONTRASEÑA</label>
            <input
              name="password"
              type="password"
              placeholder="Tu contraseña"
              value={credentials.password}
              onChange={handleChange}
              style={shared.input}
              autoComplete="current-password"
            />
          </div>

          {error && <div style={shared.error}>⚠️ {error}</div>}

          <button
            type="submit"
            disabled={loading}
            style={{ ...shared.btnPrimary, opacity: loading ? 0.7 : 1 }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#2D5239'; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#355E45'; }}
          >
            {loading ? '⏳ Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Links */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <span
            style={shared.link}
            onClick={onGoForgot}
          >
            ¿Olvidaste tu contraseña?
          </span>
        </div>

        <div style={shared.divider}>
          <div style={{ flex: 1, height: '1px', background: '#EEE' }} />
          <span>o</span>
          <div style={{ flex: 1, height: '1px', background: '#EEE' }} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '14px', color: '#888' }}>¿No tienes cuenta? </span>
          <span style={shared.link} onClick={onGoRegister}>Regístrate</span>
        </div>
      </div>
    </div>
  );
};

export default Login;