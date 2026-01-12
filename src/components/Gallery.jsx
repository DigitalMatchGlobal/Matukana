import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { supabase } from "@/lib/customSupabaseClient";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Image as ImageIcon, X, ZoomIn, Loader2 } from "lucide-react";

// --- SUB-COMPONENTE PARA CARGA OPTIMIZADA ---
const LazyImage = ({ src, alt, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="break-inside-avoid mb-6" // mb-6 para espaciado en columnas
      onClick={onClick}
    >
      <div className="group relative overflow-hidden rounded-2xl bg-stone-200 cursor-zoom-in border border-stone-100 shadow-sm">
        
        {/* 1. Placeholder / Skeleton (Se muestra mientras carga) */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-200 z-10">
            <Loader2 className="animate-spin text-stone-400 w-8 h-8" />
          </div>
        )}

        {/* 2. Imagen Real */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async" // Ayuda al navegador a no bloquear el renderizado
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-auto object-cover transition-all duration-700 group-hover:scale-110 
            ${isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"}`} // Efecto "Blur-up"
        />

        {/* Overlay con Zoom (Solo visible cuando cargó) */}
        {isLoaded && (
          <>
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                <ZoomIn className="text-white" size={24} />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
              <h3 className="text-white font-bold text-lg leading-tight drop-shadow-md">
                {alt}
              </h3>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

// --- COMPONENTE PRINCIPAL ---
const Gallery = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Estado para controlar qué tab está activo realmente
  const [activeTab, setActiveTab] = useState("products");

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setImages(data);
      }
      setLoading(false);
    };

    fetchImages();
  }, []);

  const categories = [
    { id: "products", label: "Productos" },
    { id: "plants", label: "Plantas" },
    { id: "landscapes", label: "Paisajes" },
    { id: "agustin", label: "Nosotros" },
  ];

  // Filtramos solo cuando renderizamos
  const getFilteredImages = () => {
    if (activeTab === "all") return images;
    return images.filter((img) => img.category === activeTab);
  };

  const filteredImages = getFilteredImages();

  return (
    <section
      id="galeria"
      className="py-24 px-4 bg-white relative overflow-hidden min-h-[80vh]"
      ref={ref}
    >
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-2 bg-stone-100 rounded-full mb-4">
            <ImageIcon size={16} className="text-stone-500 mr-2" />
            <span className="text-xs font-bold uppercase tracking-widest text-stone-600">
              Archivo Visual
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-amber-900 mb-4">
            Galería Matukana
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto text-lg">
            Instantes de recolección, preparación y conexión con el entorno natural.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900"></div>
          </div>
        ) : (
          // Usamos value y onValueChange para controlar el estado manualmente
          // Esto evita renderizar las imágenes de las pestañas ocultas
          <Tabs 
            defaultValue="products" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="space-y-12"
          >
            <div className="w-full overflow-x-auto pb-4 flex justify-start md:justify-center no-scrollbar">
              <TabsList className="bg-white border border-stone-200 p-1.5 rounded-full shadow-sm h-auto inline-flex min-w-max">
                <TabsTrigger
                  value="all"
                  className="rounded-full px-6 py-2 text-sm data-[state=active]:bg-amber-900 data-[state=active]:text-white transition-all duration-300"
                >
                  Todo
                </TabsTrigger>
                {categories.map((cat) => (
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

            <TabsContent value={activeTab} className="mt-0 min-h-[400px]">
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                <AnimatePresence mode="popLayout">
                  {filteredImages.map((img) => (
                    <LazyImage 
                      key={img.id}
                      src={img.image_url}
                      alt={img.title}
                      onClick={() => setSelectedImage(img)}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {filteredImages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-stone-400">
                  <ImageIcon size={48} className="mb-4 opacity-20" />
                  <p className="italic">No hay imágenes en esta sección.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-50 bg-stone-800/50 hover:bg-stone-700 text-white p-2 rounded-full backdrop-blur-md transition-colors"
            >
              <X size={24} />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row bg-stone-900 rounded-lg overflow-hidden shadow-2xl"
            >
              <div className="flex-1 bg-black flex items-center justify-center relative">
                 <img
                  src={selectedImage.image_url}
                  alt={selectedImage.title}
                  className="max-w-full max-h-[50vh] md:max-h-[90vh] object-contain"
                />
              </div>

              <div className="w-full md:w-80 bg-stone-900 p-6 flex flex-col justify-center border-t md:border-t-0 md:border-l border-stone-800">
                <span className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">
                  {categories.find((c) => c.id === selectedImage.category)?.label || "Galería"}
                </span>
                <h3 className="text-white font-serif font-bold text-2xl mb-3 leading-tight">
                  {selectedImage.title}
                </h3>
                <p className="text-stone-300 text-sm leading-relaxed">
                  {selectedImage.description || "Sin descripción"}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;