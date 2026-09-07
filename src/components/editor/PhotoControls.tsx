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
  onReset: () => void;
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
  onReset,
  disabled
}) => {
  return (
    <div className={`flex flex-col gap-4 w-full max-w-[400px] mx-auto transition-opacity duration-300 ${disabled ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
      <div className="flex gap-2 justify-center">
        <button className="flex-1 py-2 px-2 text-sm font-semibold text-brand-primary bg-brand-primary/10 rounded-full hover:bg-brand-primary/20 active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-brand-primary/50" onClick={onFit}>Ajustar</button>
        <button className="flex-1 py-2 px-2 text-sm font-semibold text-brand-primary bg-brand-primary/10 rounded-full hover:bg-brand-primary/20 active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-brand-primary/50" onClick={onFill}>Preencher</button>
        <button className="flex-1 py-2 px-2 text-sm font-semibold text-brand-primary bg-brand-primary/10 rounded-full hover:bg-brand-primary/20 active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-brand-primary/50" onClick={onCenter}>Centro</button>
        <button className="flex-1 py-2 px-2 text-sm font-semibold text-brand-secondary bg-brand-secondary/10 rounded-full hover:bg-brand-secondary/20 active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-brand-secondary/50" onClick={onReset}>Resetar</button>
      </div>
      
      <div className="flex gap-3 items-center bg-white p-3 rounded-2xl shadow-sm border border-black/5">
        <button className="w-10 h-10 flex items-center justify-center text-xl font-bold text-text-muted hover:text-brand-primary hover:bg-brand-primary/10 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-brand-primary/50" onClick={onRotateLeft}>↺</button>
        <div className="flex-1 flex flex-col items-center">
          <label className="text-xs font-semibold text-text-muted mb-2">Rotação ({Math.round(rotation)}°)</label>
          <input type="range" min="-180" max="180" value={rotation} onChange={(e) => onRotationChange(parseFloat(e.target.value))} className="w-full accent-brand-primary cursor-pointer" />
        </div>
        <button className="w-10 h-10 flex items-center justify-center text-xl font-bold text-text-muted hover:text-brand-primary hover:bg-brand-primary/10 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-brand-primary/50" onClick={onRotateRight}>↻</button>
      </div>

      <div className="flex gap-3 items-center bg-white p-3 rounded-2xl shadow-sm border border-black/5">
        <span className="font-bold text-text-muted text-xl w-6 text-center select-none">-</span>
        <input type="range" min="0.1" max="5" step="0.05" value={zoom} onChange={(e) => onZoomChange(parseFloat(e.target.value))} className="flex-1 accent-brand-primary cursor-pointer" />
        <span className="font-bold text-text-muted text-xl w-6 text-center select-none">+</span>
      </div>
    </div>
  );
};
