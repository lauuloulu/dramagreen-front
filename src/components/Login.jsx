import { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Codificamos en Base64 para Basic Auth
    const token = btoa(`${credentials.username}:${credentials.password}`);
    
    try {
    const response = await axios.get('http://localhost:9000/api/auth/me', {
      headers: { 'Authorization': `Basic ${token}` }
    });

    console.log("Login OK:", response.data); // para debug
    localStorage.setItem('auth_token', token);
    localStorage.setItem('username', credentials.username);
    localStorage.setItem('role', response.data.roles[0].authority);
    axios.defaults.headers.common['Authorization'] = `Basic ${token}`;
    
    onLoginSuccess();
  } catch (err) {
    setError(true);
    console.error("Status:", err.response?.status);
    console.error("Data:", err.response?.data);
  }
};

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🌿 DramaGreen</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="username"
          placeholder="Usuario"
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          onChange={handleChange}
          style={styles.input}
        />
        {error && <p style={styles.error}>Credenciales incorrectas. La planta llora. 💧</p>}
        <button type="submit" style={styles.button}>Entrar</button>
      </form>
    </div>
  );
};

// Estilos mínimos "al vuelo"
const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px', fontFamily: 'sans-serif' },
  title: { color: '#2d5a27', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' },
  input: { padding: '10px', borderRadius: '5px', border: '1px solid #ccc' },
  button: { padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  error: { color: 'red', fontSize: '12px' }
};

export default Login;