import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="animate-in flex flex-col items-center min-h-screen bg-bg-main">
      {/* Hero / Arte Principal */}
      <div className="relative w-full max-w-[600px] aspect-[4/3] md:aspect-[16/10] min-h-[350px] max-h-[500px] rounded-b-3xl overflow-hidden shadow-sm border-b-[6px] border-white bg-bg-main">
        <Image
          src="/fotosite.png"
          alt="Fazendinha do Martin - 2 anos"
          fill
          priority
          sizes="(max-width: 600px) 100vw, 600px"
          className="object-cover object-top"
        />
        
        {/* Degradê sutil para fundir com o fundo da página e destacar os botões */}
        <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-bg-main via-bg-main/80 to-transparent pointer-events-none" />
      </div>

      {/* Mensagem de Boas-vindas */}
      <div className="mt-8 px-6 text-center max-w-[500px]">
        <h2 className="text-3xl font-display font-bold text-brand-primary mb-2">Bem-vindo(a)!</h2>
        <p className="text-lg text-text-muted font-medium">Venha celebrar e criar memórias divertidas na nossa fazendinha.</p>
      </div>

      {/* Área de Botões (HTML Reais) */}
      <div className="w-full max-w-[400px] p-6 text-center mt-2 relative z-10 flex flex-col gap-4">
        <Link href="/capture" className="block focus-visible:outline-none rounded-full">
          <button className="w-full py-4 text-[1.2rem] font-display font-semibold text-white bg-brand-primary rounded-full shadow-[0_4px_14px_rgba(85,139,47,0.3)] transition-all duration-200 hover:brightness-110 active:scale-95 focus-visible:ring-4 focus-visible:ring-brand-primary/50 flex items-center justify-center gap-2">
            📸 Tirar uma Foto
          </button>
        </Link>
        
        <Link href="/gallery" className="block focus-visible:outline-none rounded-full">
          <button className="w-full py-4 text-[1.1rem] font-display font-semibold text-text-muted bg-transparent border-2 border-text-muted rounded-full transition-all duration-200 hover:brightness-95 active:scale-95 focus-visible:ring-4 focus-visible:ring-text-muted/50 flex items-center justify-center gap-2">
            🖼️ Ver a Galeria
          </button>
        </Link>
      </div>
    </main>
  );
}
