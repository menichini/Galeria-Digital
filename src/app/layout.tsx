import './globals.css';
import React from 'react';
import { Outfit, Inter } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

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
      <body className={`${inter.variable} ${outfit.variable}`}>
        {/* We removed the ugly nav to allow a clean full-screen mobile experience */}
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
