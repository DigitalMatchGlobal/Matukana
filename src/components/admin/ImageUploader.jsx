import React, { useState } from 'react';
import { Plus, X, ArrowLeft, ArrowRight, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';

const ImageUploader = ({ images = [], onChange, maxImages = 2, bucketName = 'media', folderPath = 'productos' }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      if (images.length >= maxImages) {
        alert(`Solo puedes subir un máximo de ${maxImages} imágenes.`);
        return;
      }

      setUploading(true);

      // 1. Generar nombre único para evitar duplicados
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${folderPath}/${fileName}`;

      // 2. Subir a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 3. Obtener URL Pública
      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      // 4. Actualizar el estado con la nueva URL
      onChange([...images, data.publicUrl]);

    } catch (error) {
      console.error('Error subiendo imagen:', error);
      alert('Hubo un error al subir la imagen. Revisa la consola o las políticas de tu bucket.');
    } finally {
      setUploading(false);
      // Limpiar el input para permitir subir el mismo archivo si se borró y se quiere subir de nuevo
      event.target.value = ''; 
    }
  };

  const handleRemove = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
    // Nota: Opcionalmente aquí podrías agregar lógica para borrar el archivo del bucket también,
    // pero usualmente se dejan por seguridad o historial.
  };

  const handleMove = (index, direction) => {
    const newImages = [...images];
    if (direction === 'left' && index > 0) {
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    } else if (direction === 'right' && index < newImages.length - 1) {
      [newImages[index + 1], newImages[index]] = [newImages[index], newImages[index + 1]];
    }
    onChange(newImages);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-stone-700">
            Imágenes ({images.length}/{maxImages})
        </label>
        {uploading && <span className="text-xs text-amber-600 flex items-center gap-1"><Loader2 className="animate-spin h-3 w-3"/> Subiendo...</span>}
      </div>
      
      {/* Botón de carga */}
      {images.length < maxImages && (
        <div className="flex gap-2">
           <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="w-full">
            <div className={`
                flex items-center justify-center gap-2 w-full h-10 border-2 border-dashed rounded-md cursor-pointer transition-colors
                ${uploading ? 'bg-stone-100 border-stone-300' : 'border-stone-300 hover:border-amber-500 hover:bg-amber-50'}
            `}>
                {uploading ? (
                    <Loader2 size={16} className="animate-spin text-stone-500" />
                ) : (
                    <Upload size={16} className="text-stone-500" />
                )}
                <span className="text-sm text-stone-600 font-medium">
                    {uploading ? 'Procesando...' : 'Cargar imagen desde PC'}
                </span>
            </div>
          </label>
        </div>
      )}

      {/* Grid de Imágenes (Mantenemos tu lógica visual que estaba excelente) */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mt-2">
          {images.map((url, idx) => (
            <div key={idx} className="relative group aspect-video bg-stone-100 rounded-md overflow-hidden border border-stone-200 shadow-sm">
              <img src={url} alt={`Producto ${idx + 1}`} className="w-full h-full object-cover" />
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {idx > 0 && (
                  <button 
                    onClick={() => handleMove(idx, 'left')}
                    className="p-1.5 bg-white/20 hover:bg-white/40 text-white rounded backdrop-blur-sm"
                    type="button"
                    title="Mover a la izquierda"
                  >
                    <ArrowLeft size={16} />
                  </button>
                )}
                
                <button 
                  onClick={() => handleRemove(idx)}
                  className="p-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded backdrop-blur-sm"
                  type="button"
                  title="Eliminar imagen"
                >
                  <X size={16} />
                </button>

                {idx < images.length - 1 && (
                  <button 
                    onClick={() => handleMove(idx, 'right')}
                    className="p-1.5 bg-white/20 hover:bg-white/40 text-white rounded backdrop-blur-sm"
                    type="button"
                    title="Mover a la derecha"
                  >
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
              
              {/* Badge de orden */}
              <div className="absolute top-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                #{idx + 1}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {images.length === 0 && (
          <div className="text-center py-4 bg-stone-50 border border-dashed border-stone-200 rounded-md">
             <p className="text-xs text-stone-400 italic">No hay imágenes seleccionadas</p>
          </div>
      )}

      {/* AQUÍ AGREGAMOS EL RECORDATORIO TÉCNICO */}
      <div className="text-[11px] text-stone-500 bg-amber-50/50 p-2 rounded border border-amber-100/50">
        <p className="font-medium text-amber-900/80">Recomendaciones:</p>
        <ul className="list-disc list-inside mt-1 space-y-0.5">
            <li>Formato: <strong>Horizontal (16:9)</strong></li>
            <li>Tamaño ideal: <strong>1280 x 720 px</strong></li>
            <li>Archivos: .jpg o .webp (Máx 2MB)</li>
        </ul>
      </div>
      
    </div>
  );
};

export default ImageUploader;