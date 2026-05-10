import { useEffect, useState, useCallback } from 'react';
import api from '../api'; // Nuestra instancia de Axios con interceptores

function PlantDashboard() {
  // Inicializamos loading en true para no tener que llamar a setLoading(true) dentro del effect
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlants = useCallback(async (isInitialLoad = false) => {
    try {
      // Solo cambiamos el estado si no es la carga inicial (para evitar el error de ESLint)
      if (!isInitialLoad) setLoading(true);
      
      const response = await api.get('/api/plants');
      setPlants(response.data);
    } catch (error) {
      console.error("Error cargando plantas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      const response = await api.get('/api/plants');
      if (isMounted) {
        setPlants(response.data);
        setLoading(false);
      }
    };

    loadData();

    return () => { isMounted = false; }; // Cleanup para evitar fugas de memoria
  }, []); // Array vacío para que no dependa de fetchPlants y el linter se calme

  const handleWatering = async (plantId) => {
    try {
      await api.post(`/api/plants/${plantId}/water`);
      fetchPlants(); // Aquí sí podemos llamar a fetchPlants porque es un evento de usuario
    } catch (error) {
      alert("Error al regar");
    }
  };

  if (loading) return <p>Cargando tu selva privada... 🌿</p>;

  return (
    <div style={styles.dashboard}>
      <h2>Mis Plantas</h2>
      <div style={styles.grid}>
        {plants.length === 0 ? (
          <p>No hay plantas. ¡Adopta una y evita el drama!</p>
        ) : (
          plants.map(plant => (
            <div key={plant.id} style={styles.card}>
              <h3>{plant.nickname}</h3>
              <p><strong>Especie:</strong> {plant.speciesName}</p>
              
              <div style={plant.needsWater ? styles.alert : styles.ok}>
                {plant.needsWater ? "⚠️ NECESITA AGUA" : "✅ Hidratada"}
              </div>

              <p>Próximo riego: {new Date(plant.nextWatering).toLocaleDateString()}</p>
              
              <button 
                onClick={async () => {
                  await api.post(`/api/plants/${plant.id}/water`);
                  fetchPlants(); // Recargamos para ver los cambios
                }}
                style={styles.waterBtn}
              >
                Regar 💧
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  dashboard: { padding: '20px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' },
  card: { border: '1px solid #ddd', padding: '15px', borderRadius: '10px', backgroundColor: '#f9f9f9', textAlign: 'center' },
  alert: { color: 'red', fontWeight: 'bold', margin: '10px 0' },
  ok: { color: 'green', margin: '10px 0' },
  waterBtn: { backgroundColor: '#3498db', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }
};

export default PlantDashboard;