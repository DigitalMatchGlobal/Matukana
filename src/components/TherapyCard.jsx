import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const TherapyCard = ({ therapy }) => {
  const { toast } = useToast();

  const handleSchedule = async () => {
    // 1. Open WhatsApp immediately
    const message = encodeURIComponent(`Hola! Me gustaría solicitar un turno para: ${therapy.name}`);
    window.open(`https://wa.me/5493875000000?text=${message}`, '_blank');
    
    // 2. Save to Supabase in background
    try {
      const { error } = await supabase
        .from('inquiries')
        .insert([
          {
            type: 'therapy',
            item_name: therapy.name,
            status: 'new'
          }
        ]);

      if (error) {
        console.error('Error saving inquiry:', error);
      } else {
        toast({
          title: "Solicitud registrada",
          description: "Tu interés en esta terapia ha sido guardado.",
        });
      }
    } catch (err) {
      console.error('Error in handleSchedule:', err);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group border border-stone-200 flex flex-col h-full"
    >
      {/* Therapy Image Section */}
      <div className="w-full h-48 bg-stone-100 relative overflow-hidden">
        {therapy.images && therapy.images.length > 0 ? (
          <img 
            src={therapy.images[0]} 
            alt={therapy.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
           <div className="w-full h-full flex items-center justify-center bg-stone-50 text-stone-300">
             <div className="w-12 h-12 rounded-full bg-stone-100" />
           </div>
        )}
      </div>

      <div className="p-6 space-y-4 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-amber-900">{therapy.name}</h3>
        
        <p className="text-stone-700 text-sm leading-relaxed line-clamp-3">{therapy.description}</p>
        
        <div className="flex items-center text-sm text-stone-600">
          <Clock size={16} className="mr-2 text-amber-700" />
          <span>{therapy.duration}</span>
        </div>
        
        <div className="bg-amber-50 rounded-md p-3 border-l-4 border-amber-600 mt-auto mb-4">
          <p className="text-sm text-stone-700 line-clamp-2">
            <span className="font-medium text-amber-800">Beneficios:</span> {therapy.benefits}
          </p>
        </div>
        
        <Button
          onClick={handleSchedule}
          className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full group-hover:scale-105 transition-transform duration-300 mt-auto"
        >
          <MessageCircle size={18} className="mr-2" />
          Solicitar Turno
        </Button>
      </div>
    </motion.div>
  );
};

export default TherapyCard;