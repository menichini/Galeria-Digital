"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Lightbox, { FileItem } from "@/components/Lightbox";

export default function GalleryPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const fetchFiles = async () => {
    try {
      const res = await fetch(`/api/public/list?t=${Date.now()}`, { 
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      const data = await res.json();
      setFiles(data.files || []);
    } catch (e) {
      console.error('Failed to fetch public gallery files', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen px-4 py-24 flex items-center justify-center w-full">
        <div className="glass-card animate-in text-center p-8 max-w-sm w-full">
          <h2 className="text-2xl font-display font-semibold text-brand-primary">Carregando mural...</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 pt-20 pb-12 w-full max-w-[1200px] mx-auto relative">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-primary mb-3">
          🖼️ Mural do Martin
        </h1>
        <p className="text-lg md:text-xl text-text-muted font-medium">
          As memórias mais divertidas da nossa fazendinha!
        </p>
      </div>
      
      {files.length === 0 ? (
        <div className="glass-card animate-in p-8 max-w-md mx-auto text-center">
          <p className="text-lg font-medium text-text-muted">Nenhuma foto foi tirada ainda. Seja o primeiro!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {files.map((file, i) => (
            <div 
              key={file.name} 
              onClick={() => setLightboxIndex(i)}
              className="group relative glass-card p-3 flex flex-col gap-3 animate-in hover:scale-[1.02] hover:z-10 hover:shadow-[0_24px_48px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="relative w-full aspect-[3/4] overflow-hidden rounded-md bg-white border border-black/5 shadow-inner">
                <Image 
                  src={file.url} 
                  alt="Foto da festa" 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105" 
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  priority={i < 4}
                />
              </div>
              <div className="text-sm font-medium text-text-muted text-center">
                {file.createdAt ? new Date(file.createdAt).toLocaleDateString('pt-BR') : 'Hoje'}
              </div>
            </div>
          ))}
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox 
          files={files}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </main>
  );
}
