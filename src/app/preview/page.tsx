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
    <main className="animate-in flex flex-col items-center min-h-screen px-4 pt-16 pb-10 w-full">
      <div className="w-full max-w-[500px] flex flex-col items-center">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-primary mb-2">
            Ajuste sua Foto
          </h1>
          <p className="text-sm md:text-base text-text-muted font-medium">
            Mova, gire e dê zoom para encaixar perfeitamente.
          </p>
        </div>
        
        <PhotoFrameEditor onConfirm={handleConfirm} isUploading={isUploading} />
      </div>
    </main>
  );
}
