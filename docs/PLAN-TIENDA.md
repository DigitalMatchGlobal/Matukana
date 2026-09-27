# Plan de la tienda — cuánto hay que refactorizar

Evaluación hecha el 2026-09-27, comparando el esquema real de Matukana contra el motor
de POV Store. Alcance decidido: **sin agenda** (la disponibilidad se coordina por WhatsApp
y después se paga).

---

## La respuesta corta

**El backend de POV se reusa casi entero. Lo que hay que refactorizar es el modelo de datos
de Matukana, que hoy no puede vender.** No es trabajo de diseño ni de checkout: es de catálogo.

---

## El problema de fondo: hoy nada es vendible

Esquema actual, tal como está en la base:

| Tabla | Filas | Campo de precio |
|---|---|---|
| `products` | 10 | `price` **`text`** |
| `therapies` | 9 | **no tiene** |
| `experiences` | 6 | **no tiene** |
| `gallery` | 5 | no aplica |

Tres cosas rompen el checkout antes de empezar:

1. **`price` es texto.** Hoy guarda cosas como `"$ 15.000"`. No se puede sumar un carrito con
   eso, ni mandarle un total a MercadoPago, ni calcular un envío.
2. **Terapias y experiencias no tienen precio.** Son justo lo que más vende Matukana y no
   existen como algo cobrable.
3. **No hay órdenes.** Ni `orders`, ni `order_items`, ni carrito. Eso viene entero de POV.

---

## La decisión de arquitectura: un solo catálogo, no tres

Hoy son tres tablas con tres formas distintas. El checkout, el carrito, `order_items`, el
descuento de stock y la preferencia de MercadoPago **se apoyan todos sobre un catálogo**.
Mantener tres tipos separados significa escribir y mantener el checkout tres veces.

**Propuesta:** una tabla `products` (la de POV) con un campo `item_type`:

| `item_type` | Qué es | Stock | Cómo se entrega |
|---|---|---|---|
| `producto` | aceites, ungüentos | sí, se descuenta | envío o retiro |
| `terapia` | masajes, sesiones | **no** | se coordina por WhatsApp |
| `experiencia` | caminatas, sahumos | **cupo** (opcional) | fecha ya en `experiences.date` |

`therapies` y `experiences` **no se borran**: siguen alimentando las secciones del sitio.
Lo que se agrega es la fila vendible, con su precio numérico y su `slug`.

> Alternativa evaluada y descartada: dejar las tres tablas y hacer un checkout que sepa de
> cada una. Triplica la superficie del carrito y de `order_items` para ahorrar una migración
> de datos de 15 filas. No conviene.

---

## Qué se trae de POV tal cual

Lo que ya está resuelto y probado en producción:

- `create-order` con **idempotencia** y RPC transaccional
- `mp-preference` + `mp-webhook` con **verificación de firma HMAC**
- Stock-once (que no se descuente dos veces si el webhook llega repetido)
- Rate-limit en los endpoints públicos
- Carrito, página de producto, confirmación de orden
- Panel de órdenes e inventario

## Qué hay que tocar sí o sí

| # | Trabajo | Tamaño |
|---|---|---|
| 1 | Migrar el catálogo a `products` de POV: `price` a numérico, `slug`, `item_type`, `is_active` | 1 día (son 25 filas, se migran con SQL) |
| 2 | Traer `orders`, `order_items`, `cart_items` y las RPCs | ½ día |
| 3 | **MercadoPago Argentina**: `currency_id` a `ARS`, cuotas y `payer.identification` (DNI/CUIT) | 1 día ← lo único realmente nuevo |
| 4 | Provincias argentinas en lugar del ENUM de departamentos uruguayos | ½ día |
| 5 | Reglas de envío de Matukana (¿envía? ¿sólo retira en Ameghino 653?) | depende de Agus |
| 6 | Adaptar el front de POV a la identidad de Matukana | 1–2 días |
| 7 | **Correos de pedido** (no existen en POV) + Resend | 1 día |

**Total estimado: 5 a 7 días de trabajo**, sin contar lo que dependa de decisiones de Agus.

---

## Lo que NO hay que refactorizar

- **El sitio actual.** Las secciones, el diseño y el admin de contenido se quedan como están.
  La tienda se suma, no reemplaza.
- **La autenticación y la seguridad.** Ya están resueltas.
- **El panel de contenido.** Los gestores de productos/terapias/experiencias siguen sirviendo;
  lo que se agrega es el campo de precio y el de "se vende / no se vende".

---

## Preguntas para Agus antes de empezar

Estas cambian el trabajo, así que conviene tenerlas respondidas:

1. **¿Qué se vende online y qué no?** ¿Todas las terapias, o algunas se siguen coordinando sólo
   por WhatsApp?
2. **¿Los productos se envían?** Si sí: ¿a todo el país, sólo a Salta, cuánto cobra, desde qué
   monto es gratis. Si no: sólo retiro en Ameghino 653.
3. **¿Cobra seña o el total?** En terapias es común cobrar una seña y el resto en el local.
4. **¿Lleva control de stock de los productos?** ¿O son a pedido?
5. **Precios reales de cada terapia y experiencia**, que hoy no están en la base.

La 2 y la 5 son las que frenan el arranque.
