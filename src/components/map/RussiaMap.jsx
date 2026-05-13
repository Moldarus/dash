// src/components/Map/RussiaMap.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RussiaMapImage from '../../assets/russia-map.svg';
import { getPlantByRegion } from '../../data/regionsData';

export default function RussiaMap() {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const navigate = useNavigate();

  const handleRegionClick = (regionId, regionName) => {
    const plant = getPlantByRegion(regionId);
    
    if (plant) {
      localStorage.setItem('selectedPlant', JSON.stringify(plant));
      localStorage.setItem('selectedRegion', JSON.stringify({
        regionId,
        regionName
      }));
      navigate('/dashboard');
    }
  };

  // Маркеры с координатами в процентах (0-100%)
  const activeMarkers = [
    { id: 'RU-VGG', name: 'Воронежская область', label: 'ВТРЗ', x:  23.1, y: 53.6, hasPlant: true },
    { id: 'RU-YAR', name: 'Ярославская область', label: 'ЯЭРЗ', x: 27.3, y: 45.6, hasPlant: true },
    { id: 'RU-ROS', name: 'Ростовская область', label: 'РЭРЗ', x: 21, y: 58, hasPlant: true },
    { id: 'RU-ULY', name: 'Приморском край', label: 'УЛРЗ', x: 74.3, y: 76, hasPlant: true },
    { id: 'RU-ALT', name: 'Астраханская область', label: 'АТРЗ', x: 23.4, y: 64.3, hasPlant: true },
    { id: 'RU-CHE', name: 'Челябинская область', label: 'ЧЭРЗ', x: 33.8, y: 61.5, hasPlant: true },
    { id: 'RU-ORE', name: 'Оренбургская область', label: 'ОЛРЗ', x: 29.5, y: 62, hasPlant: true },
    { id: 'RU-UUD', name: 'Республика Бурятия', label: 'УУЛВРЗ', x: 59, y: 70, hasPlant: true },
  ];

  return (
    <div className="map-wrapper" style={{ width: '100%', padding: '20px', background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)', borderRadius: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'auto' }}>
      <div className="map-container" onContextMenu={(e) => e.preventDefault()} style={{ width: '1600px', height: '900px', minWidth: '1600px', minHeight: '900px', position: 'relative', background: '#ffffff', borderRadius: '16px', overflow: 'hidden', border: '2px solid #dee2e6', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)', userSelect: 'none', WebkitUserSelect: 'none', transition: 'box-shadow 0.3s ease' }}>
        
        {/* Заголовок карты */}
        <div style={{ position: 'absolute', top: '0', left: '0', right: '0', padding: '15px 20px', background: 'linear-gradient(135deg, #2c5aa0 0%, #1e40af 100%)', color: '#ffffff', zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Карта заводов для аудита</h3>
          <p style={{ margin: '5px 0 0 0', fontSize: '13px', opacity: 0.9 }}>Выберите регион для просмотра результатов</p>
        </div>

        {/* Карта */}
        <img src={RussiaMapImage} alt="Карта России" draggable={false} onDragStart={(e) => e.preventDefault()} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '60px 40px 40px 40px', pointerEvents: 'none', WebkitUserDrag: 'none' }} />

        {/* Маркеры */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', padding: '60px 40px 40px 40px', boxSizing: 'border-box' }}>
          {activeMarkers.map((region) => (
            <div key={region.id} onClick={() => handleRegionClick(region.id, region.name)} onMouseEnter={() => setHoveredRegion(region.name)} onMouseLeave={() => setHoveredRegion(null)} style={{ position: 'absolute', left: `${region.x}%`, top: `${region.y}%`, transform: 'translate(-50%, -50%)', cursor: 'pointer', pointerEvents: 'auto', zIndex: 10 }}>
              {/* Пульсирующий фон */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(44, 90, 160, 0.3)', animation: 'pulse 2s infinite', pointerEvents: 'none' }} />
              {/* Основная точка */}
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'linear-gradient(135deg, #2c5aa0 0%, #1e40af 100%)', border: '4px solid #ffffff', boxShadow: '0 4px 12px rgba(44, 90, 160, 0.4)', transition: 'all 0.2s ease' }} />
              {/* ✅ Подпись под точкой (уменьшенная) */}
              <div style={{ 
                position: 'absolute',
                top: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '13px',  /* ✅ Было 13px → стало 10px */
                fontWeight: '600', /* ✅ Было bold → стало 600 */
                color: '#030303',
                whiteSpace: 'nowrap',
                background: 'rgba(255,255,255,0.9)',
                padding: '2px 6px',  /* ✅ Было 4px 12px → стало 2px 6px */
                borderRadius: '4px',
                border: '1px solid #2c5aa0',
                pointerEvents: 'none',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
              }}>
                {region.label}
              </div>
            </div>
          ))}
        </div>

        {/* Тултип */}
        {hoveredRegion && (
          <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #2c5aa0 0%, #1e40af 100%)', color: '#ffffff', padding: '12px 24px', borderRadius: '8px', fontSize: '15px', fontWeight: '500', zIndex: 1000, boxShadow: '0 4px 16px rgba(44, 90, 160, 0.3)' }}>
            {hoveredRegion} — Завод активен
          </div>
        )}

        {/* Легенда */}
        <div style={{ position: 'absolute', top: '80px', right: '20px', background: 'rgba(255, 255, 255, 0.98)', color: '#000000', padding: '15px', borderRadius: '10px', fontSize: '13px', zIndex: 100, border: '1px solid #dee2e6', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div style={{ fontWeight: '600', marginBottom: '10px', color: '#2c5aa0' }}>Легенда</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: 'linear-gradient(135deg, #2c5aa0 0%, #1e40af 100%)', border: '2px solid #fff', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', display: 'inline-block' }}></span>
            <span>Завод для аудита</span>
          </div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #eee' }}>Кликните на маркер для просмотра</div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          50% { transform: translate(-50%, -50%) scale(1.6); opacity: 0.2; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
        }
        .map-container { -webkit-touch-callout: none; -webkit-user-select: none; user-select: none; }
        .map-container:hover { box-shadow: 0 12px 40px rgba(0, 0, 0, 0.16); }
        @media (max-width: 1650px) { .map-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; } }
      `}</style>
    </div>
  );
}