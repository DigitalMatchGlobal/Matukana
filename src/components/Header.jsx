import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sprout } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detectar scroll para el efecto "Glass"
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#hero' },
    { name: 'Sobre Agustín', href: '#sobre-agustin' },
    { name: 'Productos', href: '#productos' },
    { name: 'Terapias', href: '#terapias' },
    { name: 'Experiencias', href: '#experiencias' },
    { name: 'Contacto', href: '#contacto' }
  ];

  // FUNCIÓN CORREGIDA PARA MÓVIL Y DESKTOP
  const handleNavClick = (href) => {
    setIsMenuOpen(false); // 1. Cerrar menú primero

    // 2. Usar un pequeño timeout para dar tiempo a que el menú empiece a cerrar
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        // 3. Cálculo manual del scroll para compensar el Header fijo
        const headerOffset = 85; // Altura aproximada del header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }, 150); // 150ms de espera es imperceptible pero arregla el bug en móviles
  };

  return (
    <header 
      // Ajuste: Si está scrolleado O el menú está abierto, ponemos fondo sólido/glass
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || isMenuOpen
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-stone-200/50 py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          
          {/* Logo Animado */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => handleNavClick('#hero')}
          >
            <div className={`p-2 rounded-full transition-colors ${scrolled || isMenuOpen ? 'bg-amber-100' : 'bg-white/50 backdrop-blur-sm'}`}>
                <Sprout size={20} className="text-amber-700 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className={`text-xl font-bold tracking-wide transition-colors ${scrolled || isMenuOpen ? 'text-amber-900' : 'text-amber-900'}`}>
                MATUKANA
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            className="hidden md:flex items-center gap-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="relative group text-stone-700 hover:text-amber-900 transition-colors duration-300 text-sm font-medium"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menú"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              // 🚀 AQUÍ ESTÁ LA CLAVE DE LA VELOCIDAD:
              transition={{ duration: 0.2, ease: "easeInOut" }} 
              className="md:hidden overflow-hidden bg-white/90 backdrop-blur-xl border-t border-stone-100/50 mt-2 rounded-b-2xl shadow-xl"
            >
              <div className="flex flex-col p-4 space-y-2">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.href)}
                    className="block w-full text-left py-3 px-4 text-stone-700 hover:text-amber-900 hover:bg-amber-50 rounded-lg transition-all duration-200 font-medium active:bg-amber-100"
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;