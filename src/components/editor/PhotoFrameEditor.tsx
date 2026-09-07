import React, { useState, useEffect, useCallback } from 'react';
import { FramePreview } from './FramePreview';
import { PhotoControls } from './PhotoControls';
import { usePhotoTransform, SafeArea } from '../../hooks/usePhotoTransform';

interface PhotoFrameEditorProps {
  onConfirm: (dataUrl: string) => void;
  isUploading: boolean;
}

// Adjust these based on the actual frame.jpeg empty area
const SAFE_AREA: SafeArea = { top: 0.18, right: 0.9, bottom: 0.85, left: 0.1 };

export const PhotoFrameEditor: React.FC<PhotoFrameEditorProps> = ({ onConfirm, isUploading }) => {
  const [photoUrl, setPhotoUrl] = useState('');
  const [frameUrl, setFrameUrl] = useState('');

  const [photoSize, setPhotoSize] = useState({ width: 0, height: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const {
    transform,
    setZoom,
    setPan,
    setRotation,
    center,
    fit,
    fill
  } = usePhotoTransform(
    photoSize.width,
    photoSize.height,
    containerSize.width,
    containerSize.height,
    SAFE_AREA
  );

  useEffect(() => {
    setPhotoUrl(sessionStorage.getItem('capturedImage') || '');
    setFrameUrl(sessionStorage.getItem('selectedFrame') || '');
  }, []);

  // Initial fit/fill when photo and container are ready
  useEffect(() => {
    if (photoSize.width > 0 && containerSize.width > 0) {
      fill();
    }
    // Only run once when dimensions are available
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoSize.width, containerSize.width]);

  const handleExport = async () => {
    if (isUploading) return;

    try {
      const loadImage = (src: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          if (src.startsWith('http') || src.startsWith('/')) {
            img.crossOrigin = 'anonymous';
          }
          img.onload = () => resolve(img);
          img.onerror = (e) => reject(e);
          img.src = src;
        });

      const [photoImg, frameImg] = await Promise.all([
        loadImage(photoUrl),
        loadImage(frameUrl),
      ]);

      const canvas = document.createElement('canvas');
      canvas.width = frameImg.width;
      canvas.height = frameImg.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get canvas context');

      // Fill white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Math for mapping DOM space to Canvas space
      const ratioX = canvas.width / (containerSize.width || 1);
      const ratioY = canvas.height / (containerSize.height || 1);
      
      // Use average ratio to prevent distortion (container aspectRatio should match frame aspectRatio)
      const ratio = (ratioX + ratioY) / 2;

      const safeCenterX = canvas.width * (SAFE_AREA.left + SAFE_AREA.right) / 2;
      const safeCenterY = canvas.height * (SAFE_AREA.top + SAFE_AREA.bottom) / 2;

      const canvasTranslateX = transform.x * ratio;
      const canvasTranslateY = transform.y * ratio;
      const canvasScale = transform.scale * ratio;

      // Draw photo
      ctx.save();
      
      // Clip to safe area
      ctx.beginPath();
      ctx.rect(
        canvas.width * SAFE_AREA.left,
        canvas.height * SAFE_AREA.top,
        canvas.width * (SAFE_AREA.right - SAFE_AREA.left),
        canvas.height * (SAFE_AREA.bottom - SAFE_AREA.top)
      );
      ctx.clip();

      ctx.translate(safeCenterX + canvasTranslateX, safeCenterY + canvasTranslateY);
      ctx.rotate((transform.rotation * Math.PI) / 180);
      
      ctx.drawImage(
        photoImg,
        (-photoImg.width * canvasScale) / 2,
        (-photoImg.height * canvasScale) / 2,
        photoImg.width * canvasScale,
        photoImg.height * canvasScale
      );
      ctx.restore();

      // Draw frame
      if (frameUrl.endsWith('.jpg') || frameUrl.endsWith('.jpeg')) {
        ctx.globalCompositeOperation = 'multiply';
      }
      ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';

      // Export
      const MAX_DIM = 1200;
      let finalDataUrl = '';
      if (canvas.width > MAX_DIM || canvas.height > MAX_DIM) {
        const scale = Math.min(MAX_DIM / canvas.width, MAX_DIM / canvas.height);
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = canvas.width * scale;
        exportCanvas.height = canvas.height * scale;
        const ectx = exportCanvas.getContext('2d');
        if (ectx) ectx.drawImage(canvas, 0, 0, exportCanvas.width, exportCanvas.height);
        finalDataUrl = exportCanvas.toDataURL('image/jpeg', 0.85);
      } else {
        finalDataUrl = canvas.toDataURL('image/jpeg', 0.85);
      }

      onConfirm(finalDataUrl);

    } catch (e) {
      console.error('Export error:', e);
      alert('Erro ao processar imagem final.');
    }
  };

  if (!photoUrl || !frameUrl) {
    return <p>Carregando recursos...</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', width: '100%' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <FramePreview
          photoSrc={photoUrl}
          frameSrc={frameUrl}
          transform={transform}
          onTransformChange={(t) => {
            setPan(t.x, t.y);
            setZoom(t.scale);
            setRotation(t.rotation);
          }}
          safeArea={SAFE_AREA}
          onPhotoLoad={(w, h) => setPhotoSize({ width: w, height: h })}
          onContainerResize={(w, h) => setContainerSize({ width: w, height: h })}
        />
      </div>

      <PhotoControls
        zoom={transform.scale}
        rotation={transform.rotation}
        onZoomChange={setZoom}
        onRotationChange={setRotation}
        onRotateLeft={() => setRotation(transform.rotation - 90)}
        onRotateRight={() => setRotation(transform.rotation + 90)}
        onCenter={center}
        onFit={fit}
        onFill={fill}
        disabled={isUploading}
      />

      <div style={{ width: '100%', maxWidth: '400px' }}>
        <button 
          onClick={handleExport} 
          disabled={isUploading} 
          className="btn btn-primary"
        >
          {isUploading ? 'Enviando...' : 'Finalizar e Enviar 🎉'}
        </button>
      </div>
    </div>
  );
};
