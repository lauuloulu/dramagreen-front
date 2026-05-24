import { useState, useEffect } from 'react';
import axios from 'axios';
import { getWateringInfo } from '../utils/WateringUtils';

// ── Utilidades ────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
    if (!dateStr) return 'Nunca';
    return new Date(dateStr).toLocaleDateString('es-ES', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
};

const LIGHT_LABELS = {
    LOW: { label: 'Luz baja', emoji: '🌑', color: '#7B68EE' },
    INDIRECT: { label: 'Indirecta', emoji: '🌥️', color: '#87CEEB' },
    MEDIUM: { label: 'Luz media', emoji: '🌤️', color: '#FFA500' },
    HIGH: { label: 'Luz alta', emoji: '☀️', color: '#FFD700' },
    DIRECT: { label: 'Directa', emoji: '🌞', color: '#FF8C00' },
};

const STATUS_LABELS = {
    ALIVE: { label: 'Saludable', color: '#4CAF50', emoji: '✅' },
    DRY: { label: 'Seca', color: '#F44336', emoji: '🏜️' },
    SICK: { label: 'Enferma', color: '#FFC107', emoji: '🤒' },
    DEAD: { label: 'Muerta', color: '#9E9E9E', emoji: '💀' },
};

const WATERING_METHODS = [
    { value: 'TOP_WATERING', label: 'Por arriba', emoji: '🚿', description: 'Riego directo sobre la tierra' },
    { value: 'BOTTOM_WATERING', label: 'Por abajo', emoji: '🪣', description: 'Sumergir el tiesto en agua' },
    { value: 'MISTING', label: 'Pulverización', emoji: '💨', description: 'Spray sobre hojas y tierra' },
    { value: 'SOAKING', label: 'Empapado', emoji: '🌊', description: 'Riego abundante hasta drenar' },
    { value: 'SELF_WATERING', label: 'Autoriego', emoji: '⚙️', description: 'Sistema de riego automático' },
];

const METHOD_EMOJI = {
    TOP_WATERING: '🚿',
    BOTTOM_WATERING: '🪣',
    MISTING: '💨',
    SOAKING: '🌊',
    SELF_WATERING: '⚙️',
};

// ── Subcomponentes ────────────────────────────────────────────────────────
const Section = ({ title, children }) => (
    <div style={{
        background: '#fff', borderRadius: '20px',
        border: '1px solid #EDE8E0', padding: '20px', marginBottom: '14px',
    }}>
        <h3 style={{
            margin: '0 0 16px', fontSize: '13px', fontWeight: 800,
            color: '#999', letterSpacing: '0.08em',
            textTransform: 'uppercase', fontFamily: 'inherit',
        }}>
            {title}
        </h3>
        {children}
    </div>
);

const InfoRow = ({ label, value, valueColor }) => (
    <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '10px 0',
        borderBottom: '1px solid #F5F0EA',
    }}>
        <span style={{ fontSize: '14px', color: '#888', fontFamily: 'inherit' }}>{label}</span>
        <span style={{ fontSize: '14px', fontWeight: 700, color: valueColor || '#2D2D2D', fontFamily: 'inherit' }}>
            {value}
        </span>
    </div>
);

const ProgressBar = ({ ratio, color, label, sublabel }) => (
    <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '14px', color: '#555', fontFamily: 'inherit' }}>{label}</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color, fontFamily: 'inherit' }}>{sublabel}</span>
        </div>
        <div style={{ height: '8px', background: '#EEE', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
                width: `${Math.round(ratio * 100)}%`, height: '100%',
                background: color, borderRadius: '4px', transition: 'width 0.6s ease',
            }} />
        </div>
    </div>
);

const Toast = ({ message, type }) => (
    <div style={{
        background: type === 'error' ? '#FEF2F2' : '#E8F5E9',
        border: `1.5px solid ${type === 'error' ? '#F44336' : '#4CAF50'}`,
        borderRadius: '12px', padding: '12px 16px', marginBottom: '14px',
        color: type === 'error' ? '#C62828' : '#2E7D32',
        fontSize: '14px', fontWeight: 700, fontFamily: 'inherit',
        animation: 'slideDown 0.3s ease',
    }}>
        {message}
    </div>
);

// ── Modal de riego con método y notas ─────────────────────────────────────
const WateringModal = ({ onConfirm, onCancel, loading }) => {
    const [method, setMethod] = useState('TOP_WATERING');
    const [notes, setNotes] = useState('');

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            zIndex: 1000,
        }}>
            <div style={{
                background: '#fff', borderRadius: '24px 24px 0 0',
                padding: '28px', width: '100%', maxWidth: '500px',
                boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
                animation: 'slideUp 0.3s ease',
            }}>
                <h3 style={{
                    margin: '0 0 4px', fontSize: '18px', fontWeight: 800,
                    color: '#2D2D2D', fontFamily: 'inherit',
                }}>
                    💧 Registrar riego
                </h3>
                <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#AAA', fontFamily: 'inherit' }}>
                    ¿Cómo has regado la planta?
                </p>

                {/* Selector método */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                    {WATERING_METHODS.map(m => {
                        const isSelected = method === m.value;
                        return (
                            <div
                                key={m.value}
                                onClick={() => setMethod(m.value)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: '12px 14px', borderRadius: '12px', cursor: 'pointer',
                                    border: isSelected ? '2px solid #2196F3' : '2px solid #E8E0D5',
                                    background: isSelected ? '#E3F2FD' : '#FAF8F5',
                                    transition: 'all 0.15s',
                                }}
                            >
                                <span style={{ fontSize: '20px' }}>{m.emoji}</span>
                                <div style={{ flex: 1 }}>
                                    <p style={{
                                        margin: 0, fontSize: '14px', fontFamily: 'inherit',
                                        fontWeight: isSelected ? 700 : 600,
                                        color: isSelected ? '#1565C0' : '#2D2D2D',
                                    }}>
                                        {m.label}
                                    </p>
                                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#AAA', fontFamily: 'inherit' }}>
                                        {m.description}
                                    </p>
                                </div>
                                {isSelected && (
                                    <div style={{
                                        width: '20px', height: '20px', borderRadius: '50%',
                                        background: '#2196F3', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        fontSize: '11px', color: '#fff', fontWeight: 700, flexShrink: 0,
                                    }}>✓</div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Notas */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{
                        display: 'block', fontSize: '13px', fontWeight: 700,
                        color: '#5C5047', marginBottom: '6px',
                        fontFamily: 'inherit', letterSpacing: '0.02em',
                    }}>
                        NOTAS <span style={{ fontWeight: 400, color: '#BBB' }}>(opcional)</span>
                    </label>
                    <textarea
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Observaciones del riego, estado de la planta..."
                        maxLength={250}
                        rows={3}
                        style={{
                            width: '100%', padding: '12px 14px',
                            border: '1.5px solid #DDD5C8', borderRadius: '12px',
                            fontSize: '14px', fontFamily: 'inherit',
                            resize: 'none', boxSizing: 'border-box',
                            outline: 'none', lineHeight: 1.5,
                        }}
                    />
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#CCC', fontFamily: 'inherit' }}>
                        {250 - notes.length} caracteres restantes
                    </p>
                </div>

                {/* Botones */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={onCancel}
                        style={{
                            flex: 1, padding: '13px', borderRadius: '12px',
                            border: '1.5px solid #DDD', background: '#fff',
                            fontSize: '14px', fontWeight: 700,
                            cursor: 'pointer', fontFamily: 'inherit',
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => onConfirm(method, notes)}
                        disabled={loading}
                        style={{
                            flex: 2, padding: '13px', borderRadius: '12px',
                            border: 'none', background: '#2196F3', color: '#fff',
                            fontSize: '14px', fontWeight: 700,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit', opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? '⏳ Regando...' : '💧 Confirmar riego'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Modal borrar ──────────────────────────────────────────────────────────
const DeleteModal = ({ plantName, onConfirm, onCancel, loading }) => (
    <div style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '20px',
    }}>
        <div style={{
            background: '#fff', borderRadius: '20px',
            padding: '28px', maxWidth: '360px', width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🗑️</div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#2D2D2D', fontFamily: 'inherit' }}>
                    ¿Borrar {plantName}?
                </h3>
                <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#888', fontFamily: 'inherit' }}>
                    Esta acción no se puede deshacer. Se eliminará la planta y todo su historial.
                </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={onCancel} style={{
                    flex: 1, padding: '12px', borderRadius: '12px',
                    border: '1.5px solid #DDD', background: '#fff',
                    fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                }}>
                    Cancelar
                </button>
                <button onClick={onConfirm} disabled={loading} style={{
                    flex: 1, padding: '12px', borderRadius: '12px',
                    border: 'none', background: '#F44336', color: '#fff',
                    fontSize: '14px', fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit', opacity: loading ? 0.7 : 1,
                }}>
                    {loading ? '⏳ Borrando...' : '🗑️ Sí, borrar'}
                </button>
            </div>
        </div>
    </div>
);

// ── Componente principal ──────────────────────────────────────────────────
const PlantDetail = ({ plantId, onBack, onEdit, onDeleted }) => {
    const [plant, setPlant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showWateringModal, setShowWateringModal] = useState(false);
    const [wateringLoading, setWateringLoading] = useState(false);
    const [fertilizingLoading, setFertilizingLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchPlant = async () => {
        try {
            const { data } = await axios.get(`http://localhost:9000/api/plants/${plantId}`);
            setPlant(data);
        } catch {
            showToast('No se pudo cargar la planta', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPlant(); }, [plantId]);

    // Riego detallado con método y notas
    const handleWater = async (method, notes) => {
        setWateringLoading(true);
        try {
            const { data } = await axios.post(
                `http://localhost:9000/api/plants/${plantId}/water/detailed`,
                null,
                { params: { method, ...(notes?.trim() && { notes }) } }
            );
            setPlant(data);
            setShowWateringModal(false);
            showToast('¡Planta regada! 💧');
        } catch {
            showToast('Error al regar la planta', 'error');
        } finally {
            setWateringLoading(false);
        }
    };

    const handleFertilize = async () => {
        setFertilizingLoading(true);
        try {
            const { data } = await axios.post(`http://localhost:9000/api/plants/${plantId}/fertilize`);
            setPlant(data);
            showToast('¡Planta fertilizada! 🌱');
        } catch {
            showToast('Error al fertilizar la planta', 'error');
        } finally {
            setFertilizingLoading(false);
        }
    };

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            await axios.delete(`http://localhost:9000/api/plants/${plantId}`);
            onDeleted?.();
        } catch {
            showToast('Error al borrar la planta', 'error');
            setShowDeleteModal(false);
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loading) return (
        <div style={{
            minHeight: '100vh', background: '#F2EDE6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Nunito', sans-serif",
        }}>
            <p style={{ color: '#888', fontSize: '16px' }}>Cargando ficha...</p>
        </div>
    );

    if (!plant) return (
        <div style={{
            minHeight: '100vh', background: '#F2EDE6',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '16px',
            fontFamily: "'Nunito', sans-serif",
        }}>
            <p style={{ color: '#F44336', fontSize: '16px' }}>No se encontró la planta</p>
            <button onClick={onBack} style={{
                padding: '10px 20px', borderRadius: '10px',
                cursor: 'pointer', fontFamily: 'inherit',
            }}>← Volver</button>
        </div>
    );

    const waterInfo = getWateringInfo(plant.lastWatered, plant.wateringFrequency);
    const fertInfo = getWateringInfo(plant.lastFertilizing, plant.fertilizingFrequency);
    const status = STATUS_LABELS[plant.status] || STATUS_LABELS.ALIVE;
    const light = LIGHT_LABELS[plant.idealLight] || { label: plant.idealLight || '—', emoji: '💡', color: '#888' };

    return (
        <div style={{
            minHeight: '100vh', background: '#F2EDE6',
            fontFamily: "'Nunito', sans-serif", paddingBottom: '40px',
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
                @keyframes fadeIn    { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideUp   { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
                textarea:focus { border-color: #2196F3 !important; outline: none; box-shadow: 0 0 0 3px #2196F320; }
            `}</style>

            {/* Modales */}
            {showWateringModal && (
                <WateringModal
                    onConfirm={handleWater}
                    onCancel={() => setShowWateringModal(false)}
                    loading={wateringLoading}
                />
            )}
            {showDeleteModal && (
                <DeleteModal
                    plantName={plant.nickname}
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeleteModal(false)}
                    loading={deleteLoading}
                />
            )}

            {/* ── Cabecera con imagen ── */}
            <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
                {plant.imageUrl
                    ? <img src={plant.imageUrl} alt={plant.nickname}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.style.display = 'none'; }}
                    />
                    : <div style={{
                        width: '100%', height: '100%',
                        background: 'linear-gradient(135deg, #2D5239, #4A7C5E)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '100px',
                    }}>🌿</div>
                }
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)',
                }} />
                <button onClick={onBack} style={{
                    position: 'absolute', top: '16px', left: '16px',
                    background: 'rgba(255,255,255,0.9)', border: 'none',
                    borderRadius: '10px', padding: '8px 14px',
                    cursor: 'pointer', fontSize: '14px', fontWeight: 700,
                    fontFamily: 'inherit', color: '#2D2D2D',
                }}>← Volver</button>
                <div style={{
                    position: 'absolute', top: '16px', right: '16px',
                    display: 'flex', gap: '8px',
                }}>
                    <button onClick={() => onEdit?.(plant)} style={{
                        background: 'rgba(255,255,255,0.9)', border: 'none',
                        borderRadius: '10px', padding: '8px 14px',
                        cursor: 'pointer', fontSize: '14px', fontWeight: 700,
                        fontFamily: 'inherit', color: '#355E45',
                    }}>✏️ Editar</button>
                    <button onClick={() => setShowDeleteModal(true)} style={{
                        background: 'rgba(244,67,54,0.9)', border: 'none',
                        borderRadius: '10px', padding: '8px 14px',
                        cursor: 'pointer', fontSize: '14px', fontWeight: 700,
                        fontFamily: 'inherit', color: '#fff',
                    }}>🗑️</button>
                </div>
                <div style={{
                    position: 'absolute', bottom: '60px', right: '16px',
                    background: status.color + '22', border: `1.5px solid ${status.color}`,
                    borderRadius: '20px', padding: '4px 12px',
                    fontSize: '13px', fontWeight: 700, color: status.color, fontFamily: 'inherit',
                }}>
                    {status.emoji} {status.label}
                </div>
                <div style={{ position: 'absolute', bottom: '20px', left: '20px' }}>
                    <h1 style={{
                        margin: 0, color: '#fff', fontSize: '28px', fontWeight: 900,
                        textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                    }}>{plant.nickname}</h1>
                    <p style={{
                        margin: '4px 0 0', color: 'rgba(255,255,255,0.85)',
                        fontSize: '15px', fontStyle: 'italic',
                        textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                    }}>{plant.speciesName}</p>
                </div>
            </div>

            {/* ── Contenido ── */}
            <div style={{ padding: '16px 16px 0', animation: 'fadeIn 0.4s ease' }}>

                {toast && <Toast message={toast.message} type={toast.type} />}

                {/* ── Botones de acción ── */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                    <button
                        onClick={() => setShowWateringModal(true)} // ← abre el modal
                        style={{
                            flex: 1, padding: '14px', borderRadius: '14px',
                            border: 'none', background: '#2196F3', color: '#fff',
                            fontSize: '15px', fontWeight: 700, fontFamily: 'inherit',
                            cursor: 'pointer', transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#1976D2'}
                        onMouseLeave={e => e.currentTarget.style.background = '#2196F3'}
                    >
                        💧 Regar
                    </button>
                    <button
                        onClick={handleFertilize}
                        disabled={fertilizingLoading}
                        style={{
                            flex: 1, padding: '14px', borderRadius: '14px',
                            border: 'none', background: '#4CAF50', color: '#fff',
                            fontSize: '15px', fontWeight: 700, fontFamily: 'inherit',
                            cursor: fertilizingLoading ? 'not-allowed' : 'pointer',
                            opacity: fertilizingLoading ? 0.7 : 1, transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => { if (!fertilizingLoading) e.currentTarget.style.background = '#388E3C'; }}
                        onMouseLeave={e => { if (!fertilizingLoading) e.currentTarget.style.background = '#4CAF50'; }}
                    >
                        {fertilizingLoading ? '⏳ ...' : '🌱 Fertilizar'}
                    </button>
                </div>

                {/* ── Estado de cuidados ── */}
                <Section title="Estado de cuidados">
                    <ProgressBar
                        ratio={waterInfo.ratio} color={waterInfo.color}
                        label={`💧 Riego · cada ${plant.wateringFrequency} días`}
                        sublabel={`Próximo: ${waterInfo.label}`}
                    />
                    <ProgressBar
                        ratio={fertInfo.ratio} color={fertInfo.color}
                        label={`🌱 Fertilización · cada ${plant.fertilizingFrequency} días`}
                        sublabel={`Próximo: ${fertInfo.label}`}
                    />
                    <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                        <div style={{
                            flex: 1, background: '#F7F3EE', borderRadius: '12px',
                            padding: '12px', textAlign: 'center',
                        }}>
                            <p style={{ margin: 0, fontSize: '12px', color: '#999', fontFamily: 'inherit' }}>Último riego</p>
                            <p style={{ margin: '4px 0 0', fontSize: '14px', fontWeight: 700, color: '#2D2D2D', fontFamily: 'inherit' }}>
                                {formatDate(plant.lastWatered)}
                            </p>
                        </div>
                        <div style={{
                            flex: 1, background: '#F7F3EE', borderRadius: '12px',
                            padding: '12px', textAlign: 'center',
                        }}>
                            <p style={{ margin: 0, fontSize: '12px', color: '#999', fontFamily: 'inherit' }}>Última fertilización</p>
                            <p style={{ margin: '4px 0 0', fontSize: '14px', fontWeight: 700, color: '#2D2D2D', fontFamily: 'inherit' }}>
                                {formatDate(plant.lastFertilizing)}
                            </p>
                        </div>
                    </div>
                </Section>

                {/* ── Info básica ── */}
                <Section title="Información">
                    <InfoRow label="Ubicación" value={`📍 ${plant.locationName}`} />
                    <InfoRow label="Estado" value={`${status.emoji} ${status.label}`} valueColor={status.color} />
                    <InfoRow label="Especie" value={plant.speciesName} />
                </Section>

                {/* ── Info de la especie ── */}
                <Section title="Cuidados de la especie">
                    <InfoRow label="Luz ideal" value={`${light.emoji} ${light.label}`} valueColor={light.color} />
                    <InfoRow label="Humedad" value={plant.humidity ? `${plant.humidity}%` : '—'} />
                    <InfoRow label="Frecuencia riego" value={plant.wateringFrequency ? `Cada ${plant.wateringFrequency} días` : '—'} />
                    <InfoRow label="Frecuencia fertilización" value={plant.fertilizingFrequency ? `Cada ${plant.fertilizingFrequency} días` : '—'} />
                    {plant.description && (
                        <div style={{
                            marginTop: '12px', padding: '14px',
                            background: '#F7F3EE', borderRadius: '12px',
                        }}>
                            <p style={{
                                margin: 0, fontSize: '14px', color: '#555',
                                lineHeight: 1.6, fontStyle: 'italic', fontFamily: 'inherit',
                            }}>"{plant.description}"</p>
                        </div>
                    )}
                </Section>

                {/* ── Historial de riegos ── */}
                <Section title={`Historial de riegos (${plant.wateringHistory?.length || 0})`}>
                    {!plant.wateringHistory || plant.wateringHistory.length === 0
                        ? <p style={{
                            margin: 0, color: '#BBB', fontSize: '14px',
                            textAlign: 'center', padding: '12px 0', fontFamily: 'inherit',
                        }}>
                            Sin riegos registrados
                        </p>
                        : <>
                            {plant.wateringHistory.slice(0, 10).map((log, i) => (
                                <div key={i} style={{
                                    display: 'flex', gap: '12px', padding: '12px 0',
                                    borderBottom: i < Math.min(plant.wateringHistory.length, 10) - 1
                                        ? '1px solid #F5F0EA' : 'none',
                                }}>
                                    {/* Indicador timeline */}
                                    <div style={{
                                        display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', flexShrink: 0, paddingTop: '3px',
                                    }}>
                                        <div style={{
                                            width: '28px', height: '28px', borderRadius: '50%',
                                            background: i === 0 ? '#E3F2FD' : '#F5F5F5',
                                            border: `2px solid ${i === 0 ? '#2196F3' : '#DDD'}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '13px',
                                        }}>
                                            {METHOD_EMOJI[log.wateringMethod] || '💧'}
                                        </div>
                                    </div>

                                    {/* Info del riego */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <p style={{
                                                margin: 0, fontSize: '14px', fontFamily: 'inherit',
                                                fontWeight: i === 0 ? 700 : 500, color: '#2D2D2D',
                                            }}>
                                                {formatDate(log.wateredAt)}
                                            </p>
                                            {i === 0 && (
                                                <span style={{
                                                    fontSize: '11px', fontWeight: 700, color: '#2196F3',
                                                    background: '#E3F2FD', padding: '2px 8px',
                                                    borderRadius: '20px', fontFamily: 'inherit',
                                                }}>Último</span>
                                            )}
                                        </div>
                                        {log.wateringMethod && (
                                            <p style={{
                                                margin: '3px 0 0', fontSize: '12px', color: '#888',
                                                fontFamily: 'inherit',
                                            }}>
                                                {METHOD_EMOJI[log.wateringMethod]} {
                                                    WATERING_METHODS.find(m => m.value === log.wateringMethod)?.label || log.wateringMethod
                                                }
                                            </p>
                                        )}
                                        {log.notes && (
                                            <p style={{
                                                margin: '6px 0 0', fontSize: '13px', color: '#555',
                                                fontStyle: 'italic', fontFamily: 'inherit',
                                                background: '#F7F3EE', padding: '6px 10px',
                                                borderRadius: '8px', lineHeight: 1.4,
                                            }}>
                                                "{log.notes}"
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {plant.wateringHistory.length > 10 && (
                                <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#AAA', textAlign: 'center', fontFamily: 'inherit' }}>
                                    +{plant.wateringHistory.length - 10} riegos anteriores
                                </p>
                            )}
                        </>
                    }
                </Section>

            </div>
        </div>
    );
};

export default PlantDetail;