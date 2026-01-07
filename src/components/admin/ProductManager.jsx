import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Star, Save, FileImage as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import ImageUploader from './ImageUploader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, // <--- IMPORTANTE: Importado para corregir el warning
  DialogFooter,
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
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { toast } = useToast();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    use_text: '',
    price: '',
    featured: false,
    images: []
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false }); 
    
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      setProducts(data);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      use_text: '',
      price: '',
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
        use_text: product.use_text || '',
        price: product.price,
        featured: product.featured || false,
        images: product.images || []
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    // Validación básica
    if (!formData.name || !formData.price) {
        toast({ variant: "destructive", title: "Faltan datos", description: "El nombre y el precio son obligatorios." });
        return;
    }

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', editingProduct.id);
        
        if (error) throw error;
        toast({ title: "Producto actualizado", description: "Los cambios se guardaron correctamente." });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([formData]);
        
        if (error) throw error;
        toast({ title: "Producto creado", description: "El nuevo producto ha sido añadido." });
      }
      
      setIsDialogOpen(false);
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error al guardar", description: error.message });
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({ title: "Producto eliminado", description: "El producto ha sido eliminado correctamente." });
      fetchProducts();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const toggleFeatured = async (product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ featured: !product.featured })
        .eq('id', product.id);
        
      if (error) throw error;
      fetchProducts(); 
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-amber-900">Gestión de Productos</h2>
          <p className="text-sm text-stone-600">Añade o edita tus productos naturales</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-amber-900 hover:bg-amber-800 text-white">
          <Plus size={18} className="mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-900"></div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow border border-stone-200 p-4 flex flex-col h-full group"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-amber-900 line-clamp-1">{product.name}</h3>
                <button onClick={() => toggleFeatured(product)} title={product.featured ? "Quitar destacado" : "Destacar"}>
                  <Star size={20} className={product.featured ? "text-amber-500 fill-amber-500" : "text-stone-300 hover:text-amber-400"} />
                </button>
              </div>

              {/* Thumbnail preview */}
              {product.images && product.images.length > 0 ? (
                <div className="w-full h-32 mb-3 bg-stone-100 rounded-md overflow-hidden relative">
                   <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                   {product.images.length > 1 && (
                     <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                       +{product.images.length - 1}
                     </div>
                   )}
                </div>
              ) : (
                <div className="w-full h-32 mb-3 bg-stone-50 rounded-md flex items-center justify-center border border-dashed border-stone-200">
                  <ImageIcon className="text-stone-300" size={24} />
                  <span className="text-xs text-stone-400 ml-2">Sin imagen</span>
                </div>
              )}
              
              <div className="flex-1 space-y-2 mb-4">
                <p className="text-sm text-stone-600 line-clamp-2 min-h-[40px]">{product.description || "Sin descripción"}</p>
                {product.use_text && (
                    <div className="text-xs bg-stone-100 p-2 rounded text-stone-700 line-clamp-1">
                        <span className="font-semibold">Uso:</span> {product.use_text}
                    </div>
                )}
                <div className="font-bold text-amber-800 text-lg">{product.price}</div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-stone-100 mt-auto">
                <Button variant="outline" size="sm" className="flex-1 text-stone-700 hover:bg-stone-50" onClick={() => handleOpenDialog(product)}>
                  <Pencil size={14} className="mr-2" /> Editar
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50">
                      <Trash2 size={14} className="mr-2" /> Borrar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar {product.name}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción es irreversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(product.id)} className="bg-red-600 hover:bg-red-700 text-white">
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
            {/* CORRECCIÓN: Se agrega Description para accesibilidad y evitar el warning */}
            <DialogDescription>
              Completa la información del producto y sube tus imágenes.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium text-stone-700">Nombre</label>
              <input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all"
                placeholder="Ej: Aceite de Lavanda"
              />
            </div>
            
            {/* Componente Uploader con la ruta correcta */}
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                <ImageUploader 
                images={formData.images} 
                onChange={(newImages) => setFormData({...formData, images: newImages})} 
                maxImages={2}
                bucketName="media"
                folderPath="products"
                />
            </div>

            <div className="grid gap-2">
              <label htmlFor="price" className="text-sm font-medium text-stone-700">Precio</label>
              <input
                id="price"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                placeholder="Ej: $4.500"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium text-stone-700">Descripción</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="flex min-h-[80px] w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 resize-none"
                placeholder="Descripción corta del producto"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="use_text" className="text-sm font-medium text-stone-700">Modo de Uso / Beneficios</label>
              <input
                id="use_text"
                value={formData.use_text}
                onChange={(e) => setFormData({...formData, use_text: e.target.value})}
                className="flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                placeholder="Ej: Ideal para masajes relajantes"
              />
            </div>

            <div className="flex items-center gap-2 mt-2 bg-amber-50 p-3 rounded-md border border-amber-100">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                className="h-4 w-4 rounded border-amber-300 text-amber-900 focus:ring-amber-500 cursor-pointer"
              />
              <label htmlFor="featured" className="text-sm font-medium text-amber-900 cursor-pointer select-none">
                  Destacar este producto en la portada
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-amber-900 hover:bg-amber-800 text-white">
              <Save size={16} className="mr-2" /> Guardar Producto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManager;