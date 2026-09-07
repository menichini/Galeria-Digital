import { FrameConfig } from '../config/frames';

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    if (src.startsWith('http') || src.startsWith('/')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });

export async function autoComposePhoto(photoUrl: string, frameConfig: FrameConfig): Promise<string> {
  const [photoImg, frameImg] = await Promise.all([
    loadImage(photoUrl),
    loadImage(frameConfig.image),
  ]);

  const canvas = document.createElement('canvas');
  canvas.width = frameImg.width;
  canvas.height = frameImg.height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Failed to get canvas context');

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Crop area dimensions and position
  const cropX = canvas.width * frameConfig.cropArea.x;
  const cropY = canvas.height * frameConfig.cropArea.y;
  const cropW = canvas.width * frameConfig.cropArea.width;
  const cropH = canvas.height * frameConfig.cropArea.height;
  const safeCenterX = cropX + cropW / 2;
  const safeCenterY = cropY + cropH / 2;

  // Calculate scaling to fill the crop area
  const scaleX = cropW / (photoImg.width || 1);
  const scaleY = cropH / (photoImg.height || 1);
  const scale = Math.max(scaleX, scaleY); // minScaleToFill

  ctx.save();
  
  // Clip to crop area (not strictly necessary since frame covers, but good for transparency if any)
  ctx.beginPath();
  ctx.rect(cropX, cropY, cropW, cropH);
  ctx.clip();

  // Move to center of crop area
  ctx.translate(safeCenterX, safeCenterY);
  
  // Draw photo centered
  ctx.drawImage(
    photoImg,
    (-photoImg.width * scale) / 2,
    (-photoImg.height * scale) / 2,
    photoImg.width * scale,
    photoImg.height * scale
  );
  
  ctx.restore();

  // Handle blending modes for JPEG frames
  if (frameConfig.image.endsWith('.jpg') || frameConfig.image.endsWith('.jpeg')) {
    ctx.globalCompositeOperation = 'multiply';
  }
  
  // Draw frame on top
  ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'source-over';

  // Downscale if too large to save memory/upload time
  const MAX_DIM = 1200;
  let finalDataUrl = '';
  
  if (canvas.width > MAX_DIM || canvas.height > MAX_DIM) {
    const scaleDown = Math.min(MAX_DIM / canvas.width, MAX_DIM / canvas.height);
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width * scaleDown;
    exportCanvas.height = canvas.height * scaleDown;
    const ectx = exportCanvas.getContext('2d');
    if (ectx) {
      ectx.drawImage(canvas, 0, 0, exportCanvas.width, exportCanvas.height);
    }
    finalDataUrl = exportCanvas.toDataURL('image/jpeg', 0.85);
  } else {
    finalDataUrl = canvas.toDataURL('image/jpeg', 0.85);
  }

  return finalDataUrl;
}
