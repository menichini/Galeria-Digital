'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CameraCapture } from '../../components/CameraCapture';
import { PhotoFrameEditor } from '../../components/editor/PhotoFrameEditor';
import { DEFAULT_EVENT_FRAME } from '../../config/frames';
import { compressPhotoBeforeProcess } from '../../lib/image-utils';

type PartyModeStep = 'capture' | 'processing' | 'preview' | 'uploading';

export default function CapturePage() {
  const router = useRouter();

  const [step, setStep] = useState<PartyModeStep>('capture');
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);

  const handleCapture = async (file: File) => {
    setStep('processing');
    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        try {
          const rawPhoto = reader.result;

          // Comprimir imediatamente para evitar estourar o limite de 5MB do sessionStorage
          const compressedPhoto = await compressPhotoBeforeProcess(rawPhoto);

          setPhotoDataUrl(compressedPhoto);
          sessionStorage.setItem('capturedImage', compressedPhoto);

          setStep('preview');
        } catch (e) {
          console.error('Auto composition failed', e);
          // If processing fails, fallback to standard editor
          sessionStorage.setItem('selectedFrame', DEFAULT_EVENT_FRAME.id);
          router.push('/preview');
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
        setStep('preview');
      }
    }
  };

  const handleCustomize = () => {
    sessionStorage.setItem('selectedFrame', DEFAULT_EVENT_FRAME.id);
    router.push('/preview');
  };

  const handleRetake = () => {
    setPhotoDataUrl(null);
    setStep('capture');
  };

  return (
    <main className="animate-in flex flex-col items-center min-h-screen px-4 pt-16 pb-10 w-full">
      <div className="w-full max-w-[400px] flex flex-col items-center">
        {step === 'capture' && (
          <>
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-primary mb-2">
                📸 Sorria!
              </h1>
              <p className="text-lg text-text-muted font-medium">
                Tire uma foto para a Fazendinha.
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
          />
        )}

        {/* Decorativo */}
        <div className="mt-12 opacity-80 select-none pointer-events-none">
          <div className="text-4xl flex gap-6 justify-center">
            🐴 🌻 🐄
          </div>
        </div>
      </div>
    </main>
  );
}
