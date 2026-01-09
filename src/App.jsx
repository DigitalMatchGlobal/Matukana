import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AboutAgustin from '@/components/AboutAgustin';
import Products from '@/components/Products';
import Therapies from '@/components/Therapies';
import Experiences from '@/components/Experiences';
import Gallery from '@/components/Gallery';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { Toaster } from '@/components/ui/toaster';
import CustomCursor from '@/components/ui/CustomCursor'; // 1. Importamos el Cursor Spirit

function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(window.location.hash === '#admin');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminRoute(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // --- LÓGICA DE ADMIN ---
  if (isAdminRoute) {
    return (
      <>
        {/* Agregamos el ruido también en Admin para mantener la identidad visual */}
        <div className="noise-overlay"></div>
        {/* Nota: No ponemos el CustomCursor aquí para mantener la precisión del puntero en la gestión de datos */}
        
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
      <Helmet>
        <title>Matukana - Medicina Natural, Terapias y Experiencias en la Naturaleza</title>
        <meta name="description" content="Descubre Matukana: medicina natural, terapias corporales y experiencias conscientes en Salta, Argentina. Aceites, ungüentos, masajes y conexión auténtica con la naturaleza." />
      </Helmet>
      
      {/* 2. Efectos Visuales Globales */}
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