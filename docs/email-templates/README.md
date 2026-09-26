# Plantillas de correo — Matukana

Los mails que manda Supabase Auth vienen con un diseño genérico ("Confirm your signup",
fondo blanco, tipografía del sistema). Para un cliente eso se lee como software ajeno.
Estas cinco plantillas usan la paleta del sitio (stone + amber), el logo real y el tono
en castellano rioplatense.

**Verlas antes de subirlas:** abrir cualquiera en el navegador.
`open docs/email-templates/02-recuperar-contrasena.html`

## Dónde se pega cada una

Supabase → **Authentication** → **Emails** → pestaña *Templates*. Se reemplaza todo el
contenido del cuadro *Message body*.

| Archivo | Template de Supabase | ¿Cuándo se dispara? |
|---|---|---|
| `01-invitacion.html` | Invite user | Al invitar a alguien desde el dashboard |
| `02-recuperar-contrasena.html` | Reset Password | "Olvidé mi contraseña" |
| `03-confirmar-cuenta.html` | Confirm signup | Alta con confirmación de correo |
| `04-link-de-acceso.html` | Magic Link | Login sin contraseña |
| `05-cambio-de-correo.html` | Change Email Address | Al cambiar la dirección de la cuenta |

Conviene ajustar también el **Subject** de cada uno, que es lo primero que se ve:

| Template | Asunto sugerido |
|---|---|
| Invite user | `Tu acceso al panel de Matukana` |
| Reset Password | `Recuperá tu contraseña — Matukana` |
| Confirm signup | `Confirmá tu correo — Matukana` |
| Magic Link | `Tu enlace de acceso — Matukana` |
| Change Email | `Confirmá tu nueva dirección — Matukana` |

Variables de Supabase usadas: `{{ .ConfirmationURL }}` (botón + enlace de respaldo).
Están disponibles además `{{ .Token }}`, `{{ .TokenHash }}`, `{{ .SiteURL }}`, `{{ .Email }}`.

## ⚠️ El diseño no arregla el remitente

Con el SMTP que trae Supabase de fábrica, el mail sale **desde `noreply@mail.app.supabase.io`**,
por más lindo que sea el HTML. Y ese SMTP tiene un límite bajo (unos pocos mails por hora) y
entrega mediocre: cae en spam seguido.

Para un cliente real hay que configurar **SMTP propio** en Authentication → Emails → *SMTP Settings*,
con un remitente del estilo `hola@vivematukana.com`. En DigitalMatch ya usamos **Resend** para
esto en otros proyectos. Mientras eso no esté, conviene no mandarle mails automáticos a nadie
que importe.

## Cómo dar de alta a Agus SIN mandarle ningún mail

Mientras las plantillas no estén cargadas y el SMTP no esté configurado, **no usar "Invite user"**:
eso dispara el mail genérico, que es justo lo que queremos evitar.

En su lugar, Supabase → **Authentication** → **Users** → **Add user** → *Create new user*:

1. Email: `kumikeagustin@gmail.com`
2. Password: una temporal, generada al azar
3. ✅ Marcar **Auto Confirm User**
4. Crear

Esa vía **no manda ningún correo**. La contraseña temporal se la pasás a Agus por WhatsApp y
él la cambia cuando entra.

**Orden recomendado:** cargar las plantillas → configurar el SMTP propio → recién ahí habilitar
cualquier flujo que mande mails.
