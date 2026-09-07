"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";

export interface FileItem {
  name: string;
  url: string;
  createdAt?: string;
}

interface LightboxProps {
  files: FileItem[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({ files, initialIndex, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const file = files[currentIndex];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % files.length);
  }, [files.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + files.length) % files.length);
  }, [files.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Swipe logic
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Mural do Martin",
          text: "Olha essa foto!",
          url: file.url,
        });
      } catch (error) {
        console.log("Erro ao compartilhar", error);
      }
    } else {
      navigator.clipboard.writeText(file.url);
      alert("Link da foto copiado para a área de transferência!");
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(file.url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = file.name || 'foto.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Erro ao baixar a foto", error);
      // Fallback: abre em nova aba
      window.open(file.url, '_blank');
    }
  };

  if (!file) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={onClose} // Clicar no fundo fecha
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Top Actions Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10 pointer-events-none safe-area-pt">
        <div className="flex gap-3 pointer-events-auto">
          <button
            onClick={handleShare}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition-colors"
            aria-label="Compartilhar foto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          </button>
          <button
            onClick={handleDownload}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition-colors"
            aria-label="Baixar foto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </button>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white pointer-events-auto transition-colors"
          aria-label="Fechar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      {/* Prev Button (Desktop mainly) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
        className="hidden md:flex absolute left-4 p-4 rounded-full bg-white/5 hover:bg-white/20 text-white transition-colors z-10"
        aria-label="Foto anterior"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>

      {/* Main Image */}
      <div 
        className="relative w-full h-full max-w-7xl max-h-screen flex items-center justify-center p-0 md:p-12"
      >
        {/* Usamos object-contain para a imagem preencher a área mantendo a proporção. Não precisa de next/image fill aqui necessariamente, mas vamos usar para aproveitar otimização */}
        <div className="relative w-full h-full max-w-[100vw] max-h-[100dvh]" onClick={(e) => e.stopPropagation()}>
           <Image
            src={file.url}
            alt={file.name || "Foto ampliada"}
            fill
            sizes="100vw"
            quality={90}
            className="object-contain"
            priority
            draggable={false}
          />
        </div>
      </div>

      {/* Next Button (Desktop mainly) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        className="hidden md:flex absolute right-4 p-4 rounded-full bg-white/5 hover:bg-white/20 text-white transition-colors z-10"
        aria-label="Próxima foto"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
      
      {/* Indicador Mobile */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none md:hidden safe-area-pb">
        <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white/80 text-xs font-medium tracking-wide">
          {currentIndex + 1} / {files.length}
        </div>
      </div>
    </div>
  );
}
