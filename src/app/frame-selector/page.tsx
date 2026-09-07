'use client';
import { useRouter } from 'next/navigation';
import FrameSelector from '../../components/FrameSelector';

export default function FrameSelectorPage() {
  const router = useRouter();

  const handleSelect = (framePath: string) => {
    sessionStorage.setItem('selectedFrame', framePath);
    router.push('/preview');
  };

  return (
    <main className="animate-in flex flex-col items-center min-h-screen px-4 pt-16 pb-10 w-full">
      <div className="w-full max-w-[800px] flex flex-col items-center">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-primary mb-2">
            Escolha a Moldura
          </h1>
          <p className="text-lg text-text-muted font-medium">
            Qual combina mais com a sua foto?
          </p>
        </div>

        <FrameSelector onSelect={handleSelect} />
      </div>
    </main>
  );
}
