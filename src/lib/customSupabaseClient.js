'use client';

import { createClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────────────────────
// Migración Vite → Next. Dos cosas cambiaron acá:
//
// 1. Las env vars pasaron de `import.meta.env.VITE_*` a `process.env.NEXT_PUBLIC_*`.
//    Next las inlinea en el bundle en BUILD TIME → hay que declararlas en Vercel
//    antes del deploy; agregarlas después no alcanza, hay que rebuildear.
//
// 2. Los placeholders de abajo no son pereza. En Vite este módulo sólo corría en
//    el navegador. En Next, un componente 'use client' igual se RENDERIZA EN EL
//    SERVER durante el build, así que este `createClient` se ejecuta al buildear
//    y `createClient('')` tira "supabaseUrl is required" y voltea el build entero.
//    Con el placeholder el build pasa; el cliente real se arma en el navegador,
//    que es el único lugar donde se lo usa (todas las queries viven en useEffect).
// ─────────────────────────────────────────────────────────────

const PLACEHOLDER_URL = 'https://placeholder.supabase.co';
const PLACEHOLDER_KEY = 'placeholder-anon-key';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Faltan env vars: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
      'El sitio va a cargar pero sin datos (productos, terapias, experiencias y galería vacíos).'
  );
}

export const supabase = createClient(
  supabaseUrl || PLACEHOLDER_URL,
  supabaseAnonKey || PLACEHOLDER_KEY
);
