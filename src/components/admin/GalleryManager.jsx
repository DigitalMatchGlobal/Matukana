import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, Pencil } from 'lucide-react'; // Added Pencil icon
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const GalleryManager = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null); // State for editing mode
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'products',
    image_url: ''
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      setImages(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'products',
      image_url: ''
    });
    setEditingImage(null); // Clear editing state
  };

  // Modified to handle opening dialog for both creating and editing
  const handleOpenDialog = (image = null) => {
    if (image) {
        setEditingImage(image);
        setFormData({
            title: image.title || '',
            description: image.description || '',
            category: image.category || 'products',
            image_url: image.image_url || ''
        });
    } else {
        resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (!formData.image_url) {
        toast({ variant: "destructive", title: "Falta imagen", description: "Debes subir una imagen para la galería." });
        return;
      }

      let error;

      if (editingImage) {
        // --- EDIT MODE (UPDATE) ---
        const { error: updateError } = await supabase
            .from('gallery')
            .update(formData)
            .eq('id', editingImage.id);
        error = updateError;
      } else {
        // --- CREATE MODE (INSERT) ---
        const { error: insertError } = await supabase
            .from('gallery')
            .insert([formData]);
        error = insertError;
      }
        
      if (error) throw error;
      
      toast({ 
          title: editingImage ? "Imagen actualizada" : "Imagen añadida", 
          description: "Los cambios se han guardado correctamente." 
      });
      
      setIsDialogOpen(false);
      fetchImages();
      resetForm();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({ title: "Imagen eliminada", description: "La imagen ha sido borrada correctamente." });
      fetchImages();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const filterImages = (category) => {
    return images.filter(img => img.category === category);
  };

  const categories = [
    { id: 'products', label: 'Productos' },
    { id: 'plants', label: 'Plantas' },
    { id: 'landscapes', label: 'Paisajes' },
    { id: 'agustin', label: 'Agustín' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-amber-900">Gestión de Galería</h2>
          <p className="text-sm text-stone-600">Sube y organiza las fotos del sitio</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-amber-900 hover:bg-amber-800 text-white">
          <Plus size={18} className="mr-2" />
          Nueva Imagen
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-white border border-stone-200 w-full justify-start p-2 h-auto flex-wrap gap-2">
           <TabsTrigger value="all" className="data-[state=active]:bg-stone-100 px-4 py-2">Todas</TabsTrigger>
           {categories.map(cat => (
             <TabsTrigger key={cat.id} value={cat.id} className="data-[state=active]:bg-stone-100 px-4 py-2">
               {cat.label}
             </TabsTrigger>
           ))}
        </TabsList>

        <div className="mt-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-900"></div>
            </div>
          ) : (
            <>
                <TabsContent value="all" className="mt-0">
                   <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                     {images.map((img) => (
                       <ImageCard key={img.id} img={img} onEdit={handleOpenDialog} onDelete={handleDelete} />
                     ))}
                     {images.length === 0 && <p className="text-stone-500 col-span-full text-center py-8">No hay imágenes en la galería.</p>}
                   </div>
                </TabsContent>

                {categories.map(cat => (
                    <TabsContent key={cat.id} value={cat.id} className="mt-0">
                       <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                         {filterImages(cat.id).map((img) => (
                           <ImageCard key={img.id} img={img} onEdit={handleOpenDialog} onDelete={handleDelete} />
                         ))}
                         {filterImages(cat.id).length === 0 && <p className="text-stone-500 col-span-full text-center py-8">No hay imágenes en esta categoría.</p>}
                       </div>
                    </TabsContent>
                ))}
            </>
          )}
        </div>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle>{editingImage ? 'Editar Imagen' : 'Nueva Imagen'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium text-stone-700">Título</label>
              <input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                placeholder="Ej: Recolección de Lavanda"
              />
            </div>
            
             <div className="grid gap-2">
              <label htmlFor="category" className="text-sm font-medium text-stone-700">Categoría</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                <label className="text-sm font-medium text-stone-700 mb-2 block">Imagen</label>
                <ImageUploader 
                    // Convert single string URL to array for the uploader component
                    images={formData.image_url ? [formData.image_url] : []} 
                    // On change, take the first element of the array and save as string
                    onChange={(newImages) => setFormData({...formData, image_url: newImages[0] || ''})} 
                    maxImages={1}
                    bucketName="media"
                    folderPath="gallery"
                />
            </div>

            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium text-stone-700">Descripción (Opcional)</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="flex min-h-[80px] w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 resize-none"
                placeholder="Breve descripción del momento..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-amber-900 hover:bg-amber-800 text-white">
              <Save size={16} className="mr-2" /> Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ImageCard = ({ img, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow border border-stone-200 overflow-hidden group relative"
    >
      <div className="aspect-square bg-stone-100 relative overflow-hidden">
        <img src={img.image_url} alt={img.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        
        {/* Overlay with action buttons */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            
            {/* Edit Button */}
            <Button 
                onClick={() => onEdit(img)} 
                variant="secondary" 
                size="icon" 
                className="rounded-full bg-white/90 hover:bg-white text-amber-900"
            >
                <Pencil size={18} />
            </Button>

            {/* Delete Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon" className="rounded-full">
                  <Trash2 size={18} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar imagen?</AlertDialogTitle>
                  <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(img.id)} className="bg-red-600 hover:bg-red-700 text-white">
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>
      </div>
      <div className="p-3">
        <h4 className="font-bold text-sm text-amber-900 truncate" title={img.title}>{img.title}</h4>
        <p className="text-xs text-stone-500 truncate">{img.category}</p>
      </div>
    </motion.div>
  );
};

export default GalleryManager;