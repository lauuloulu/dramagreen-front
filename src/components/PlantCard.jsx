import { useState } from 'react';
import axios from 'axios';
import { getWateringInfo } from '../utils/WateringUtils';

const PlantCard = ({ plant, onClick, onWatered }) => {
    const [watering, setWatering] = useState(false);
    const [localPlant, setLocalPlant] = useState(plant);

    const { color, label, emoji, ratio } = getWateringInfo(
        localPlant.lastWatered,
        localPlant.wateringFrequency
    );

    const handleWater = async (e) => {
        e.stopPropagation(); // evitar que abra la ficha
        setWatering(true);
        try {
            const { data } = await axios.post(
                `http://localhost:9000/api/plants/${localPlant.id}/water`
            );
            setLocalPlant(data);    // actualizar la card sin recargar
            onWatered?.();          // avisar al dashboard si lo necesita
        } catch (err) {
            console.error('Error al regar:', err);
        } finally {
            setWatering(false);
        }
    };

    return (
        <div
            onClick={() => onClick(localPlant)}
            style={{
                background: '#fff',
                borderRadius: '18px',
                border: '1.5px solid #EDE8E0',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex',
                flexDirection: 'column',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.10)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            {/* Avatar */}
            <div style={{
                height: '110px',
                background: 'linear-gradient(135deg, #E8F5E9, #F1F8E9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
            }}>
                {localPlant.imageUrl
                    ? <img
                        src={localPlant.imageUrl} alt={localPlant.nickname}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.style.display = 'none'; e.target.parentNode.innerText = '🌿'; }}
                    />
                    : <span style={{ fontSize: '52px' }}>🌿</span>
                }
            </div>

            {/* Info */}
            <div style={{ padding: '12px 14px 14px' }}>
                <p style={{ margin: 0, fontWeight: 800, fontSize: '15px', color: '#2D2D2D', fontFamily: 'inherit' }}>
                    {localPlant.nickname}
                </p>

                {/* Días próximo riego + botón regar */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', margin: '10px 0 8px', gap: '8px',
                }}>
                    {/* Izquierda: días */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        background: color + '14', borderRadius: '10px',
                        padding: '6px 10px', flex: 1,
                    }}>
                        <span style={{ fontSize: '16px' }}>💧</span>
                        <div>
                            <p style={{ margin: 0, fontSize: '10px', color: '#AAA', fontFamily: 'inherit' }}>
                                Próximo riego
                            </p>
                            <p style={{ margin: 0, fontSize: '13px', fontWeight: 800, color, fontFamily: 'inherit' }}>
                                {emoji} {label}
                            </p>
                        </div>
                    </div>

                    {/* Derecha: botón regar */}
                    <button
                        onClick={handleWater}
                        disabled={watering}
                        title="Regar planta"
                        style={{
                            width: '38px', height: '38px',
                            borderRadius: '12px',
                            border: 'none',
                            background: watering ? '#E0E0E0' : '#2196F3',
                            color: '#fff',
                            fontSize: '18px',
                            cursor: watering ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                            transition: 'background 0.2s, transform 0.1s',
                        }}
                        onMouseEnter={e => { if (!watering) e.currentTarget.style.background = '#1976D2'; }}
                        onMouseLeave={e => { if (!watering) e.currentTarget.style.background = '#2196F3'; }}
                        onMouseDown={e => { if (!watering) e.currentTarget.style.transform = 'scale(0.92)'; }}
                        onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                    >
                        {watering ? '⏳' : '💧'}
                    </button>
                </div>

                {/* Barra */}
                <div style={{ height: '5px', background: '#EEE', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${Math.round(ratio * 100)}%`,
                        height: '100%', background: color,
                        borderRadius: '3px', transition: 'width 0.5s ease',
                    }}/>
                </div>
            </div>
        </div>
    );
};

export default PlantCard;