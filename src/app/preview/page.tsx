'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PhotoFrameEditor } from '../../components/editor/PhotoFrameEditor';

export default function PreviewPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  const handleConfirm = async (finalDataUrl: string) => {
    if (isUploading) return;
    setIsUploading(true);

    try {
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
    <main className="animate-in" style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>Ajuste sua Foto</h1>
      <PhotoFrameEditor onConfirm={handleConfirm} isUploading={isUploading} />
    </main>
  );
}
