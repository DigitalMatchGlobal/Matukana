-- ─────────────────────────────────────────────────────────────────────────────
-- AUDITORÍA DE RLS — Matukana
--
-- Por qué: el panel de /admin escribe a Supabase con la **anon key**, la misma
-- que sirve el sitio público. El login nuevo (Supabase Auth) hace que el admin
-- opere como `authenticated`, pero **lo que realmente autoriza es la RLS**.
-- Si `anon` puede escribir, el login no protege nada.
--
-- Cómo: pegar la PARTE 1 en el SQL Editor de Supabase (proyecto
-- xwotrjojocxpjwalanqh) y leer los resultados ANTES de aplicar nada.
-- La PARTE 2 es la propuesta, comentada a propósito.
-- ─────────────────────────────────────────────────────────────────────────────


-- ─────────────────────────────────────────────────────────────────────────────
-- RESULTADOS DE LA PRIMERA PASADA — 2026-09-26
--
-- Probado desde afuera, con la anon key, sin tocar la base (sólo lecturas).
--
--   LECTURA COMO `anon`:
--     products      → 200, devuelve filas   (esperado: es el catálogo público)
--     therapies     → 200, devuelve filas   (esperado)
--     experiences   → 200, devuelve filas   (esperado)
--     gallery       → 200, devuelve filas   (esperado)
--     inquiries     → 200, devuelve filas   ⚠️ NO esperado — 56 consultas
--
--   Sobre `inquiries`: cualquiera con la anon key (o sea, cualquiera que abra
--   el sitio y mire el bundle) puede listar las 56 consultas recibidas.
--   Lo bueno: la tabla guarda sólo `type`, `item_name` y `status` — NO hay
--   datos personales, ni nombre ni teléfono ni mail. O sea que no es una fuga
--   de datos de clientes, pero sí deja ver qué terapias y productos consulta
--   la gente y cuántas consultas entran. Es información del negocio de Agus
--   y no tiene por qué leerla un tercero.
--
--   INVENTARIO (con service_role, 2026-09-27):
--     · public tiene exactamente 5 tablas: products, therapies, experiences,
--       gallery, inquiries. No hay funciones RPC. Base chica y limpia.
--     · Storage: un solo bucket, `media`, PÚBLICO, **sin límite de tamaño de
--       archivo y sin restricción de tipo MIME**. Aunque la subida quede sólo
--       para el admin, conviene ponerle techo (ver 2.1 abajo): hoy un archivo
--       de cualquier peso y cualquier formato entra.
--     · Auth: **0 usuarios** antes de hoy — confirma que el panel nunca usó
--       autenticación real. Ahora hay 1 (el de Agus).
--
--   ESCRITURA COMO `anon`: **SIN VERIFICAR**. Probarlo desde afuera implicaba
--   mandar UPDATE/DELETE contra la base de producción de Agus, así que no se
--   hizo. Es lo que responden las consultas 1.1 a 1.3 de acá abajo, que se
--   corren desde el SQL Editor sin tocar ningún dato.
--   Hasta saberlo, hay que asumir lo peor: que `anon` puede escribir.
-- ─────────────────────────────────────────────────────────────────────────────


-- ═══════════════════════════════════════════════════════════════
-- PARTE 1 — DIAGNÓSTICO (sólo lectura, no cambia nada)
-- ═══════════════════════════════════════════════════════════════

-- 1.1 ¿Está RLS activa en cada tabla?
--     Si rowsecurity = false, la tabla está ABIERTA de par en par:
--     cualquiera con la anon key hace lo que quiera.
SELECT tablename, rowsecurity AS rls_activa
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('products', 'therapies', 'experiences', 'gallery', 'inquiries')
ORDER BY tablename;

-- 1.2 ¿Qué políticas existen y para quién?
--     Mirar la columna `roles`: si aparece {anon} o {public} en un INSERT,
--     UPDATE o DELETE de las tablas de catálogo, ahí está el agujero.
SELECT tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('products', 'therapies', 'experiences', 'gallery', 'inquiries')
ORDER BY tablename, cmd;

-- 1.3 Los GRANT por debajo de la RLS.
--     RLS filtra filas, pero el GRANT decide si el rol puede tocar la tabla.
--     Ojo con TRUNCATE: saltea RLS.
SELECT table_name, grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND grantee IN ('anon', 'authenticated')
  AND table_name IN ('products', 'therapies', 'experiences', 'gallery', 'inquiries')
ORDER BY table_name, grantee, privilege_type;

-- 1.4 Storage: ¿qué buckets hay y cuáles son públicos?
SELECT id, name, public FROM storage.buckets ORDER BY name;

-- 1.5 Storage: políticas del bucket.
--     Un INSERT permitido a `anon` significa que cualquiera puede subir
--     archivos al bucket de Agus (abuso y costo).
SELECT policyname, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects'
ORDER BY policyname;

-- 1.6 ¿Qué usuarios existen en Auth? (debería estar el de Agus y nadie más)
SELECT id, email, created_at, last_sign_in_at
FROM auth.users
ORDER BY created_at;


-- ═══════════════════════════════════════════════════════════════
-- PARTE 2 — PROPUESTA (comentada: NO ejecutar sin leer la 1)
-- ═══════════════════════════════════════════════════════════════
--
-- Matriz objetivo, sacada de cómo usa la app cada tabla:
--
--   products / therapies / experiences / gallery
--     · lee todo el mundo (es el catálogo público del sitio)
--     · escribe SÓLO el admin logueado
--
--   inquiries
--     · INSERTA cualquiera (el botón de "consultar" del sitio público)
--     · LEE y MODIFICA sólo el admin logueado
--       (hoy guarda type / item_name / status: no hay datos personales,
--        pero igual no tiene por qué leerlo un desconocido)
--
-- Antes de aplicar: confirmar con 1.2 qué políticas ya existen, para no
-- duplicar ni pisar. Los DROP de abajo son conservadores a propósito.

/*
-- ── Catálogo: lectura pública, escritura autenticada ──
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['products', 'therapies', 'experiences', 'gallery']
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_select_public', t);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR SELECT TO anon, authenticated USING (true)',
      t || '_select_public', t);

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_write_admin', t);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true)',
      t || '_write_admin', t);

    EXECUTE format('REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.%I FROM anon', t);
  END LOOP;
END $$;

-- ── Consultas: las carga el público, las lee el admin ──
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS inquiries_insert_public ON public.inquiries;
CREATE POLICY inquiries_insert_public ON public.inquiries
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS inquiries_read_admin ON public.inquiries;
CREATE POLICY inquiries_read_admin ON public.inquiries
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS inquiries_manage_admin ON public.inquiries;
CREATE POLICY inquiries_manage_admin ON public.inquiries
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

REVOKE SELECT, UPDATE, DELETE, TRUNCATE ON public.inquiries FROM anon;

-- ── Storage: mirar todos, subir sólo el admin ──
-- (reemplazar 'media' por el bucket real que devuelva 1.4)
DROP POLICY IF EXISTS media_read_public ON storage.objects;
CREATE POLICY media_read_public ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'media');

DROP POLICY IF EXISTS media_write_admin ON storage.objects;
CREATE POLICY media_write_admin ON storage.objects
  FOR ALL TO authenticated USING (bucket_id = 'media') WITH CHECK (bucket_id = 'media');
*/

-- ── 2.1 Storage: ponerle techo al bucket ──
-- Hoy `media` acepta archivos de cualquier peso y cualquier tipo. Esto se
-- cambia desde el dashboard (Storage → media → Settings) o así:
/*
UPDATE storage.buckets
SET file_size_limit = 5242880,  -- 5 MB
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
WHERE id = 'media';
*/


-- ── Después de aplicar, verificar A MANO (esto es lo que cuenta) ──
--  1. Sitio público en ventana de incógnito: productos, terapias,
--     experiencias y galería SE VEN.
--  2. El botón de consulta del sitio público sigue registrando en `inquiries`.
--  3. /admin sin loguear: NO puede leer inquiries ni escribir catálogo.
--  4. /admin logueado: alta, edición, borrado y subida de imagen funcionan.
