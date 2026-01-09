import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Star, Leaf, RotateCw, Info, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const ProductCard = ({ product }) => {
  const { toast } = useToast();
  const [isFlipped, setIsFlipped] = useState(false);

  const handleConsult = async (e) => {
    e.stopPropagation();
    const message = encodeURIComponent(`Hola! Me interesa el producto: ${product.name}`);
    window.open(`https://wa.me/5493874833177?text=${message}`, '_blank');
    
    try {
        await supabase.from('inquiries').insert([{ type: 'product', item_name: product.name, status: 'new' }]);
    } catch(err) { console.error(err); }
  };

  return (
    <div className="group h-[480px] perspective-1000 relative"> 
      {/* Altura aumentada levemente a 480px para dar más aire al contenido */}

      {/* 1. BADGE DESTACADO (FIJO A LA IZQUIERDA) 
          Aseguramos left-4 para que esté bien pegado a la izquierda
      */}
      {product.featured && (
        <div className="absolute top-4 left-4 z-20 bg-amber-400 text-amber-900 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
          <Star size={10} fill="currentColor" /> Destacado
        </div>
      )}
      
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        className="relative w-full h-full preserve-3d"
        style={{ transformStyle: 'preserve-3d' }}
      >
        
        {/* ================= FRENTE ================= */}
        <div className="absolute inset-0 backface-hidden bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden">
          
          {/* 2. BOTÓN INFO (FIJO A LA DERECHA)
             Aseguramos right-4. Al estar en extremos opuestos, ya no se solaparán.
          */}
          {product.details && (
            <button 
                onClick={() => setIsFlipped(true)}
                className="absolute top-4 right-4 z-10 text-amber-900 bg-amber-100/80 hover:bg-amber-200 p-2 rounded-full shadow-sm transition-colors backdrop-blur-sm"
                title="Ver más detalles y secretos"
            >
                <Info size={18} strokeWidth={2.5} />
            </button>
          )}

          {/* Imagen */}
          <div className="w-full h-60 bg-gradient-to-b from-stone-50 to-white flex items-center justify-center p-6 relative pt-14"> 
            {/* pt-14 asegura que la imagen no choque con los badges superiores */}
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images[0]} 
                alt={product.name} 
                className="h-full w-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
               <div className="flex flex-col items-center justify-center text-stone-300">
                 <Leaf size={40} />
               </div>
            )}
          </div>

          <div className="p-5 flex flex-col flex-1">
            <h3 className="text-xl font-serif font-bold text-amber-900 leading-tight mb-2">
                {product.name}
            </h3>
            
            {/* Descripción corta */}
            <p className="text-stone-500 text-sm line-clamp-2 mb-3">
                {product.description}
            </p>

            {/* 3. RECUPERAMOS EL ESTILO "USO" CON HOJITA 🍃 */}
            {product.use_text && (
              <div className="mt-auto mb-4 flex items-start gap-2.5 p-3 bg-stone-50/80 rounded-lg border border-stone-100">
                <Leaf size={16} className="text-green-600 mt-0.5 shrink-0 fill-green-50" />
                <p className="text-xs text-stone-600 leading-snug">
                  <span className="font-bold text-stone-700 block mb-0.5">Uso:</span>
                  <span className="italic">{product.use_text}</span>
                </p>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-3 border-t border-stone-100 mt-auto">
              <div className="flex flex-col">
                 <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Precio</span>
                 <span className="text-xl font-bold text-amber-900">{product.price}</span>
              </div>
              <Button onClick={handleConsult} size="sm" className="bg-green-600 hover:bg-green-700 text-white rounded-full px-5 shadow-lg shadow-green-100 transition-transform active:scale-95">
                <MessageCircle size={16} className="mr-2" /> Consultar
              </Button>
            </div>
          </div>
        </div>

        {/* ================= REVERSO (INFO EXTRA) ================= */}
        <div 
            className="absolute inset-0 backface-hidden bg-stone-100 rounded-2xl border border-stone-200 shadow-inner p-6 flex flex-col text-center"
            style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
        >
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <Leaf size={200} />
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
                    <h4 className="font-serif text-lg font-bold text-amber-900">Detalles & Secretos</h4>
                    <div className="h-0.5 w-12 bg-amber-300 mx-auto rounded-full mt-2"></div>
                </div>

                <div className="overflow-y-auto max-h-[220px] px-2 custom-scrollbar text-left">
                    <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {product.details || "Información adicional no disponible."}
                    </p>
                </div>

                <button 
                    onClick={() => setIsFlipped(false)}
                    className="mt-auto text-xs font-bold text-amber-900 flex items-center justify-center gap-1 hover:underline pt-4"
                >
                    <RotateCw size={12} /> Volver al producto
                </button>
            </div>
        </div>

      </motion.div>
    </div>
  );
};

export default ProductCard;