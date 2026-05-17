import { useState } from "react";
import Login from "./components/Login";
import PlantDashboard from './components/PlantDashboard';
import PlantForm from './components/PlantForm';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('auth_token'));
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'new-plant' | 'plant-detail'
  const [selectedPlant, setSelectedPlant] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
  };

  const handleViewPlant = (plant) => {
    setSelectedPlant(plant);
    setView('plant-detail');
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // ── Vistas sin nav (pantalla completa) ──
  if (view === 'new-plant') {
    return (
      <PlantForm
        onSuccess={() => setView('dashboard')}
        onCancel={() => setView('dashboard')}
      />
    );
  }

  // ── Vistas con nav ──
  return (
    <div>
      <nav style={styles.nav}>
        <span>🌿 DramaGreen</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '14px', opacity: 0.8 }}>
            {localStorage.getItem('username')}
          </span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Salir</button>
        </div>
      </nav>

      <main>
        {view === 'dashboard' && (
          <PlantDashboard
            onViewPlant={handleViewPlant}
            onNewPlant={() => setView('new-plant')}
          />
        )}

        {view === 'plant-detail' && selectedPlant && (
          <div style={{ padding: '20px' }}>
            <button onClick={() => setView('dashboard')} style={styles.backBtn}>
              ← Volver
            </button>
            <h2>{selectedPlant.nickname}</h2>
            <p>Ficha completa — próximamente</p>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    backgroundColor: '#2D5239',
    color: 'white',
  },
  logoutBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '6px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  backBtn: {
    background: 'none',
    border: '1px solid #ccc',
    padding: '6px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '16px',
    fontSize: '14px',
  }
};

export default App;