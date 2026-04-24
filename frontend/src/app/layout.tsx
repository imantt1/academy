import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Imantt Academy — Transforming Infrastructure',
  description:
    'Plataforma educativa especializada en sistemas RTP (Reinforced Thermoplastic Pipe). Certifícate en inspección, instalación y gestión de integridad.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
