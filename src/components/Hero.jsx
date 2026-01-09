import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles, ArrowDown, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Hola! Me gustaría conocer más sobre Matukana.');
    window.open(`https://wa.me/5493874833177?text=${message}`, '_blank');
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center pt-20 px-4 relative overflow-hidden bg-stone-50">
      
      {/* 1. FONDO ATMOSFÉRICO (Blobs Animados) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
         {/* Blob Ámbar */}
         <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-amber-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
         {/* Blob Verde */}
         <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-green-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
         {/* Blob Rosa suave (equilibrar) */}
         <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-stone-200/60 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
         
         {/* Pattern sutil encima */}
         <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
      </div>

      <div className="container mx-auto max-w-4xl text-center relative z-10">
        
        {/* Badge de Bienvenida */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/40 px-4 py-1.5 rounded-full text-amber-800 text-sm font-semibold shadow-sm mb-6"
        >
            <Sparkles size={14} className="text-amber-500" />
            <span>Bienvenido a Matukana</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-amber-900 leading-tight">
            Reconecta con tu <br/>
            <span className="relative inline-block mt-2">
                <span className="relative z-10">Esencia Natural</span>
                {/* Subrayado orgánico */}
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-green-300 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" opacity="0.6" />
                </svg>
            </span>
          </h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed"
          >
            Medicina natural, terapias corporales y experiencias conscientes en la naturaleza.
            Un espacio de sanación y conexión auténtica en el corazón de Salta.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* BOTÓN SHIMMER (Igual que contacto) */}
            <Button
              onClick={handleWhatsAppClick}
              className="group relative overflow-hidden bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-full shadow-xl shadow-green-100 transition-all duration-300 hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center gap-2">
                 <MessageCircle size={22} />
                 Contactar por WhatsApp
              </span>
              <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 animate-shimmer" />
            </Button>
            
            <Button
                onClick={() => document.getElementById('productos')?.scrollIntoView({behavior: 'smooth'})} 
                variant="outline" 
                className="px-8 py-6 text-lg rounded-full border-2 border-stone-200 text-stone-600 hover:border-amber-600 hover:text-amber-700 bg-transparent hover:bg-amber-50 transition-all"
            >
                Ver Productos
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Indicador de Scroll Down */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1, duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-stone-400"
      >
        <ArrowDown size={24} />
      </motion.div>

    </section>
  );
};

export default Hero;