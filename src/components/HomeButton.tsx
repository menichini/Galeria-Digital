'use client';
import { usePathname, useRouter } from 'next/navigation';

export default function HomeButton() {
  const pathname = usePathname();
  const router = useRouter();

  // Não mostrar na página inicial nem no painel admin
  if (pathname === '/' || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <button
      onClick={() => router.push('/')}
      style={{
        position: 'fixed',
        top: '1rem',
        left: '1rem',
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '50px',
        padding: '0.5rem 1rem',
        color: '#fff',
        fontWeight: '500',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <span style={{ fontSize: '1.2rem' }}>🏠</span>
      Início
    </button>
  );
}
