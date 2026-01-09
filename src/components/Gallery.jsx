import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Image as ImageIcon, X, ZoomIn } from 'lucide-react';

const Gallery = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // Para el Lightbox

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
    <section id="galeria" className="py-24 px-4 bg-white relative overflow-hidden" ref={ref}>
      
      {/* Fondo sutil de puntos Tech/Natural */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-2 bg-stone-100 rounded-full mb-4">
            <ImageIcon size={16} className="text-stone-500 mr-2" />
            <span className="text-xs font-bold uppercase tracking-widest text-stone-600">Archivo Visual</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-amber-900 mb-4">Galería Matukana</h2>
          <p className="text-stone-600 max-w-2xl mx-auto text-lg">
            Instantes de recolección, preparación y conexión con el entorno natural que nos rodea.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900"></div>
          </div>
        ) : (
          <Tabs defaultValue="all" className="space-y-12">
            
            {/* Filtros Estilizados */}
            <div className="flex justify-center">
              <TabsList className="bg-white border border-stone-200 p-1.5 rounded-full shadow-sm">
                {categories.map(cat => (
                  <TabsTrigger 
                    key={cat.id} 
                    value={cat.id}
                    className="rounded-full px-6 py-2 text-sm data-[state=active]:bg-amber-900 data-[state=active]:text-white transition-all duration-300"
                  >
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Galería tipo Masonry (Cascada) */}
            {categories.map(cat => (
              <TabsContent key={cat.id} value={cat.id} className="mt-0 min-h-[400px]">
                 <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                   <AnimatePresence>
                    {filterImages(cat.id).map((img, index) => (
                      <motion.div
                        key={img.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="break-inside-avoid"
                        onClick={() => setSelectedImage(img)}
                      >
                        <div className="group relative overflow-hidden rounded-2xl bg-stone-100 cursor-zoom-in">
                          <img 
                            src={img.image_url} 
                            alt={img.title} 
                            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          
                          {/* Overlay al Hover */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                             <ZoomIn className="text-white opacity-80" size={32} />
                          </div>
                          
                          {/* Caption Flotante */}
                          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                            <h3 className="text-white font-bold text-lg leading-tight">{img.title}</h3>
                            {img.description && <p className="text-stone-200 text-sm mt-1 line-clamp-2">{img.description}</p>}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                   </AnimatePresence>
                 </div>
                 
                 {filterImages(cat.id).length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-stone-400">
                       <ImageIcon size={48} className="mb-4 opacity-20" />
                       <p className="italic">No hay imágenes en esta sección por el momento.</p>
                    </div>
                 )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>

      {/* LIGHTBOX (MODAL DE ZOOM) */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-5xl max-h-[90vh] w-full bg-transparent rounded-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()} // Evita cerrar si clickeas la imagen
            >
                <img 
                    src={selectedImage.image_url} 
                    alt={selectedImage.title}
                    className="w-full h-full object-contain max-h-[85vh] rounded-lg shadow-2xl"
                />
                
                <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="absolute bottom-4 left-4 right-4 text-center">
                    <h3 className="text-white font-bold text-xl drop-shadow-md">{selectedImage.title}</h3>
                    {selectedImage.description && <p className="text-white/80 text-sm mt-1 drop-shadow-md">{selectedImage.description}</p>}
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default Gallery;