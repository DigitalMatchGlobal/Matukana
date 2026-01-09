import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Save, Search, Star, Package, DollarSign, Tag, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import ImageUploader from './ImageUploader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription, // Importante para accesibilidad
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { toast } = useToast();

  // Estado del formulario unificado
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    use_text: '', // Campo específico de tu DB
    details: '',  // Campo específico de tu DB (reverso)
    featured: false, // Campo específico de tu DB
    images: []
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  // Buscador en tiempo real
  useEffect(() => {
    if (searchTerm === '') {
        setFilteredProducts(products);
    } else {
        const lowerTerm = searchTerm.toLowerCase();
        const filtered = products.filter(p => 
            p.name.toLowerCase().includes(lowerTerm) || 
            (p.description && p.description.toLowerCase().includes(lowerTerm))
        );
        setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      setProducts(data || []);
      setFilteredProducts(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      use_text: '',
      details: '',
      featured: false,
      images: []
    });
    setEditingProduct(null);
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price || '',
        use_text: product.use_text || '',
        details: product.details || '',
        featured: product.featured || false,
        images: product.images || []
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price) {
        toast({ variant: "destructive", title: "Faltan datos", description: "Nombre y precio son obligatorios." });
        return;
    }

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', editingProduct.id);
        
        if (error) throw error;
        toast({ title: "Producto actualizado", description: "Cambios guardados con éxito." });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([formData]);
        
        if (error) throw error;
        toast({ title: "Producto creado", description: "Nuevo producto añadido al catálogo." });
      }
      
      setIsDialogOpen(false);
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({ title: "Eliminado", description: "Producto eliminado correctamente." });
      fetchProducts();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  // Switch rápido de destacado
  const toggleFeatured = async (product) => {
      const newVal = !product.featured;
      // Actualización optimista en UI
      const updatedList = products.map(p => p.id === product.id ? {...p, featured: newVal} : p);
      setProducts(updatedList);
      
      const { error } = await supabase
        .from('products')
        .update({ featured: newVal })
        .eq('id', product.id);
        
      if (error) {
          toast({ variant: "destructive", title: "Error", description: "No se pudo actualizar." });
          fetchProducts(); // Revertir si falla
      }
  };

  return (
    <div className="space-y-8">
      
      {/* --- HEADER & TOOLBAR --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-stone-100 sticky top-20 z-10">
        <div>
          <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
            <Package className="text-amber-600" size={24} />
            Catálogo
          </h2>
          <p className="text-sm text-stone-500 hidden sm:block">Administra tu inventario</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Buscador Moderno */}
            <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Buscar..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                />
            </div>

            <Button onClick={() => handleOpenDialog()} className="bg-stone-900 hover:bg-stone-800 text-white shadow-lg shadow-stone-900/20">
                <Plus size={18} className="mr-2" />
                Nuevo
            </Button>
        </div>
      </div>

      {/* --- GRID DE PRODUCTOS --- */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-900"></div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onEdit={handleOpenDialog} 
                onDelete={handleDelete}
                onToggleFeatured={toggleFeatured}
              />
            ))}
          </AnimatePresence>
          
          {filteredProducts.length === 0 && (
              <div className="col-span-full py-20 text-center text-stone-400">
                  <Package className="mx-auto mb-2 opacity-50" size={40} />
                  <p>No se encontraron productos.</p>
              </div>
          )}
        </div>
      )}

      {/* --- MODAL EDITAR/CREAR --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-amber-900">
                {editingProduct ? 'Editar Producto' : 'Crear Producto'}
            </DialogTitle>
            <DialogDescription>
                Completa todos los detalles para que tu producto brille en la tienda.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Nombre</label>
                    <input
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                        placeholder="Ej: Ungüento de Jarilla"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Precio</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={14} />
                        <input
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                            className="w-full pl-8 p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                            placeholder="0.00"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Imágenes</label>
                <div className="p-4 bg-stone-50 border border-dashed border-stone-200 rounded-xl">
                    <ImageUploader 
                        images={formData.images} 
                        onChange={(newImages) => setFormData({...formData, images: newImages})} 
                        maxImages={4}
                        bucketName="media"
                        folderPath="products"
                    />
                </div>
            </div>

            {/* Descripción Frontal */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Descripción (Frente)</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg text-sm min-h-[80px] focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none"
                    placeholder="Lo que se ve primero..."
                />
            </div>

            {/* Detalles Reverso */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-2">
                    <FileText size={14} /> Detalles del Reverso
                </label>
                <textarea
                    value={formData.details}
                    onChange={(e) => setFormData({...formData, details: e.target.value})}
                    className="w-full p-3 bg-amber-50/50 border border-amber-100 rounded-lg text-sm min-h-[100px] focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none"
                    placeholder="Ingredientes, historia, modo de uso extendido..."
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Uso Corto (Badge)</label>
                <input
                    value={formData.use_text}
                    onChange={(e) => setFormData({...formData, use_text: e.target.value})}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                    placeholder="Ej: Dolores musculares"
                />
            </div>

            {/* Switch Destacado */}
            <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-lg cursor-pointer hover:bg-amber-100/50 transition-colors" onClick={() => setFormData({...formData, featured: !formData.featured})}>
                <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${formData.featured ? 'bg-amber-600' : 'bg-stone-300'}`}>
                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${formData.featured ? 'translate-x-4' : ''}`}></div>
                </div>
                <span className="text-sm font-medium text-amber-900 select-none">Destacar en Portada</span>
            </div>

          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-amber-900 hover:bg-amber-800 text-white shadow-md">
              <Save size={16} className="mr-2" /> Guardar Producto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// --- TARJETA DE PRODUCTO PREMIUM ---
const ProductCard = ({ product, onEdit, onDelete, onToggleFeatured }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 overflow-hidden flex flex-col h-full"
    >
      {/* IMAGEN HERO */}
      <div className="relative aspect-square overflow-hidden bg-stone-100 cursor-pointer" onClick={() => onEdit(product)}>
        {product.images && product.images.length > 0 ? (
            <img 
                src={product.images[0]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
        ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-stone-300">
                <Package size={48} strokeWidth={1} />
                <span className="text-xs mt-2">Sin imagen</span>
            </div>
        )}

        {/* Precio Flotante */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm text-stone-900 font-bold text-sm border border-white/50">
            {product.price}
        </div>

        {/* Estrella Destacado */}
        <button 
            onClick={(e) => { e.stopPropagation(); onToggleFeatured(product); }}
            className={`absolute top-3 right-3 p-2 rounded-full shadow-sm transition-all duration-300 ${
                product.featured 
                ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' 
                : 'bg-white/80 text-stone-400 hover:bg-white hover:text-amber-400'
            }`}
            title="Destacar/Quitar"
        >
            <Star size={16} fill={product.featured ? "currentColor" : "none"} />
        </button>

        {/* Overlay Acciones (Desktop Hover) */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[1px]">
            <Button onClick={(e) => { e.stopPropagation(); onEdit(product); }} className="bg-white text-stone-900 hover:bg-amber-50 rounded-full h-10 w-10 p-0 shadow-lg border-none">
                <Pencil size={18} />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button onClick={(e) => e.stopPropagation()} className="bg-white text-red-600 hover:bg-red-50 rounded-full h-10 w-10 p-0 shadow-lg border-none">
                  <Trash2 size={18} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
                  <AlertDialogDescription>Esta acción es irreversible.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(product.id)} className="bg-red-600 text-white hover:bg-red-700">Eliminar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif font-bold text-lg text-stone-800 leading-tight mb-2 group-hover:text-amber-700 transition-colors cursor-pointer" onClick={() => onEdit(product)}>
            {product.name}
        </h3>
        
        <p className="text-sm text-stone-500 line-clamp-2 mb-4 flex-1">
            {product.description || <span className="italic opacity-50">Sin descripción</span>}
        </p>

        {product.use_text && (
            <div className="flex items-start gap-2 mt-auto pt-4 border-t border-stone-100">
                <Tag size={14} className="text-amber-500 mt-0.5 shrink-0" />
                <span className="text-xs text-stone-600 font-medium line-clamp-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                    {product.use_text}
                </span>
            </div>
        )}
      </div>

      {/* Barra de Acciones Móvil (Solo visible en pantallas pequeñas) */}
      <div className="md:hidden flex border-t border-stone-100 divide-x divide-stone-100">
        <button onClick={() => onEdit(product)} className="flex-1 py-3 text-sm font-medium text-stone-600 hover:bg-stone-50 flex items-center justify-center gap-2">
            <Pencil size={14} /> Editar
        </button>
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button className="flex-1 py-3 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center justify-center gap-2">
                    <Trash2 size={14} /> Borrar
                </button>
            </AlertDialogTrigger>
             <AlertDialogContent className="bg-white">
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(product.id)} className="bg-red-600 text-white">Eliminar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.div>
  );
};

export default ProductManager;