# ESTADO — Matukana

> **Única fuente de verdad del estado del proyecto.** Actualizar al cambiar de estado.
> Detalle de la migración → [`MIGRACION-NEXT.md`](MIGRACION-NEXT.md) ·
> Seguridad → [`auditoria-rls.sql`](auditoria-rls.sql) ·
> Correos → [`email-templates/README.md`](email-templates/README.md) ·
> Plan de la base de tiendas → `/dev/TIENDA-BASE`

**Última actualización: 2026-09-27**

---

## Dónde estamos

El sitio está **migrado a Next 15 y con la base blindada**, pero **todavía no deployado**.
Lo publicado en `vivematukana.com` sigue siendo el build viejo de Vite, y ese panel **ya no
puede editar** (escribía como `anon`, y `anon` perdió la escritura). Esa es la única deuda
operativa con consecuencia real hoy: **Agus no tiene panel usable hasta el deploy.**

Mientras tanto se edita desde `npm run dev` → `localhost:3000/admin`, que entra con login
real y trabaja contra la misma base de producción.

---

## Hecho

### Migración a Next 15 (rama `feat/migracion-next`, **sin pushear**)
Stack igual al de POV Store. Diseño intacto, ~20 componentes portados sin tocarles el markup.
HTML renderizado en el server (antes el crawler recibía un div vacío). Detalle y gotchas en
[`MIGRACION-NEXT.md`](MIGRACION-NEXT.md).

### Autenticación real del admin
Antes: la contraseña se comparaba **en el navegador** contra un string del código, visible en
el bundle. Ahora: `supabase.auth.signInWithPassword`, sesión por `onAuthStateChange` (sobrevive
al refresh), `signOut()` de verdad.

Usuario: **`kumikeagustin@gmail.com`**, creado por Admin API con `email_confirm: true` — sin
mandarle ningún correo. Login verificado punta a punta. Contraseña temporal entregada aparte:
**que la cambie**.

### Seguridad de la base — el hallazgo más grave, ya cerrado
Estaba **completamente abierta**: RLS apagada en las 5 tablas, 0 políticas, y `anon` con
SELECT/INSERT/UPDATE/DELETE/**TRUNCATE** en todas. Storage con una sola política `ALL` para el
rol `public` y sin techo. Cualquiera con la anon key (pública por diseño) podía vaciar el
catálogo desde la consola del navegador.

Ahora: RLS activa, 12 políticas en `public` + 2 en `storage`, `anon` reducido a leer el
catálogo e insertar en `inquiries`, bucket con techo de 5 MB y sólo imágenes.
Verificado desde afuera: catálogo e imágenes siguen cargando; `inquiries` da 401.

### Correos transaccionales
Las 5 plantillas de Supabase Auth reemplazadas por las de Matukana (logo, paleta stone+amber,
asuntos en castellano), cargadas por Management API. Fuente en [`email-templates/`](email-templates/).
`site_url` corregido a `https://vivematukana.com` y `uri_allow_list` con `http://localhost:3000/**`.

---

## Pendiente

| # | Qué | Bloquea |
|---|---|---|
| 1 | **Deploy del Next a Vercel** | Que Agus vuelva a tener panel. Es lo más urgente |
| 2 | **Conectar el SMTP de `info@vivematukana.com`** | Que los correos salgan con remitente propio |
| 3 | Validación visual del sitio por Gonzalo | — |
| 4 | Que Agus cambie su contraseña temporal | — |

### Sobre el punto 2 — el correo, y una distinción que importa

La casilla `info@vivematukana.com` está en **Spacemail** y tiene SMTP habilitado:

| | |
|---|---|
| host | `mail.spacemail.com` |
| puerto | `465` (SSL) |
| usuario | `info@vivematukana.com` |
| contraseña | la de la casilla — **falta para poder configurarlo** |

En Supabase `smtp_host`, `smtp_user` y `smtp_pass` siguen **vacíos**, así que todo correo sale
todavía desde `noreply@mail.app.supabase.io`.

**⚠️ Esto NO cubre los correos de pedido.** El SMTP de Supabase Auth manda **sólo** correos de
autenticación: recuperar contraseña, invitación, confirmar dirección, magic link. Nada más.

**Los correos de confirmación de compra no existen todavía en ningún lado.** Se verificó:
POV Store **no manda un solo correo** — cero dependencias de envío en el proyecto. El comprador
ve la página de confirmación y listo. O sea que "te llega el mail con tu pedido" es una función
**a construir**, no algo que venga con el motor.

Cuando se construya, conviene que **no** salga por el SMTP de la casilla: un buzón común tiene
límites bajos de envío y mala entrega para correo transaccional. Va por un proveedor
transaccional (Resend) usando el mismo dominio, con SPF y DKIM en el DNS. El SMTP de Spacemail
alcanza de sobra para los correos de Auth, que son un puñado por mes.

---

## Deuda técnica (no bloquea, pero está anotada)

1. Imágenes en `<img>` plano, no `next/image` (`remotePatterns` ya configurado)
2. Catálogo y galería se buscan en `useEffect` → **no están en el HTML del server**.
   Pasarlos a server components es el próximo salto de SEO real
3. `SupabaseAuthContext.jsx` es código muerto (nadie lo importa)
4. React 18, no 19 (POV usa 19) — converger cuando llegue el motor de tienda
5. `favicon.svg` y `apple-touch-icon.png` referenciados pero ausentes de `public/`
6. "Olvidé mi contraseña" no está implementado (requiere ruta `/admin/reset`)

---

## Lo que viene después del deploy

La tienda: portar el motor de POV Store con **MercadoPago Argentina**.
Alcance decidido: **sin agenda** — la disponibilidad de terapias y experiencias se coordina por
WhatsApp y después se paga; Agus manda el link del producto, que ya existe en `/products/[slug]`.
