import React, { useState } from 'react';
import { Plus, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ImageUploader = ({ images = [], onChange, maxImages = 2 }) => {
  const [urlInput, setUrlInput] = useState('');

  const handleAdd = () => {
    if (!urlInput.trim()) return;
    if (images.length >= maxImages) return;
    
    onChange([...images, urlInput.trim()]);
    setUrlInput('');
  };

  const handleRemove = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
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
      <label className="text-sm font-medium text-stone-700">Imágenes ({images.length}/{maxImages})</label>
      
      <div className="flex gap-2">
        <input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="https://..."
          className="flex-1 h-9 rounded-md border border-stone-300 bg-white px-3 py-1 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          disabled={images.length >= maxImages}
        />
        <Button 
          onClick={handleAdd} 
          type="button" 
          variant="secondary" 
          size="sm"
          className="bg-stone-200 text-stone-800 hover:bg-stone-300"
          disabled={!urlInput || images.length >= maxImages}
        >
          <Plus size={16} />
        </Button>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mt-2">
          {images.map((url, idx) => (
            <div key={idx} className="relative group aspect-video bg-stone-100 rounded-md overflow-hidden border border-stone-200">
              <img src={url} alt={`Imagen ${idx + 1}`} className="w-full h-full object-cover" />
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {idx > 0 && (
                  <button 
                    onClick={() => handleMove(idx, 'left')}
                    className="p-1 bg-white/20 hover:bg-white/40 text-white rounded"
                    type="button"
                  >
                    <ArrowLeft size={14} />
                  </button>
                )}
                
                <button 
                  onClick={() => handleRemove(idx)}
                  className="p-1 bg-red-500/80 hover:bg-red-600 text-white rounded"
                  type="button"
                >
                  <X size={14} />
                </button>

                {idx < images.length - 1 && (
                  <button 
                    onClick={() => handleMove(idx, 'right')}
                    className="p-1 bg-white/20 hover:bg-white/40 text-white rounded"
                    type="button"
                  >
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-stone-500">Pega la URL de la imagen. Máximo {maxImages} imágenes.</p>
    </div>
  );
};

export default ImageUploader;