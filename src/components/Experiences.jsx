import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { MapPin } from 'lucide-react'; // Icono de mapa para experiencias
import ExperienceCard from '@/components/ExperienceCard';
import { supabase } from '@/lib/customSupabaseClient';

const Experiences = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      // Fetch upcoming experiences first
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('date', { ascending: true }); 
      
      if (!error && data) {
        // Tu lógica de ordenamiento es perfecta, la mantenemos
        const sorted = data.sort((a, b) => {
           if (a.date && !b.date) return -1;
           if (!a.date && b.date) return 1;
           if (a.date && b.date) return new Date(a.date) - new Date(b.date);
           return 0;
        });
        setExperiences(sorted);
      }
      setLoading(false);
    };

    fetchExperiences();
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
    <section id="experiencias" className="py-24 px-4 bg-stone-50" ref={ref}>
      <div className="container mx-auto max-w-7xl">
        
        {/* Encabezado Estilo Boutique */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <div className="inline-flex items-center justify-center p-2 bg-amber-100/50 text-amber-800 rounded-full mb-4">
            <MapPin size={16} className="mr-2" />
            <span className="text-xs font-bold uppercase tracking-widest">Comunidad & Naturaleza</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-serif font-bold text-amber-900 mb-6">
            Calendario de Experiencias
          </h2>
          <p className="text-stone-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Próximas fechas para vivir encuentros profundos, retiros y talleres en sintonía con los ciclos naturales.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900"></div>
          </div>
        ) : (
          /* Grid de Experiencias */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10"
          >
            {experiences.map((experience) => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))}
            
            {experiences.length === 0 && (
               <div className="col-span-full text-center py-12 text-stone-500 italic bg-white rounded-xl border border-dashed border-stone-200">
                 Pronto anunciaremos nuevas fechas y experiencias para esta temporada.
               </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Experiences;