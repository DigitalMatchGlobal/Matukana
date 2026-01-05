import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { MessageCircle, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Contact = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Hola! Me gustaría conectar con Matukana.');
    window.open(`https://wa.me/5493874833177?text=${message}`, '_blank');
  };

  return (
    <section id="contacto" className="py-20 px-4 bg-white" ref={ref}>
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">Conectemos</h2>
            <p className="text-stone-700 max-w-2xl mx-auto">
              La mejor manera de comenzar es una conversación sincera. Escribime y conversemos sobre lo que necesitás.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gradient-to-br from-green-50 to-amber-50 rounded-2xl p-8 shadow-lg"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-2 text-stone-700">
                <MapPin className="text-amber-700" size={20} />
                <span>Salta, Argentina</span>
              </div>

              <div className="flex items-center justify-center gap-2 text-stone-700">
                <Phone className="text-amber-700" size={20} />
                <span>+54 9 3874 83-3177</span>
              </div>

              <Button
                onClick={handleWhatsAppClick}
                className="bg-green-600 hover:bg-green-700 text-white px-12 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <MessageCircle className="mr-2" size={24} />
                Escribir por WhatsApp
              </Button>

              <p className="text-sm text-stone-600 italic">
                "La conexión humana es el primer paso de cualquier sanación"
              </p>
            </div>
          </motion.div>

          <div className="pt-8 text-stone-600 text-sm">
            <p>Respondo personalmente cada mensaje.</p>
            <p>No hay formularios, solo conversación auténtica.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;