# Plan de la tienda

Actualizado el **2026-11-07** con las respuestas de Agus. Reemplaza la versión del 2026-09-27,
que asumía que se venderían también terapias y experiencias.

---

## Lo que Agus decidió

> *"Los productos son la papa y es lo único que se puede vender o cobrar al instante."*
> *"La terapia no vamos a hacer que la paguen. Las excursiones tampoco, todo con consulta previa."*

**Se cobra online: sólo los productos.** Terapias y caminatas siguen como hoy — consulta por
WhatsApp y se arregla con él. Lo que pide para esas dos es **más consultas**, no un carrito.

Esto **achica la tienda a la mitad** respecto del plan anterior: no hay que modelar servicios
vendibles, ni seña, ni fecha a confirmar, ni precio por cantidad de personas.

> ⚠ **Un punto a confirmar con él.** En la primera respuesta dijo *"si podemos vender las
> terapias pero CON FECHA A CONFIRMAR previa consulta"*, y más tarde cerró con *"la terapia no
> vamos a hacer que la paguen"*. Tomamos lo segundo, que es más tajante y más reciente.
> Conviene confirmárselo en una línea antes de arrancar.

### Envíos

| Caso | Qué pasa |
|---|---|
| Ciudad de Salta | **Envío gratis** (lo lleva él, un cadete, o lo pasan a buscar por Ameghino 653) |
| Resto del país | **Lo paga el cliente**. Correo Argentino o Andreani. Referencia que dio: ~$30.000 por un bulto de 8 a 10 productos |
| Compra mayor a **$300.000** | **Envío gratis** a todo el país |
| Exterior | **No se envía.** Si quieren, mandan a alguien a buscarlo |

**El problema a resolver:** *"según tarifa de la empresa que se encargue"* no se puede cobrar en
un checkout. La web tiene que decir un número **antes** de que la persona pague.

**Propuesta:** una tarifa plana fuera de Salta (los ~$30.000 que él mismo estimó), gratis dentro
de Salta, y gratis arriba de $300.000. Es un número que se cambia en un campo de configuración
cuando el correo aumente. **Falta que Agus confirme ese número.**

Y su frase ordena la prioridad: *"eso no nos tiene que frenar, hay que vender y cobrar los
productos"*. Si el número lo traba, se sale con "sólo retiro + Salta gratis" y el envío al
interior se suma después.

### Stock

> *"Siempre hay stock de todos los productos. Mínimo 20 de c/u."*

**No hace falta control de stock.** No se muestra cantidad, no se bloquea la venta, no hay
"últimas unidades". Una cosa menos que mantener y un motivo menos de venta perdida.

### Precios

- **Productos: los que están, están OK.** No se actualizan — *"no actualicé todavía para que la
  gente se anime"*.
- **Terapias y caminatas:** como no se cobran online, no hacen falta en la base para vender.
  Sí conviene mostrarlos para que la consulta llegue mejor filtrada.
- **Caminatas: el precio es relativo y él lo sabe.** Día entero ~$200.000 (hasta 2–3 personas);
  3 h con auto $80.000–$120.000; 6 h en Cachi $150.000; grupo de 10 ~$600.000 ($60.000 por
  persona); 20 personas ~$900.000–$1.000.000.
  **Se ofreció a armar dos excursiones con precio, horas y cupo fijos** *"como para darle
  estructura"*. **Hay que tomarle esa oferta**: dos excursiones con precio publicado convierten
  mucho mejor que un "consultar".

---

## Lo otro que pidió Agus, y que vale tanto como la tienda

> *"La gente que entra está viendo los productos y después tiene que seguir bajando para ver los
> servicios y seguir bajando para ver la camioneta. Quizá podemos hacer tres botones: productos,
> servicios y caminatas."*

Tiene razón y hay una coincidencia afortunada: **esto es exactamente la deuda de SEO que quedó
parada en la migración.** Hoy el sitio es una sola página larga; las secciones existen pero no
son direcciones propias.

**Propuesta:** `/productos`, `/terapias` y `/experiencias` como rutas reales, con los tres
botones arriba. Eso le da:

- lo que pidió: entrar directo a lo que a cada uno le interesa;
- un link para mandar por WhatsApp a cada cosa;
- páginas que Google puede indexar por separado — hoy todo compite por una sola;
- y los textos de SEO de cada sección **ya están escritos y guardados** en
  `src/lib/seoBySection.js`, esperando justo esto.

Además deja el terreno listo para la tienda: el checkout necesita que cada producto tenga su
propia dirección.

---

## Qué hay que hacer

### Bloque A — la navegación que pidió Agus (no depende de nada)

| # | Trabajo | Tamaño |
|---|---|---|
| A1 | `/productos`, `/terapias`, `/experiencias` como rutas, con los textos SEO ya escritos | 1–1,5 días |
| A2 | Los tres botones arriba + que la home siga funcionando para el que scrollea | ½ día |
| A3 | Pasar las imágenes a `next/image` y optimizar al subir — **hoy es regla de la casa** (ver abajo) | ½ día |

### Bloque B — la tienda (sólo productos)

| # | Trabajo | Tamaño |
|---|---|---|
| B1 | `products` al modelo de POV: **`price` de texto a numérico**, `slug`, `is_active` | ½ día (son 10 filas) |
| B2 | Traer `orders`, `order_items`, `cart_items` y las RPCs de POV | ½ día |
| B3 | **MercadoPago Argentina**: `currency_id` a `ARS`, cuotas, `payer.identification` (DNI/CUIT) | 1 día ← lo único nuevo de verdad |
| B4 | Provincias argentinas en lugar del ENUM de departamentos uruguayos | ½ día |
| B5 | Envío: gratis en Salta / tarifa plana al interior / gratis > $300.000 / retiro | ½ día |
| B6 | Carrito, checkout y confirmación con la identidad de Matukana | 1,5 días |
| B7 | **Correos de pedido** + Resend + verificar el dominio | 1 día |

**Bloque A: 2–2,5 días. Bloque B: 5–5,5 días.**

Se pueden hacer en ese orden y entregar el A primero: es lo que Agus va a *ver*, y no depende
de que confirme nada.

---

## Novedad grande: POV ya no es el mismo motor de septiembre

Entre el 27/09 y hoy, POV Store sumó cosas que antes había que construir desde cero:

| Lo que hay ahora en POV | Qué significa para Matukana |
|---|---|
| **Mails transaccionales por Resend** (`src/lib/email/`), sin SDK, fail-open si falta la key | B7 pasa de "construir" a "portar". En septiembre esto no existía |
| **Página pública de seguimiento de pedidos** | Se puede traer casi gratis |
| **Integración con MatchBot**: catálogo firmado, checkout desde el bot | El "circuito virtuoso" que buscábamos ya existe en código |
| Arquitectura de correo probada: **se envía por Resend, se recibe por Spacemail**, sin tocar el MX | Matukana tiene exactamente el mismo esquema (`info@vivematukana.com` en Spacemail) |

⚠ Ojo con el detalle del SPF que dejó documentado POV: **dos registros SPF en el mismo host se
invalidan entre sí**. Si Resend pidiera uno en la raíz, hay que mergearlo en un único TXT con el
de Spacemail.

---

## Reglas de la casa que ahora aplican (y antes no existían)

`AGENTS.md` sumó el 31/10 la regla de imágenes, nacida del egress de Killa TV. Toca de lleno a
este proyecto, que es una galería con subida de fotos por el cliente:

1. **Nunca guardar el original que sube el usuario.** Optimizar al subir: lado mayor 1600 px,
   JPEG q82 (~150 KB). Referencia: `KILLA/killa-web/lib/editorial/image.ts`.
2. **Nombre con uuid, `upsert: false`, `cacheControl: 31536000`.** Para cambiar una imagen se
   sube con nombre nuevo; nunca se pisa una URL con caché largo.
3. **`next/image` en las páginas públicas**, nunca `<img>` apuntando directo a Storage.
4. **`og:image` ≤ 250 KB**, o WhatsApp la descarta y muestra el ícono del sitio.
5. **Supabase en Pro antes de entregar** y revisar Usage a la semana de salir.

Hoy Matukana **incumple 1, 2 y 3**: el `ImageUploader` sube el archivo tal cual y todo el sitio
usa `<img>`. Por eso A3 no es cosmético.

---

## Lo que falta de Agus

1. **Confirmar que las terapias no se cobran online** (dijo las dos cosas).
2. **El número de la tarifa plana de envío al interior** — ¿los $30.000 sirven como número fijo?
3. **Las dos excursiones con precio, horas y cupo fijos** que se ofreció a armar.
4. Los precios de las terapias, si se van a mostrar (para que la consulta llegue filtrada).
