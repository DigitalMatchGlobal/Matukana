import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Star, Leaf, ArrowRight } from 'lucide-react'; // Agregué Leaf y ArrowRight
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const ProductCard = ({ product }) => {
  const { toast } = useToast();

  const handleConsult = async () => {
    // 1. Open WhatsApp immediately (Mantenemos tu número y lógica)
    const message = encodeURIComponent(`Hola! Me interesa el producto: ${product.name}`);
    window.open(`https://wa.me/5493874833177?text=${message}`, '_blank');
    
    // 2. Save to Supabase in background
    try {
      const { error } = await supabase
        .from('inquiries')
        .insert([
          {
            type: 'product',
            item_name: product.name,
            status: 'new'
          }
        ]);

      if (error) {
        console.error('Error saving inquiry:', error);
      } else {
        toast({
          title: "Consulta registrada",
          description: "Te estamos redirigiendo a WhatsApp...",
        });
      }
    } catch (err) {
      console.error('Error in handleConsult:', err);
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
      whileHover={{ y: -8 }} // Efecto de levitación
      className="group relative bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden"
    >
      {/* Badge de Destacado Flotante */}
      {product.featured && (
        <div className="absolute top-4 right-4 z-10 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
          <Star size={10} fill="currentColor" /> Destacado
        </div>
      )}

      {/* Product Image Section - Más limpio y espacioso */}
      <div className="w-full h-64 bg-gradient-to-b from-stone-50 to-white relative overflow-hidden flex items-center justify-center p-6">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="h-full w-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
           <div className="flex flex-col items-center justify-center text-stone-300">
             <Leaf size={40} />
             <span className="text-xs mt-2">Natural</span>
           </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        {/* Título con fuente Serif para toque artesanal */}
        <div className="mb-4">
            <h3 className="text-xl font-serif font-bold text-amber-900 leading-tight group-hover:text-amber-700 transition-colors">
                {product.name}
            </h3>
            <p className="text-stone-500 text-sm mt-2 line-clamp-2 leading-relaxed">
                {product.description}
            </p>
        </div>
        
        {/* Sección de Uso rediseñada - Menos agresiva, más integrada */}
        {product.use_text && (
          <div className="mt-auto mb-4 flex items-start gap-2 p-3 bg-stone-50 rounded-lg border border-stone-100">
            <Leaf size={14} className="text-green-600 mt-0.5 shrink-0" />
            <p className="text-xs text-stone-600 italic">
              <span className="font-semibold text-stone-700 not-italic">Uso:</span> {product.use_text}
            </p>
          </div>
        )}
        
        {/* Footer con Precio y Botón */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100 mt-auto">
          <div className="flex flex-col">
             <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Precio</span>
             <span className="text-xl font-bold text-amber-900">{product.price}</span>
          </div>
          
          <Button
            onClick={handleConsult}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white rounded-full px-5 shadow-green-100 hover:shadow-green-200 shadow-lg transition-all"
          >
            <MessageCircle size={16} className="mr-2" />
            Consultar
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;