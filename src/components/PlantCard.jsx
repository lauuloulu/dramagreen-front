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
        e.stopPropagation();
        setWatering(true);
        try {
            const { data } = await axios.post(
                `http://localhost:9000/api/plants/${localPlant.id}/water`
            );
            setLocalPlant(data);
            onWatered?.();
        } catch (err) {
            console.error('Error al regar:', err);
        } finally {
            setWatering(false);
        }
    };

    return (
        <div className="plant-card" onClick={() => onClick(localPlant)}>

            {/* Avatar */}
            <div className="plant-card__image">
                {localPlant.imageUrl
                    ? <img
                        src={localPlant.imageUrl}
                        alt={localPlant.nickname}
                        onError={e => { e.target.style.display = 'none'; e.target.parentNode.innerText = '🌿'; }}
                    />
                    : <span style={{ fontSize: '52px' }}>🌿</span>
                }
            </div>

            {/* Info */}
            <div className="plant-card__body">
                <p className="plant-card__name">{localPlant.nickname}</p>

                {/* Riego + botón */}
                <div className="plant-card__watering">
                    {/* Días restantes */}
                    <div
                        className="plant-card__watering-info"
                        style={{ background: color + '14' }}
                    >
                        <span style={{ fontSize: '16px' }}>💧</span>
                        <div>
                            <p className="plant-card__watering-label">Próximo riego</p>
                            <p className="plant-card__watering-value" style={{ color }}>
                                {emoji} {label}
                            </p>
                        </div>
                    </div>

                    {/* Botón regar */}
                    <button
                        className={`btn btn--icon plant-card__water-btn ${watering ? 'plant-card__water-btn--loading' : ''}`}
                        onClick={handleWater}
                        disabled={watering}
                        title="Regar planta"
                    >
                        {watering ? '⏳' : '💧'}
                    </button>
                </div>

                {/* Barra de progreso */}
                <div className="progress">
                    <div
                        className="progress__bar"
                        style={{ width: `${Math.round(ratio * 100)}%`, background: color }}
                    />
                </div>
            </div>
        </div>
    );
};

export default PlantCard;