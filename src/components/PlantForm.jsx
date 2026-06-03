import { useState, useEffect } from 'react';
import api from '../Api';
import { inputStyle, btnPrimary } from '../styles/formStyles';
import AvatarSelector from './AvatarSelector';
import ErrorBox from './ErrorBox';

const LOCATION_ICONS = {
  'Salón': '🛋️', 'Cocina': '🍳', 'Dormitorio': '🛏️',
  'Baño': '🚿', 'Estudio': '💻', 'Terraza': '🌤️',
};

// plant prop → modo edición. Sin plant → modo creación.
const PlantForm = ({ plant, onSuccess, onCancel }) => {
  const isEditing = !!plant;

  const [form, setForm] = useState({
    nickname: plant?.nickname || '',
    speciesName: plant?.speciesName || '',
    locationName: plant?.locationName || '',
    imageUrl: plant?.imageUrl || '',
    status: plant?.status || 'ALIVE',
  });
  const [species, setSpecies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [speciesRes, locationsRes] = await Promise.all([
          api.get('/species'),
          api.get('/locations'),
        ]);
        setSpecies(speciesRes.data);
        setLocations(locationsRes.data);
      } catch {
        setSpecies([
          { id: 1, commonName: 'Monstera deliciosa' },
          { id: 2, commonName: 'Epipremnum aureum' },
          { id: 3, commonName: 'Ficus lyrata' },
          { id: 4, commonName: 'Aloe barbadensis' },
          { id: 5, commonName: 'Echinopsis oxygona' },
        ]);
        setLocations([
          { id: 1, name: 'Salón' },
          { id: 2, name: 'Cocina' },
          { id: 3, name: 'Dormitorio' },
          { id: 4, name: 'Baño' },
          { id: 5, name: 'Estudio' },
          { id: 6, name: 'Terraza' },
        ]);
      }
    };
    fetchData();
  }, []);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateStep1 = () => {
    if (!form.nickname.trim()) return 'Dale un nombre a tu planta';
    if (!form.speciesName) return 'Selecciona una especie';
    if (!form.locationName) return 'Selecciona una ubicación';
    return '';
  };

  const handleNextStep = () => {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setStep(2);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
        if (isEditing) {
            const res = await api.put(`/plants/${plant.id}`, form);
            onSuccess?.(res.data);
        } else {
            await api.post('/plants', form);
            onSuccess?.();
        }
    } catch (err) {
        setError(err.response?.data?.message || 'Error al guardar la planta');
    } finally {
        setLoading(false);
    }
};

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 700,
    color: '#5C5047',
    marginBottom: '6px',
    fontFamily: "'Nunito', sans-serif",
    letterSpacing: '0.02em',
  };

  const btnSecondary = {
    width: '100%',
    padding: '13px',
    background: 'transparent',
    color: '#666',
    border: '1.5px solid #DDD5C8',
    borderRadius: '14px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Nunito', sans-serif",
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F7F3EE',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: "'Nunito', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        input:focus, select:focus { border-color: #355E45 !important; box-shadow: 0 0 0 3px #355E4520; }
      `}</style>

      <div style={{
        width: '100%', maxWidth: '460px',
        background: '#fff', borderRadius: '24px',
        border: '1px solid #EDE8E0',
        boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}>

        {/* ── Cabecera ── */}
        <div style={{
          background: isEditing
            ? 'linear-gradient(135deg, #4A3728 0%, #7D5A3C 100%)'  // marrón en edición
            : 'linear-gradient(135deg, #2D5239 0%, #355E45 100%)', // verde en creación
          padding: '28px 28px 24px',
        }}>
          <button onClick={onCancel} style={{
            background: 'rgba(255,255,255,0.15)', border: 'none',
            borderRadius: '8px', color: '#fff', cursor: 'pointer',
            padding: '4px 10px', fontSize: '13px',
            marginBottom: '12px', fontFamily: 'inherit',
          }}>
            ← Volver
          </button>
          <h1 style={{ margin: 0, color: '#fff', fontSize: '24px', fontWeight: 800 }}>
            {isEditing
              ? (step === 1 ? `✏️ Editar ${plant.nickname}` : '🎨 Cambiar avatar')
              : (step === 1 ? '🌱 Nueva planta' : '🎨 Elige su avatar')
            }
          </h1>
          <p style={{ margin: '6px 0 16px', color: '#D4C4B0', fontSize: '14px' }}>
            {isEditing
              ? (step === 1 ? 'Modifica los datos de tu planta' : 'Cambia la imagen si quieres')
              : (step === 1 ? 'Cuéntanos sobre tu nueva compañera verde' : 'Ponle cara a tu planta')
            }
          </p>
          {/* Indicador de pasos */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {[1, 2].map(s => (
              <div key={s} style={{
                height: '4px', flex: 1, borderRadius: '2px',
                background: s <= step ? '#fff' : 'rgba(255,255,255,0.3)',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>
        </div>

        {/* ── Contenido ── */}
        <div style={{ padding: '28px' }}>

          {/* ── PASO 1: datos básicos ── */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Nickname */}
              <div>
                <label style={labelStyle}>NOMBRE DE TU PLANTA</label>
                <input
                  type="text"
                  placeholder="ej. Carmela, El Monstruo, Pepita..."
                  value={form.nickname}
                  onChange={e => handleChange('nickname', e.target.value)}
                  style={inputStyle}
                  maxLength={40}
                />
                {form.nickname && (
                  <p style={{ margin: '4px 0 0 4px', fontSize: '12px', color: '#AAA' }}>
                    {40 - form.nickname.length} caracteres restantes
                  </p>
                )}
              </div>

              {/* Especie */}
              <div>
                <label style={labelStyle}>ESPECIE</label>
                <select
                  value={form.speciesName}
                  onChange={e => handleChange('speciesName', e.target.value)}
                  style={{
                    ...inputStyle,
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 14px center',
                    paddingRight: '36px',
                    color: form.speciesName ? '#2D2D2D' : '#AAA',
                  }}
                >
                  <option value="" disabled>Selecciona una especie...</option>
                  {species.map(s => (
                    <option key={s.id} value={s.commonName}>{s.commonName}</option>
                  ))}
                </select>
                {isEditing && (
                  <p style={{ margin: '4px 0 0 4px', fontSize: '12px', color: '#AAA' }}>
                    Especie actual: {plant.speciesName}
                  </p>
                )}
              </div>

              {/* Ubicación */}
              <div>
                <label style={labelStyle}>UBICACIÓN EN CASA</label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                }}>
                  {locations.map(loc => {
                    const isSelected = form.locationName === loc.name;
                    return (
                      <div
                        key={loc.id}
                        onClick={() => handleChange('locationName', loc.name)}
                        style={{
                          padding: '10px 6px', borderRadius: '12px', cursor: 'pointer',
                          border: isSelected ? '2px solid #355E45' : '2px solid #E8E0D5',
                          background: isSelected ? '#EDF5EF' : '#FAF8F5',
                          textAlign: 'center', transition: 'all 0.15s',
                        }}
                      >
                        <div style={{ fontSize: '20px', marginBottom: '3px' }}>
                          {LOCATION_ICONS[loc.name] || '📍'}
                        </div>
                        <div style={{
                          fontSize: '12px', fontFamily: 'inherit',
                          fontWeight: isSelected ? 700 : 400,
                          color: isSelected ? '#355E45' : '#666',
                        }}>
                          {loc.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Estado */}
              {isEditing && (
                <div>
                  <label style={labelStyle}>ESTADO DE LA PLANTA</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    {[
                      { value: 'ALIVE', emoji: '💚', label: 'Sana' },
                      { value: 'DRY', emoji: '🏜️', label: 'Seca' },
                      { value: 'SICK', emoji: '🤒', label: 'Enferma' },
                      { value: 'DEAD', emoji: '💀', label: 'Muerta' },
                    ].map(s => {
                      const isSelected = form.status === s.value;
                      return (
                        <div
                          key={s.value}
                          onClick={() => handleChange('status', s.value)}
                          style={{
                            padding: '10px 6px', borderRadius: '12px', cursor: 'pointer',
                            border: isSelected ? '2px solid #355E45' : '2px solid #E8E0D5',
                            background: isSelected ? '#EDF5EF' : '#FAF8F5',
                            textAlign: 'center', transition: 'all 0.15s',
                          }}
                        >
                          <div style={{ fontSize: '20px', marginBottom: '3px' }}>{s.emoji}</div>
                          <div style={{
                            fontSize: '12px', fontFamily: 'inherit',
                            fontWeight: isSelected ? 700 : 400,
                            color: isSelected ? '#355E45' : '#666',
                          }}>
                            {s.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {error && <ErrorBox message={error} />}

              <button
                onClick={handleNextStep}
                style={btnPrimary}
                onMouseEnter={e => e.currentTarget.style.background = '#2D5239'}
                onMouseLeave={e => e.currentTarget.style.background = '#355E45'}
              >
                Siguiente → {isEditing ? 'Cambiar avatar' : 'Elegir avatar'}
              </button>
            </div>
          )}

          {/* ── PASO 2: avatar ── */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Preview */}
              <div style={{
                background: '#F7F3EE', borderRadius: '16px',
                padding: '16px', display: 'flex', alignItems: 'center', gap: '14px',
              }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '14px',
                  background: '#E8F0EA', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '32px', overflow: 'hidden', flexShrink: 0,
                }}>
                  {form.imageUrl
                    ? <img
                      src={form.imageUrl} alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.target.style.display = 'none'; e.target.parentNode.innerText = '🌿'; }}
                    />
                    : '🌿'
                  }
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: '16px', color: '#2D2D2D' }}>
                    {form.nickname}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#888', fontStyle: 'italic' }}>
                    {form.speciesName}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#AAA' }}>
                    📍 {form.locationName}
                  </p>
                </div>
              </div>

              {/* Selector de avatares */}
              <div>
                <label style={labelStyle}>
                  {isEditing ? 'CAMBIAR AVATAR' : 'ELIGE UN AVATAR'}
                </label>
                <AvatarSelector
                  selected={form.imageUrl}
                  onChange={url => handleChange('imageUrl', url)}
                />
                {!form.imageUrl && (
                  <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#AAA', textAlign: 'center' }}>
                    {isEditing ? 'Selecciona un nuevo avatar o deja el actual' : 'Puedes dejarlo sin avatar y añadirlo después'}
                  </p>
                )}
              </div>

              {error && <ErrorBox message={error} />}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    ...btnPrimary,
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    background: isEditing ? '#7D5A3C' : '#355E45',
                  }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.background = isEditing ? '#5C3D1E' : '#2D5239'; }}
                  onMouseLeave={e => { if (!loading) e.currentTarget.style.background = isEditing ? '#7D5A3C' : '#355E45'; }}
                >
                  {loading
                    ? '⏳ Guardando...'
                    : isEditing ? '💾 Guardar cambios' : '✅ Añadir planta'
                  }
                </button>
                <button onClick={() => setStep(1)} style={btnSecondary}>
                  ← Volver atrás
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PlantForm;