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
| 1 | 🟡 **Auth del admin: hecha. Falta la RLS** | Ver abajo. Es lo próximo. |
| 2 | Las imágenes siguen en `<img>` plano, no `next/image` | Cambia el layout visual y hay que probarlo con el cliente. `next.config.mjs` ya tiene el `remotePatterns` de Supabase listo |
| 3 | Productos, terapias, experiencias y galería se buscan en `useEffect` | El contenido **no está en el HTML del server**. Pasarlos a server components es el próximo salto de SEO real |
| 4 | `src/contexts/SupabaseAuthContext.jsx` es código muerto | Nadie lo importa. Sirve como base cuando se haga el login de verdad |
| 5 | React 18, no 19 | POV Store usa 19. Se deja para converger cuando llegue el motor de tienda, no en la misma pasada |
| 6 | `favicon.svg` y `apple-touch-icon.png` no existen en `public/` | `index.html` los enlazaba por URL absoluta; los archivos no están en el repo |

### 🟡 El punto 1, en detalle

**Antes.** `AdminLogin.jsx` comparaba la contraseña **en el navegador** contra un string escrito
en el código (`if (password === 'matukana.2026')`). Estaba en el bundle de cualquier visitante.
Y el "login" era un `useState` que se perdía en cada refresh.

**Ahora (hecho el 2026-09-26).**

- `AdminLogin` usa `supabase.auth.signInWithPassword({ email, password })`. Se agregó campo de
  email; el diseño (tilt 3D, animaciones de estado) quedó igual.
- El error no distingue "mail inexistente" de "contraseña incorrecta" — decirlo permitiría
  averiguar qué mails tienen cuenta.
- `AdminApp` ya no guarda un booleano: lee la sesión real con `getSession()` y se suscribe a
  `onAuthStateChange`. Efecto secundario bueno: **la sesión sobrevive al refresh** y se cae
  sola al cerrar sesión desde otra pestaña.
- "Salir" hace `supabase.auth.signOut()` de verdad.

**Lo que FALTA, y es lo que más pesa.**

1. **Crear el usuario de Agus** en Supabase → Authentication → Users (mail real + contraseña
   que él después cambia). Sin esto no entra nadie: ya no hay contraseña de emergencia.
2. **Auditar la RLS.** El panel sigue hablando con la base con la **anon key**; el login hace
   que el admin opere como `authenticated`, pero **quien autoriza es la RLS**. Si `anon` puede
   escribir `products`, `therapies`, `experiences` o `gallery`, el login no protege nada.
   → Script listo para correr: [`docs/auditoria-rls.sql`](auditoria-rls.sql) (diagnóstico
   primero, propuesta de políticas comentada después).
3. **"Olvidé mi contraseña"** no está. Requiere una ruta `/admin/reset` y verificar el envío de
   mail del proyecto; se deja para cuando tengamos acceso al Supabase. Mientras tanto, el reset
   se hace desde el dashboard de Supabase.

## Cómo correrlo

```bash
cp .env.example .env.local   # completar con las credenciales reales de Supabase
npm install
npm run dev                  # http://localhost:3000 · panel en /admin
```

## Deploy (cuando se haga)

En Vercel: framework **Next.js** (autodetecta), y cargar `NEXT_PUBLIC_SUPABASE_URL` y
`NEXT_PUBLIC_SUPABASE_ANON_KEY` **antes** del primer build.
