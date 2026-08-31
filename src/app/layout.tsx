import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Fazendinha do Martin',
  description: 'Projeto em construção',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
