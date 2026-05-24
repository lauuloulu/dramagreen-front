import { useState, useEffect } from 'react';
import axios from 'axios';
import PlantCard from './PlantCard';
import { ROOMS } from '../constants/rooms';
import { getWateringInfo } from '../utils/WateringUtils';

const PlantDashboard = ({ onViewPlant, onNewPlant, onNewSpecies }) => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomIndex, setRoomIndex] = useState(0);
  const [animDir, setAnimDir] = useState(null); // 'left' | 'right'
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const { data } = await axios.get('http://localhost:9000/api/plants/my');
        setPlants(data);
      } catch {
        // Mock para desarrollo
        setPlants([
          { id: 1, nickname: 'Carmela', speciesName: 'Monstera deliciosa', locationName: 'Salón', imageUrl: '/avatar/plants/monstera.png', lastWatered: '2026-05-10', wateringFrequency: 7 },
          { id: 2, nickname: 'Pepita', speciesName: 'Epipremnum aureum', locationName: 'Cocina', imageUrl: '/avatar/plants/pothos.png', lastWatered: '2026-05-08', wateringFrequency: 5 },
          { id: 3, nickname: 'Señor Pinchos', speciesName: 'Echinopsis', locationName: 'Estudio', imageUrl: '/avatar/plants/cactusLargo.png', lastWatered: '2026-04-20', wateringFrequency: 21 },
          { id: 4, nickname: 'Diva', speciesName: 'Phalaenopsis', locationName: 'Dormitorio', imageUrl: '/avatar/plants/orquidea.png', lastWatered: '2026-05-12', wateringFrequency: 10 },
          { id: 5, nickname: 'Gigante', speciesName: 'Ficus lyrata', locationName: 'Salón', imageUrl: '/avatar/plants/ficusGrande.png', lastWatered: '2026-05-09', wateringFrequency: 6 },
          { id: 6, nickname: 'Cleopatra', speciesName: 'Aloe barbadensis', locationName: 'Baño', imageUrl: '/avatar/plants/aloeVera.png', lastWatered: '2026-04-28', wateringFrequency: 14 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlants();
  }, []);

  const currentRoom = ROOMS[roomIndex];
  const roomPlants = plants.filter(p => p.locationName === currentRoom.key);
  const urgentCount = plants.filter(p => {
    const { daysLeft } = getWateringInfo(p.lastWatered, p.wateringFrequency);
    return typeof daysLeft !== 'undefined' && daysLeft <= 0;
  }).length;

  const navigate = (dir) => {
    const newIndex = dir === 'next'
      ? (roomIndex + 1) % ROOMS.length
      : (roomIndex - 1 + ROOMS.length) % ROOMS.length;

    setAnimDir(dir === 'next' ? 'left' : 'right');
    setVisible(false);

    setTimeout(() => {
      setRoomIndex(newIndex);
      setAnimDir(null);
      setVisible(true);
    }, 220);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F2EDE6',
      fontFamily: "'Nunito', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        @keyframes fadeInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeInLeft  { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeIn      { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer     { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      {/* ── Barra superior ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 24px',
        background: '#fff',
        borderBottom: '1px solid #EDE8E0',
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 900, color: '#2D2D2D' }}>
            🌿 DramaGreen
          </h1>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#999' }}>
            {plants.length} plantas · {urgentCount > 0 ? `${urgentCount} necesitan riego` : 'Todas al día ✓'}
          </p>
        </div>
        <button
          onClick={onNewPlant}
          style={{
            background: '#355E45', color: '#fff',
            border: 'none', borderRadius: '12px',
            padding: '10px 18px', fontSize: '14px', fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#2D5239'}
          onMouseLeave={e => e.currentTarget.style.background = '#355E45'}
        >
          + Nueva planta
        </button>
        <button
          onClick={onNewSpecies}
          style={{
            background: '#4A7C5E', color: '#fff', border: 'none', borderRadius: '12px',
            padding: '10px 18px', fontSize: '14px', fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#355E45'}
          onMouseLeave={e => e.currentTarget.style.background = '#4A7C5E'}
        >
          + Nueva especie
        </button>
      </div>

      {/* ── Imagen de habitación ── */}
      <div style={{ position: 'relative', height: '320px', overflow: 'hidden' }}>
        {/* Imagen */}
        <img
          key={currentRoom.key}
          src={currentRoom.image}
          alt={currentRoom.label}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            animation: visible
              ? animDir === 'left'
                ? 'fadeInLeft 0.3s ease'
                : 'fadeInRight 0.3s ease'
              : 'none',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.2s',
          }}
          onError={e => { e.target.style.display = 'none'; }}
        />

        {/* Gradiente inferior */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '160px',
          background: 'linear-gradient(to top, #F2EDE6 0%, transparent 100%)',
        }} />

        {/* Nombre de habitación sobre la imagen */}
        <div style={{
          position: 'absolute', bottom: '24px', left: '24px',
          animation: visible ? 'fadeIn 0.3s ease' : 'none',
          opacity: visible ? 1 : 0,
        }}>
          <span style={{ fontSize: '28px' }}>{currentRoom.emoji}</span>
          <h2 style={{
            margin: '4px 0 0',
            fontSize: '32px', fontWeight: 900,
            color: '#2D2D2D', lineHeight: 1,
          }}>
            {currentRoom.label}
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#666' }}>
            {roomPlants.length === 0
              ? 'Sin plantas aquí'
              : `${roomPlants.length} planta${roomPlants.length > 1 ? 's' : ''}`
            }
          </p>
        </div>

        {/* Flechas de navegación */}
        <button
          onClick={() => navigate('prev')}
          style={{
            position: 'absolute', left: '16px', top: '50%',
            transform: 'translateY(-50%)',
            width: '44px', height: '44px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.9)',
            border: 'none', cursor: 'pointer', fontSize: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            transition: 'transform 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
        >
          ←
        </button>
        <button
          onClick={() => navigate('next')}
          style={{
            position: 'absolute', right: '16px', top: '50%',
            transform: 'translateY(-50%)',
            width: '44px', height: '44px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.9)',
            border: 'none', cursor: 'pointer', fontSize: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            transition: 'transform 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
        >
          →
        </button>

        {/* Indicadores de puntos */}
        <div style={{
          position: 'absolute', bottom: '16px', right: '24px',
          display: 'flex', gap: '6px',
        }}>
          {ROOMS.map((r, i) => (
            <div
              key={r.key}
              onClick={() => {
                const dir = i > roomIndex ? 'next' : 'prev';
                setAnimDir(dir === 'next' ? 'left' : 'right');
                setVisible(false);
                setTimeout(() => { setRoomIndex(i); setAnimDir(null); setVisible(true); }, 220);
              }}
              style={{
                width: i === roomIndex ? '20px' : '7px',
                height: '7px', borderRadius: '4px',
                background: i === roomIndex ? '#355E45' : 'rgba(0,0,0,0.25)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Plantas de la habitación ── */}
      <div style={{ padding: '8px 20px 40px' }}>

        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '14px', marginTop: '8px',
          }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                height: '180px', borderRadius: '18px',
                background: '#E8E0D5',
                animation: 'shimmer 1.5s ease-in-out infinite',
              }} />
            ))}
          </div>
        ) : roomPlants.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '48px 20px',
            animation: 'fadeIn 0.4s ease',
          }}>
            <div style={{ fontSize: '56px', marginBottom: '12px' }}>
              {currentRoom.emoji}
            </div>
            <p style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#888' }}>
              No hay plantas en {currentRoom.label}
            </p>
            <p style={{ margin: '6px 0 20px', fontSize: '14px', color: '#BBB' }}>
              ¿La añadimos?
            </p>
            <button
              onClick={onNewPlant}
              style={{
                background: '#355E45', color: '#fff',
                border: 'none', borderRadius: '12px',
                padding: '10px 22px', fontSize: '14px', fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              + Añadir planta aquí
            </button>
          </div>
        ) : (
          <div
            key={currentRoom.key}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '14px', marginTop: '8px',
              animation: visible ? 'fadeIn 0.35s ease' : 'none',
            }}
          >
            {roomPlants.map((plant, i) => (
              <div
                key={plant.id}
                style={{ animation: `fadeIn 0.3s ease ${i * 0.06}s both` }}
              >
                <PlantCard plant={plant} onClick={onViewPlant} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantDashboard;