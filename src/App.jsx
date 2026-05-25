import { useState } from "react";
import Login from "./components/Login";
import PlantDashboard from './components/PlantDashboard';
import PlantForm from './components/PlantForm';
import SpeciesForm from './components/Speciesform';
import PlantDetail from './components/PlantDetail';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('auth_token'));
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'new-plant' | 'plant-detail'
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [detailKey, setDetailKey] = useState(0); // Para forzar re-render en PlantDetail

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

  {
    view === 'new-species' && (
      <SpeciesForm
        onSuccess={() => setView('dashboard')}
        onCancel={() => setView('dashboard')}
      />
    )
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
  if (view === 'edit-plant' && selectedPlant) {
  return (
        <PlantForm
            plant={selectedPlant}
            onSuccess={(updatedPlant) => {
                if (updatedPlant) setSelectedPlant(updatedPlant);
                setDetailKey(k => k + 1); // ← fuerza remount
                setView('plant-detail');
            }}
            onCancel={() => setView('plant-detail')}
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
            onNewSpecies={() => setView('new-species')}
          />
        )}

        {view === 'new-species' && (
          <SpeciesForm
            onSuccess={() => setView('dashboard')}
            onCancel={() => setView('dashboard')}
          />
        )}

        {view === 'plant-detail' && selectedPlant && (
          <PlantDetail
            key={detailKey}
            plantId={selectedPlant.id}
            onBack={() => setView('dashboard')}
            onEdit={(plant) => { setSelectedPlant(plant); setView('edit-plant'); }}
            onDeleted={() => setView('dashboard')}
          />
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