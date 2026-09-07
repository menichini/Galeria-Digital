import React from 'react';

interface PhotoControlsProps {
  zoom: number;
  rotation: number;
  onZoomChange: (val: number) => void;
  onRotationChange: (val: number) => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onCenter: () => void;
  onFit: () => void;
  onFill: () => void;
  disabled?: boolean;
}

export const PhotoControls: React.FC<PhotoControlsProps> = ({
  zoom,
  rotation,
  onZoomChange,
  onRotationChange,
  onRotateLeft,
  onRotateRight,
  onCenter,
  onFit,
  onFill,
  disabled
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '400px', margin: '0 auto', opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button className="btn btn-ghost" style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }} onClick={onFit}>Ajustar</button>
        <button className="btn btn-ghost" style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }} onClick={onFill}>Preencher</button>
        <button className="btn btn-ghost" style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }} onClick={onCenter}>Centro</button>
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button className="btn btn-ghost" style={{ width: '40px', height: '40px', padding: 0 }} onClick={onRotateLeft}>↺</button>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Rotação ({Math.round(rotation)}°)</label>
          <input type="range" min="-180" max="180" value={rotation} onChange={(e) => onRotationChange(parseFloat(e.target.value))} style={{ width: '100%' }} />
        </div>
        <button className="btn btn-ghost" style={{ width: '40px', height: '40px', padding: 0 }} onClick={onRotateRight}>↻</button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold' }}>-</span>
        <input type="range" min="0.1" max="5" step="0.05" value={zoom} onChange={(e) => onZoomChange(parseFloat(e.target.value))} style={{ flex: 1 }} />
        <span style={{ fontWeight: 'bold' }}>+</span>
      </div>
    </div>
  );
};
