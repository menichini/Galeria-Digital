'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CameraCapture } from '../../components/CameraCapture';
import { QuickPreview } from '../../components/QuickPreview';
import { DEFAULT_EVENT_FRAME } from '../../config/frames';
import { autoComposePhoto, compressPhotoBeforeProcess } from '../../lib/image-utils';

type PartyModeStep = 'capture' | 'processing' | 'preview' | 'uploading';

export default function CapturePage() {
  const router = useRouter();
  
  const [step, setStep] = useState<PartyModeStep>('capture');
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [composedDataUrl, setComposedDataUrl] = useState<string | null>(null);

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

          const composed = await autoComposePhoto(compressedPhoto, DEFAULT_EVENT_FRAME);
          setComposedDataUrl(composed);
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

  const handleConfirm = async () => {
    if (!composedDataUrl || step === 'uploading') return;
    setStep('uploading');

    try {
      const resp = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUrl: composedDataUrl }),
      });
      const result = await resp.json();
      if (result.url) {
        sessionStorage.setItem('uploadedUrl', result.url);
        router.push('/success');
      } else {
        alert('Erro ao enviar a foto: ' + (result.error || 'Erro desconhecido.'));
        setStep('preview');
      }
    } catch (e) {
      console.error(e);
      alert('Falha na comunicação com o servidor.');
      setStep('preview');
    }
  };

  const handleCustomize = () => {
    sessionStorage.setItem('selectedFrame', DEFAULT_EVENT_FRAME.id);
    router.push('/preview');
  };

  const handleRetake = () => {
    setPhotoDataUrl(null);
    setComposedDataUrl(null);
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

        {(step === 'preview' || step === 'uploading') && composedDataUrl && (
          <>
            <div className="text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-primary mb-2">
                ✨ Ficou linda!
              </h1>
            </div>
            <QuickPreview
              composedImage={composedDataUrl}
              isUploading={step === 'uploading'}
              onConfirm={handleConfirm}
              onCustomize={handleCustomize}
              onRetake={handleRetake}
            />
          </>
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
