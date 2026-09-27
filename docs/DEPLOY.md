# Deploy a Vercel — de Vite a Next

El proyecto de Vercel que sirve `vivematukana.com` **ya existe** y está conectado al repo
`DigitalMatchGlobal/Matukana`. No hay que crear uno nuevo ni mover el dominio: hay que
**actualizar el existente**, porque el framework cambió.

---

## ⚠️ Lo que rompe si no se hace primero

El proyecto fue creado cuando el sitio era **Vite**. Si el *Framework Preset* quedó fijado en
Vite, Vercel va a intentar correr `vite build` y buscar la carpeta `dist` — que ya no existe.
**El build falla.**

Y las `NEXT_PUBLIC_*` se **inlinean en build time**: si no están cargadas antes del build, el
sitio despliega sin datos. Cargarlas después no alcanza, hay que rebuildear.

---

## Pasos, en este orden

### 1. Variables de entorno (antes que nada)

Vercel → el proyecto → **Settings → Environment Variables**. Dos variables, marcadas para
**Production, Preview y Development**:

| Nombre | Valor |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xwotrjojocxpjwalanqh.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | la anon key del proyecto (Supabase → Settings → API) |

Las dos son públicas por diseño: viajan en el bundle del sitio. Lo que protege la base es la
RLS, que ya está aplicada.

### 2. Framework Preset

Settings → **Build and Deployment** → *Framework Settings*:

- **Framework Preset: Next.js**
- Build Command, Output Directory e Install Command: dejar en **automático**.
  Si hay overrides viejos apuntando a `dist` o a `vite build`, **borrarlos**.

### 3. Deploy de prueba (preview)

Con la rama `feat/migracion-next` pusheada, Vercel arma un **preview** automáticamente.
Abrirlo y revisar: se ven los productos, terapias, experiencias y galería; el panel entra
en `/admin` con el usuario de Agus.

> ⚠️ Si el preview devuelve **401**, es la *Deployment Protection* de Vercel, no un error del
> sitio. Se desactiva en Settings → Deployment Protection, o se valida directo en producción.

### 4. Producción

Mergear `feat/migracion-next` a `main` y pushear. Vercel deploya solo.

### 5. Verificar en producción

- [ ] `vivematukana.com` carga con el catálogo completo (10 productos, 9 terapias, 6 experiencias, 5 fotos)
- [ ] `vivematukana.com/admin` muestra el login nuevo (email + contraseña)
- [ ] Agus entra con su usuario, **edita algo y lo ve reflejado en el sitio**
- [ ] Subir una imagen desde el gestor de galería (prueba el blindaje de Storage)
- [ ] El botón de consulta del sitio público registra en `inquiries`
- [ ] El viejo `#admin` ya no muestra nada raro

### 6. Después del deploy

- Que Agus **cambie la contraseña temporal**
- Confirmar que el panel viejo quedó fuera de circulación (ya no puede escribir: `anon` perdió
  la escritura el 2026-09-27)

---

## Si algo sale mal

El deploy anterior sigue disponible en Vercel: **Deployments → el último que funcionaba →
Promote to Production**. Vuelve el sitio viejo en segundos.

Ojo con una cosa si se hace rollback: el panel de ese build **no puede editar**, porque
escribía con la anon key y eso ya está cerrado en la base. El sitio público se ve bien igual.
