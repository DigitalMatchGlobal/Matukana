import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const ProductCard = ({ product }) => {
  const { toast } = useToast();

  const handleConsult = async () => {
    // 1. Open WhatsApp immediately
    const message = encodeURIComponent(`Hola! Me interesa el producto: ${product.name}`);
    window.open(`https://wa.me/5493875000000?text=${message}`, '_blank');
    
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
          description: "Se ha registrado tu interés en nuestro sistema.",
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
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group flex flex-col h-full"
    >
      {/* Product Image Section */}
      <div className="w-full aspect-square bg-stone-100 relative overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
           <div className="w-full h-full flex items-center justify-center bg-stone-50 text-stone-300">
             {/* Fallback pattern or icon could go here, for now just subtle color */}
             <div className="w-16 h-16 rounded-full bg-stone-100" />
           </div>
        )}
        
        {product.featured && (
            <div className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full shadow-sm">
              <Star className="text-amber-500 fill-amber-500" size={16} />
            </div>
        )}
      </div>

      <div className="p-6 space-y-4 flex flex-col flex-1">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-bold text-amber-900">{product.name}</h3>
        </div>
        
        <p className="text-stone-700 text-sm line-clamp-3">{product.description}</p>
        
        {product.use_text && (
          <div className="bg-green-50 rounded-md p-3 border-l-4 border-green-600 mt-auto">
            <p className="text-xs text-stone-700 line-clamp-2">
              <span className="font-medium text-green-800">Uso:</span> {product.use_text}
            </p>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2 mt-auto">
          <span className="text-2xl font-bold text-amber-900">{product.price}</span>
          <Button
            onClick={handleConsult}
            className="bg-green-600 hover:bg-green-700 text-white rounded-full group-hover:scale-105 transition-transform duration-300"
          >
            <MessageCircle size={18} className="mr-2" />
            Consultar
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;