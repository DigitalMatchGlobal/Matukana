# Migración Vite → Next

Rama: `feat/migracion-next` · Fecha: 2026-09-26 · Build verificado: ✅ `npm run build` + `npm run start`

Primer paso del plan de tienda online (ver `/dev/TIENDA-BASE`). Esta migración **no agrega
la tienda**: deja el sitio sobre el stack que la tienda necesita (Next 15 App Router, el
mismo de POV Store), con el comportamiento visible intacto.

---

## Qué cambió

| Antes (Vite) | Ahora (Next 15) |
|---|---|
| `index.html` con meta tags a mano | `src/app/layout.jsx` → `export const metadata` |
| `src/main.jsx` + `ReactDOM.createRoot` | `src/app/layout.jsx` (server component) |
| `src/App.jsx` con `window.location.hash` | rutas reales: `/` y `/admin` |
| `react-helmet-async` (SEO client-side) | metadata nativo de Next (server-side) |
| `<link>` a Google Fonts | `next/font/google` (Inter self-hosted) |
| `import.meta.env.VITE_*` | `process.env.NEXT_PUBLIC_*` |
| `src/index.css` | `src/styles/globals.css` |
| `React.lazy` + `Suspense` por sección | imports directos (ver más abajo) |

Los ~20 componentes de `src/components` **no se tocaron**, salvo por el `'use client'` de
arriba de todo y los tres puntos donde se navegaba por hash. El diseño es idéntico.

## Lo que mejoró sin pedirlo

- **El HTML ya viene armado del server.** Antes el crawler recibía `<div id="root"></div>`
  y tenía que ejecutar JS para ver algo. Verificado: las 7 secciones, los textos y el JSON-LD
  están en el HTML inicial.
- **El `noindex` del admin ahora es real.** Lo inyectaba react-helmet del lado del cliente;
  un crawler que no ejecuta JS nunca lo veía. Ahora sale en el HTML de `/admin`.
- **La fuente se sirve desde el propio dominio** — se cae el round-trip a `fonts.gstatic.com`.

## Decisiones que cambian comportamiento (leer antes de sorprenderse)

### 1. El título ya no cambia al scrollear

`App.jsx` tenía un mapa `seoBySection` y cambiaba `<title>` y `description` según la sección
visible. **Se sacó**, por dos razones: Google indexa el título del HTML inicial y no vuelve a
leerlo cuando cambia por scroll, así que no aportaba SEO; y en Next el metadata se resuelve en
el server, donde no existe "la sección visible".

**Los textos no se perdieron**: están en `src/lib/seoBySection.js`. Sirven tal cual el día que
cada sección sea una ruta propia (`/terapias`, `/productos`), que es cuando ese SEO empieza a
valer de verdad.

Efecto colateral: `src/lib/useActiveSection.js` quedó **sin usar** (era su único consumidor).
Se deja en el repo porque lo va a necesitar el resaltado del nav o las rutas por sección.

### 2. Las secciones ya no hacen lazy loading

En un SPA, `React.lazy` achicaba el bundle inicial. En Next el HTML ya viene renderizado, así
que diferir las secciones sólo lograba que el usuario (y el crawler) vieran un spinner donde
debería haber contenido. Se importan directo.

### 3. `#admin` ahora es `/admin`

Era `window.location.hash === '#admin'`. Ahora es una ruta. Los tres lugares que navegaban por
hash usan `useRouter()`: el link del Footer, "volver al sitio" del Dashboard y "cancelar" del Login.

## Gotchas encontrados (los que costaron tiempo)

### El build se cae por el cliente de Supabase

`npm run build` fallaba con **`Error: supabaseUrl is required`** al prerenderizar `/admin`.

En Vite, `customSupabaseClient.js` sólo corría en el navegador. En Next, **un componente
`'use client'` igual se renderiza en el server durante el build**, así que el `createClient()`
de nivel de módulo se ejecuta al buildear — y sin env vars, revienta y voltea el build entero.

Solución en `src/lib/customSupabaseClient.js`: placeholders de fallback + un `console.warn`
explícito. El cliente real se arma en el navegador, que es donde vive todo el uso (las queries
están en `useEffect`).

### Las `NEXT_PUBLIC_*` se inlinean en build time

No alcanza con cargarlas en Vercel después del deploy: **hay que rebuildear**. Distinto de Vite,
donde el `.env` se leía igual.

## Lo que quedó pendiente (deuda consciente)

| # | Tema | Por qué se dejó |
|---|---|---|
| 1 | 🔴 **El admin no tiene autenticación real** | Ver abajo. Es lo próximo. |
| 2 | Las imágenes siguen en `<img>` plano, no `next/image` | Cambia el layout visual y hay que probarlo con el cliente. `next.config.mjs` ya tiene el `remotePatterns` de Supabase listo |
| 3 | Productos, terapias, experiencias y galería se buscan en `useEffect` | El contenido **no está en el HTML del server**. Pasarlos a server components es el próximo salto de SEO real |
| 4 | `src/contexts/SupabaseAuthContext.jsx` es código muerto | Nadie lo importa. Sirve como base cuando se haga el login de verdad |
| 5 | React 18, no 19 | POV Store usa 19. Se deja para converger cuando llegue el motor de tienda, no en la misma pasada |
| 6 | `favicon.svg` y `apple-touch-icon.png` no existen en `public/` | `index.html` los enlazaba por URL absoluta; los archivos no están en el repo |

### 🔴 El punto 1, en detalle

`src/components/admin/AdminLogin.jsx` compara la contraseña **en el navegador**, contra un
string escrito en el código (`if (password === 'matukana.2026')`). Eso significa:

- La contraseña **está en el bundle** que se descarga cualquier visitante. No es secreta.
- Y aunque lo fuera, no protege nada: el panel escribe a Supabase con la **anon key**, así que
  lo que realmente autoriza es la RLS. Si la RLS deja escribir a `anon`, cualquiera puede
  escribir sin pasar por el login.

Esto **ya era así antes de la migración** — no lo introdujo este cambio, y por eso no se arregló
acá (era una migración, no un rediseño). Pero se vuelve grave en cuanto la tienda maneje pedidos
y plata.

**Lo que hay que hacer:** usuario real en Supabase Auth para Agus, `AdminLogin` contra
`supabase.auth.signInWithPassword`, y **auditar la RLS de `products`, `therapies`,
`experiences`, `inquiries` y del bucket de Storage**. Lo segundo importa más que lo primero.

## Cómo correrlo

```bash
cp .env.example .env.local   # completar con las credenciales reales de Supabase
npm install
npm run dev                  # http://localhost:3000 · panel en /admin
```

## Deploy (cuando se haga)

En Vercel: framework **Next.js** (autodetecta), y cargar `NEXT_PUBLIC_SUPABASE_URL` y
`NEXT_PUBLIC_SUPABASE_ANON_KEY` **antes** del primer build.
