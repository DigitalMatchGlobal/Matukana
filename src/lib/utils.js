import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// --- FUNCIÓN CORREGIDA (MODO SEGURO) ---
export const getOptimizedImage = (url, width = 800) => {
  if (!url) return "/placeholder.png"; 
  
  // ⚠️ CAMBIO: Por ahora devolvemos la URL original tal cual viene.
  // Esto arregla las imágenes rotas inmediatamente.
  // Cuando actives "Image Transformations" en Supabase, podremos volver a intentar la optimización.
  
  return url;

  /* COMENTAMOS LA LÓGICA DE TRANSFORMACIÓN HASTA QUE SE ACTIVE EN SUPABASE:
     
     if (url.includes("/render/image/")) return url;
     if (!url.includes("supabase.co")) return url; 

     const optimizedUrl = url.replace(
       /\/storage\/v1\/object\/public\//, 
       "/storage/v1/render/image/public/"
     );

     return `${optimizedUrl}?width=${width}&resize=contain&format=webp&quality=75`;
  */
};