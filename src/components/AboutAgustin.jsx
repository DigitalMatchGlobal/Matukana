import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';

const AboutAgustin = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="sobre-agustin" className="py-20 px-4 bg-white" ref={ref}>
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900">Sobre Agustín</h2>
            
            <div className="space-y-4 text-stone-700 leading-relaxed">
              <p>
                Mi camino con la medicina natural comenzó hace años, cuando sentí la necesidad de reconectar con algo más profundo, más auténtico. La naturaleza siempre fue mi maestra.
              </p>
              
              <p>
                En Salta, rodeado de montañas y valles, aprendí el lenguaje de las plantas, la sabiduría ancestral de los remedios naturales y el poder transformador del tacto consciente.
              </p>
              
              <p>
                Matukana nació como un espacio donde la medicina tradicional, las terapias corporales y la conexión con la naturaleza se encuentran. No es solo un servicio, es un camino de regreso a lo esencial.
              </p>
              
              <p className="text-amber-800 font-medium">
                Cada aceite, cada terapia, cada experiencia está hecha con intención, respeto y amor por la tierra que nos sostiene.
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img 
                alt="Agustín en la naturaleza de Salta"
                className="w-full h-full object-cover"
               src="https://xwotrjojocxpjwalanqh.supabase.co/storage/v1/object/public/media/products/Logo_Matukana.png" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-green-700 rounded-full opacity-20 blur-3xl" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-amber-700 rounded-full opacity-20 blur-3xl" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutAgustin;