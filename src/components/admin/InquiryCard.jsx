import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, Heart, Sparkles, Clock, CheckCircle, MessageCircle, 
  ArchiveRestore, AlertCircle, Copy, Hash, MoreHorizontal 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/components/ui/use-toast';

// Función para fechas relativas
const timeAgo = (dateParam) => {
  if (!dateParam) return null;
  const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
  const today = new Date();
  const seconds = Math.round((today - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return 'Recién';
  if (minutes < 60) return `hace ${minutes} min`;
  if (hours < 24) return `hace ${hours} h`;
  if (days === 1) return 'ayer';
  return `hace ${days} días`;
};

const InquiryCard = ({ inquiry, onStatusChange }) => {
  const { toast } = useToast();
  const date = new Date(inquiry.created_at);
  
  // Lógica de Urgencia: Si es 'new' y pasaron más de 24hs
  const hoursSince = (new Date() - date) / (1000 * 60 * 60);
  const isUrgent = inquiry.status === 'new' && hoursSince > 24;

  const handleCopy = () => {
    const text = `Consulta Matukana:\nInterés en: ${inquiry.item_name}\nTipo: ${inquiry.type}\nFecha: ${date.toLocaleString()}`;
    navigator.clipboard.writeText(text);
    toast({ description: "Datos copiados al portapapeles" });
  };
  
  const getTypeConfig = () => {
    switch (inquiry.type) {
      case 'product': return { icon: <Package size={16} />, label: 'Producto', color: 'bg-amber-100 text-amber-700', border: 'border-amber-200' };
      case 'therapy': return { icon: <Heart size={16} />, label: 'Terapia', color: 'bg-rose-100 text-rose-700', border: 'border-rose-200' };
      case 'experience': return { icon: <Sparkles size={16} />, label: 'Experiencia', color: 'bg-indigo-100 text-indigo-700', border: 'border-indigo-200' };
      default: return { icon: <MessageCircle size={16} />, label: 'Consulta', color: 'bg-stone-100 text-stone-700', border: 'border-stone-200' };
    }
  };

  const getStatusConfig = () => {
    switch (inquiry.status) {
      case 'new': return { label: 'Nueva', color: 'bg-emerald-500', text: 'text-emerald-700' };
      case 'contacted': return { label: 'En Proceso', color: 'bg-amber-400', text: 'text-amber-700' };
      case 'completed': return { label: 'Archivada', color: 'bg-stone-300', text: 'text-stone-500' };
      default: return { label: inquiry.status, color: 'bg-stone-300', text: 'text-stone-600' };
    }
  };

  const typeConfig = getTypeConfig();
  const statusConfig = getStatusConfig();
  const isCompleted = inquiry.status === 'completed';

  // ID simulado corto (ej: PRD-492) basado en ID real
  const shortId = `${inquiry.type.substring(0,3).toUpperCase()}-${inquiry.id.substring(0,4).toUpperCase()}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`group relative bg-white rounded-xl border p-0 overflow-hidden transition-all duration-300 ${
        isUrgent ? 'border-l-4 border-l-red-500 shadow-md' : 
        isCompleted ? 'border-stone-100 opacity-60 hover:opacity-100' : 'border-stone-200 hover:border-amber-300 hover:shadow-md'
      }`}
    >
      {/* --- HEADER DE LA TARJETA --- */}
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-stone-400 flex items-center bg-stone-50 px-1.5 py-0.5 rounded">
                <Hash size={10} className="mr-0.5" />{shortId}
            </span>
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${typeConfig.color} ${typeConfig.border}`}>
                {typeConfig.icon}
                <span>{typeConfig.label}</span>
            </div>
        </div>

        <div className="flex items-center gap-2">
            {isUrgent && (
                <div className="flex items-center gap-1 text-red-500 text-xs font-bold animate-pulse" title="Sin atender hace +24hs">
                    <AlertCircle size={14} />
                    <span className="hidden sm:inline">Pendiente</span>
                </div>
            )}
            <div className="flex items-center gap-1 text-xs text-stone-400">
                <Clock size={12} />
                {timeAgo(inquiry.created_at)}
            </div>
            
            {/* Menú de Opciones Extra */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-stone-400 hover:text-stone-600">
                  <MoreHorizontal size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem onClick={handleCopy} className="text-xs cursor-pointer">
                  <Copy size={12} className="mr-2" /> Copiar detalles
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="px-4 pb-4">
        <div className="flex items-start justify-between">
            <div>
                <h3 className={`font-bold text-stone-800 text-lg leading-tight ${isCompleted ? 'line-through decoration-stone-300' : ''}`}>
                    {inquiry.item_name}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                    Recibido el {date.toLocaleDateString()} a las {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
            </div>
            
            {/* Indicador de Estado (Punto de color) */}
            <div className={`w-3 h-3 rounded-full mt-1.5 ${statusConfig.color} shadow-sm ring-2 ring-white`} title={statusConfig.label}></div>
        </div>
      </div>

      {/* --- FOOTER DE ACCIONES --- */}
      <div className="bg-stone-50/50 border-t border-stone-100 p-3 flex gap-2">
        
        {inquiry.status === 'new' && (
          <Button
            onClick={() => onStatusChange(inquiry.id, 'contacted')}
            size="sm"
            className="w-full bg-stone-900 hover:bg-stone-800 text-white h-8 text-xs shadow-sm transition-transform active:scale-95"
          >
            <MessageCircle size={14} className="mr-2" />
            Marcar como Contactado
          </Button>
        )}

        {inquiry.status === 'contacted' && (
          <Button
            onClick={() => onStatusChange(inquiry.id, 'completed')}
            size="sm"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs shadow-sm transition-transform active:scale-95"
          >
            <CheckCircle size={14} className="mr-2" />
            Cerrar Ticket
          </Button>
        )}

        {inquiry.status === 'completed' && (
          <Button
            onClick={() => onStatusChange(inquiry.id, 'new')}
            variant="outline"
            size="sm"
            className="w-full border-stone-200 text-stone-600 hover:bg-white h-8 text-xs"
          >
            <ArchiveRestore size={14} className="mr-2" />
            Reabrir
          </Button>
        )}
      </div>

    </motion.div>
  );
};

export default InquiryCard;