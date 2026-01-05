import React from 'react';
import { Sprout } from 'lucide-react';

const Footer = () => {
  const handleAdminClick = (e) => {
    e.preventDefault();
    window.location.hash = 'admin';
  };

  return (
    <footer className="bg-amber-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sprout size={24} />
              <span className="text-2xl font-bold">MATUKANA</span>
            </div>
            <p className="text-stone-200 text-sm">
              Medicina natural, terapias y experiencias conscientes en Salta, Argentina.
            </p>
          </div>

          <div className="space-y-3">
            <span className="font-semibold text-lg">Navegación</span>
            <nav className="flex flex-col gap-2">
              <button onClick={() => document.querySelector('#hero')?.scrollIntoView({ behavior: 'smooth' })} className="text-stone-200 hover:text-white text-sm text-left transition-colors">Inicio</button>
              <button onClick={() => document.querySelector('#sobre-agustin')?.scrollIntoView({ behavior: 'smooth' })} className="text-stone-200 hover:text-white text-sm text-left transition-colors">Sobre Agustín</button>
              <button onClick={() => document.querySelector('#productos')?.scrollIntoView({ behavior: 'smooth' })} className="text-stone-200 hover:text-white text-sm text-left transition-colors">Productos</button>
              <button onClick={() => document.querySelector('#terapias')?.scrollIntoView({ behavior: 'smooth' })} className="text-stone-200 hover:text-white text-sm text-left transition-colors">Terapias</button>
              <button onClick={() => document.querySelector('#experiencias')?.scrollIntoView({ behavior: 'smooth' })} className="text-stone-200 hover:text-white text-sm text-left transition-colors">Experiencias</button>
            </nav>
          </div>

          <div className="space-y-3">
            <span className="font-semibold text-lg">Contacto</span>
            <div className="space-y-2 text-sm text-stone-200">
              <p>Salta, Argentina</p>
              <p>+54 9 3874 83-3177</p>
              <p className="text-xs italic mt-4">Con amor desde el corazón de los valles</p>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-700 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-stone-200 text-sm">
            © {new Date().getFullYear()} Matukana. Hecho con intención y respeto.
          </p>
          <button 
            onClick={handleAdminClick}
            className="text-stone-300 hover:text-white text-xs transition-colors"
          >
            Administración
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;