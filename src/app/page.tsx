import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="animate-in flex flex-col items-center min-h-screen bg-bg-main">
      <div className="relative w-full max-w-[600px] shadow-md bg-bg-main overflow-hidden">
        <Image
          src="/fotosite.png"
          alt="Fazendinha do Martin - 2 anos"
          width={600}
          height={800}
          priority
          sizes="(max-width: 600px) 100vw, 600px"
          className="h-auto w-full object-contain"
        />

        {/* 
          Hotspots Clicáveis
          As classes top-[X%] e h-[X%] podem ser ajustadas conforme a posição real
          dos botões na imagem original. Utilizamos foco visível e interatividade discreta
          para garantir usabilidade sem estragar a arte.
        */}

        {/* Hotspot: Tirar uma Foto */}
        <Link
          href="/capture"
          aria-label="Tirar uma Foto"
          className="absolute left-[10%] right-[10%] top-[71%] h-[8%] rounded-full 
                     hover:bg-white/10 active:bg-white/20 active:scale-95 transition-all duration-200 
                     focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-primary"
        />

        {/* Hotspot: Ver a Galeria */}
        <Link
          href="/gallery"
          aria-label="Ver a Galeria"
          className="absolute left-[10%] right-[10%] top-[79%] h-[8%] rounded-full 
                     hover:bg-white/10 active:bg-white/20 active:scale-95 transition-all duration-200 
                     focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-text-muted/50"
        />
      </div>
    </main>
  );
}
