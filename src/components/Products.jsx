import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Sprout } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/customSupabaseClient';
import { getOptimizedImage } from '@/lib/utils'; // Importamos el optimizador

const Products = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        // OPTIMIZACIÓN CRÍTICA:
        // Transformamos la URL de la imagen AQUÍ, antes de pasarla al componente hijo.
        // Pedimos un ancho de 500px (suficiente para tarjeta) en formato WebP.
        const optimizedData = data.map(product => ({
            ...product,
            image_url: getOptimizedImage(product.image_url, 500)
        }));
        
        setProducts(optimizedData);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <section id="productos" className="py-24 px-4 bg-stone-50/50" ref={ref}>
      <div className="container mx-auto max-w-7xl"> 
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-2 bg-amber-100/50 text-amber-800 rounded-full mb-4">
            <Sprout size={16} className="mr-2" />
            <span className="text-xs font-bold uppercase tracking-widest">100% Naturales & Artesanales</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-serif font-bold text-amber-900 mb-6">
            Nuestros Productos
          </h2>
          <p className="text-stone-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Cada producto está elaborado artesanalmente con plantas recolectadas con respeto y preparadas con dedicación para tu bienestar.
          </p>
        </motion.div>

        {loading ? (
           <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900"></div>
           </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10" 
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Products;