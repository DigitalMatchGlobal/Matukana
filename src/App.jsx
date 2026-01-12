import React, { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutAgustin from "@/components/AboutAgustin";
import Products from "@/components/Products";
import Therapies from "@/components/Therapies";
import Experiences from "@/components/Experiences";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { Toaster } from "@/components/ui/toaster";
import CustomCursor from "@/components/ui/CustomCursor";
import SEO from "@/components/SEO";
import { useActiveSection } from "@/lib/useActiveSection";

// IDs públicos (tienen que matchear los <section id="...">)
const PUBLIC_SECTION_IDS = [
  "inicio",
  "sobre-agustin",
  "productos",
  "terapias",
  "experiencias",
  "galeria",
  "contacto",
];

function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(
    window.location.hash === "#admin"
  );
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // ✅ Hook SIEMPRE se ejecuta (no condicional), para cumplir Rules of Hooks
  const activeSection = useActiveSection(PUBLIC_SECTION_IDS);

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminRoute(window.location.hash === "#admin");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // -------------------------
  // SEO por sección (dinámico)
  // -------------------------
  const seoBySection = useMemo(
    () => ({
      inicio: {
        title: "Matukana | Bienestar, masajes y terapias holísticas en Salta",
        description:
          "Masajes terapéuticos, terapias holísticas y medicina natural en el centro de Salta. Lunes a viernes de 12 a 20 hs. Turnos por WhatsApp.",
      },
      "sobre-agustin": {
        title: "Sobre Agustín | Matukana",
        description:
          "Conocé la historia de Matukana y el recorrido de Agustín: territorio, plantas medicinales, terapias y bienestar integral en Salta.",
      },
      productos: {
        title: "Productos naturales | Matukana (Salta)",
        description:
          "Aceites, ungüentos y preparados artesanales basados en plantas medicinales. Consultas y pedidos por WhatsApp desde Salta.",
      },
      terapias: {
        title: "Masajes terapéuticos en Salta | Matukana",
        description:
          "Masajes terapéuticos y abordajes holísticos en el centro de Salta. Acompañamiento personalizado para bienestar físico y equilibrio.",
      },
      experiencias: {
        title: "Experiencias en la naturaleza | Matukana (Salta)",
        description:
          "Caminatas, sahumos y experiencias conscientes en la naturaleza. Conexión con el territorio y bienestar integral desde Salta.",
      },
      galeria: {
        title: "Galería | Matukana",
        description:
          "Imágenes de Matukana: terapias, productos y experiencias. Naturaleza, territorio y bienestar en Salta.",
      },
      contacto: {
        title: "Contacto | Matukana (Salta) | Turnos por WhatsApp",
        description:
          "Ubicación: Ameghino 653 (Hotel Inkai, 2° piso), Salta. Lunes a viernes 12 a 20 hs. WhatsApp +54 9 3874 83-3177. Instagram @vive.matukana.",
      },
    }),
    []
  );

  const activeSEO = seoBySection[activeSection] || seoBySection.inicio;

  // -------------------------
  // Schema (válido) — NO usar WellnessCenter (da error)
  // -------------------------
  const MATUKANA_SCHEMA = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "MassageTherapist"],
      name: "Matukana",
      image: [
        "https://www.vivematukana.com/og-image.png"
      ],
      url: "https://www.vivematukana.com/",
      telephone: "+5493874833177",
      sameAs: ["https://www.instagram.com/vive.matukana/"],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Ameghino 653, Hotel Inkai, 2° piso",
        addressLocality: "Salta",
        addressRegion: "Salta",
        postalCode: "4400",
        addressCountry: "AR",
      },
      priceRange: "$$", // Recomendado por Google para LocalBusiness
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "12:00",
          closes: "20:00",
        },
      ],
      areaServed: "Salta, Argentina",
    }),
    []
  );

  // -------------------------
  // ADMIN (no index)
  // -------------------------
  if (isAdminRoute) {
    return (
      <>
        <SEO
          title="Admin | Matukana"
          description="Panel de administración"
          noindex
        />

        <div className="noise-overlay"></div>

        {!isAdminLoggedIn ? (
          <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />
        ) : (
          <AdminDashboard onLogout={() => setIsAdminLoggedIn(false)} />
        )}

        <Toaster />
      </>
    );
  }

  // -------------------------
  // PÚBLICO
  // -------------------------
  return (
    <>
      <SEO
        title={activeSEO.title}
        description={activeSEO.description}
        schema={MATUKANA_SCHEMA}
      />

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
        <Toaster />
      </div>
    </>
  );
}

export default App;
