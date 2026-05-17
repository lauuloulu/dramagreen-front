import { useState, useEffect } from 'react';
import axios from 'axios';
import WateringInfo from '../components/WateringInfo';

const PlantCard = ({ plant, onClick }) => {
    const { color, label, emoji, ratio } = WateringInfo(plant.lastWatered, plant.wateringFrequency);

    return (
        <div
            onClick={() => onClick(plant)}
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
            {/* Imagen avatar */}
            <div style={{
                height: '110px',
                background: 'linear-gradient(135deg, #E8F5E9, #F1F8E9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
            }}>
                {plant.imageUrl
                    ? <img
                        src={plant.imageUrl} alt={plant.nickname}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.style.display = 'none'; e.target.parentNode.innerText = '🌿'; }}
                    />
                    : <span style={{ fontSize: '52px' }}>🌿</span>
                }
                {/* Badge estado */}
                <div style={{
                    position: 'absolute', top: '8px', right: '8px',
                    background: color + '22', border: `1.5px solid ${color}`,
                    borderRadius: '20px', padding: '2px 8px',
                    fontSize: '11px', fontWeight: 700, color: color,
                    fontFamily: 'inherit',
                }}>
                    {emoji} {label}
                </div>
            </div>

            {/* Info */}
            <div style={{ padding: '12px 14px 14px' }}>
                <p style={{ margin: 0, fontWeight: 800, fontSize: '15px', color: '#2D2D2D', fontFamily: 'inherit' }}>
                    {plant.nickname}
                </p>
                <p style={{ margin: '2px 0 8px', fontSize: '12px', color: '#999', fontStyle: 'italic', fontFamily: 'inherit' }}>
                    {plant.speciesName}
                </p>
                {/* Barra de riego */}
                <div style={{ height: '5px', background: '#EEE', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${Math.round(ratio * 100)}%`,
                        height: '100%', background: color,
                        borderRadius: '3px', transition: 'width 0.5s ease',
                    }} />
                </div>
            </div>
        </div>
    );
};

export default PlantCard;