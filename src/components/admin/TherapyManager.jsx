import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Save, Search, Clock, Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import ImageUploader from './ImageUploader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
  const [filteredTherapies, setFilteredTherapies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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

  // Buscador en tiempo real
  useEffect(() => {
    if (searchTerm === '') {
        setFilteredTherapies(therapies);
    } else {
        const lowerTerm = searchTerm.toLowerCase();
        const filtered = therapies.filter(t => 
            t.name.toLowerCase().includes(lowerTerm) || 
            (t.description && t.description.toLowerCase().includes(lowerTerm))
        );
        setFilteredTherapies(filtered);
    }
  }, [searchTerm, therapies]);

  const fetchTherapies = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('therapies')
      .select('*')
      .order('name');
    
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      setTherapies(data || []);
      setFilteredTherapies(data || []);
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
    <div className="space-y-8">
      
      {/* --- HEADER & TOOLBAR --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-stone-100 sticky top-20 z-10">
        <div>
          <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
            <Heart className="text-amber-600" size={24} />
            Terapias y Sesiones
          </h2>
          <p className="text-sm text-stone-500 hidden sm:block">Gestiona tu oferta de bienestar</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Buscar terapia..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                />
            </div>

            <Button onClick={() => handleOpenDialog()} className="bg-stone-900 hover:bg-stone-800 text-white shadow-lg shadow-stone-900/20">
                <Plus size={18} className="mr-2" />
                Nueva
            </Button>
        </div>
      </div>

      {/* --- GRID DE TERAPIAS --- */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-900"></div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence>
            {filteredTherapies.map((therapy) => (
              <TherapyCard 
                key={therapy.id} 
                therapy={therapy} 
                onEdit={handleOpenDialog} 
                onDelete={handleDelete} 
              />
            ))}
          </AnimatePresence>
          
          {filteredTherapies.length === 0 && (
              <div className="col-span-full py-20 text-center text-stone-400">
                  <Heart className="mx-auto mb-2 opacity-50" size={40} />
                  <p>No se encontraron terapias.</p>
              </div>
          )}
        </div>
      )}

      {/* --- MODAL --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-amber-900">
                {editingTherapy ? 'Editar Terapia' : 'Nueva Terapia'}
            </DialogTitle>
            <DialogDescription>
                Define los detalles de la sesión para tus pacientes.
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
                        placeholder="Ej: Masaje Descontracturante"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Duración</label>
                    <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={14} />
                        <input
                            value={formData.duration}
                            onChange={(e) => setFormData({...formData, duration: e.target.value})}
                            className="w-full pl-8 p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                            placeholder="Ej: 60 mins"
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
                        maxImages={2}
                        bucketName="media"
                        folderPath="therapies"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Descripción</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg text-sm min-h-[100px] focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none"
                    placeholder="¿En qué consiste la terapia?"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles size={14} className="text-amber-500" /> Beneficios Clave
                </label>
                <textarea
                    value={formData.benefits}
                    onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                    className="w-full p-3 bg-amber-50/50 border border-amber-100 rounded-lg text-sm min-h-[80px] focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none"
                    placeholder="Ej: Relaja músculos, reduce estrés, mejora circulación..."
                />
            </div>

          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-amber-900 hover:bg-amber-800 text-white shadow-md">
              <Save size={16} className="mr-2" /> Guardar Terapia
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// --- TARJETA DE TERAPIA PREMIUM ---
const TherapyCard = ({ therapy, onEdit, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 overflow-hidden flex flex-col h-full"
    >
      {/* IMAGEN HERO */}
      <div className="relative aspect-square overflow-hidden bg-stone-100 cursor-pointer" onClick={() => onEdit(therapy)}>
        {therapy.images && therapy.images.length > 0 ? (
            <img 
                src={therapy.images[0]} 
                alt={therapy.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
        ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-stone-300">
                <Heart size={48} strokeWidth={1} />
                <span className="text-xs mt-2">Sin imagen</span>
            </div>
        )}

        {/* Badge de Duración Flotante */}
        {therapy.duration && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm text-stone-700 font-bold text-xs border border-white/50 flex items-center gap-1.5">
                <Clock size={12} className="text-amber-600" />
                {therapy.duration}
            </div>
        )}

        {/* Overlay Acciones (Desktop Hover) */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[1px]">
            <Button onClick={(e) => { e.stopPropagation(); onEdit(therapy); }} className="bg-white text-stone-900 hover:bg-amber-50 rounded-full h-10 w-10 p-0 shadow-lg border-none">
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
                  <AlertDialogTitle>¿Eliminar terapia?</AlertDialogTitle>
                  <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(therapy.id)} className="bg-red-600 text-white hover:bg-red-700">Eliminar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif font-bold text-lg text-stone-800 leading-tight mb-2 group-hover:text-amber-700 transition-colors cursor-pointer" onClick={() => onEdit(therapy)}>
            {therapy.name}
        </h3>
        
        <p className="text-sm text-stone-500 line-clamp-2 mb-4 flex-1">
            {therapy.description || <span className="italic opacity-50">Sin descripción</span>}
        </p>

        {therapy.benefits && (
            <div className="flex items-start gap-2 mt-auto pt-4 border-t border-stone-100">
                <Sparkles size={14} className="text-amber-500 mt-0.5 shrink-0" />
                <span className="text-xs text-stone-600 font-medium line-clamp-1 bg-amber-50/50 px-2 py-0.5 rounded border border-amber-100/50">
                    {therapy.benefits}
                </span>
            </div>
        )}
      </div>

      {/* Barra de Acciones Móvil */}
      <div className="md:hidden flex border-t border-stone-100 divide-x divide-stone-100">
        <button onClick={() => onEdit(therapy)} className="flex-1 py-3 text-sm font-medium text-stone-600 hover:bg-stone-50 flex items-center justify-center gap-2">
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
                  <AlertDialogAction onClick={() => onDelete(therapy.id)} className="bg-red-600 text-white">Eliminar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.div>
  );
};

export default TherapyManager;