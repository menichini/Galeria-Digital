import React, { useEffect, useState, useRef } from 'react';

export const Preview: React.FC<{ 
  onConfirm: (adjustments: { zoom: number, panRatioX: number, panRatioY: number, rotation: number, filter: string }) => void,
  isUploading?: boolean
}> = ({ onConfirm, isUploading = false }) => {
  const [photo, setPhoto] = useState<string>('');
  const [frame, setFrame] = useState<string>('');

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [filter, setFilter] = useState('none');
  const [frameRatio, setFrameRatio] = useState('3/4');

  const containerRef = useRef<HTMLDivElement>(null);
  
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const captured = sessionStorage.getItem('capturedImage') || '';
    const chosen = sessionStorage.getItem('selectedFrame') || '';
    setPhoto(captured);
    setFrame(chosen);

    if (chosen) {
      const img = new window.Image();
      img.onload = () => {
        if (img.width && img.height) {
          setFrameRatio(`${img.width}/${img.height}`);
        }
      };
      img.src = chosen;
    }
  }, []);

  if (!photo) {
    return <p>Imagem não encontrada. Volte à captura.</p>;
  }

  const handleStart = (clientX: number, clientY: number) => {
    if (isUploading) return;
    isDragging.current = true;
    lastPos.current = { x: clientX, y: clientY };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging.current) return;
    const dx = clientX - lastPos.current.x;
    const dy = clientY - lastPos.current.y;
    setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    lastPos.current = { x: clientX, y: clientY };
  };

  const handleEnd = () => {
    isDragging.current = false;
  };

  const rotatePhoto = () => {
    if (isUploading) return;
    setRotation(prev => (prev + 90) % 360);
  };

  const handleConfirm = () => {
    if (isUploading) return;
    const container = containerRef.current;
    const pw = container ? container.clientWidth : 300;
    const ph = container ? container.clientHeight : 400;
    
    onConfirm({
      zoom,
      panRatioX: pan.x / pw,
      panRatioY: pan.y / ph,
      rotation,
      filter,
    });
  };

  const getCssFilter = () => {
    if (filter === 'grayscale') return 'grayscale(100%)';
    if (filter === 'sepia') return 'sepia(80%)';
    return 'none';
  };

  return (
    <div>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>
        Ajuste, gire ou aplique filtros na sua foto!
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <button onClick={rotatePhoto} disabled={isUploading} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer', opacity: isUploading ? 0.5 : 1 }}>
          ↻ Girar
        </button>
        <select value={filter} onChange={e => setFilter(e.target.value)} disabled={isUploading} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', opacity: isUploading ? 0.5 : 1 }}>
          <option value="none">Normal</option>
          <option value="grayscale">Preto & Branco</option>
          <option value="sepia">Sépia (Vintage)</option>
        </select>
      </div>

      <div
        ref={containerRef}
        onMouseDown={e => handleStart(e.clientX, e.clientY)}
        onMouseMove={e => handleMove(e.clientX, e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={e => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={e => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={handleEnd}
        style={{
          position: 'relative',
          width: '90%',
          maxWidth: 400,
          aspectRatio: frameRatio,
          margin: '0 auto',
          backgroundColor: '#e0e0e0',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          cursor: isDragging.current ? 'grabbing' : (isUploading ? 'wait' : 'grab'),
          touchAction: 'none',
          opacity: isUploading ? 0.7 : 1
        }}
      >
        <img
          src={photo}
          alt="Foto"
          draggable={false}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`,
            transformOrigin: 'center',
            filter: getCssFilter(),
            pointerEvents: 'none' 
          }}
        />

        {frame && (
          <img
            src={frame}
            alt="Moldura"
            draggable={false}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'fill',
              zIndex: 2,
              pointerEvents: 'none',
              mixBlendMode: frame.endsWith('.jpg') ? 'multiply' : 'normal'
            }}
          />
        )}

        <div style={{
          position: 'absolute',
          bottom: '8%',
          width: '100%',
          textAlign: 'center',
          zIndex: 3,
          color: '#ffffff',
          fontFamily: 'var(--font-pacifico), cursive',
          fontSize: '2.5rem',
          textShadow: '2px 2px 0 #558B2F, -2px -2px 0 #558B2F, 2px -2px 0 #558B2F, -2px 2px 0 #558B2F, 0px 4px 10px rgba(0,0,0,0.5)',
          pointerEvents: 'none'
        }}>
          Fazendinha do Martin
        </div>
      </div>

      <div style={{ margin: '1rem auto', maxWidth: 300 }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Zoom</label>
        <input 
          type="range" 
          min="0.5" 
          max="3" 
          step="0.05" 
          value={zoom} 
          onChange={e => setZoom(parseFloat(e.target.value))}
          disabled={isUploading}
          style={{ width: '100%', opacity: isUploading ? 0.5 : 1 }}
        />
      </div>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button onClick={handleConfirm} disabled={isUploading} className="btn btn-primary" style={{ opacity: isUploading ? 0.5 : 1 }}>
          {isUploading ? 'Enviando...' : 'Confirmar e Enviar'}
        </button>
      </div>
    </div>
  );
};

export default Preview;
