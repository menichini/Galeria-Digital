'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CameraCapture } from '../CameraCapture';
import { PhotoFrameEditor } from '../editor/PhotoFrameEditor';
import { getEventConfig, EventId } from '../../config/events';
import { compressPhotoBeforeProcess } from '../../lib/image-utils';

type PartyModeStep = 'capture' | 'processing' | 'preview' | 'uploading';

interface CaptureViewProps {
  eventId: EventId;
}

export function CaptureView({ eventId }: CaptureViewProps) {
  const router = useRouter();
  const eventConfig = getEventConfig(eventId);

  const [step, setStep] = useState<PartyModeStep>('capture');
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);

  const handleCapture = async (file: File) => {
    setStep('processing');
    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        try {
          const rawPhoto = reader.result;

          // Compress immediately to prevent exceeding sessionStorage limit
          const compressedPhoto = await compressPhotoBeforeProcess(rawPhoto);

          setPhotoDataUrl(compressedPhoto);
          sessionStorage.setItem('capturedImage', compressedPhoto);
          sessionStorage.setItem('currentEvent', eventId);
          sessionStorage.setItem('selectedFrame', eventConfig.frame.id);

          setStep('preview');
        } catch (e) {
          console.error('Auto composition failed', e);
          sessionStorage.setItem('currentEvent', eventId);
          sessionStorage.setItem('selectedFrame', eventConfig.frame.id);
          router.push(eventConfig.previewUrl);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = async (finalDataUrl: string) => {
    if (step === 'uploading') return;
    setStep('uploading');

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
        setStep('preview');
      }
    }
  };

  const handleRetake = () => {
    setPhotoDataUrl(null);
    setStep('capture');
  };

  return (
    <main className={`animate-in flex flex-col items-center min-h-screen px-4 pt-16 pb-10 w-full ${eventConfig.themeClass}`}>
      <div className="w-full max-w-[400px] flex flex-col items-center">
        {step === 'capture' && (
          <>
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-primary mb-2">
                📸 Sorria!
              </h1>
              <p className="text-lg text-text-muted font-medium">
                {eventId === 'olga'
                  ? 'Tire uma foto para a Fazendinha da Olga.'
                  : 'Tire uma foto para a Fazendinha.'}
              </p>
            </div>
            <div className="w-full glass-card p-6 md:p-8 flex flex-col gap-6 relative z-10">
              <CameraCapture onCapture={handleCapture} />
            </div>
          </>
        )}

        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <div className="w-12 h-12 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin"></div>
            <p className="text-brand-primary font-medium animate-pulse">Preparando sua foto...</p>
          </div>
        )}

        {(step === 'preview' || step === 'uploading') && photoDataUrl && (
          <PhotoFrameEditor
            onConfirm={handleConfirm}
            onCancel={handleRetake}
            isUploading={step === 'uploading'}
            frameConfig={eventConfig.frame}
          />
        )}

        {/* Decorative farm icons */}
        <div className="mt-12 opacity-80 select-none pointer-events-none">
          <div className="text-4xl flex gap-6 justify-center">
            {eventConfig.emojis}
          </div>
        </div>
      </div>
    </main>
  );
}
