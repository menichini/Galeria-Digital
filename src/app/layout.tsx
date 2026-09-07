import './globals.css';
import React from 'react';
import { Outfit, Inter, Pacifico } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const pacifico = Pacifico({ weight: '400', subsets: ['latin'], variable: '--font-pacifico' });

import HomeButton from '../components/HomeButton';

import { UploadQueueSync } from '../components/UploadQueueSync';

export const metadata = {
  title: 'Fazendinha do Martin',
  description: 'Galeria digital do aniversário do Martin',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${outfit.variable} ${pacifico.variable} bg-bg-main text-text-main font-sans antialiased overflow-x-hidden`}>
        <UploadQueueSync />
        {/* We removed the ugly nav to allow a clean full-screen mobile experience */}
        <HomeButton />
        <div className="flex flex-col min-h-[100dvh] w-full max-w-[900px] mx-auto relative">
          {children}
        </div>
      </body>
    </html>
  );
}
