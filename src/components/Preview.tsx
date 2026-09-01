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

  const [photoSize, setPhotoSize] = useState({ width: 0, height: 0 });
  const [containerSize, setContainerSize] = useState({ width: 300, height: 400 });

  useEffect(() => {
    const captured = sessionStorage.getItem('capturedImage') || '';
    const chosen = sessionStorage.getItem('selectedFrame') || '';
    setPhoto(captured);
    setFrame(chosen);

    if (captured) {
      const pImg = new window.Image();
      pImg.onload = () => setPhotoSize({ width: pImg.width, height: pImg.height });
      pImg.src = captured;
    }

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

  useEffect(() => {
    if (containerRef.current) {
      const updateSize = () => {
        if (containerRef.current) {
          setContainerSize({
            width: containerRef.current.clientWidth,
            height: containerRef.current.clientHeight
          });
        }
      };
      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, [frameRatio, photo]);

  if (!photo) {
    return <p>Imagem não encontrada. Volte à captura.</p>;
  }

  // Calculate base scale so image covers container
  const isRotated90 = rotation === 90 || rotation === 270;
  const effectivePhotoWidth = isRotated90 ? photoSize.height : photoSize.width;
  const effectivePhotoHeight = isRotated90 ? photoSize.width : photoSize.height;

  let baseScale = 1;
  if (effectivePhotoWidth > 0 && effectivePhotoHeight > 0) {
    baseScale = Math.max(containerSize.width / effectivePhotoWidth, containerSize.height / effectivePhotoHeight);
  }

  const renderedWidth = photoSize.width * baseScale;
  const renderedHeight = photoSize.height * baseScale;

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
    const pw = containerSize.width || 300;
    const ph = containerSize.height || 400;
    
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
        {photoSize.width > 0 && (
          <img
            src={photo}
            alt="Foto"
            draggable={false}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: renderedWidth,
              height: renderedHeight,
              marginLeft: -renderedWidth / 2,
              marginTop: -renderedHeight / 2,
              zIndex: 1,
              transform: `translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scale(${zoom})`,
              filter: getCssFilter(),
              pointerEvents: 'none' 
            }}
          />
        )}

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
          min="1" 
          max="4" 
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
