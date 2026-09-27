import React from 'react';
import HomeClient from '@/components/HomeClient';

// JSON-LD de negocio local. Vive en el server component: se renderiza en el
// HTML inicial, que es donde los crawlers lo leen.
const MATUKANA_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'MassageTherapist'],
  name: 'Matukana',
  image: ['https://www.vivematukana.com/og-image.png'],
  url: 'https://www.vivematukana.com/',
  telephone: '+5493874833177',
  sameAs: ['https://www.instagram.com/vive.matukana/'],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Ameghino 653, Hotel Inkai, 2° piso',
    addressLocality: 'Salta',
    addressRegion: 'Salta',
    postalCode: '4400',
    addressCountry: 'AR',
  },
  priceRange: '$$',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '12:00',
      closes: '20:00',
    },
  ],
  areaServed: 'Salta, Argentina',
};

export const metadata = {
  title: 'Matukana | Bienestar, masajes y terapias holísticas en Salta',
  description:
    'Masajes terapéuticos, terapias holísticas y medicina natural en el centro de Salta. Lunes a viernes de 12 a 20 hs. Turnos por WhatsApp.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(MATUKANA_SCHEMA) }}
      />
      <HomeClient />
    </>
  );
}
