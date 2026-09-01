"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const router = useRouter();
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    const uploaded = sessionStorage.getItem('uploadedUrl') || '';
    if (!uploaded) {
      // Se não houver URL, redireciona para a captura
      router.replace('/capture');
    } else {
      setUrl(uploaded);
    }
  }, [router]);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = url;
    a.download = 'foto_fazendinha.png';
    a.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Foto da festa', url });
      } catch (e) {
        console.error('Share failed', e);
      }
    } else {
      alert('Compartilhamento não suportado neste navegador.');
    }
  };

  return (
    <main style={{ padding: '2rem', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ color: 'var(--color-primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>🎉 Ficou Demais!</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Sua foto já está salva no Mural da Fazendinha.</p>
      
      {url && (
        <div className="glass-card" style={{ padding: '1rem', width: '100%', maxWidth: '400px' }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '4px solid white', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
             <img src={url} alt="Foto final" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexDirection: 'column' }}>
            <button onClick={handleDownload} className="btn btn-primary">
              ↓ Baixar Foto
            </button>
            <button onClick={handleShare} className="btn btn-secondary">
              ➦ Compartilhar
            </button>
            <button onClick={() => router.push('/gallery')} className="btn" style={{ backgroundColor: 'transparent', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }}>
              🖼️ Ver Mural
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
