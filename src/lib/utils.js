import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// --- FUNCIÓN DE OPTIMIZACIÓN BLINDADA ---
export const getOptimizedImage = (url, width = 800) => {
  if (!url) return "/placeholder.png"; 
  
  // 1. Si la imagen ya viene optimizada (ya tiene render/image), la devolvemos tal cual
  // Esto evita errores si la llamamos dos veces por accidente.
  if (url.includes("/render/image/")) return url;

  // 2. Si no es de Supabase, devolvemos la original
  if (!url.includes("supabase.co")) return url; 

  // 3. Transformación de Supabase
  // Usamos una Expresión Regular para asegurar que reemplace solo lo correcto
  const optimizedUrl = url.replace(
    /\/storage\/v1\/object\/public\//, 
    "/storage/v1/render/image/public/"
  );

  // 4. Parámetros Clave:
  // resize=contain: Asegura que el producto entre en el cuadrado sin cortarse.
  // quality=75: El punto dulce entre calidad visual y peso.
  // format=webp: Formato moderno de Google.
  return `${optimizedUrl}?width=${width}&resize=contain&format=webp&quality=75`;
};