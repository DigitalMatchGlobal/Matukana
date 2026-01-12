import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// --- NUEVA FUNCIÓN DE OPTIMIZACIÓN ---
export const getOptimizedImage = (url, width = 800) => {
  if (!url) return "/placeholder.png"; 
  // Si no es de supabase, devolvemos la original
  if (!url.includes("supabase.co")) return url; 

  // Transformación de Supabase: Cambiamos /object/ por /render/image/
  const optimizedUrl = url.replace(
    "/storage/v1/object/public/",
    "/storage/v1/render/image/public/"
  );

  // Pedimos formato WebP (super ligero) y una calidad del 80%
  return `${optimizedUrl}?width=${width}&format=webp&quality=80`;
};