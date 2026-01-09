import React from 'react';
import { ArrowUp, Instagram, Facebook, Zap } from 'lucide-react'; 
import { Button } from '@/components/ui/button';

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
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-amber-900/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          
          {/* Columna Marca */}
          <div className="space-y-6 md:col-span-2">
            <div className="flex items-center gap-3">
              {/* LOGO REAL MATUKANA */}
              <div className="bg-stone-800 p-2 rounded-xl border border-stone-700/50 shadow-lg group hover:border-amber-500/30 transition-all duration-500">
                  <img 
                    src="https://xwotrjojocxpjwalanqh.supabase.co/storage/v1/object/public/media/products/Logo_Matukana.png" 
                    alt="Logo Matukana"
                    className="w-10 h-10 object-contain group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500"
                  />
              </div>
              <span className="text-3xl font-serif font-bold tracking-wide text-stone-100">MATUKANA</span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed max-w-sm">
              Medicina natural, terapias y experiencias conscientes. Un puente entre la sabiduría de la tierra y tu bienestar en Salta, Argentina.
            </p>
            <div className="flex gap-4 pt-2">
                {/* Redes Sociales con efecto hover */}
                <a href="https://www.instagram.com/vive.matukana/" target="_blank" rel="noopener noreferrer" className="bg-stone-800 p-2 rounded-full hover:bg-amber-600 hover:text-white text-stone-400 transition-all duration-300 hover:scale-110"><Instagram size={20} /></a>
                <a href="#" className="bg-stone-800 p-2 rounded-full hover:bg-blue-600 hover:text-white text-stone-400 transition-all duration-300 hover:scale-110"><Facebook size={20} /></a>
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
        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-stone-500 text-xs">
              © {new Date().getFullYear()} Matukana. Todos los derechos reservados.
            </p>
            
            {/* --- FIRMA DIGITAL MATCH GLOBAL (BRANDING AZUL/VIOLETA) --- */}
            <a 
              href="https://www.digitalmatchglobal.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              // Borde hover cambia a Azul Eléctrico (#2563EB)
              className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-950 border border-stone-800 hover:border-[#2563EB]/50 transition-all duration-500 overflow-hidden"
            >
                {/* Glow de fondo: Azul Eléctrico al pasar el mouse */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2563EB]/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                
                <span className="text-[10px] text-stone-500 uppercase tracking-wider font-medium group-hover:text-stone-400 transition-colors">Made by</span>
                
                {/* GRADIENTE DE MARCA: #2563EB (Azul) a #6D5DFE (Violeta) */}
                <span className="text-xs font-bold bg-gradient-to-r from-[#2563EB] to-[#6D5DFE] bg-clip-text text-transparent transition-all duration-300 group-hover:brightness-125">
                    DigitalMatchGlobal
                </span>
                
                {/* Rayo: Se prende en Violeta Tech (#6D5DFE) */}
                <Zap size={10} className="text-stone-600 group-hover:text-[#6D5DFE] group-hover:fill-[#6D5DFE] transition-all duration-300" />
            </a>
          </div>
          
          <div className="flex items-center gap-6">
              <button 
                onClick={handleAdminClick}
                className="text-stone-700 hover:text-stone-400 text-xs transition-colors uppercase tracking-wider font-bold"
              >
                Admin
              </button>
              
              <Button 
                onClick={scrollToTop}
                variant="outline"
                size="icon"
                className="rounded-full bg-stone-800 border-stone-700 text-stone-300 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all shadow-lg hover:shadow-amber-900/20"
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