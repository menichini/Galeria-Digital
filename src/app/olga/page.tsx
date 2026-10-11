import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Fazendinha da Olga — Chá de Bebê',
  description: 'Galeria digital do Chá de Bebê da Olga - Fazenda Rosa Linda',
};

export default function OlgaHome() {
  return (
    <main className="theme-olga animate-in flex flex-col items-center min-h-screen bg-[#FDEAF0]">
      <div className="relative w-full max-w-[600px] shadow-md bg-[#FDEAF0] overflow-hidden">
        <Image
          src="/chadebebedaolga.jpeg"
          alt="Fazendinha da Olga - Chá de Bebê - Fazenda Rosa Linda"
          width={600}
          height={900}
          priority
          sizes="(max-width: 600px) 100vw, 600px"
          className="h-auto w-full object-contain"
        />

        {/* 
          Hotspots Clicáveis para Fazendinha da Olga
          Posicionamento milimétrico calculado sobre chadebebedaolga.jpeg
        */}

        {/* Hotspot: Tirar uma Foto */}
        <Link
          href="/olga/capture"
          aria-label="Tirar uma Foto"
          className="absolute left-[19.5%] right-[19.5%] top-[67.7%] h-[6.8%] rounded-full 
                     hover:bg-white/10 active:bg-white/20 active:scale-95 transition-all duration-200 
                     focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D81B60]"
        />

        {/* Hotspot: Ver a Galeria */}
        <Link
          href="/olga/gallery"
          aria-label="Ver a Galeria"
          className="absolute left-[19.5%] right-[19.5%] top-[76.0%] h-[6.0%] rounded-full 
                     hover:bg-white/10 active:bg-white/20 active:scale-95 transition-all duration-200 
                     focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#EC407A]/50"
        />
      </div>
    </main>
  );
}
