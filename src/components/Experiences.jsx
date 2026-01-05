import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
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
        .order('date', { ascending: true }); // Closest dates first
      
      if (!error && data) {
        // Sort so that upcoming/defined dates are first, then undefined/null dates at the end
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
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section id="experiencias" className="py-20 px-4 bg-stone-50" ref={ref}>
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">Calendario de Experiencias</h2>
          <p className="text-stone-700 max-w-2xl mx-auto">
            Próximas fechas para vivir encuentros profundos con la naturaleza y la comunidad.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900"></div>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {experiences.map((experience) => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))}
            {experiences.length === 0 && (
               <div className="col-span-full text-center py-12 text-stone-500 italic">
                 Pronto anunciaremos nuevas fechas y experiencias.
               </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Experiences;