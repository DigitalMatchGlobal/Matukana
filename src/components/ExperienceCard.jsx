import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Calendar, Clock, Info, X, Sparkles, RotateCw, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const ExperienceCard = ({ experience }) => {
  const { toast } = useToast();
  const [isFlipped, setIsFlipped] = useState(false);

  const handleInterest = async (e) => {
    e.stopPropagation();
    const dateStr = experience.date ? ` el ${new Date(experience.date).toLocaleDateString()}` : '';
    const message = encodeURIComponent(`Hola! Me interesa participar en: ${experience.name}${dateStr}`);
    window.open(`https://wa.me/5493874833177?text=${message}`, '_blank');
    
    // Guardar en Supabase
    try {
        await supabase.from('inquiries').insert([{ type: 'experience', item_name: experience.name, status: 'new' }]);
    } catch(err) { console.error(err); }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', { 
      weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
    });
  };

  const formattedDate = formatDate(experience.date);

  // Lógica para el Badge de Estado (Esquina Superior Izquierda)
  const getStatusBadge = () => {
    if (experience.status === 'full') {
      return (
        <div className="absolute top-4 left-4 z-20 bg-red-100 text-red-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
           <Users size={10} /> Cupo Completo
        </div>
      );
    }
    if (experience.status === 'upcoming' && formattedDate) {
      return (
        <div className="absolute top-4 left-4 z-20 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
           <Calendar size={10} /> Próxima Fecha
        </div>
      );
    }
    // Si no tiene fecha específica o es a coordinar
    return (
        <div className="absolute top-4 left-4 z-20 bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
           <Calendar size={10} /> A Coordinar
        </div>
    );
  };

  return (
    <div className="group h-[550px] perspective-1000 relative">
      
      {getStatusBadge()}

      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        className="relative w-full h-full preserve-3d"
        style={{ transformStyle: 'preserve-3d' }}
      >
        
        {/* ================= FRENTE ================= */}
        <div className="absolute inset-0 backface-hidden bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden">
          
          {/* Botón Info Píldora */}
          {(experience.includes || experience.description) && (
            <button 
                onClick={() => setIsFlipped(true)}
                className="absolute top-4 right-4 z-10 bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Ver qué incluye"
            >
                <Info size={12} strokeWidth={2.5} /> Más info
            </button>
          )}

          {/* Imagen */}
          <div className="w-full h-60 bg-gradient-to-b from-stone-50 to-white flex items-center justify-center p-6 relative pt-14"> 
            {experience.images && experience.images.length > 0 ? (
              <img 
                src={experience.images[0]} 
                alt={experience.name} 
                className="h-full w-full object-cover rounded-lg shadow-sm transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
               <div className="flex flex-col items-center justify-center text-stone-300">
                  <div className="p-4 bg-white rounded-full shadow-sm">
                    <MapPin size={32} className="text-amber-200" />
                 </div>
               </div>
            )}
          </div>

          <div className="p-5 flex flex-col flex-1">
            <h3 className="text-xl font-serif font-bold text-amber-900 leading-tight mb-2">
                {experience.name}
            </h3>
            
            <p className="text-stone-500 text-sm line-clamp-2 mb-4">
                {experience.description}
            </p>

            {/* Fecha Destacada */}
            <div className="bg-stone-50 rounded-lg p-3 border border-stone-100 mb-2">
                {formattedDate ? (
                    <div className="flex items-center gap-2 text-stone-700">
                        <Calendar size={16} className="text-amber-600 shrink-0" />
                        <span className="text-xs font-semibold capitalize">{formattedDate} hs</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-stone-500 italic">
                        <Calendar size={16} className="text-stone-400 shrink-0" />
                        <span className="text-xs">Fecha a coordinar con el grupo</span>
                    </div>
                )}
            </div>

            {/* Duración */}
            {experience.duration && (
                <div className="flex items-center gap-2 text-xs text-stone-500 ml-1">
                    <Clock size={14} />
                    <span>Duración: {experience.duration}</span>
                </div>
            )}
            
            {/* Footer Botón */}
            <div className="pt-4 mt-auto">
              <Button 
                onClick={handleInterest} 
                disabled={experience.status === 'full'}
                className={`w-full rounded-full transition-transform active:scale-95 shadow-lg ${
                    experience.status === 'full' 
                    ? 'bg-stone-200 text-stone-500 cursor-not-allowed shadow-none' 
                    : 'bg-amber-900 hover:bg-amber-800 text-white shadow-amber-100'
                }`}
              >
                <MessageCircle size={16} className="mr-2" />
                {experience.status === 'full' ? 'Cupo Completo' : 'Me Interesa'}
              </Button>
            </div>
          </div>
        </div>

        {/* ================= REVERSO (QUÉ INCLUYE) ================= */}
        <div 
            className="absolute inset-0 backface-hidden bg-stone-100 rounded-2xl border border-stone-200 shadow-inner p-6 flex flex-col text-center"
            style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
        >
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <MapPin size={200} />
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
                        <Sparkles size={20} />
                    </span>
                    <h4 className="font-serif text-lg font-bold text-amber-900">La Experiencia Incluye</h4>
                    <div className="h-0.5 w-12 bg-amber-300 mx-auto rounded-full mt-2"></div>
                </div>

                <div className="overflow-y-auto max-h-[260px] px-2 custom-scrollbar text-left">
                    {experience.includes ? (
                         <div className="bg-white/60 p-4 rounded-lg border border-stone-200/50">
                            <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-wrap">
                                {experience.includes}
                            </p>
                        </div>
                    ) : (
                        <p className="text-stone-500 text-sm italic text-center">
                            Consulta por el programa completo de esta actividad.
                        </p>
                    )}
                    
                    {experience.capacity && (
                        <p className="text-xs text-stone-500 mt-4 text-center">
                            <Users size={12} className="inline mr-1" />
                            Cupo máximo: {experience.capacity} personas
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

export default ExperienceCard;