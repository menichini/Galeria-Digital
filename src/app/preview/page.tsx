'use client';
import { useRouter } from 'next/navigation';
import Preview from '../../components/Preview';

export default function PreviewPage() {
  const router = useRouter();

  const handleConfirm = async () => {
    const photoDataUrl = sessionStorage.getItem('capturedImage') || '';
    const frameUrl = sessionStorage.getItem('selectedFrame') || '';

    // Load images and composite using canvas
    const loadImage = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        if (src.startsWith('http') || src.startsWith('/')) {
          img.crossOrigin = 'anonymous';
        }
        img.onload = () => resolve(img);
        img.onerror = (e) => {
           console.error('Failed to load image:', src, e);
           reject(e);
        };
        img.src = src;
      });

    try {
      const [photoImg, frameImg] = await Promise.all([
        loadImage(photoDataUrl),
        loadImage(frameUrl),
      ]);

        // Cria canvas com tamanho da moldura
        const canvas = document.createElement('canvas');
        canvas.width = frameImg.width;
        canvas.height = frameImg.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Failed to get canvas context');

        // Fundo branco sólido por precaução
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Calcula object-fit: cover para a foto
        const scale = Math.max(canvas.width / photoImg.width, canvas.height / photoImg.height);
        const x = (canvas.width / 2) - (photoImg.width / 2) * scale;
        const y = (canvas.height / 2) - (photoImg.height / 2) * scale;

        // Desenha a foto primeiro (fundo)
        ctx.drawImage(photoImg, x, y, photoImg.width * scale, photoImg.height * scale);

        // Desenha a moldura por cima (frente)
        ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

      const combinedDataUrl = canvas.toDataURL('image/jpeg', 0.85); // JPEG to reduce size

      const resp = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUrl: combinedDataUrl }),
      });
      const result = await resp.json();
      if (result.url) {
        sessionStorage.setItem('uploadedUrl', result.url);
        router.push('/success');
      } else {
        alert('Erro ao enviar a foto.');
      }
    } catch (e) {
      console.error(e);
      alert('Falha na comunicação com o servidor.');
    }
  };

  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Pré‑visualização</h1>
      <Preview onConfirm={handleConfirm} />
    </main>
  );
}
