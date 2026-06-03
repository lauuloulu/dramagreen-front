import { useState, useEffect } from 'react';
import api from '../Api';
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
    TOP_WATERING: '🚿', BOTTOM_WATERING: '🪣',
    MISTING: '💨', SOAKING: '🌊', SELF_WATERING: '⚙️',
};

// ── Subcomponentes ────────────────────────────────────────────────────────
const Section = ({ title, children }) => (
    <div className="section">
        <h3 className="section__title">{title}</h3>
        {children}
    </div>
);

const InfoRow = ({ label, value, valueColor }) => (
    <div className="info-row">
        <span className="info-row__label">{label}</span>
        <span className="info-row__value" style={valueColor ? { color: valueColor } : {}}>
            {value}
        </span>
    </div>
);

const ProgressBar = ({ ratio, color, label, sublabel }) => (
    <div className="detail-progress">
        <div className="detail-progress__header">
            <span className="detail-progress__label">{label}</span>
            <span className="detail-progress__sublabel" style={{ color }}>{sublabel}</span>
        </div>
        <div className="progress">
            <div className="progress__bar" style={{ width: `${Math.round(ratio * 100)}%`, background: color }} />
        </div>
    </div>
);

const Toast = ({ message, type }) => (
    <div className={`toast toast--${type}`}>{message}</div>
);

// ── Modal de riego ────────────────────────────────────────────────────────
const WateringModal = ({ onConfirm, onCancel, loading }) => {
    const [method, setMethod] = useState('TOP_WATERING');
    const [notes, setNotes] = useState('');

    return (
        <div className="modal-overlay modal-overlay--bottom">
            <div className="modal modal--sheet">
                <h3 className="modal__title">💧 Registrar riego</h3>
                <p className="modal__sub">¿Cómo has regado la planta?</p>

                {/* Selector de método */}
                <div className="watering-method-list">
                    {WATERING_METHODS.map(m => {
                        const isSelected = method === m.value;
                        return (
                            <div
                                key={m.value}
                                className={`watering-method-item ${isSelected ? 'watering-method-item--selected' : ''}`}
                                onClick={() => setMethod(m.value)}
                            >
                                <span className="watering-method-item__emoji">{m.emoji}</span>
                                <div className="watering-method-item__info">
                                    <p className="watering-method-item__label">{m.label}</p>
                                    <p className="watering-method-item__desc">{m.description}</p>
                                </div>
                                {isSelected && <div className="watering-method-item__check">✓</div>}
                            </div>
                        );
                    })}
                </div>

                {/* Notas */}
                <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="form-label">
                        Notas <span style={{ fontWeight: 400, color: '#BBB' }}>(opcional)</span>
                    </label>
                    <textarea
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Observaciones del riego, estado de la planta..."
                        maxLength={250}
                        rows={3}
                        className="form-input form-textarea"
                    />
                    <p className="form-hint">{250 - notes.length} caracteres restantes</p>
                </div>

                {/* Botones */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={onCancel} className="btn btn--secondary" style={{ flex: 1 }}>
                        Cancelar
                    </button>
                    <button
                        onClick={() => onConfirm(method, notes)}
                        disabled={loading}
                        className="btn btn--water"
                        style={{ flex: 2 }}
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
    <div className="modal-overlay">
        <div className="modal" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🗑️</div>
            <h3 className="modal__title">¿Borrar {plantName}?</h3>
            <p className="modal__sub">
                Esta acción no se puede deshacer. Se eliminará la planta y todo su historial.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button onClick={onCancel} className="btn btn--secondary" style={{ flex: 1 }}>
                    Cancelar
                </button>
                <button onClick={onConfirm} disabled={loading} className="btn btn--danger" style={{ flex: 1 }}>
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
            const { data } = await api.get(`/plants/${plantId}`);
            setPlant(data);
        } catch {
            showToast('No se pudo cargar la planta', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPlant(); }, [plantId]);

    const handleWater = async (method, notes) => {
        setWateringLoading(true);
        try {
            const { data } = await api.post(
                `/plants/${plantId}/water/detailed`,
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
            const { data } = await api.post(`/plants/${plantId}/fertilize`);
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
            await api.delete(`/plants/${plantId}`);
            onDeleted?.();
        } catch {
            showToast('Error al borrar la planta', 'error');
            setShowDeleteModal(false);
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loading) return (
        <div className="detail-loading">
            <p>Cargando ficha...</p>
        </div>
    );

    if (!plant) return (
        <div className="detail-loading">
            <p style={{ color: 'var(--color-danger)' }}>No se encontró la planta</p>
            <button onClick={onBack} className="btn btn--secondary" style={{ width: 'auto' }}>← Volver</button>
        </div>
    );

    const waterInfo = getWateringInfo(plant.lastWatered, plant.wateringFrequency);
    const fertInfo = getWateringInfo(plant.lastFertilizing, plant.fertilizingFrequency);
    const status = STATUS_LABELS[plant.status] || STATUS_LABELS.ALIVE;
    const light = LIGHT_LABELS[plant.idealLight] || { label: plant.idealLight || '—', emoji: '💡', color: '#888' };

    return (
        <div className="page" style={{ paddingBottom: '40px' }}>

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

            {/* ── Cabecera ── */}
            <div className="detail-header">
                {plant.imageUrl
                    ? <img src={plant.imageUrl} alt={plant.nickname} className="detail-header__img"
                        onError={e => { e.target.style.display = 'none'; }}
                    />
                    : <div className="detail-header__fallback">🌿</div>
                }
                <div className="detail-header__gradient" />

                {/* Botón volver */}
                <div className="detail-header__top detail-header__top--left">
                    <button onClick={onBack} className="btn btn--ghost">← Volver</button>
                </div>

                {/* Botones editar + borrar */}
                <div className="detail-header__top detail-header__top--right">
                    <button onClick={() => onEdit?.(plant)} className="btn btn--ghost" style={{ color: 'var(--color-primary)' }}>
                        ✏️ Editar
                    </button>
                    <button onClick={() => setShowDeleteModal(true)} className="btn btn--danger" style={{ padding: '8px 14px' }}>
                        🗑️
                    </button>
                </div>

                {/* Badge estado */}
                <div
                    className="badge detail-header__status"
                    style={{
                        background: status.color + '22',
                        border: `1.5px solid ${status.color}`,
                        color: status.color,
                    }}
                >
                    {status.emoji} {status.label}
                </div>

                {/* Nombre y especie */}
                <div className="detail-header__info">
                    <h1 className="detail-header__name">{plant.nickname}</h1>
                    <p className="detail-header__species">{plant.speciesName}</p>
                </div>
            </div>

            {/* ── Contenido ── */}
            <div className="detail-content animate-fadeIn">

                {toast && <Toast message={toast.message} type={toast.type} />}

                {/* Botones acción */}
                <div className="detail-actions">
                    <button onClick={() => setShowWateringModal(true)} className="btn btn--water">
                        💧 Regar
                    </button>
                    <button
                        onClick={handleFertilize}
                        disabled={fertilizingLoading}
                        className="btn btn--fertilize"
                    >
                        {fertilizingLoading ? '⏳ ...' : '🌱 Fertilizar'}
                    </button>
                </div>

                {/* Estado de cuidados */}
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
                    <div className="detail-dates">
                        <div className="detail-date-box">
                            <p className="detail-date-box__label">Último riego</p>
                            <p className="detail-date-box__value">{formatDate(plant.lastWatered)}</p>
                        </div>
                        <div className="detail-date-box">
                            <p className="detail-date-box__label">Última fertilización</p>
                            <p className="detail-date-box__value">{formatDate(plant.lastFertilizing)}</p>
                        </div>
                    </div>
                </Section>

                {/* Info básica */}
                <Section title="Información">
                    <InfoRow label="Ubicación" value={`📍 ${plant.locationName}`} />
                    <InfoRow label="Estado" value={`${status.emoji} ${status.label}`} valueColor={status.color} />
                    <InfoRow label="Especie" value={plant.speciesName} />
                </Section>

                {/* Info especie */}
                <Section title="Cuidados de la especie">
                    <InfoRow label="Luz ideal" value={`${light.emoji} ${light.label}`} valueColor={light.color} />
                    <InfoRow label="Humedad" value={plant.humidity ? `${plant.humidity}%` : '—'} />
                    <InfoRow label="Frecuencia riego" value={plant.wateringFrequency ? `Cada ${plant.wateringFrequency} días` : '—'} />
                    <InfoRow label="Frecuencia fertilización" value={plant.fertilizingFrequency ? `Cada ${plant.fertilizingFrequency} días` : '—'} />
                    {plant.description && (
                        <div className="detail-description">
                            <p>"{plant.description}"</p>
                        </div>
                    )}
                </Section>

                {/* Historial */}
                <Section title={`Historial de riegos (${plant.wateringHistory?.length || 0})`}>
                    {!plant.wateringHistory || plant.wateringHistory.length === 0
                        ? <p className="detail-empty-history">Sin riegos registrados</p>
                        : <>
                            {plant.wateringHistory.slice(0, 10).map((log, i) => (
                                <div
                                    key={i}
                                    className={`history-item ${i < Math.min(plant.wateringHistory.length, 10) - 1 ? 'history-item--bordered' : ''}`}
                                >
                                    {/* Dot timeline */}
                                    <div className={`history-dot ${i === 0 ? 'history-dot--recent' : ''}`}>
                                        {METHOD_EMOJI[log.wateringMethod] || '💧'}
                                    </div>

                                    {/* Info */}
                                    <div className="history-info">
                                        <div className="history-info__header">
                                            <p className={`history-info__date ${i === 0 ? 'history-info__date--bold' : ''}`}>
                                                {formatDate(log.wateredAt)}
                                            </p>
                                            {i === 0 && <span className="history-badge">Último</span>}
                                        </div>
                                        {log.wateringMethod && (
                                            <p className="history-info__method">
                                                {METHOD_EMOJI[log.wateringMethod]} {WATERING_METHODS.find(m => m.value === log.wateringMethod)?.label || log.wateringMethod}
                                            </p>
                                        )}
                                        {log.notes && (
                                            <p className="history-info__notes">"{log.notes}"</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {plant.wateringHistory.length > 10 && (
                                <p className="history-more">+{plant.wateringHistory.length - 10} riegos anteriores</p>
                            )}
                        </>
                    }
                </Section>

            </div>
        </div>
    );
};

export default PlantDetail;