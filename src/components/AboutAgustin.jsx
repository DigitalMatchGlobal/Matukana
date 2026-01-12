import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Leaf, Quote } from 'lucide-react';
import { getOptimizedImage } from "@/lib/utils"; // Importamos el optimizador

const AboutAgustin = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 5]);

  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // URL original
  const imageUrl = "https://xwotrjojocxpjwalanqh.supabase.co/storage/v1/object/public/media/matukana/AgusMatukana.png";

  return (
    <section id="sobre-agustin" className="py-24 px-4 bg-stone-50 overflow-hidden" ref={containerRef}>
      <div className="container mx-auto max-w-6xl relative">
        
        <div className="absolute top-0 right-0 -z-10 opacity-10">
            <Leaf size={400} className="text-amber-900 rotate-12" />
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* COLUMNA TEXTO */}
          <motion.div 
            variants={textVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-8 relative z-10"
          >
            <motion.div variants={itemVariants}>
                <span className="text-amber-600 font-bold tracking-widest text-xs uppercase mb-2 block">El Guardián</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-amber-900">Hola! Soy Agustín</h2>
                <div className="h-1 w-20 bg-amber-500 mt-4 rounded-full"></div>
            </motion.div>
            
            <div className="space-y-6 text-stone-700 leading-relaxed text-lg">
              <motion.p variants={itemVariants}>
                Mi camino con la medicina natural comenzó hace años, cuando sentí la necesidad de reconectar con algo más profundo. <span className="font-semibold text-amber-800">La naturaleza siempre fue mi maestra.</span>
              </motion.p>
              
              <motion.p variants={itemVariants}>
                En Salta, rodeado de montañas y valles, aprendí el lenguaje de las plantas y la sabiduría ancestral. Matukana no es solo un servicio, es un <span className="italic">camino de regreso a lo esencial.</span>
              </motion.p>
              
              <motion.div variants={itemVariants} className="bg-white/60 p-6 rounded-r-2xl border-l-4 border-amber-600 shadow-sm backdrop-blur-sm">
                <div className="flex gap-2">
                    <Quote size={24} className="text-amber-400 shrink-0" />
                    <p className="text-amber-900 font-medium italic">
                    Cada aceite, cada terapia, cada experiencia está hecha con intención, respeto y amor por la tierra que nos sostiene.
                    </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* COLUMNA IMAGEN */}
          <div className="relative h-full min-h-[400px] flex items-center justify-center">
            <motion.div 
                style={{ y, rotate }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-stone-200">
                    {/* OPTIMIZACIÓN APLICADA: Usamos la función getOptimizedImage */}
                    <img 
                        src={getOptimizedImage(imageUrl, 600)} 
                        alt="Agustín en la naturaleza"
                        loading="lazy"
                        width="450" // Evita saltos de layout
                        height="560"
                        className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-1000"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/40 to-transparent"></div>
                </div>

                <motion.div 
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-10 -left-10 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 z-20 max-w-[200px]"
                >
                    <div className="bg-green-100 p-2 rounded-full">
                        <Leaf size={20} className="text-green-700" />
                    </div>
                    <div>
                        <p className="text-xs text-stone-500 uppercase font-bold">Filosofía</p>
                        <p className="text-sm font-bold text-stone-800">100% Natural</p>
                    </div>
                </motion.div>

            </motion.div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] -z-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutAgustin;