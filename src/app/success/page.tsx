"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

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
    <main className="animate-in flex flex-col items-center justify-center min-h-screen px-4 py-12 w-full">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-primary mb-3">
          🎉 Ficou Demais!
        </h1>
        <p className="text-lg md:text-xl text-text-muted font-medium">
          Sua foto já está salva no Mural da Fazendinha.
        </p>
      </div>
      
      {url && (
        <div className="w-full max-w-[400px] glass-card p-6 md:p-8 flex flex-col gap-6 relative z-10">
          <div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden border-[6px] border-white shadow-[0_4px_15px_rgba(0,0,0,0.1)] bg-bg-main transform rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
             <Image src={url} alt="Foto final" fill className="object-cover" />
          </div>
          
          <div className="flex flex-col gap-3 mt-4">
            <button 
              onClick={handleDownload} 
              className="w-full py-4 text-lg font-display font-semibold text-white bg-brand-primary rounded-full shadow-[0_4px_14px_rgba(85,139,47,0.3)] transition-all duration-200 hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-primary/50 flex items-center justify-center gap-2"
            >
              ↓ Baixar Foto
            </button>
            <button 
              onClick={handleShare} 
              className="w-full py-4 text-lg font-display font-semibold text-white bg-brand-secondary rounded-full shadow-[0_4px_14px_rgba(239,108,0,0.3)] transition-all duration-200 hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-secondary/50 flex items-center justify-center gap-2"
            >
              ➦ Compartilhar
            </button>
            <button 
              onClick={() => router.push('/gallery')} 
              className="w-full py-4 text-lg font-display font-semibold text-brand-primary bg-transparent border-2 border-brand-primary rounded-full transition-all duration-200 hover:bg-brand-primary/5 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-primary/50 flex items-center justify-center gap-2"
            >
              🖼️ Ver Mural
            </button>
          </div>
        </div>
      )}

      {/* Decorative footer message */}
      <div className="mt-12 text-center text-text-muted font-display text-lg opacity-80">
        <p>Obrigado por comemorar com a gente!</p>
        <p className="text-sm mt-1">🐮 🐷 🚜</p>
      </div>
    </main>
  );
}
