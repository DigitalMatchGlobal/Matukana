# ESTADO — Matukana

> **Única fuente de verdad del estado del proyecto.** Actualizar al cambiar de estado.
> Detalle de la migración → [`MIGRACION-NEXT.md`](MIGRACION-NEXT.md) ·
> Seguridad → [`auditoria-rls.sql`](auditoria-rls.sql) ·
> Correos → [`email-templates/README.md`](email-templates/README.md) ·
> Plan de la base de tiendas → `/dev/TIENDA-BASE`

**Última actualización: 2026-09-27** — 🟢 **EN PRODUCCIÓN**

---

## Dónde estamos

🟢 **El sitio Next está en producción en `vivematukana.com`.** Mergeado a `main` y deployado el
2026-09-27. Verificado en vivo: sirve `/_next/static` (ya no el build de Vite), el HTML trae las
7 secciones y el JSON-LD, `/admin` responde con `noindex` real, la fuente se sirve del propio
dominio.

Agus validó el preview completo antes del merge: catálogo, login, edición y **subida de imagen
a Storage con usuario autenticado** — que era la primera vez que se ejercitaba el blindaje
aplicado el día anterior.

**El panel viejo ya no existe.** Agus tiene su panel en `vivematukana.com/admin`, con login real.

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
| 1 | ~~Deploy del Next a Vercel~~ ✅ **hecho el 2026-09-27** | — |
| 2 | **Resend**: cuenta + verificar el dominio (SPF/DKIM) | Que los correos salgan con remitente propio. Junto con los de pedido, no antes |
| 3 | ~~Validación visual~~ ✅ hecha en el preview | — |
| 4 | Que Agus cambie su contraseña temporal | Ya hay botón **"Contraseña"** en el header del panel |
| 5 | **Mover el proyecto al Vercel Pro**: hoy está en un team **Hobby**, que prohíbe el uso comercial | Riesgo de términos de servicio, más cuando la tienda cobre |

### Sobre el punto 2 — el correo

Acá hay **dos decisiones distintas** que conviene no mezclar:

#### A. Dónde LEE Agus su correo — no es asunto del proyecto

`info@vivematukana.com` vive en **Spacemail** (Spaceship). Que Agus lo lea desde el webmail de
Spacemail, desde Gmail con reenvío, o mudando el dominio a Google Workspace **no afecta en nada
al sitio ni a la tienda**. Es comodidad suya y no bloquea ningún trabajo.

Si pregunta: el reenvío a un Gmail + "Enviar como" con el SMTP de Spacemail sale **$0**, es
reversible y le da la app de Gmail. Workspace (~USD 6–7/usuario/mes) sólo se justifica si quiere
además Calendar, Meet y Drive corporativos. **Decisión de Agus, no nuestra.**

#### B. Cómo ENVÍA correo la aplicación — esto sí es nuestro

Dos tipos, y hoy **ninguno de los dos está en el camino crítico**:

| Tipo | Ejemplos | Urgencia real |
|---|---|---|
| **Auth** (Supabase) | recuperar contraseña, invitación | Ninguna: hay un solo usuario y su contraseña se resetea desde el dashboard |
| **Pedido** (la app) | confirmación al comprador, aviso de venta al dueño | Cuando exista la tienda. **No está construido** |

**Decisión tomada (2026-09-27): el envío va por Resend, no por el SMTP de Spacemail.**

Se evaluó conectar Supabase Auth al SMTP de Spacemail (`mail.spacemail.com:465`, usuario
`info@vivematukana.com`). Funciona y son dos minutos, pero se descartó por tres razones:

1. **Ata el envío al buzón.** Si Agus mañana se muda a Workspace o cambia de proveedor, el
   envío de la app se rompe y hay que rehacerlo.
2. **Un buzón común no es para correo transaccional**: límites bajos y entrega mediocre.
   Terminás en spam justo con el mail que confirma que alguien pagó.
3. **Vamos a necesitar Resend igual** para los correos de pedido. Hacer el trabajo de DNS una
   sola vez y apuntar ahí *ambos* tipos de correo es una configuración, no dos.

Lo que implica, para cuando se haga: cuenta de Resend, verificar `vivematukana.com` (registros
TXT/CNAME para SPF y DKIM en el DNS de Spaceship) y apuntar el SMTP de Supabase a
`smtp.resend.com`. Buena práctica: usar un subdominio de envío (`mail.vivematukana.com`) para
aislar la reputación de entrega de la casilla donde Agus lee.

**Mientras tanto**: los correos de Auth salen desde `noreply@mail.app.supabase.io`. Como no hay
ningún flujo que los dispare hoy, no molesta a nadie.

⚠️ **Los correos de pedido no existen todavía en ningún lado.** Se verificó: POV Store **no
manda un solo correo** — cero dependencias de envío. El comprador ve la página de confirmación
y listo; el dueño no se entera de la venta salvo que mire el panel. Es una función **a
construir**, no algo que venga con el motor.

---

## Deuda técnica (no bloquea, pero está anotada)

1. Imágenes en `<img>` plano, no `next/image` (`remotePatterns` ya configurado)
2. Catálogo y galería se buscan en `useEffect` → **no están en el HTML del server**.
   Pasarlos a server components es el próximo salto de SEO real
3. `SupabaseAuthContext.jsx` es código muerto (nadie lo importa)
4. React 18, no 19 (POV usa 19) — converger cuando llegue el motor de tienda
5. `favicon.svg` y `apple-touch-icon.png` referenciados pero ausentes de `public/`
6. "Olvidé mi contraseña" no está implementado (requiere ruta `/admin/reset` **y SMTP**).
   Sí existe el **cambio de contraseña desde adentro del panel**
   (`src/components/admin/CambiarPassword.jsx`), que no manda correo ni depende del SMTP.
   Si Agus se la olvida estando afuera, se resetea desde el dashboard de Supabase.

---

## Lo que viene ahora

La tienda: portar el motor de POV Store con **MercadoPago Argentina**.
Alcance decidido: **sin agenda** — la disponibilidad de terapias y experiencias se coordina por
WhatsApp y después se paga; Agus manda el link del producto, que ya existe en `/products/[slug]`.
