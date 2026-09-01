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
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>✅ Foto enviada com sucesso!</h1>
      {url && (
        <div style={{ marginTop: '1rem' }}>
          <img src={url} alt="Foto enviada" style={{ maxWidth: '100%', height: 'auto' }} />
          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={handleDownload}
              style={{
                background: 'linear-gradient(135deg, #56ab2f, #a8e063)',
                color: '#fff',
                border: 'none',
                padding: '0.6rem 1.2rem',
                marginRight: '0.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Baixar
            </button>
            <button
              onClick={handleShare}
              style={{
                background: 'linear-gradient(135deg, #36d1dc, #5b86e5)',
                color: '#fff',
                border: 'none',
                padding: '0.6rem 1.2rem',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Compartilhar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
