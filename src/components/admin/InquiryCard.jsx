import React from 'react';
import { motion } from 'framer-motion';
import { Package, Heart, Sparkles, Clock, CheckCircle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const InquiryCard = ({ inquiry, onStatusChange }) => {
  const getTypeIcon = () => {
    switch (inquiry.type) {
      case 'product':
        return <Package size={20} className="text-amber-700" />;
      case 'therapy':
        return <Heart size={20} className="text-green-700" />;
      case 'experience':
        return <Sparkles size={20} className="text-blue-700" />;
      default:
        return null;
    }
  };

  const getTypeLabel = () => {
    switch (inquiry.type) {
      case 'product':
        return 'Producto';
      case 'therapy':
        return 'Terapia';
      case 'experience':
        return 'Experiencia';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (inquiry.status) {
      case 'new':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'contacted':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'completed':
        return 'bg-stone-100 text-stone-800 border-stone-200';
      default:
        return 'bg-stone-100 text-stone-800';
    }
  };

  const getStatusLabel = () => {
    switch (inquiry.status) {
      case 'new':
        return 'Nueva';
      case 'contacted':
        return 'Contactada';
      case 'completed':
        return 'Completada';
      default:
        return '';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha desconocida';
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getTypeIcon()}
          <div>
            <div className="text-xs text-stone-500 uppercase tracking-wide">{getTypeLabel()}</div>
            <h3 className="text-lg font-bold text-amber-900">{inquiry.item_name}</h3>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
          {getStatusLabel()}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-stone-600 mb-4">
        <Clock size={16} />
        <span>{formatDate(inquiry.created_at)}</span>
      </div>

      <div className="flex gap-2">
        {inquiry.status === 'new' && (
          <Button
            onClick={() => onStatusChange(inquiry.id, 'contacted')}
            variant="outline"
            size="sm"
            className="border-amber-300 text-amber-800 hover:bg-amber-50"
          >
            <MessageCircle size={16} className="mr-2" />
            Marcar Contactada
          </Button>
        )}
        {inquiry.status === 'contacted' && (
          <Button
            onClick={() => onStatusChange(inquiry.id, 'completed')}
            variant="outline"
            size="sm"
            className="border-green-300 text-green-800 hover:bg-green-50"
          >
            <CheckCircle size={16} className="mr-2" />
            Marcar Completada
          </Button>
        )}
        {inquiry.status === 'completed' && (
          <Button
            onClick={() => onStatusChange(inquiry.id, 'new')}
            variant="outline"
            size="sm"
            className="border-stone-300 text-stone-700 hover:bg-stone-50"
          >
            Reabrir
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default InquiryCard;