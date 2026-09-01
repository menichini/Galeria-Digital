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
    <main className="animate-in" style={{ padding: 'var(--spacing-md) 0' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
        <h1 style={{ fontSize: '2.5rem' }}>📸 Sorria!</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
          Tire uma foto para a Fazendinha do Martin.
        </p>
      </div>
      <CameraCapture onCapture={handleCapture} />
    </main>
  );
}
