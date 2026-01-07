import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Save, Clock, FileImage as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import ImageUploader from './ImageUploader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, // Importado para corregir warning de accesibilidad
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

const TherapyManager = () => {
  const [therapies, setTherapies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTherapy, setEditingTherapy] = useState(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    benefits: '',
    images: []
  });

  useEffect(() => {
    fetchTherapies();
  }, []);

  const fetchTherapies = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('therapies')
      .select('*')
      .order('name');
    
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      setTherapies(data);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration: '',
      benefits: '',
      images: []
    });
    setEditingTherapy(null);
  };

  const handleOpenDialog = (therapy = null) => {
    if (therapy) {
      setEditingTherapy(therapy);
      setFormData({
        name: therapy.name,
        description: therapy.description || '',
        duration: therapy.duration || '',
        benefits: therapy.benefits || '',
        images: therapy.images || []
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    // Validación básica
    if (!formData.name) {
        toast({ variant: "destructive", title: "Faltan datos", description: "El nombre es obligatorio." });
        return;
    }

    try {
      if (editingTherapy) {
        const { error } = await supabase
          .from('therapies')
          .update(formData)
          .eq('id', editingTherapy.id);
        
        if (error) throw error;
        toast({ title: "Terapia actualizada", description: "Cambios guardados." });
      } else {
        const { error } = await supabase
          .from('therapies')
          .insert([formData]);
        
        if (error) throw error;
        toast({ title: "Terapia creada", description: "Nueva terapia añadida." });
      }
      
      setIsDialogOpen(false);
      fetchTherapies();
      resetForm();
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('therapies')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({ title: "Eliminado", description: "Terapia eliminada correctamente." });
      fetchTherapies();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-amber-900">Gestión de Terapias</h2>
          <p className="text-sm text-stone-600">Configura tus sesiones y masajes</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-amber-900 hover:bg-amber-800 text-white">
          <Plus size={18} className="mr-2" />
          Nueva Terapia
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-900"></div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {therapies.map((therapy) => (
            <motion.div
              key={therapy.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow border border-stone-200 p-4 flex flex-col h-full group"
            >
              <h3 className="font-bold text-lg text-amber-900 mb-2">{therapy.name}</h3>

              {/* Thumbnail preview */}
              {therapy.images && therapy.images.length > 0 ? (
                <div className="w-full h-32 mb-3 bg-stone-100 rounded-md overflow-hidden relative">
                   <img src={therapy.images[0]} alt={therapy.name} className="w-full h-full object-cover" />
                   {therapy.images.length > 1 && (
                     <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                       +{therapy.images.length - 1}
                     </div>
                   )}
                </div>
              ) : (
                <div className="w-full h-32 mb-3 bg-stone-50 rounded-md flex items-center justify-center border border-dashed border-stone-200">
                  <ImageIcon className="text-stone-300" size={24} />
                  <span className="text-xs text-stone-400 ml-2">Sin imagen</span>
                </div>
              )}
              
              <div className="flex-1 space-y-3 mb-4">
                <p className="text-sm text-stone-600 line-clamp-3">{therapy.description || "Sin descripción"}</p>
                <div className="flex items-center text-xs text-stone-500">
                  <Clock size={14} className="mr-1" /> {therapy.duration}
                </div>
                {therapy.benefits && (
                    <div className="text-xs bg-amber-50 p-2 rounded text-stone-700 border border-amber-100 line-clamp-2">
                    <span className="font-semibold text-amber-800">Beneficios:</span> {therapy.benefits}
                    </div>
                )}
              </div>

              <div className="flex gap-2 pt-2 border-t border-stone-100 mt-auto">
                <Button variant="outline" size="sm" className="flex-1 text-stone-700 hover:bg-stone-50" onClick={() => handleOpenDialog(therapy)}>
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
                      <AlertDialogTitle>¿Eliminar terapia?</AlertDialogTitle>
                      <AlertDialogDescription>Esta acción es permanente.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(therapy.id)} className="bg-red-600 hover:bg-red-700 text-white">
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
            <DialogTitle>{editingTherapy ? 'Editar Terapia' : 'Nueva Terapia'}</DialogTitle>
            <DialogDescription>
                Completa la información de la terapia y sube una imagen representativa.
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
                placeholder="Ej: Masaje Descontracturante"
              />
            </div>
            
            {/* Componente Uploader Configurado para Terapias */}
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                <ImageUploader 
                images={formData.images} 
                onChange={(newImages) => setFormData({...formData, images: newImages})} 
                maxImages={2}
                bucketName="media"
                folderPath="therapies" // <--- Aquí está el cambio clave
                />
            </div>

            <div className="grid gap-2">
              <label htmlFor="duration" className="text-sm font-medium text-stone-700">Duración</label>
              <input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className="flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                placeholder="Ej: 60 minutos"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium text-stone-700">Descripción</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="flex min-h-[80px] w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 resize-none"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="benefits" className="text-sm font-medium text-stone-700">Beneficios</label>
              <textarea
                id="benefits"
                value={formData.benefits}
                onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                className="flex min-h-[60px] w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                placeholder="Lista breve de beneficios"
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

export default TherapyManager;