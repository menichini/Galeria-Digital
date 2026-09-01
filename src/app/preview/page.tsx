'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Preview from '../../components/Preview';

export default function PreviewPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  const handleConfirm = async (adjustments: { zoom: number, panRatioX: number, panRatioY: number, rotation: number, filter: string }) => {
    if (isUploading) return;
    setIsUploading(true);

    const photoDataUrl = sessionStorage.getItem('capturedImage') || '';
    const frameUrl = sessionStorage.getItem('selectedFrame') || '';

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

    try {
      const [photoImg, frameImg] = await Promise.all([
        loadImage(photoDataUrl),
        loadImage(frameUrl),
      ]);

        const canvas = document.createElement('canvas');
        canvas.width = frameImg.width;
        canvas.height = frameImg.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Failed to get canvas context');

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Apply filters
        if (adjustments.filter === 'grayscale') {
          ctx.filter = 'grayscale(100%)';
        } else if (adjustments.filter === 'sepia') {
          ctx.filter = 'sepia(80%)';
        } else {
          ctx.filter = 'none';
        }

        // We need to support rotation for the photo.
        // Rotation swaps width and height for object-fit calculations if it's 90 or 270.
        const isRotated90 = adjustments.rotation === 90 || adjustments.rotation === 270;
        const effectivePhotoWidth = isRotated90 ? photoImg.height : photoImg.width;
        const effectivePhotoHeight = isRotated90 ? photoImg.width : photoImg.height;

        const baseScale = Math.max(canvas.width / effectivePhotoWidth, canvas.height / effectivePhotoHeight);
        const finalScale = baseScale * adjustments.zoom;
        
        const baseCenterX = canvas.width / 2;
        const baseCenterY = canvas.height / 2;
        
        const panOffsetX = adjustments.panRatioX * canvas.width;
        const panOffsetY = adjustments.panRatioY * canvas.height;

        // Desenha a foto com offset e rotação
        ctx.save();
        ctx.translate(baseCenterX + panOffsetX, baseCenterY + panOffsetY);
        ctx.rotate((adjustments.rotation * Math.PI) / 180);
        ctx.drawImage(
          photoImg,
          -photoImg.width * finalScale / 2,
          -photoImg.height * finalScale / 2,
          photoImg.width * finalScale,
          photoImg.height * finalScale
        );
        ctx.restore();

        // Limpa o filtro antes de desenhar a moldura!
        ctx.filter = 'none';

        if (frameUrl.endsWith('.jpg')) {
          ctx.globalCompositeOperation = 'multiply';
        }

        ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';

        // Add text "Fazendinha do Martin"
        const text = "Fazendinha do Martin";
        const fontSize = Math.floor(canvas.height * 0.08); // Responsive font size
        ctx.font = `${fontSize}px Pacifico, cursive, sans-serif`;
        ctx.textAlign = "center";
        
        const textX = canvas.width / 2;
        const textY = canvas.height * 0.95; // Near the bottom

        // Add stroke/outline for better visibility
        ctx.lineWidth = Math.floor(fontSize * 0.15);
        ctx.strokeStyle = '#558B2F';
        ctx.strokeText(text, textX, textY);
        
        // Add fill text
        ctx.fillStyle = '#ffffff';
        ctx.fillText(text, textX, textY);

      // Redimensiona se a imagem final for muito grande (previne Payload Too Large e erro na API)
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

      const resp = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUrl: finalDataUrl }),
      });
      const result = await resp.json();
      if (result.url) {
        sessionStorage.setItem('uploadedUrl', result.url);
        router.push('/success');
      } else {
        alert('Erro ao enviar a foto: ' + (result.error || 'Erro desconhecido.'));
      }
    } catch (e) {
      console.error(e);
      alert('Falha na comunicação com o servidor.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Pré‑visualização</h1>
      <Preview onConfirm={handleConfirm} isUploading={isUploading} />
    </main>
  );
}
