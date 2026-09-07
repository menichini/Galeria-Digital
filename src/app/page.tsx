import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="animate-in" style={{ padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
      {/* Hero / Arte Principal */}
      <div 
        style={{
          width: '100%',
          maxWidth: '600px', // Tamanho máximo para desktop não distorcer
          height: '65vh', // Ocupa boa parte da tela em mobile
          minHeight: '400px',
          maxHeight: '800px',
          position: 'relative',
          borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        <Image
          src="/fotosite.png"
          alt="Fazendinha do Martin - 2 anos"
          fill
          priority
          sizes="(max-width: 600px) 100vw, 600px"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        
        {/* Degradê sutil para fundir com o fundo da página e destacar os botões */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '150px',
          background: 'linear-gradient(to top, var(--color-bg-main) 5%, transparent)'
        }} />
      </div>

      {/* Área de Botões (HTML Reais) */}
      <div style={{ 
        padding: 'var(--spacing-lg)', 
        textAlign: 'center', 
        width: '100%', 
        maxWidth: '400px', 
        marginTop: '-2rem', // Puxa os botões um pouco para cima do degradê
        position: 'relative', 
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <Link href="/capture" style={{ textDecoration: 'none', display: 'block' }}>
          <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.2rem' }}>
            📸 Tirar uma Foto
          </button>
        </Link>
        
        <Link href="/gallery" style={{ textDecoration: 'none', display: 'block' }}>
          <button className="btn btn-ghost" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
            🖼️ Ver a Galeria
          </button>
        </Link>
      </div>
    </main>
  );
}
