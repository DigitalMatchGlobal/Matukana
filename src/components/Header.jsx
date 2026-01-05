import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Inicio', href: '#hero' },
    { name: 'Sobre Agustín', href: '#sobre-agustin' },
    { name: 'Productos', href: '#productos' },
    { name: 'Terapias', href: '#terapias' },
    { name: 'Experiencias', href: '#experiencias' },
    { name: 'Contacto', href: '#contacto' }
  ];

  const handleNavClick = (href) => {
    setIsMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-200">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-2xl font-bold text-amber-900 tracking-wide">MATUKANA</span>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            className="hidden md:flex items-center gap-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {navLinks.map((link, index) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="text-stone-700 hover:text-amber-800 transition-colors duration-300 text-sm font-medium"
              >
                {link.name}
              </button>
            ))}
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-stone-700 hover:text-amber-800 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 py-4 border-t border-stone-200"
          >
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="block w-full text-left py-3 text-stone-700 hover:text-amber-800 hover:bg-stone-50 transition-colors duration-300 px-4 rounded"
              >
                {link.name}
              </button>
            ))}
          </motion.div>
        )}
      </nav>
    </header>
  );
};

export default Header;