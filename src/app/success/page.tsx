"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function SuccessPage() {
  const router = useRouter();
  const [url, setUrl] = useState<string>('');
  const [isOfflinePending, setIsOfflinePending] = useState(false);
  const [shareState, setShareState] = useState<'idle' | 'preparing' | 'sharing'>('idle');

  useEffect(() => {
    const uploaded = sessionStorage.getItem('uploadedUrl') || '';
    const offlineFlag = sessionStorage.getItem('offlinePending') === 'true';
    const localDataUrl = sessionStorage.getItem('localPhotoDataUrl') || '';

    if (!uploaded && !offlineFlag) {
      // Se não houver URL, redireciona para a captura
      router.replace('/capture');
    } else {
      setIsOfflinePending(offlineFlag);
      setUrl(offlineFlag ? localDataUrl : uploaded);
    }
  }, [router]);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `fazendinha-martin-2-anos-${Date.now()}.jpg`;
    a.click();
  };

  const handleShare = async () => {
    if (shareState !== 'idle') return;

    if (!navigator.share) {
      // Fallback 3: Se não suporta Share API, faz download
      handleDownload();
      return;
    }

    try {
      setShareState('preparing');
      
      const title = 'Fazendinha do Martin — 2 anos';
      const text = 'Olha essa lembrança da Fazendinha do Martin! 🎉';
      
      let file: File | null = null;
      let canShareFile = false;

      try {
        const response = await fetch(url);
        const blob = await response.blob();
        file = new File([blob], `fazendinha-martin-2-anos-${Date.now()}.jpg`, { type: blob.type || 'image/jpeg' });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          canShareFile = true;
        }
      } catch (err) {
        console.warn('Não foi possível preparar o arquivo para compartilhamento', err);
      }

      setShareState('sharing');

      if (canShareFile && file) {
        // Fallback 1: Share arquivo
        await navigator.share({
          title,
          text,
          files: [file],
        });
      } else {
        // Fallback 2: Share URL
        await navigator.share({
          title,
          text,
          url,
        });
      }

      setShareState('idle');
    } catch (e: any) {
      setShareState('idle');
      // AbortError é lançado quando o usuário fecha o share sheet nativo
      if (e.name !== 'AbortError') {
        console.warn('Erro ao compartilhar', e);
        // Não mostrar erro técnico em tela
      }
    }
  };

  const handleRetakePhoto = () => {
    sessionStorage.removeItem('capturedImage');
    sessionStorage.removeItem('uploadedUrl');
    sessionStorage.removeItem('offlinePending');
    sessionStorage.removeItem('localPhotoDataUrl');
    router.push('/capture');
  };

  const isShareSupported = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <main className="animate-in flex flex-col items-center justify-center min-h-screen px-4 py-12 w-full">
      <div className="text-center mb-8">
        {isOfflinePending ? (
          <>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-primary mb-3 leading-tight">
              Sua foto está salva neste aparelho 💚
            </h1>
            <p className="text-base md:text-lg text-text-muted font-medium">
              Vamos tentar enviar novamente assim que a conexão melhorar.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-primary mb-3">
              🎉 Ficou Demais!
            </h1>
            <p className="text-lg md:text-xl text-text-muted font-medium">
              Sua foto já está salva no Mural da Fazendinha.
            </p>
          </>
        )}
      </div>
      
      {url && (
        <div className="w-full max-w-[400px] glass-card p-6 md:p-8 flex flex-col gap-6 relative z-10">
          <div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden border-[6px] border-white shadow-[0_4px_15px_rgba(0,0,0,0.1)] bg-bg-main transform rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
             <Image src={url} alt="Foto final" fill className="object-cover" />
          </div>
          
          <div className="flex flex-col gap-3 mt-4">
            <button 
              onClick={handleRetakePhoto} 
              className="w-full py-4 text-xl font-display font-semibold text-white bg-brand-primary rounded-full shadow-[0_4px_14px_rgba(85,139,47,0.3)] transition-all duration-200 hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-primary/50 flex items-center justify-center gap-2"
            >
              📸 Tirar outra foto
            </button>

            {isShareSupported && (
              <button 
                onClick={handleShare} 
                disabled={shareState !== 'idle'}
                className="w-full py-4 text-lg font-display font-semibold text-white bg-brand-secondary rounded-full shadow-[0_4px_14px_rgba(239,108,0,0.3)] transition-all duration-200 hover:brightness-110 active:scale-95 disabled:opacity-70 disabled:active:scale-100 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-secondary/50 flex items-center justify-center gap-2"
              >
                {shareState === 'preparing' ? '⏳ Preparando sua foto...' : shareState === 'sharing' ? '📤 Compartilhando...' : '📤 Compartilhar minha foto'}
              </button>
            )}

            <button 
              onClick={() => { window.location.href = '/gallery'; }} 
              className="w-full py-4 text-lg font-display font-semibold text-brand-primary bg-white border-2 border-brand-primary/20 rounded-full transition-all duration-200 hover:bg-brand-primary/5 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-primary/50 flex items-center justify-center gap-2"
            >
              🖼️ Ver no Mural
            </button>

            <button 
              onClick={handleDownload} 
              className="w-full py-3 text-base font-medium text-text-muted hover:text-text-main underline decoration-text-muted/30 underline-offset-4 transition-colors flex items-center justify-center gap-2"
            >
              ⬇️ Baixar foto
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
