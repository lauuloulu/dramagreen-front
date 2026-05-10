import { useState } from "react";
import Login from "./components/Login"; // Asegúrate de tener estas rutas
import PlantDashboard from "./components/PlantDashboard";

function App() {
  // Inicializamos el estado mirando si ya hay un token guardado
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('auth_token'));

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
  };

  // Si no está autenticado, mostramos el Login
  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // Si está autenticado, mostramos la App real
  return (
    <div className="app-container">
      <nav style={styles.nav}>
        <span>🌿 DramaGreen</span>
        <button onClick={handleLogout} style={styles.logoutBtn}>Salir</button>
      </nav>
      
      <main style={{ padding: '20px' }}>
        <PlantDashboard />
      </main>
    </div>
  );
}

const styles = {
  nav: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    padding: '1rem', 
    backgroundColor: '#2d5a27', 
    color: 'white' 
  },
  logoutBtn: { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }
};

export default App; // <--- IMPORTANTE: Exportar el componente, no el API