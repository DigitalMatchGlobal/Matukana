import React from 'react';
import { motion } from 'framer-motion';
import { Package, Heart, Sparkles, Clock, CheckCircle, MessageCircle, ArchiveRestore } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Función para mostrar fechas relativas (ej: "hace 2 horas")
const timeAgo = (dateParam) => {
  if (!dateParam) return null;
  const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
  const today = new Date();
  const seconds = Math.round((today - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return 'hace un momento';
  if (minutes < 60) return `hace ${minutes} minutos`;
  if (hours < 24) return `hace ${hours} horas`;
  if (days === 1) return 'ayer';
  if (days < 7) return `hace ${days} días`;
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
};

const InquiryCard = ({ inquiry, onStatusChange }) => {
  
  const getTypeConfig = () => {
    switch (inquiry.type) {
      case 'product':
        return { icon: <Package size={18} />, label: 'Producto', color: 'bg-amber-100 text-amber-700' };
      case 'therapy':
        return { icon: <Heart size={18} />, label: 'Terapia', color: 'bg-rose-100 text-rose-700' };
      case 'experience':
        return { icon: <Sparkles size={18} />, label: 'Experiencia', color: 'bg-indigo-100 text-indigo-700' };
      default:
        return { icon: <MessageCircle size={18} />, label: 'Consulta', color: 'bg-stone-100 text-stone-700' };
    }
  };

  const getStatusConfig = () => {
    switch (inquiry.status) {
      case 'new':
        return { label: 'Nueva', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'contacted':
        return { label: 'Contactada', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'completed':
        return { label: 'Archivada', color: 'bg-stone-100 text-stone-500 border-stone-200 decoration-stone-400' }; // Estilo apagado para completadas
      default:
        return { label: inquiry.status, color: 'bg-stone-100 text-stone-800' };
    }
  };

  const typeConfig = getTypeConfig();
  const statusConfig = getStatusConfig();
  const isCompleted = inquiry.status === 'completed';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative bg-white rounded-xl border p-5 transition-all duration-300 ${
        isCompleted ? 'border-stone-100 opacity-75 hover:opacity-100' : 'border-stone-200 shadow-sm hover:shadow-md hover:border-amber-200'
      }`}
    >
      
      {/* --- HEADER: TIPO Y ESTADO --- */}
      <div className="flex items-center justify-between mb-3">
        <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${typeConfig.color}`}>
            {typeConfig.icon}
            <span>{typeConfig.label}</span>
        </div>
        <div className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusConfig.color}`}>
            {statusConfig.label}
        </div>
      </div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="mb-4">
        <h3 className={`text-lg font-bold text-stone-800 leading-tight ${isCompleted ? 'line-through text-stone-400' : ''}`}>
            {inquiry.item_name}
        </h3>
        <div className="flex items-center gap-2 text-xs text-stone-500 mt-2">
            <Clock size={14} />
            <span>{timeAgo(inquiry.created_at)}</span>
            <span className="text-stone-300">•</span>
            <span className="opacity-70">
                {new Date(inquiry.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
        </div>
      </div>

      {/* --- ACCIONES --- */}
      <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
        
        {inquiry.status === 'new' && (
          <Button
            onClick={() => onStatusChange(inquiry.id, 'contacted')}
            size="sm"
            className="w-full bg-stone-900 hover:bg-stone-800 text-white h-9 rounded-lg text-xs font-medium shadow-sm"
          >
            <MessageCircle size={14} className="mr-2" />
            Marcar como Contactada
          </Button>
        )}

        {inquiry.status === 'contacted' && (
          <Button
            onClick={() => onStatusChange(inquiry.id, 'completed')}
            size="sm"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-9 rounded-lg text-xs font-medium shadow-sm"
          >
            <CheckCircle size={14} className="mr-2" />
            Archivar / Completar
          </Button>
        )}

        {inquiry.status === 'completed' && (
          <Button
            onClick={() => onStatusChange(inquiry.id, 'new')}
            variant="ghost"
            size="sm"
            className="w-full text-stone-500 hover:text-stone-800 hover:bg-stone-100 h-9 rounded-lg text-xs"
          >
            <ArchiveRestore size={14} className="mr-2" />
            Reabrir Consulta
          </Button>
        )}
      </div>

    </motion.div>
  );
};

export default InquiryCard;