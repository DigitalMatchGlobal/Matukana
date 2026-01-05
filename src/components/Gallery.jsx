import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const Gallery = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setImages(data);
      }
      setLoading(false);
    };

    fetchImages();
  }, []);

  const categories = [
    { id: 'all', label: 'Todo' },
    { id: 'products', label: 'Productos' },
    { id: 'plants', label: 'Plantas' },
    { id: 'landscapes', label: 'Paisajes' },
    { id: 'agustin', label: 'Nosotros' }
  ];

  const filterImages = (cat) => {
    if (cat === 'all') return images;
    return images.filter(img => img.category === cat);
  };

  return (
    <section id="galeria" className="py-20 px-4 bg-white" ref={ref}>
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">Galería Matukana</h2>
          <p className="text-stone-700 max-w-2xl mx-auto">
            Instantes de recolección, preparación y conexión con el entorno natural que nos rodea.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900"></div>
          </div>
        ) : (
          <Tabs defaultValue="all" className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="bg-stone-100 flex-wrap h-auto p-1 gap-1">
                {categories.map(cat => (
                  <TabsTrigger 
                    key={cat.id} 
                    value={cat.id}
                    className="data-[state=active]:bg-white data-[state=active]:text-amber-900 px-4 py-2 rounded-sm"
                  >
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {categories.map(cat => (
              <TabsContent key={cat.id} value={cat.id} className="mt-0">
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                   {filterImages(cat.id).map((img) => (
                     <motion.div
                       key={img.id}
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       transition={{ duration: 0.5 }}
                       className="group relative overflow-hidden rounded-lg aspect-square bg-stone-100 shadow-sm"
                     >
                       <img 
                         src={img.image_url} 
                         alt={img.title} 
                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                         <h3 className="text-white font-bold text-lg">{img.title}</h3>
                         {img.description && <p className="text-white/80 text-sm mt-1">{img.description}</p>}
                       </div>
                     </motion.div>
                   ))}
                   {filterImages(cat.id).length === 0 && (
                     <div className="col-span-full text-center py-12 text-stone-500 italic">
                       No hay imágenes en esta sección por el momento.
                     </div>
                   )}
                 </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </section>
  );
};

export default Gallery;