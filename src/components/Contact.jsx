import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { MessageCircle, MapPin, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Contact = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Hola! Me gustaría conectar con Matukana.');
    window.open(`https://wa.me/5493874833177?text=${message}`, '_blank');
  };

  return (
    <section id="contacto" className="py-24 px-4 bg-white relative overflow-hidden" ref={ref}>
      
      {/* Fondo sutil animado */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          <div>
            <span className="text-green-600 font-bold tracking-widest text-xs uppercase mb-2 block">Hablemos</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-amber-900 mb-4">Conectemos</h2>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto">
              La mejor manera de comenzar es una conversación sincera. Sin bots, sin formularios complejos.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            // GLASSMORPHISM CARD
            className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl relative overflow-hidden group"
          >
            {/* Brillo de fondo en la tarjeta */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-50"></div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
                
                {/* Info de contacto */}
                <div className="space-y-6 text-left">
                     <div className="flex items-center gap-4 group/item hover:bg-stone-50 p-3 rounded-xl transition-colors">
                        <div className="bg-amber-100 p-3 rounded-full text-amber-700 group-hover/item:scale-110 transition-transform">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-stone-500 uppercase font-bold">Ubicación</p>
                            <p className="text-stone-800 font-medium">Salta, Argentina</p>
                        </div>
                     </div>

                     <div className="flex items-center gap-4 group/item hover:bg-stone-50 p-3 rounded-xl transition-colors">
                        <div className="bg-amber-100 p-3 rounded-full text-amber-700 group-hover/item:scale-110 transition-transform">
                            <Phone size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-stone-500 uppercase font-bold">Teléfono</p>
                            <p className="text-stone-800 font-medium">+54 9 3874 83-3177</p>
                        </div>
                     </div>
                </div>

                {/* Botón CTA Gigante */}
                <div className="flex flex-col items-center justify-center space-y-4">
                    <Button
                        onClick={handleWhatsAppClick}
                        className="relative overflow-hidden bg-green-600 hover:bg-green-700 text-white px-10 py-8 text-xl rounded-full shadow-xl shadow-green-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full md:w-auto group"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            <MessageCircle size={28} />
                            Iniciar Chat
                            <Send size={20} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                        
                        {/* Efecto Shimmer (Brillo que pasa) */}
                        <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 animate-shimmer" />
                    </Button>
                    <p className="text-sm text-stone-500 italic">
                        Respondo personalmente.
                    </p>
                </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default Contact;