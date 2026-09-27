'use client';

import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CustomCursor from '@/components/ui/CustomCursor';
import AboutAgustin from '@/components/AboutAgustin';
import Products from '@/components/Products';
import Therapies from '@/components/Therapies';
import Experiences from '@/components/Experiences';
import Gallery from '@/components/Gallery';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

// Nota de migración: en Vite estas secciones venían con React.lazy + Suspense
// para achicar el bundle inicial del SPA. Acá no aplica — Next renderiza el
// HTML completo en el server, así que diferirlas sólo lograba que el crawler
// (y el usuario) vieran huecos con un spinner. Ver docs/MIGRACION-NEXT.md.
export default function HomeClient() {
  return (
    <>
      <CustomCursor />
      <div className="noise-overlay"></div>

      <div className="min-h-screen bg-stone-50">
        <Header />

        <main>
          <section id="inicio">
            <Hero />
          </section>

          <section id="sobre-agustin">
            <AboutAgustin />
          </section>

          <section id="productos">
            <Products />
          </section>

          <section id="terapias">
            <Therapies />
          </section>

          <section id="experiencias">
            <Experiences />
          </section>

          <section id="galeria">
            <Gallery />
          </section>

          <section id="contacto">
            <Contact />
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
