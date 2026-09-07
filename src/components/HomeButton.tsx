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
      className="fixed top-4 left-4 z-[1000] bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 text-text-main font-medium cursor-pointer flex items-center gap-2 shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-primary/50"
    >
      <span className="text-xl">🏠</span>
      Início
    </button>
  );
}
