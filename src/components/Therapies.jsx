import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import TherapyCard from '@/components/TherapyCard';
import { supabase } from '@/lib/customSupabaseClient';

const Therapies = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [therapies, setTherapies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTherapies = async () => {
      const { data, error } = await supabase
        .from('therapies')
        .select('*')
        .order('name');
      
      if (!error && data) {
        setTherapies(data);
      }
      setLoading(false);
    };

    fetchTherapies();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <section id="terapias" className="py-24 px-4 bg-stone-50/30" ref={ref}>
      <div className="container mx-auto max-w-7xl">
        
        {/* Encabezado Estilo Boutique (Igual que Productos) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <div className="inline-flex items-center justify-center p-2 bg-emerald-100/50 text-emerald-800 rounded-full mb-4">
            <Sparkles size={16} className="mr-2" />
            <span className="text-xs font-bold uppercase tracking-widest">Relajación & Sanación</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-serif font-bold text-amber-900 mb-6">
            Terapias y Masajes
          </h2>
          <p className="text-stone-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Espacios sagrados de sanación donde el cuerpo, la mente y el alma encuentran su equilibrio natural a través de técnicas ancestrales.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading ? (
           <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900"></div>
           </div>
        ) : (
          /* Grid de Terapias */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10"
          >
            {therapies.map((therapy) => (
              <TherapyCard key={therapy.id} therapy={therapy} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Therapies;