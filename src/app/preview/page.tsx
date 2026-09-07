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

    const uploadId = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : Date.now().toString() + Math.floor(Math.random() * 1000);

    try {
      const resp = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUrl: finalDataUrl, uploadId }),
      });
      const result = await resp.json();
      if (resp.ok && result.url) {
        sessionStorage.setItem('uploadedUrl', result.url);
        sessionStorage.removeItem('offlinePending');
        sessionStorage.removeItem('localPhotoDataUrl');
        router.push('/success');
      } else {
        throw new Error(result.error || 'Erro desconhecido.');
      }
    } catch (e) {
      console.error('Erro de upload, salvando localmente:', e);
      try {
        const { savePendingUpload } = await import('../../lib/offline-queue');
        await savePendingUpload({
          id: uploadId,
          dataUrl: finalDataUrl,
          createdAt: Date.now(),
          attempts: 0,
          status: 'pending'
        });
        
        sessionStorage.setItem('offlinePending', 'true');
        sessionStorage.setItem('localPhotoDataUrl', finalDataUrl);
        router.push('/success');
      } catch (dbError) {
        alert('Falha ao salvar a foto localmente. Verifique se há espaço disponível.');
      }
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
