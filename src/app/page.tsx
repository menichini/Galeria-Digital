import Link from 'next/link';

export default function Home() {
  return (
    <main className="animate-in" style={{ padding: 0 }}>
      {/* Hero Header */}
      <div 
        style={{
          width: '100%',
          height: '250px',
          backgroundImage: 'url(/farm-hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          position: 'relative'
        }}
      >
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '80px',
          background: 'linear-gradient(to top, var(--color-bg-light) 10%, transparent)'
        }} />
      </div>

      <div style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginTop: '-1rem', position: 'relative', zIndex: 2 }}>
          Fazendinha do Martin
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xl)' }}>
          Seja bem-vindo(a) à festa! 🎉<br/>Deixe sua marca e divirta-se.
        </p>

        <Link href="/capture" style={{ textDecoration: 'none' }}>
          <button className="btn btn-primary">
            📸 Tirar uma Foto!
          </button>
        </Link>
        
        <Link href="/gallery" style={{ textDecoration: 'none' }}>
          <button className="btn btn-ghost" style={{ marginTop: 'var(--spacing-md)' }}>
            🖼️ Ver o Mural
          </button>
        </Link>
      </div>
    </main>
  );
}
