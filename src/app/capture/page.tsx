'use client';
import { useRouter } from 'next/navigation';
import { CameraCapture } from '../../components/CameraCapture';

export default function CapturePage() {
  const router = useRouter();

  const handleCapture = async (file: File) => {
    // Convert file to data URL and store in sessionStorage
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        sessionStorage.setItem('capturedImage', reader.result);
        router.push('/frame-selector');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <main className="animate-in flex flex-col items-center min-h-screen px-4 pt-16 pb-10 w-full">
      <div className="w-full max-w-[400px] flex flex-col items-center">
        {/* Título Temático */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-primary mb-2">
            📸 Sorria!
          </h1>
          <p className="text-lg text-text-muted font-medium">
            Tire uma foto para a Fazendinha.
          </p>
        </div>

        {/* Card Principal */}
        <div className="w-full glass-card p-6 md:p-8 flex flex-col gap-6 relative z-10">
          <CameraCapture onCapture={handleCapture} />
        </div>

        {/* Decorativo leve de fundo (ilustrativo para o tema) */}
        <div className="mt-12 opacity-80 select-none pointer-events-none">
          {/* Fallback de decoração para não precisar de imagem extra caso não exista. Usamos texto/emojis por enquanto, mas preparado para Image se necessário. */}
          <div className="text-4xl flex gap-6 justify-center">
            🐴 🌻 🐄
          </div>
        </div>
      </div>
    </main>
  );
}
