import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
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
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section id="terapias" className="py-20 px-4 bg-white" ref={ref}>
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">Terapias y Masajes</h2>
          <p className="text-stone-700 max-w-2xl mx-auto">
            Espacios de sanación donde el cuerpo y el alma encuentran su equilibrio natural.
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