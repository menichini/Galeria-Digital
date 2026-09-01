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
    <main style={{ padding: '2rem' }}>
      <h1 style={{ textAlign: 'center' }}>Selecione a Moldura</h1>
      <FrameSelector onSelect={handleSelect} />
    </main>
  );
}
