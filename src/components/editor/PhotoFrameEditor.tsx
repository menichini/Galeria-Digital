import React, { useState, useEffect } from 'react';
import { FramePreview } from './FramePreview';
import { PhotoControls } from './PhotoControls';
import { usePhotoTransform } from '../../hooks/usePhotoTransform';
import { DEFAULT_EVENT_FRAME, FrameConfig } from '../../config/frames';

interface PhotoFrameEditorProps {
  onConfirm: (dataUrl: string) => void;
  isUploading: boolean;
}

export const PhotoFrameEditor: React.FC<PhotoFrameEditorProps> = ({ onConfirm, isUploading }) => {
  const [photoUrl, setPhotoUrl] = useState('');
  const [frameConfig, setFrameConfig] = useState<FrameConfig | null>(null);

  const [photoSize, setPhotoSize] = useState({ width: 0, height: 0 });
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const cropArea = frameConfig?.cropArea || { x: 0, y: 0, width: 1, height: 1 };

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
    cropArea
  );

  useEffect(() => {
    const pUrl = sessionStorage.getItem('capturedImage') || '';
    setPhotoUrl(pUrl);
    
    setFrameConfig(DEFAULT_EVENT_FRAME);

    const img = new Image();
    img.onload = () => {
      setFrameSize({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = DEFAULT_EVENT_FRAME.image;
  }, []);

  useEffect(() => {
    if (photoSize.width > 0 && containerSize.width > 0 && frameSize.width > 0 && frameConfig) {
      fill();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoSize.width, containerSize.width, frameSize.width, frameConfig]);

  const handleExport = async () => {
    if (isUploading || !frameConfig) return;

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
        loadImage(frameConfig.image),
      ]);

      const canvas = document.createElement('canvas');
      canvas.width = frameImg.width;
      canvas.height = frameImg.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get canvas context');

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const ratioX = canvas.width / (containerSize.width || 1);
      const ratioY = canvas.height / (containerSize.height || 1);
      const ratio = (ratioX + ratioY) / 2;

      const cropX = canvas.width * frameConfig.cropArea.x;
      const cropY = canvas.height * frameConfig.cropArea.y;
      const cropW = canvas.width * frameConfig.cropArea.width;
      const cropH = canvas.height * frameConfig.cropArea.height;

      const safeCenterX = cropX + cropW / 2;
      const safeCenterY = cropY + cropH / 2;

      const canvasTranslateX = transform.x * ratio;
      const canvasTranslateY = transform.y * ratio;
      const canvasScale = transform.scale * ratio;

      ctx.save();
      
      ctx.beginPath();
      ctx.rect(cropX, cropY, cropW, cropH);
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

      if (frameConfig.image.endsWith('.jpg') || frameConfig.image.endsWith('.jpeg')) {
        ctx.globalCompositeOperation = 'multiply';
      }
      ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';

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

  if (!photoUrl || !frameConfig || frameSize.width === 0) {
    return <p>Carregando recursos...</p>;
  }

  const frameAspectRatio = frameSize.width / frameSize.height;

  return (
    <div className="flex flex-col gap-6 items-center w-full">
      <div className="w-full max-w-[400px]">
        <FramePreview
          photoSrc={photoUrl}
          frameSrc={frameConfig.image}
          transform={transform}
          onTransformChange={(t) => {
            setPan(t.x, t.y);
            setZoom(t.scale);
            setRotation(t.rotation);
          }}
          cropArea={frameConfig.cropArea}
          frameAspectRatio={frameAspectRatio}
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

      <div className="w-full max-w-[400px] mt-2">
        <button 
          onClick={handleExport} 
          disabled={isUploading} 
          className="w-full py-4 text-xl font-display font-semibold text-white bg-brand-primary rounded-full shadow-[0_4px_14px_rgba(85,139,47,0.3)] transition-all duration-200 hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-primary/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100"
        >
          {isUploading ? 'Enviando...' : 'Finalizar e Enviar 🎉'}
        </button>
      </div>
    </div>
  );
};
