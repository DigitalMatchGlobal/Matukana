import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Save, Search, Calendar, Clock, User, Sparkles, MapPin } from 'lucide-react';
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

const ExperienceManager = () => {
  const [experiences, setExperiences] = useState([]);
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
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

  useEffect(() => {
    fetchExperiences();
  }, []);

  // Buscador en tiempo real
  useEffect(() => {
    if (searchTerm === '') {
        setFilteredExperiences(experiences);
    } else {
        const lowerTerm = searchTerm.toLowerCase();
        const filtered = experiences.filter(e => 
            e.name.toLowerCase().includes(lowerTerm) || 
            (e.description && e.description.toLowerCase().includes(lowerTerm))
        );
        setFilteredExperiences(filtered);
    }
  }, [searchTerm, experiences]);

  const fetchExperiences = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      // Orden personalizado: Fechas futuras primero, luego sin fecha
      const sorted = (data || []).sort((a, b) => {
           if (a.date && !b.date) return -1;
           if (!a.date && b.date) return 1;
           if (a.date && b.date) return new Date(a.date) - new Date(b.date);
           return 0;
      });
      setExperiences(sorted);
      setFilteredExperiences(sorted);
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
      let dateStr = '';
      if (exp.date) {
        const d = new Date(exp.date);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        dateStr = d.toISOString().slice(0, 16);
      }

      setFormData({
        name: exp.name,
        description: exp.description || '',
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
    if (!formData.name) {
        toast({ variant: "destructive", title: "Faltan datos", description: "El nombre es obligatorio." });
        return;
    }

    try {
      const payload = {
        ...formData,
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

  return (
    <div className="space-y-8">
      
      {/* --- HEADER & TOOLBAR --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-stone-100 sticky top-20 z-10">
        <div>
          <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
            <MapPin className="text-amber-600" size={24} />
            Experiencias
          </h2>
          <p className="text-sm text-stone-500 hidden sm:block">Calendario y actividades</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
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
                Nueva
            </Button>
        </div>
      </div>

      {/* --- GRID DE EXPERIENCIAS --- */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-900"></div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence>
            {filteredExperiences.map((exp) => (
              <ExperienceCard 
                key={exp.id} 
                experience={exp} 
                onEdit={handleOpenDialog} 
                onDelete={handleDelete} 
              />
            ))}
          </AnimatePresence>
          
          {filteredExperiences.length === 0 && (
              <div className="col-span-full py-20 text-center text-stone-400">
                  <Calendar className="mx-auto mb-2 opacity-50" size={40} />
                  <p>No se encontraron experiencias.</p>
              </div>
          )}
        </div>
      )}

      {/* --- MODAL --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-amber-900">
                {editingExperience ? 'Editar Experiencia' : 'Nueva Experiencia'}
            </DialogTitle>
            <DialogDescription>
                Planifica tu próxima aventura en la naturaleza.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            
            <div className="grid gap-2">
              <label htmlFor="name" className="text-xs font-bold text-stone-500 uppercase tracking-wider">Nombre</label>
              <input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                placeholder="Ej: Caminata Medicinal"
              />
            </div>
            
            <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Imagen de Portada</label>
                <div className="p-4 bg-stone-50 border border-dashed border-stone-200 rounded-xl">
                    <ImageUploader 
                        images={formData.images} 
                        onChange={(newImages) => setFormData({...formData, images: newImages})} 
                        maxImages={2}
                        bucketName="media"
                        folderPath="experiences"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Estado</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full p-2.5 bg-white border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                >
                  <option value="to_coordinate">A Coordinar</option>
                  <option value="upcoming">Próxima Fecha</option>
                  <option value="full">Cupo Completo</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Fecha y Hora</label>
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full p-2.5 bg-white border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Cupo (Personas)</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Duración</label>
                <input
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                  placeholder="Ej: 3 horas"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Disponibilidad (Texto)</label>
              <input
                value={formData.availability}
                onChange={(e) => setFormData({...formData, availability: e.target.value})}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                placeholder="Ej: Fines de semana / A pedido (Si no hay fecha fija)"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg text-sm min-h-[80px] focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-2">
                 <Sparkles size={14} className="text-amber-500" /> Qué incluye
              </label>
              <textarea
                value={formData.includes}
                onChange={(e) => setFormData({...formData, includes: e.target.value})}
                className="w-full p-3 bg-amber-50/50 border border-amber-100 rounded-lg text-sm min-h-[60px] focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none"
                placeholder="Materiales, refrigerio, guía, etc."
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-amber-900 hover:bg-amber-800 text-white shadow-md">
              <Save size={16} className="mr-2" /> Guardar Experiencia
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// --- TARJETA DE EXPERIENCIA PREMIUM ---
const ExperienceCard = ({ experience, onEdit, onDelete }) => {
  
  const getStatusConfig = (status) => {
    switch (status) {
      case 'upcoming': return { label: 'Próxima', color: 'bg-emerald-500', text: 'text-white' };
      case 'full': return { label: 'Completa', color: 'bg-red-500', text: 'text-white' };
      default: return { label: 'A Coordinar', color: 'bg-amber-400', text: 'text-white' };
    }
  };

  const statusConfig = getStatusConfig(experience.status);

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return {
        day: date.getDate(),
        month: date.toLocaleDateString('es-AR', { month: 'short' }).toUpperCase()
    };
  };

  const dateObj = formatDate(experience.date);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 overflow-hidden flex flex-col h-full"
    >
      {/* IMAGEN HERO */}
      <div className="relative aspect-video overflow-hidden bg-stone-100 cursor-pointer" onClick={() => onEdit(experience)}>
        {experience.images && experience.images.length > 0 ? (
            <img 
                src={experience.images[0]} 
                alt={experience.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
        ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-stone-300">
                <MapPin size={48} strokeWidth={1} />
                <span className="text-xs mt-2">Sin imagen</span>
            </div>
        )}

        {/* Badge Estado */}
        <div className={`absolute top-3 right-3 ${statusConfig.color} ${statusConfig.text} px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm`}>
            {statusConfig.label}
        </div>

        {/* Calendario Flotante (Si tiene fecha) */}
        {dateObj && (
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md rounded-lg shadow-lg p-1.5 text-center min-w-[50px]">
                <div className="text-[10px] font-bold text-stone-500 uppercase">{dateObj.month}</div>
                <div className="text-xl font-bold text-stone-900 leading-none">{dateObj.day}</div>
            </div>
        )}

        {/* Overlay Acciones */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[1px]">
            <Button onClick={(e) => { e.stopPropagation(); onEdit(experience); }} className="bg-white text-stone-900 hover:bg-amber-50 rounded-full h-10 w-10 p-0 shadow-lg border-none">
                <Pencil size={18} />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button onClick={(e) => e.stopPropagation()} className="bg-white text-red-600 hover:bg-red-50 rounded-full h-10 w-10 p-0 shadow-lg border-none">
                  <Trash2 size={18} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(experience.id)} className="bg-red-600 text-white">Eliminar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif font-bold text-lg text-stone-800 leading-tight mb-2 cursor-pointer group-hover:text-amber-700 transition-colors" onClick={() => onEdit(experience)}>
            {experience.name}
        </h3>
        
        <p className="text-sm text-stone-500 line-clamp-2 mb-4 flex-1">
            {experience.description || <span className="italic opacity-50">Sin descripción</span>}
        </p>

        <div className="flex items-center gap-4 text-xs text-stone-500 border-t border-stone-100 pt-3 mt-auto">
            {experience.duration && (
                <div className="flex items-center gap-1">
                    <Clock size={12} className="text-amber-500" /> {experience.duration}
                </div>
            )}
            {experience.capacity && (
                <div className="flex items-center gap-1">
                    <User size={12} className="text-amber-500" /> Cupo: {experience.capacity}
                </div>
            )}
        </div>
      </div>

      {/* Barra de Acciones Móvil */}
      <div className="md:hidden flex border-t border-stone-100 divide-x divide-stone-100">
        <button onClick={() => onEdit(experience)} className="flex-1 py-3 text-sm font-medium text-stone-600 hover:bg-stone-50 flex items-center justify-center gap-2">
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
                  <AlertDialogAction onClick={() => onDelete(experience.id)} className="bg-red-600 text-white">Eliminar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.div>
  );
};

export default ExperienceManager;