# Entorno — qué clonar para trabajar este proyecto en otra máquina

Actualizado: 2026-11-07

---

## 1. Lo que se clona

| Qué | Dónde | Para qué |
|---|---|---|
| **Matukana** | `DigitalMatchGlobal/Matukana` | El proyecto. Es esto |
| **POV Store** | `GonzaloRamosEngineer/POVSTOREUY` | El **motor** del que sale la tienda. Sólo referencia, no se toca |

```bash
mkdir -p ~/Documents/dev && cd ~/Documents/dev
gh auth login --hostname github.com --git-protocol https --web   # entrar como DigitalMatchGlobal
gh auth setup-git --hostname github.com                          # si no, el keychain pisa el login
git clone https://github.com/DigitalMatchGlobal/Matukana.git
git clone https://github.com/GonzaloRamosEngineer/POVSTOREUY.git
```

⚠ **POV vive en la cuenta personal `GonzaloRamosEngineer`, no en la organización.** Si en la otra
máquina entrás sólo como `DigitalMatchGlobal`, ese clone falla. Es candidato a mudarse a la org.

## 2. Lo que NO está en ningún repo (y hay que copiar a mano)

Esto es lo que te va a faltar si sólo clonás:

| Qué | Dónde está | Por qué importa |
|---|---|---|
| `dev/TIENDA-BASE/` | **sólo local, sin remoto** | La bitácora de la base de tiendas: hallazgos, decisiones y lecciones de costeo |
| `dev/AGENTS.md` + `dev/CLAUDE.md` | sueltos en la raíz de `dev/` | Las reglas de la casa para cualquier sesión de agente |
| `dev/INFRAESTRUCTURA-DMG.md` | suelto en la raíz de `dev/` | Política de cuentas, Vercel Pro, y las cuentas de GitHub |

**Mientras no tengan repo, hay que copiarlos por fuera** (AirDrop, Drive, pendrive). Lo sano es
crear un repo privado `DigitalMatchGlobal/dmg-docs` con los tres y clonarlo como cualquier otro.

## 3. Credenciales (no se clonan nunca)

El `.env.local` está gitignoreado, así que no viaja con el repo. En la máquina nueva:

```bash
cd Matukana && cp .env.example .env.local
```

y completar con los valores del proyecto de Supabase `xwotrjojocxpjwalanqh`
(Supabase → Settings → API). Las dos son públicas por diseño: viajan en el bundle del sitio.

Según `AGENTS.md`, las credenciales de la casa viven en `~/.dmg-ops/` con permisos 600 —
nunca en el chat ni en el repo.

## 4. Levantarlo

```bash
cd Matukana
npm install
npm run dev        # http://localhost:3000 · panel en /admin
```

Node 22.x (es con el que se buildeó y el que está puesto en Vercel).

⚠ **No correr `npm run build` con el `npm run dev` levantado**: comparten la carpeta `.next` y el
dev queda corrupto (`__webpack_modules__[moduleId] is not a function`). Si pasa:
`rm -rf .next` y arrancar de nuevo.

## 5. Accesos que hacen falta además del código

| Servicio | Qué |
|---|---|
| GitHub | Cuenta **DigitalMatchGlobal** (es la única con permiso de escritura en los repos de la org) |
| Supabase | Proyecto `xwotrjojocxpjwalanqh`. Para RLS y plantillas de correo hace falta un **PAT** (`sbp_…`), que la service_role no reemplaza |
| Vercel | Proyecto `matukana`, team DigitalMatchGlobal. ⚠ Sigue en plan **Hobby** |
| Dominio | `vivematukana.com` |
| Correo | `info@vivematukana.com` en Spacemail (`mail.spacemail.com`) |

## 6. Para orientarse al llegar

Leer en este orden: [`ESTADO.md`](ESTADO.md) (la foto del proyecto) →
[`PLAN-TIENDA.md`](PLAN-TIENDA.md) (lo que viene) → [`MIGRACION-NEXT.md`](MIGRACION-NEXT.md)
(por qué el código está como está).
