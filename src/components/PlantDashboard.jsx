import { useState, useEffect } from 'react';
import axios from 'axios';
import PlantCard from './PlantCard';
import { ROOMS } from '../constants/rooms';
import { getWateringInfo } from '../utils/WateringUtils';

const PlantDashboard = ({ onViewPlant, onNewPlant, onNewSpecies }) => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomIndex, setRoomIndex] = useState(0);
  const [animDir, setAnimDir] = useState(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const { data } = await axios.get('http://localhost:9000/api/plants/my');
        setPlants(data);
      } catch {
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

  const getImageAnimation = () => {
    if (!visible) return 'none';
    return animDir === 'left' ? 'fadeInLeft 0.35s ease' : 'fadeInRight 0.35s ease';
  };

  return (
    <div className="page">

      {/* ── Barra superior ── */}
      <nav className="dashboard-topbar">
        <div className="dashboard-topbar__brand">
          <span className="dashboard-topbar__sep" />
          <div className="dashboard-topbar__status">
            <span className="dashboard-topbar__count">
              <strong>{plants.length}</strong> plantas
            </span>
            <span className="dashboard-topbar__sep" />
            <span className={`dashboard-topbar__dot ${urgentCount > 0 ? 'dashboard-topbar__dot--warn' : 'dashboard-topbar__dot--ok'}`} />
            <span className={`dashboard-topbar__pill ${urgentCount > 0 ? 'dashboard-topbar__pill--warn' : 'dashboard-topbar__pill--ok'}`}>
              {urgentCount > 0 ? `${urgentCount} necesitan riego` : 'Todas al día'}
            </span>
          </div>
        </div>
        <div className="dashboard-topbar__actions">
          <button className="btn btn--secondary" onClick={onNewSpecies}>
            <i className="ti ti-leaf" /> Nueva especie
          </button>
          <button className="btn btn--primary" onClick={onNewPlant}>
            <i className="ti ti-plus" /> Nueva planta
          </button>
        </div>
      </nav>

      {/* ── Hero habitación ── */}
      <div className="room-hero">

        {/* Imagen con animación */}
        <img
          key={currentRoom.key}
          src={currentRoom.image}
          alt={currentRoom.label}
          className="room-hero__img"
          style={{
            animation: getImageAnimation(),
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.2s',
          }}
          onError={e => { e.target.style.display = 'none'; }}
        />

        {/* Gradiente solo en la parte inferior — menos agresivo */}
        <div className="room-hero__gradient" />

        {/* Info habitación */}
        <div
          className="room-hero__info"
          style={{
            animation: visible ? 'fadeIn 0.3s ease' : 'none',
            opacity: visible ? 1 : 0,
          }}
        >
          <span style={{ fontSize: '28px' }}>{currentRoom.emoji}</span>
          <h2 className="room-hero__name">{currentRoom.label}</h2>
          <p className="room-hero__count">
            {roomPlants.length === 0
              ? 'Sin plantas aquí'
              : `${roomPlants.length} planta${roomPlants.length > 1 ? 's' : ''}`
            }
          </p>
        </div>

        {/* Flechas */}
        <button
          className="room-nav-btn room-nav-btn--prev"
          onClick={() => navigate('prev')}
          aria-label="Habitación anterior"
        >
          ←
        </button>
        <button
          className="room-nav-btn room-nav-btn--next"
          onClick={() => navigate('next')}
          aria-label="Habitación siguiente"
        >
          →
        </button>

        {/* Dots */}
        <div className="room-dots">
          {ROOMS.map((r, i) => (
            <div
              key={r.key}
              className={`room-dot ${i === roomIndex ? 'room-dot--active' : ''}`}
              onClick={() => {
                const dir = i > roomIndex ? 'next' : 'prev';
                setAnimDir(dir === 'next' ? 'left' : 'right');
                setVisible(false);
                setTimeout(() => { setRoomIndex(i); setAnimDir(null); setVisible(true); }, 220);
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Plantas ── */}
      <div className="plant-grid-wrapper">
        {loading ? (
          <div className="plant-grid">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton" style={{ height: '200px' }} />
            ))}
          </div>
        ) : roomPlants.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__emoji">{currentRoom.emoji}</div>
            <p className="empty-state__title">No hay plantas en {currentRoom.label}</p>
            <p className="empty-state__sub">¿La añadimos?</p>
            <button className="btn btn--primary" style={{ width: 'auto', padding: '10px 24px' }} onClick={onNewPlant}>
              + Añadir planta aquí
            </button>
          </div>
        ) : (
          <div
            key={currentRoom.key}
            className="plant-grid"
            style={{ animation: visible ? 'fadeIn 0.35s ease' : 'none' }}
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