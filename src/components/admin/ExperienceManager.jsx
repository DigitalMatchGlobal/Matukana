import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Save, Calendar, Clock, User, FileImage as ImageIcon } from 'lucide-react';
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

const ExperienceManager = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    availability: '', // Legacy field kept for flexibility
    duration: '',
    includes: '',
    date: '',
    capacity: '',
    status: 'to_coordinate',
    images: []
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('date', { ascending: true }); // Order by date now
    
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      setExperiences(data);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      availability: '',
      duration: '',
      includes: '',
      date: '',
      capacity: '',
      status: 'to_coordinate',
      images: []
    });
    setEditingExperience(null);
  };

  const handleOpenDialog = (exp = null) => {
    if (exp) {
      setEditingExperience(exp);
      // Format date for input datetime-local if exists
      let dateStr = '';
      if (exp.date) {
        const d = new Date(exp.date);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        dateStr = d.toISOString().slice(0, 16);
      }

      setFormData({
        name: exp.name,
        description: exp.description,
        availability: exp.availability || '',
        duration: exp.duration || '',
        includes: exp.includes || '',
        date: dateStr,
        capacity: exp.capacity || '',
        status: exp.status || 'to_coordinate',
        images: exp.images || []
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        // Convert empty string to null for date/capacity
        date: formData.date ? new Date(formData.date).toISOString() : null,
        capacity: formData.capacity ? parseInt(formData.capacity) : null
      };

      if (editingExperience) {
        const { error } = await supabase
          .from('experiences')
          .update(payload)
          .eq('id', editingExperience.id);
        if (error) throw error;
        toast({ title: "Experiencia actualizada", description: "Cambios guardados." });
      } else {
        const { error } = await supabase
          .from('experiences')
          .insert([payload]);
        if (error) throw error;
        toast({ title: "Experiencia creada", description: "Nueva experiencia añadida." });
      }
      setIsDialogOpen(false);
      fetchExperiences();
      resetForm();
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast({ title: "Eliminado", description: "Experiencia eliminada correctamente." });
      fetchExperiences();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'upcoming': return 'Próxima';
      case 'full': return 'Completa';
      case 'to_coordinate': return 'A Coordinar';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
     switch (status) {
      case 'upcoming': return 'bg-green-100 text-green-800 border-green-200';
      case 'full': return 'bg-red-100 text-red-800 border-red-200';
      case 'to_coordinate': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Fecha sin definir';
    return new Date(dateStr).toLocaleDateString('es-AR', {
      weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-amber-900">Gestión de Experiencias</h2>
          <p className="text-sm text-stone-600">Calendario y actividades en la naturaleza</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-amber-900 hover:bg-amber-800 text-white">
          <Plus size={18} className="mr-2" />
          Nueva Experiencia
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-900"></div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {experiences.map((exp) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow border border-stone-200 p-4 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-2">
                 <h3 className="font-bold text-lg text-amber-900">{exp.name}</h3>
                 <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getStatusColor(exp.status)}`}>
                   {getStatusLabel(exp.status)}
                 </span>
              </div>

              {/* Thumbnail preview */}
              {exp.images && exp.images.length > 0 ? (
                <div className="w-full h-32 mb-3 bg-stone-100 rounded-md overflow-hidden relative">
                   <img src={exp.images[0]} alt={exp.name} className="w-full h-full object-cover" />
                   {exp.images.length > 1 && (
                     <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                       +{exp.images.length - 1}
                     </div>
                   )}
                </div>
              ) : (
                <div className="w-full h-24 mb-3 bg-stone-50 rounded-md flex items-center justify-center border border-dashed border-stone-200">
                  <ImageIcon className="text-stone-300" size={24} />
                </div>
              )}
              
              <div className="flex-1 space-y-3 mb-4">
                <p className="text-sm text-stone-600 line-clamp-3">{exp.description}</p>
                
                <div className="space-y-1 text-xs text-stone-600 bg-stone-50 p-2 rounded">
                   {exp.date ? (
                      <div className="flex items-center font-medium text-amber-900">
                        <Calendar size={14} className="mr-2" />
                        {formatDate(exp.date)}
                      </div>
                   ) : (
                      <div className="flex items-center text-stone-500">
                        <Calendar size={14} className="mr-2" />
                        {exp.availability || 'A coordinar'}
                      </div>
                   )}
                  
                  <div className="flex items-center">
                    <Clock size={14} className="mr-2" />
                    {exp.duration}
                  </div>
                  {exp.capacity && (
                    <div className="flex items-center">
                       <User size={14} className="mr-2" />
                       Cupo: {exp.capacity} personas
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-stone-100 mt-auto">
                <Button variant="outline" size="sm" className="flex-1 text-stone-700" onClick={() => handleOpenDialog(exp)}>
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
                      <AlertDialogTitle>¿Eliminar experiencia?</AlertDialogTitle>
                      <AlertDialogDescription>Esta acción es permanente.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(exp.id)} className="bg-red-600 hover:bg-red-700 text-white">
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingExperience ? 'Editar Experiencia' : 'Nueva Experiencia'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium text-stone-700">Nombre</label>
              <input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              />
            </div>
            
            <ImageUploader 
              images={formData.images} 
              onChange={(newImages) => setFormData({...formData, images: newImages})} 
              maxImages={2}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="status" className="text-sm font-medium text-stone-700">Estado</label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                >
                  <option value="to_coordinate">A Coordinar</option>
                  <option value="upcoming">Próxima Fecha</option>
                  <option value="full">Cupo Completo</option>
                </select>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="date" className="text-sm font-medium text-stone-700">Fecha y Hora</label>
                <input
                  type="datetime-local"
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="grid gap-2">
                <label htmlFor="capacity" className="text-sm font-medium text-stone-700">Cupo (Personas)</label>
                <input
                  type="number"
                  id="capacity"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="duration" className="text-sm font-medium text-stone-700">Duración</label>
                <input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                  placeholder="Ej: 3 horas"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="availability" className="text-sm font-medium text-stone-700">Texto de Disponibilidad (Opcional)</label>
              <input
                id="availability"
                value={formData.availability}
                onChange={(e) => setFormData({...formData, availability: e.target.value})}
                className="flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                placeholder="Ej: Fines de semana / A pedido"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium text-stone-700">Descripción</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="flex min-h-[80px] w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="includes" className="text-sm font-medium text-stone-700">Qué incluye</label>
              <textarea
                id="includes"
                value={formData.includes}
                onChange={(e) => setFormData({...formData, includes: e.target.value})}
                className="flex min-h-[60px] w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                placeholder="Materiales, refrigerio, guía, etc."
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

export default ExperienceManager;