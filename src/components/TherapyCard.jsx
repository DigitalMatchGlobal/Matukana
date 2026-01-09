import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, Info, X, Sparkles, RotateCw, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const TherapyCard = ({ therapy }) => {
  const { toast } = useToast();
  const [isFlipped, setIsFlipped] = useState(false);

  const handleBooking = async (e) => {
    e.stopPropagation();
    const message = encodeURIComponent(`Hola! Quisiera solicitar un turno para: ${therapy.name}`);
    window.open(`https://wa.me/5493874833177?text=${message}`, '_blank');
    
    // Guardar en Supabase
    try {
        await supabase.from('inquiries').insert([{ type: 'therapy', item_name: therapy.name, status: 'new' }]);
    } catch(err) { console.error(err); }
  };

  return (
    // Altura 550px para coincidir con ProductCard
    <div className="group h-[550px] perspective-1000 relative"> 
      
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        className="relative w-full h-full preserve-3d"
        style={{ transformStyle: 'preserve-3d' }}
      >
        
        {/* ================= FRENTE ================= */}
        <div className="absolute inset-0 backface-hidden bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden">
          
          {/* Botón "Más info" Píldora */}
          {(therapy.benefits || therapy.description) && (
            <button 
                onClick={() => setIsFlipped(true)}
                className="absolute top-4 right-4 z-10 bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Ver beneficios"
            >
                <Info size={12} strokeWidth={2.5} /> Más info
            </button>
          )}

          {/* Imagen */}
          <div className="w-full h-64 bg-gradient-to-b from-stone-50 to-white flex items-center justify-center p-6 relative pt-14"> 
            {therapy.images && therapy.images.length > 0 ? (
              <img 
                src={therapy.images[0]} 
                alt={therapy.name} 
                className="h-full w-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
               <div className="flex flex-col items-center justify-center text-stone-300">
                 <div className="p-4 bg-white rounded-full shadow-sm">
                    <Sparkles size={32} className="text-amber-200" />
                 </div>
               </div>
            )}
          </div>

          <div className="p-5 flex flex-col flex-1">
            <h3 className="text-xl font-serif font-bold text-amber-900 leading-tight mb-2">
                {therapy.name}
            </h3>
            
            <p className="text-stone-500 text-sm line-clamp-2 mb-3">
                {therapy.description}
            </p>

            {/* Caja de Duración (Estilo similar al "Uso" de productos) */}
            {therapy.duration && (
              <div className="mt-auto mb-4 flex items-start gap-2 p-3 bg-stone-50/80 rounded-lg border border-stone-100">
                <Clock size={14} className="text-amber-600 mt-1 shrink-0" />
                <p className="text-xs text-stone-600 leading-relaxed">
                  <span className="font-bold text-stone-700">Duración: </span>
                  <span className="italic">{therapy.duration}</span>
                </p>
              </div>
            )}
            
            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-stone-100 mt-auto">
              <div className="flex flex-col">
                 {/* Si tuvieras precio en terapias, iría aquí. Si no, ponemos "Valor" genérico o nada */}
                 <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Valor</span>
                 <span className="text-lg font-bold text-amber-900">{therapy.price || "Consultar"}</span>
              </div>
              <Button onClick={handleBooking} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-5 shadow-lg shadow-emerald-100 transition-transform active:scale-95">
                <CalendarDays size={16} className="mr-2" /> Solicitar
              </Button>
            </div>
          </div>
        </div>

        {/* ================= REVERSO (BENEFICIOS) ================= */}
        <div 
            className="absolute inset-0 backface-hidden bg-stone-100 rounded-2xl border border-stone-200 shadow-inner p-6 flex flex-col text-center"
            style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
        >
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <Sparkles size={200} />
            </div>

            <button 
                onClick={() => setIsFlipped(false)}
                className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-200/50 rounded-full transition-colors z-20"
            >
                <X size={20} />
            </button>

            <div className="relative z-10 flex flex-col h-full justify-center pt-8">
                <div className="mb-4">
                    <span className="inline-block p-2 bg-amber-200/50 rounded-full text-amber-800 mb-2">
                        <Leaf size={20} />
                    </span>
                    <h4 className="font-serif text-lg font-bold text-amber-900">Beneficios & Bienestar</h4>
                    <div className="h-0.5 w-12 bg-amber-300 mx-auto rounded-full mt-2"></div>
                </div>

                <div className="overflow-y-auto max-h-[280px] px-2 custom-scrollbar text-left">
                    {therapy.benefits ? (
                        <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-wrap">
                            {therapy.benefits}
                        </p>
                    ) : (
                        <p className="text-stone-500 text-sm italic text-center">
                            Consulta por los detalles específicos de esta sesión.
                        </p>
                    )}
                </div>

                <button 
                    onClick={() => setIsFlipped(false)}
                    className="mt-auto text-xs font-bold text-amber-900 flex items-center justify-center gap-1 hover:underline pt-4"
                >
                    <RotateCw size={12} /> Volver a la tarjeta
                </button>
            </div>
        </div>

      </motion.div>
    </div>
  );
};

export default TherapyCard;