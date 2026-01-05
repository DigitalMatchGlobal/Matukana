import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Calendar, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const ExperienceCard = ({ experience }) => {
  const { toast } = useToast();

  const handleInterest = async () => {
    // 1. Open WhatsApp immediately
    const message = encodeURIComponent(`Hola! Me interesa participar en: ${experience.name} ${experience.date ? 'el ' + new Date(experience.date).toLocaleDateString() : ''}`);
    window.open(`https://wa.me/5493875000000?text=${message}`, '_blank');
    
    // 2. Save to Supabase in background
    try {
      const { error } = await supabase
        .from('inquiries')
        .insert([
          {
            type: 'experience',
            item_name: experience.name,
            status: 'new'
          }
        ]);

      if (error) {
        console.error('Error saving inquiry:', error);
      } else {
         toast({
          title: "Interés registrado",
          description: "Hemos guardado tu interés en esta experiencia.",
        });
      }
    } catch (err) {
      console.error('Error in handleInterest:', err);
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

  const getStatusBadge = () => {
    if (experience.status === 'full') {
      return <span className="absolute top-4 right-4 bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded shadow-sm z-10">CUPO COMPLETO</span>;
    }
    if (experience.status === 'upcoming') {
      return <span className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded shadow-sm z-10">PRÓXIMA FECHA</span>;
    }
    if (experience.status === 'to_coordinate') {
       return <span className="absolute top-4 right-4 bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded shadow-sm z-10">A COORDINAR</span>;
    }
    return null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formattedDate = formatDate(experience.date);

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group relative flex flex-col h-full"
    >
      {/* Experience Image Section */}
      <div className="w-full h-48 bg-stone-100 relative overflow-hidden">
        {experience.images && experience.images.length > 0 ? (
          <img 
            src={experience.images[0]} 
            alt={experience.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
           <div className="w-full h-full flex items-center justify-center bg-stone-50 text-stone-300">
             <div className="w-12 h-12 rounded-full bg-stone-100" />
           </div>
        )}
        {getStatusBadge()}
      </div>

      
      <div className="p-6 space-y-4 flex-1 flex flex-col">
        <div>
          <h3 className="text-xl font-bold text-amber-900 mb-2">{experience.name}</h3>
          <p className="text-stone-700 text-sm leading-relaxed mb-4 line-clamp-3">{experience.description}</p>
        </div>
        
        <div className="space-y-3 mt-auto">
          {formattedDate ? (
            <div className="flex items-start text-sm text-stone-800 font-medium bg-amber-50 p-2 rounded-md">
              <Calendar size={18} className="mr-2 text-amber-700 shrink-0 mt-0.5" />
              <span className="capitalize">{formattedDate} hs</span>
            </div>
          ) : (
            <div className="flex items-center text-sm text-stone-600">
              <Calendar size={16} className="mr-2 text-amber-700" />
              <span>{experience.availability || 'Fecha a coordinar'}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center text-sm text-stone-600 px-1">
             <div className="flex items-center">
              <Clock size={16} className="mr-2 text-stone-400" />
              <span>{experience.duration}</span>
            </div>
            {experience.capacity && (
               <div className="flex items-center">
                <User size={16} className="mr-2 text-stone-400" />
                <span>Cupo: {experience.capacity}</span>
              </div>
            )}
          </div>

          {experience.includes && (
            <div className="text-xs text-stone-600 border-t border-stone-100 pt-3">
              <span className="font-semibold text-stone-800">Incluye:</span> {experience.includes}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6 pt-0 mt-auto">
        <Button
          onClick={handleInterest}
          disabled={experience.status === 'full'}
          className={`w-full rounded-full group-hover:scale-105 transition-transform duration-300 ${
            experience.status === 'full' 
              ? 'bg-stone-200 text-stone-500 cursor-not-allowed hover:bg-stone-200 hover:scale-100' 
              : 'bg-amber-900 hover:bg-amber-800 text-white'
          }`}
        >
          <MessageCircle size={18} className="mr-2" />
          {experience.status === 'full' ? 'Cupo Completo' : 'Me Interesa'}
        </Button>
      </div>
    </motion.div>
  );
};

export default ExperienceCard;