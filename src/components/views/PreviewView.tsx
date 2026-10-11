'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PhotoFrameEditor } from '../editor/PhotoFrameEditor';
import { getEventConfig, EventId } from '../../config/events';

interface PreviewViewProps {
  eventId: EventId;
}

export function PreviewView({ eventId }: PreviewViewProps) {
  const router = useRouter();
  const eventConfig = getEventConfig(eventId);
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
        body: JSON.stringify({
          dataUrl: finalDataUrl,
          uploadId,
          eventId,
          frameId: eventConfig.frame.id,
        }),
      });
      const result = await resp.json();
      if (resp.ok && result.url) {
        sessionStorage.setItem('uploadedUrl', result.url);
        sessionStorage.setItem('currentEvent', eventId);
        sessionStorage.removeItem('offlinePending');
        sessionStorage.removeItem('localPhotoDataUrl');
        router.push(eventConfig.successUrl);
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
          status: 'pending',
          eventId,
          frameId: eventConfig.frame.id,
        });
        
        sessionStorage.setItem('offlinePending', 'true');
        sessionStorage.setItem('localPhotoDataUrl', finalDataUrl);
        sessionStorage.setItem('currentEvent', eventId);
        router.push(eventConfig.successUrl);
      } catch (dbError) {
        alert('Falha ao salvar a foto localmente. Verifique se há espaço disponível.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className={`animate-in flex flex-col items-center min-h-screen px-4 pt-16 pb-10 w-full ${eventConfig.themeClass}`}>
      <div className="w-full max-w-[500px] flex flex-col items-center">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-primary mb-2">
            Ajuste sua Foto
          </h1>
          <p className="text-sm md:text-base text-text-muted font-medium">
            Mova, gire e dê zoom para encaixar perfeitamente.
          </p>
        </div>
        
        <PhotoFrameEditor
          onConfirm={handleConfirm}
          isUploading={isUploading}
          frameConfig={eventConfig.frame}
        />
      </div>
    </main>
  );
}
