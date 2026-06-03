import { useState } from 'react';
import api from '../Api';
import { inputStyle, btnPrimary } from '../styles/formStyles';
import ErrorBox from './ErrorBox';

// ── Opciones de luz ───────────────────────────────────────────────────────
const LIGHT_OPTIONS = [
    { value: 'LOW', label: 'Baja', emoji: '🌑', description: 'Rincones alejados de ventanas' },
    { value: 'INDIRECT', label: 'Indirecta', emoji: '🌥️', description: 'Cerca de ventana sin sol directo' },
    { value: 'MEDIUM', label: 'Media', emoji: '🌤️', description: 'Luz natural moderada' },
    { value: 'HIGH', label: 'Alta', emoji: '☀️', description: 'Mucha luz, casi directa' },
    { value: 'DIRECT', label: 'Directa', emoji: '🌞', description: 'Sol directo varias horas' },
];

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

// ── Stepper numérico ──────────────────────────────────────────────────────
const NumberStepper = ({ value, onChange, min = 1, max = 365, unit }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
            type="button"
            onClick={() => onChange(Math.max(min, value - 1))}
            style={{
                width: '38px', height: '38px', borderRadius: '10px',
                border: '1.5px solid #DDD5C8', background: '#FAF8F5',
                fontSize: '18px', cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
        >−</button>
        <div style={{ textAlign: 'center', minWidth: '80px' }}>
            <span style={{ fontSize: '22px', fontWeight: 800, color: '#355E45', fontFamily: 'inherit' }}>
                {value}
            </span>
            <span style={{ fontSize: '13px', color: '#AAA', marginLeft: '4px', fontFamily: 'inherit' }}>
                {unit}
            </span>
        </div>
        <button
            type="button"
            onClick={() => onChange(Math.min(max, value + 1))}
            style={{
                width: '38px', height: '38px', borderRadius: '10px',
                border: '1.5px solid #DDD5C8', background: '#FAF8F5',
                fontSize: '18px', cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
        >+</button>
    </div>
);

// ── Componente principal ──────────────────────────────────────────────────
const SpeciesForm = ({ onSuccess, onCancel }) => {
    const [form, setForm] = useState({
        commonName: '',
        scientificName: '',
        wateringFrequency: 7,
        fertilizingFrequency: 30,
        humidity: 50,
        description: '',
        idealLight: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1); // 1: nombres, 2: cuidados, 3: descripción

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const validateStep1 = () => {
        if (!form.commonName.trim()) return 'El nombre común es obligatorio';
        if (!form.scientificName.trim()) return 'El nombre científico es obligatorio';
        return '';
    };

    const validateStep2 = () => {
        if (!form.idealLight) return 'Selecciona el tipo de luz ideal';
        return '';
    };

    const handleNext = () => {
        const err = step === 1 ? validateStep1() : validateStep2();
        if (err) { setError(err); return; }
        setStep(s => s + 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            await api.post(`${import.meta.env.VITE_API_URL}/species`, form);
            onSuccess?.();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al guardar la especie');
        } finally {
            setLoading(false);
        }
    };

    const STEP_TITLES = {
        1: { title: '🌿 Nueva especie', subtitle: 'Identificación de la planta' },
        2: { title: '💧 Cuidados', subtitle: 'Luz, agua y nutrientes' },
        3: { title: '📝 Descripción', subtitle: 'Cuéntanos más sobre ella' },
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
        input:focus, textarea:focus { border-color: #355E45 !important; box-shadow: 0 0 0 3px #355E4520; }
        input[type=range] { accent-color: #355E45; }
      `}</style>

            <div style={{
                width: '100%', maxWidth: '480px',
                background: '#fff', borderRadius: '24px',
                border: '1px solid #EDE8E0',
                boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
                overflow: 'hidden',
            }}>

                {/* ── Cabecera ── */}
                <div style={{
                    background: 'linear-gradient(135deg, #2D5239 0%, #4A7C5E 100%)',
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
                        {STEP_TITLES[step].title}
                    </h1>
                    <p style={{ margin: '6px 0 16px', color: '#A8C9B0', fontSize: '14px' }}>
                        {STEP_TITLES[step].subtitle}
                    </p>
                    {/* Indicador de pasos */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                        {[1, 2, 3].map(s => (
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

                    {/* ── PASO 1: Nombres ── */}
                    {step === 1 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={labelStyle}>NOMBRE COMÚN</label>
                                <input
                                    type="text"
                                    placeholder="ej. Monstera, Pothos, Cactus..."
                                    value={form.commonName}
                                    onChange={e => handleChange('commonName', e.target.value)}
                                    style={inputStyle}
                                    maxLength={60}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>NOMBRE CIENTÍFICO</label>
                                <input
                                    type="text"
                                    placeholder="ej. Monstera deliciosa"
                                    value={form.scientificName}
                                    onChange={e => handleChange('scientificName', e.target.value)}
                                    style={{ ...inputStyle, fontStyle: form.scientificName ? 'italic' : 'normal' }}
                                    maxLength={80}
                                />
                                <p style={{ margin: '4px 0 0 4px', fontSize: '12px', color: '#AAA', fontFamily: 'inherit' }}>
                                    En latín, ej: Monstera deliciosa
                                </p>
                            </div>

                            {error && <ErrorBox message={error} />}

                            <button
                                onClick={handleNext}
                                style={btnPrimary}
                                onMouseEnter={e => e.currentTarget.style.background = '#2D5239'}
                                onMouseLeave={e => e.currentTarget.style.background = '#355E45'}
                            >
                                Siguiente → Cuidados
                            </button>
                        </div>
                    )}

                    {/* ── PASO 2: Cuidados ── */}
                    {step === 2 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                            {/* Luz ideal */}
                            <div>
                                <label style={labelStyle}>LUZ IDEAL</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {LIGHT_OPTIONS.map(opt => {
                                        const isSelected = form.idealLight === opt.value;
                                        return (
                                            <div
                                                key={opt.value}
                                                onClick={() => handleChange('idealLight', opt.value)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '12px',
                                                    padding: '12px 14px', borderRadius: '12px', cursor: 'pointer',
                                                    border: isSelected ? '2px solid #355E45' : '2px solid #E8E0D5',
                                                    background: isSelected ? '#EDF5EF' : '#FAF8F5',
                                                    transition: 'all 0.15s',
                                                }}
                                            >
                                                <span style={{ fontSize: '22px' }}>{opt.emoji}</span>
                                                <div style={{ flex: 1 }}>
                                                    <p style={{
                                                        margin: 0, fontSize: '14px', fontFamily: 'inherit',
                                                        fontWeight: isSelected ? 700 : 600,
                                                        color: isSelected ? '#355E45' : '#2D2D2D',
                                                    }}>
                                                        {opt.label}
                                                    </p>
                                                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#AAA', fontFamily: 'inherit' }}>
                                                        {opt.description}
                                                    </p>
                                                </div>
                                                {isSelected && (
                                                    <div style={{
                                                        width: '20px', height: '20px', borderRadius: '50%',
                                                        background: '#355E45', display: 'flex',
                                                        alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '11px', color: '#fff', fontWeight: 700, flexShrink: 0,
                                                    }}>✓</div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Frecuencia de riego */}
                            <div>
                                <label style={labelStyle}>FRECUENCIA DE RIEGO</label>
                                <NumberStepper
                                    value={form.wateringFrequency}
                                    onChange={v => handleChange('wateringFrequency', v)}
                                    min={1} max={90}
                                    unit="días"
                                />
                            </div>

                            {/* Frecuencia de fertilización */}
                            <div>
                                <label style={labelStyle}>FRECUENCIA DE FERTILIZACIÓN</label>
                                <NumberStepper
                                    value={form.fertilizingFrequency}
                                    onChange={v => handleChange('fertilizingFrequency', v)}
                                    min={1} max={365}
                                    unit="días"
                                />
                            </div>

                            {/* Humedad */}
                            <div>
                                <label style={labelStyle}>
                                    HUMEDAD IDEAL
                                    <span style={{ fontWeight: 400, marginLeft: '8px', color: '#355E45' }}>
                                        {form.humidity}%
                                    </span>
                                </label>
                                <input
                                    type="range"
                                    min={0} max={100} step={5}
                                    value={form.humidity}
                                    onChange={e => handleChange('humidity', parseInt(e.target.value))}
                                    style={{ width: '100%', cursor: 'pointer' }}
                                />
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between',
                                    fontSize: '12px', color: '#AAA', fontFamily: 'inherit', marginTop: '4px',
                                }}>
                                    <span>🏜️ Seco</span>
                                    <span>🌿 Moderado</span>
                                    <span>🌊 Húmedo</span>
                                </div>
                            </div>

                            {error && <ErrorBox message={error} />}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <button
                                    onClick={handleNext}
                                    style={btnPrimary}
                                    onMouseEnter={e => e.currentTarget.style.background = '#2D5239'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#355E45'}
                                >
                                    Siguiente → Descripción
                                </button>
                                <button onClick={() => setStep(1)} style={btnSecondary}>← Volver atrás</button>
                            </div>
                        </div>
                    )}

                    {/* ── PASO 3: Descripción ── */}
                    {step === 3 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                            {/* Preview */}
                            <div style={{
                                background: '#F7F3EE', borderRadius: '16px',
                                padding: '16px',
                            }}>
                                <p style={{ margin: '0 0 4px', fontWeight: 800, fontSize: '16px', color: '#2D2D2D', fontFamily: 'inherit' }}>
                                    {form.commonName}
                                </p>
                                <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#888', fontStyle: 'italic', fontFamily: 'inherit' }}>
                                    {form.scientificName}
                                </p>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {form.idealLight && (
                                        <span style={{
                                            fontSize: '12px', background: '#fff',
                                            border: '1px solid #EDE8E0', borderRadius: '20px',
                                            padding: '2px 10px', fontFamily: 'inherit',
                                        }}>
                                            {LIGHT_OPTIONS.find(l => l.value === form.idealLight)?.emoji} {LIGHT_OPTIONS.find(l => l.value === form.idealLight)?.label}
                                        </span>
                                    )}
                                    <span style={{
                                        fontSize: '12px', background: '#fff',
                                        border: '1px solid #EDE8E0', borderRadius: '20px',
                                        padding: '2px 10px', fontFamily: 'inherit',
                                    }}>
                                        💧 cada {form.wateringFrequency}d
                                    </span>
                                    <span style={{
                                        fontSize: '12px', background: '#fff',
                                        border: '1px solid #EDE8E0', borderRadius: '20px',
                                        padding: '2px 10px', fontFamily: 'inherit',
                                    }}>
                                        💦 {form.humidity}%
                                    </span>
                                </div>
                            </div>

                            {/* Descripción */}
                            <div>
                                <label style={labelStyle}>
                                    DESCRIPCIÓN
                                    <span style={{ fontWeight: 400, marginLeft: '6px', color: '#BBB' }}>(opcional)</span>
                                </label>
                                <textarea
                                    placeholder="Cuéntanos sobre esta planta: origen, características, curiosidades..."
                                    value={form.description}
                                    onChange={e => handleChange('description', e.target.value)}
                                    maxLength={500}
                                    rows={5}
                                    style={{
                                        ...inputStyle,
                                        resize: 'vertical',
                                        lineHeight: 1.6,
                                        minHeight: '120px',
                                    }}
                                />
                                <p style={{ margin: '4px 0 0 4px', fontSize: '12px', color: '#AAA', fontFamily: 'inherit' }}>
                                    {500 - (form.description?.length || 0)} caracteres restantes
                                </p>
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
                                    }}
                                    onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#2D5239'; }}
                                    onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#355E45'; }}
                                >
                                    {loading ? '⏳ Guardando...' : '✅ Crear especie'}
                                </button>
                                <button onClick={() => setStep(2)} style={btnSecondary}>← Volver atrás</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SpeciesForm;