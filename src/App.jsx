import React, { useState, useEffect } from "react";
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

function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(
    window.location.hash === "#admin"
  );
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminRoute(window.location.hash === "#admin");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // --- LÓGICA DE ADMIN ---
  if (isAdminRoute) {
    return (
      <>
        <SEO title="Admin | Matukana" description="Panel de administración" noindex />

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

  // --- SITIO PÚBLICO (EXPERIENCIA) ---
  return (
    <>
      <SEO
        title="Matukana | Bienestar, masajes y terapias holísticas en Salta"
        description="Masajes terapéuticos, terapias holísticas y medicina natural en el centro de Salta. Productos naturales y acompañamientos personalizados. Reservas por WhatsApp."
        // ogImage="/og-image.png" // opcional, ya toma el default
        schema={{
          "@context": "https://schema.org",
          "@type": "WellnessCenter",
          "name": "Matukana",
          "url": "https://www.vivematukana.com",
          "telephone": "+54 387 4833177",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Ameghino 653, Hotel Inkai, 2° piso",
            "addressLocality": "Salta",
            "addressRegion": "Salta",
            "postalCode": "4400",
            "addressCountry": "AR"
          },
          "areaServed": "Salta, Argentina"
        }}
      />

      <CustomCursor />
      <div className="noise-overlay"></div>

      <div className="min-h-screen bg-stone-50">
        <Header />
        <main>
          <Hero />
          <AboutAgustin />
          <Products />
          <Therapies />
          <Experiences />
          <Gallery />
          <Contact />
        </main>
        <Footer />
        <Toaster />
      </div>
    </>
  );
}

export default App;
