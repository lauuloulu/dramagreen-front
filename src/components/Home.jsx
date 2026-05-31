import { useState, useEffect } from 'react';
import axios from 'axios';

// ─── Utilidades de riego ───────────────────────────────────────────────────
const getWateringInfo = (lastWatered, frequency) => {
  const last   = new Date(lastWatered);
  const today  = new Date();
  today.setHours(0, 0, 0, 0);
  const daysSince  = Math.floor((today - last) / 86_400_000);
  const daysLeft   = frequency - daysSince;
  const ratio      = Math.min(daysSince / frequency, 1);

  let color, label, emoji;
  if (daysLeft > Math.ceil(frequency * 0.4)) {
    color = '#4CAF50'; label = `${daysLeft}d restantes`; emoji = '💧';
  } else if (daysLeft > 0) {
    color = '#FFC107'; label = `${daysLeft}d restantes`; emoji = '⚠️';
  } else {
    color = '#F44336'; label = daysLeft === 0 ? '¡Hoy!' : `¡Hace ${Math.abs(daysLeft)}d!`; emoji = '🆘';
  }
  return { ratio, color, label, emoji, daysLeft };
};

// ─── Pixel Art: Sala ──────────────────────────────────────────────────────
const PixelRoom = () => (
  <svg
    width="100%"
    viewBox="0 0 680 260"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block', imageRendering: 'pixelated', borderRadius: '16px 16px 0 0' }}
    aria-label="Ilustración pixel art de un salón con sofá, estantería y ventana"
  >
    {/* Pared */}
    <rect x="0" y="0" width="680" height="214" fill="#F5E8D4"/>
    {/* Suelo - tablas */}
    {[0,1,2,3,4,5,6].map(i => (
      <rect key={i} x={i * 98} y="212" width="96" height="48" fill={i % 2 === 0 ? '#C9915A' : '#BB8450'}/>
    ))}
    {/* Juntas del suelo */}
    {[1,2,3,4,5,6].map(i => (
      <rect key={i} x={i * 98 - 1} y="212" width="2" height="48" fill="#A06A38"/>
    ))}
    {/* Rodapié */}
    <rect x="0" y="208" width="680" height="6" fill="#A67B50"/>

    {/* ── VENTANA (izquierda) ── */}
    {/* Vara cortina */}
    <rect x="24" y="9"  width="212" height="7" fill="#7D5A3C"/>
    <rect x="24" y="9"  width="7"   height="7" fill="#6B4A2E"/>
    <rect x="229" y="9" width="7"   height="7" fill="#6B4A2E"/>
    {/* Cortina izquierda */}
    <rect x="24"  y="16" width="28" height="188" fill="#C85040"/>
    <rect x="34"  y="16" width="10" height="188" fill="#B84030"/>
    <rect x="24"  y="16" width="10" height="60"  fill="#D86050"/>
    {/* Cortina derecha */}
    <rect x="208" y="16" width="28" height="188" fill="#C85040"/>
    <rect x="208" y="16" width="10" height="188" fill="#D86050"/>
    <rect x="218" y="16" width="18" height="60"  fill="#B84030"/>
    {/* Marco ventana */}
    <rect x="52"  y="18" width="148" height="176" fill="#7D5A3C"/>
    {/* Cristal */}
    <rect x="60"  y="26" width="132" height="160" fill="#B8D8F0"/>
    {/* Divisores */}
    <rect x="60"  y="104" width="132" height="6"  fill="#7D5A3C"/>
    <rect x="124" y="26"  width="6"   height="160" fill="#7D5A3C"/>
    {/* Luz en cristal */}
    <rect x="64"  y="30"  width="54" height="70" fill="#D8EEF8" opacity="0.5"/>
    <rect x="64"  y="112" width="54" height="70" fill="#D8EEF8" opacity="0.3"/>
    <rect x="132" y="30"  width="56" height="70" fill="#D8EEF8" opacity="0.2"/>

    {/* ── ALFOMBRA ── */}
    <rect x="196" y="206" width="340" height="8" rx="2" fill="#9B6F4E" opacity="0.35"/>
    <rect x="200" y="207" width="332" height="6" rx="2" fill="#8B5C3A" opacity="0.2"/>

    {/* ── SOFÁ ── */}
    {/* Patas */}
    <rect x="222" y="208" width="14" height="6" rx="1" fill="#5C3D1E"/>
    <rect x="306" y="208" width="14" height="6" rx="1" fill="#5C3D1E"/>
    <rect x="396" y="208" width="14" height="6" rx="1" fill="#5C3D1E"/>
    <rect x="494" y="208" width="14" height="6" rx="1" fill="#5C3D1E"/>
    {/* Respaldo */}
    <rect x="214" y="130" width="304" height="54" rx="6" fill="#355E45"/>
    {/* Apoyabrazos */}
    <rect x="206" y="128" width="24"  height="82" rx="5" fill="#2D5239"/>
    <rect x="502" y="128" width="24"  height="82" rx="5" fill="#2D5239"/>
    {/* Asiento */}
    <rect x="214" y="176" width="304" height="36" rx="4" fill="#42704F"/>
    {/* Cojines */}
    <rect x="222" y="136" width="90" height="38" rx="4" fill="#E8C265"/>
    <rect x="316" y="136" width="90" height="38" rx="4" fill="#F0CA70"/>
    <rect x="410" y="136" width="90" height="38" rx="4" fill="#E8C265"/>
    {/* Detalle cojines */}
    <rect x="222" y="156" width="90" height="3" fill="#D4AE50" opacity="0.5"/>
    <rect x="316" y="156" width="90" height="3" fill="#DDB850" opacity="0.5"/>
    <rect x="410" y="156" width="90" height="3" fill="#D4AE50" opacity="0.5"/>

    {/* ── MESITA AUXILIAR ── */}
    <rect x="530" y="176" width="36" height="6" rx="2" fill="#8B6234"/>
    <rect x="540" y="182" width="8"  height="28" fill="#7D5A3C"/>
    {/* Taza */}
    <rect x="534" y="164" width="16" height="14" rx="3" fill="#F0CA70"/>
    <rect x="534" y="176" width="16" height="3"  fill="#D4AE50"/>
    <rect x="549" y="168" width="5"  height="8"  fill="#D4AE50" rx="2"/>
    {/* Humo decorativo */}
    <rect x="539" y="158" width="2" height="5" fill="#C0B0A0" opacity="0.4"/>
    <rect x="542" y="156" width="2" height="6" fill="#C0B0A0" opacity="0.3"/>
    <rect x="545" y="159" width="2" height="4" fill="#C0B0A0" opacity="0.35"/>

    {/* ── ESTANTERÍA (derecha) ── */}
    {/* Cuerpo */}
    <rect x="570" y="14" width="100" height="196" fill="#8B6234"/>
    {/* Fondo interior */}
    <rect x="578" y="22" width="84"  height="180" fill="#F5E8D4"/>
    {/* Estantes */}
    <rect x="578" y="80"  width="84" height="6"  fill="#7D5A3C"/>
    <rect x="578" y="138" width="84" height="6"  fill="#7D5A3C"/>
    {/* ─ Libros fila 1 ─ */}
    <rect x="582" y="30"  width="11" height="46" fill="#C85040"/>
    <rect x="595" y="34"  width="9"  height="42" fill="#4A7C5E"/>
    <rect x="606" y="30"  width="13" height="46" fill="#E8C265"/>
    <rect x="621" y="32"  width="8"  height="44" fill="#7D5A3C"/>
    <rect x="631" y="30"  width="10" height="46" fill="#6B4CA0" opacity="0.85"/>
    <rect x="643" y="33"  width="13" height="43" fill="#C85040" opacity="0.75"/>
    {/* ─ Libros fila 2 ─ */}
    <rect x="582" y="90"  width="14" height="44" fill="#4A7C5E"/>
    <rect x="598" y="92"  width="9"  height="42" fill="#E8C265"/>
    <rect x="609" y="90"  width="11" height="44" fill="#C85040"/>
    <rect x="622" y="92"  width="13" height="42" fill="#8B6234"/>
    <rect x="637" y="90"  width="9"  height="44" fill="#4A7C5E" opacity="0.8"/>
    <rect x="648" y="93"  width="12" height="41" fill="#6B4CA0" opacity="0.7"/>
    {/* ─ Libros fila 3 ─ */}
    <rect x="582" y="148" width="10" height="40" fill="#E8C265"/>
    <rect x="594" y="150" width="14" height="38" fill="#C85040"/>
    <rect x="610" y="148" width="9"  height="40" fill="#4A7C5E"/>
    <rect x="621" y="150" width="13" height="38" fill="#7D5A3C"/>
    <rect x="636" y="148" width="10" height="40" fill="#C85040" opacity="0.7"/>
    {/* ─ Plantita estante ─ */}
    <rect x="648" y="152" width="16" height="14" rx="2" fill="#8B6234"/>
    <rect x="651" y="143" width="10" height="11" fill="#3D6B4F"/>
    <ellipse cx="656" cy="138" rx="9"  ry="11" fill="#4A9B5E"/>
    <ellipse cx="650" cy="135" rx="6"  ry="7"  fill="#5AB06E"/>
    <ellipse cx="662" cy="136" rx="6"  ry="7"  fill="#3D8A50"/>
    <ellipse cx="656" cy="130" rx="5"  ry="6"  fill="#5AB06E"/>
  </svg>
);

// ─── Barra de riego ──────────────────────────────────────────────────────
const WateringBar = ({ ratio, color, label, emoji }) => (
  <div style={{ marginTop: '10px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
      <span style={{ fontSize: '12px', color: '#666', fontFamily: 'inherit' }}>
        {emoji} Próximo riego
      </span>
      <span style={{
        fontSize: '12px', fontWeight: 600, color: color,
        background: color + '20', padding: '2px 8px',
        borderRadius: '20px', fontFamily: 'inherit'
      }}>
        {label}
      </span>
    </div>
    <div style={{
      width: '100%', height: '8px', background: '#E8E8E8',
      borderRadius: '4px', overflow: 'hidden'
    }}>
      <div style={{
        width: `${Math.round(ratio * 100)}%`,
        height: '100%',
        background: color,
        borderRadius: '4px',
        transition: 'width 0.6s ease'
      }}/>
    </div>
  </div>
);

// ─── Card de planta ──────────────────────────────────────────────────────
const PLANT_EMOJIS = {
  'Monstera': '🌿', 'Pothos': '🍃', 'Cactus': '🌵', 'Orquídea': '🌸',
  'Ficus': '🌳', 'Aloe Vera': '🪴',
};

const PlantCard = ({ plant, onViewDetail }) => {
  const { ratio, color, label, emoji } = getWateringInfo(plant.lastWatered, plant.frequency);
  const plantEmoji = PLANT_EMOJIS[plant.name] || '🌱';

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #EDE8E0',
      borderRadius: '16px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Imagen / placeholder */}
      <div style={{
        height: '130px',
        background: 'linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '64px',
        position: 'relative',
      }}>
        <span role="img" aria-label={plant.name}>{plantEmoji}</span>
        {/* Badge ubicación */}
        <span style={{
          position: 'absolute', top: '10px', right: '10px',
          background: '#fff', color: '#6B5044',
          fontSize: '11px', fontWeight: 600,
          padding: '3px 10px', borderRadius: '20px',
          border: '1px solid #EDE8E0',
          fontFamily: 'inherit'
        }}>
          📍 {plant.location}
        </span>
      </div>

      {/* Info */}
      <div style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h3 style={{
          margin: 0, fontSize: '16px', fontWeight: 700,
          color: '#2D2D2D', fontFamily: 'inherit'
        }}>
          {plant.name}
        </h3>
        <p style={{
          margin: 0, fontSize: '12px', color: '#888',
          fontStyle: 'italic', fontFamily: 'inherit'
        }}>
          {plant.species}
        </p>

        <WateringBar ratio={ratio} color={color} label={label} emoji={emoji} />

        <button
          onClick={() => onViewDetail(plant)}
          style={{
            marginTop: '14px',
            width: '100%',
            padding: '9px',
            background: '#355E45',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#2D5239'}
          onMouseLeave={e => e.currentTarget.style.background = '#355E45'}
        >
          Ver ficha completa →
        </button>
      </div>
    </div>
  );
};

// ─── Componente principal ─────────────────────────────────────────────────
const Home = ({ onViewPlant }) => {
  const [plants, setPlants]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all'); // all | urgent | ok

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const { data } = await axios.get('http://localhost:9000/api/plants');
        setPlants(data);
      } catch {
        // Fallback a mock si el backend no responde
        setPlants(MOCK_PLANTS);
      } finally {
        setLoading(false);
      }
    };
    fetchPlants();
  }, []);

  const filteredPlants = plants.filter(p => {
    if (filter === 'all') return true;
    const { daysLeft } = getWateringInfo(p.lastWatered, p.frequency);
    if (filter === 'urgent') return daysLeft <= Math.ceil(p.frequency * 0.4);
    if (filter === 'ok')     return daysLeft >  Math.ceil(p.frequency * 0.4);
    return true;
  });

  const urgentCount = plants.filter(p => {
    const { daysLeft } = getWateringInfo(p.lastWatered, p.frequency);
    return daysLeft <= Math.ceil(p.frequency * 0.4);
  }).length;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F7F3EE',
      fontFamily: "'Nunito', 'Segoe UI', sans-serif",
    }}>
      {/* Hero: sala pixel art */}
      <div style={{
        margin: '0 auto',
        maxWidth: '900px',
        padding: '24px 20px 0',
      }}>
        <div style={{
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid #EDE8E0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
        }}>
          <PixelRoom />
          {/* Banner inferior de la sala */}
          <div style={{
            background: '#2D5239',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <h1 style={{ margin: 0, color: '#fff', fontSize: '20px', fontWeight: 700 }}>
                🌿 Mi jardín interior
              </h1>
              <p style={{ margin: '2px 0 0', color: '#A8C9B0', fontSize: '13px' }}>
                {plants.length} plantas · {urgentCount > 0 ? `${urgentCount} necesitan riego` : 'Todas al día ✓'}
              </p>
            </div>
            {urgentCount > 0 && (
              <div style={{
                background: '#F44336', color: '#fff',
                borderRadius: '20px', padding: '6px 16px',
                fontSize: '13px', fontWeight: 700,
              }}>
                {urgentCount} urgente{urgentCount > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div style={{
        maxWidth: '900px', margin: '0 auto', padding: '20px 20px 0',
        display: 'flex', gap: '8px',
      }}>
        {[
          { key: 'all',    label: 'Todas' },
          { key: 'urgent', label: '⚠️ Necesitan riego' },
          { key: 'ok',     label: '✅ Bien regadas' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '7px 16px',
              borderRadius: '20px',
              border: filter === f.key ? 'none' : '1px solid #DDD',
              background: filter === f.key ? '#355E45' : '#fff',
              color: filter === f.key ? '#fff' : '#555',
              fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid de plantas */}
      <div style={{
        maxWidth: '900px', margin: '0 auto',
        padding: '20px 20px 40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '16px',
      }}>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{
                height: '280px', borderRadius: '16px',
                background: '#EEE', animation: 'pulse 1.5s ease-in-out infinite',
              }}/>
            ))
          : filteredPlants.map(plant => (
              <PlantCard
                key={plant.id}
                plant={plant}
                onViewDetail={onViewPlant}
              />
            ))
        }
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default Home;