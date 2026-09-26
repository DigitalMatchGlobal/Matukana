import React from 'react';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Toaster } from '@/components/ui/toaster';

// Reemplaza el <link> a Google Fonts que estaba en index.html: next/font
// hostea la fuente desde el propio dominio y elimina el round-trip a
// fonts.gstatic.com (y el flash de texto sin estilo).
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

const SITE_URL = 'https://vivematukana.com';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#fafaf9',
};

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Matukana | Medicina Natural & Experiencias',
    template: '%s | Matukana',
  },
  description:
    'Medicina natural, terapias holísticas y experiencias conscientes en Salta. Conecta con la naturaleza y tu bienestar en los Valles Calchaquíes.',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.ico',
  },
  verification: {
    google: 'xryn1IsLJ4g7RHYlLrmspNccLGfc-ugpGYq4Al',
  },
  openGraph: {
    type: 'website',
    siteName: 'Matukana',
    locale: 'es_AR',
    url: SITE_URL,
    title: 'Matukana | Medicina Natural',
    description:
      'Descubre el poder de las plantas en Salta. Aceites esenciales, masajes y experiencias en la naturaleza.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Matukana - Experiencias en la Naturaleza',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Matukana | Medicina Natural',
    description: 'Conecta con la naturaleza y tu bienestar en Salta.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="bg-stone-50 text-stone-900 antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
