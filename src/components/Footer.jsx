import React from 'react';
import { Sprout, ArrowUp, Instagram, Facebook } from 'lucide-react';
import { Button } from './ui/button';

const Footer = () => {
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminClick = (e) => {
    e.preventDefault();
    window.location.hash = 'admin';
  };

  const NavLink = ({ target, children }) => (
    <button 
        onClick={() => document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })} 
        className="text-stone-300 hover:text-white text-sm text-left transition-colors group flex items-center gap-2"
    >
        <span className="w-0 group-hover:w-2 h-0.5 bg-amber-500 transition-all duration-300 rounded-full"></span>
        {children}
    </button>
  );

  return (
    <footer className="bg-stone-900 text-white pt-20 pb-10 px-4 relative overflow-hidden">
      
      {/* Círculo decorativo gigante de fondo */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-amber-900/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          
          {/* Columna Marca */}
          <div className="space-y-6 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="bg-stone-800 p-2 rounded-lg">
                  <Sprout size={32} className="text-amber-500" />
              </div>
              <span className="text-3xl font-serif font-bold tracking-wide">MATUKANA</span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed max-w-sm">
              Medicina natural, terapias y experiencias conscientes. Un puente entre la sabiduría de la tierra y tu bienestar en Salta, Argentina.
            </p>
            <div className="flex gap-4 pt-2">
                {/* Redes Sociales con efecto hover */}
                <a href="#" className="bg-stone-800 p-2 rounded-full hover:bg-amber-600 transition-colors"><Instagram size={20} /></a>
                <a href="#" className="bg-stone-800 p-2 rounded-full hover:bg-blue-600 transition-colors"><Facebook size={20} /></a>
            </div>
          </div>

          {/* Columna Navegación */}
          <div className="space-y-4">
            <span className="font-bold text-lg text-amber-500 block mb-4">Explorar</span>
            <nav className="flex flex-col gap-3">
              <NavLink target="#hero">Inicio</NavLink>
              <NavLink target="#sobre-agustin">Sobre Agustín</NavLink>
              <NavLink target="#productos">Productos</NavLink>
              <NavLink target="#terapias">Terapias</NavLink>
              <NavLink target="#experiencias">Experiencias</NavLink>
            </nav>
          </div>

          {/* Columna Contacto */}
          <div className="space-y-4">
            <span className="font-bold text-lg text-amber-500 block mb-4">Contacto</span>
            <div className="space-y-3 text-sm text-stone-300">
              <p className="flex items-start gap-3">
                <span className="opacity-50">📍</span> Salta, Argentina
              </p>
              <p className="flex items-start gap-3">
                <span className="opacity-50">📱</span> +54 9 3874 83-3177
              </p>
              <p className="text-xs italic text-stone-500 mt-6 border-l-2 border-stone-700 pl-3">
                "Con amor desde el corazón de los valles"
              </p>
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-stone-500 text-xs">
            © {new Date().getFullYear()} Matukana. Todos los derechos reservados.
          </p>
          
          <div className="flex items-center gap-6">
              <button 
                onClick={handleAdminClick}
                className="text-stone-600 hover:text-amber-500 text-xs transition-colors uppercase tracking-wider font-bold"
              >
                Acceso Admin
              </button>
              
              <Button 
                onClick={scrollToTop}
                variant="outline"
                size="icon"
                className="rounded-full bg-stone-800 border-stone-700 text-stone-300 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all"
              >
                <ArrowUp size={18} />
              </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;