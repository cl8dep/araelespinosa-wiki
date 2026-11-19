# AGENTS.md

La Wiki de Arael Espinosa (wiki.araelespinosa.me): guías gratuitas sobre trámites migratorios en Uruguay, Cuba y Panamá. Docusaurus 3, contenido en `docs/` (guías) y `stats/` (estadísticas). Es la puerta de entrada de la gestoría (www.araelespinosa.me, repo `araelespinosa-website`).

## Audiencia y lenguaje

Lectores: personas migrantes, sobre todo de Cuba y Venezuela, que no conocen la jerga legal ni administrativa. Todo texto nuevo o editado debe ser **lenguaje llano**:

- Frases cortas, una idea por frase. Explicar cada término técnico la primera vez ("resolución firme" → "una respuesta definitiva, sin apelaciones pendientes").
- Decir quién hace qué: "Migración te da un certificado", no "se expide el certificado".
- Fechas, plazos, montos y requisitos concretos, siempre con su fuente oficial (IMPO, gub.uy) enlazada.
- No inventar pasos, costos ni plazos. Si algo no está publicado, decirlo y avisar que se actualizará.
- Tono cercano.
- **Español neutro, nunca rioplatense.** Tratar al lector de "tú" ("tienes", "puedes", "cuéntame"), nunca de "vos" ("tenés", "podés", "contame"). Evitar regionalismos ("arrancar" → "empezar"). Algunas guías antiguas todavía usan "usted" o "vos": al editarlas, pasarlas a "tú".
- Cerrar con la aclaración de que la información no constituye asesoramiento letrado.

## SEO, AEO y LLM (obligatorio en cada cambio)

- **Front matter** en cada guía: `title` con la palabra clave principal, `description` de 120 a 160 caracteres que responda la pregunta del lector, y `keywords`.
- **Una URL por tema.** Si cambia la norma, actualizar la guía existente en lugar de crear otra, para no perder posicionamiento ni duplicar contenido.
- **JSON-LD:**
  - `FAQPage` en el propio `.md` cuando la guía tiene preguntas frecuentes. Las preguntas y respuestas del JSON-LD deben coincidir con las visibles en la página.
  - `HowTo` solo si los pasos están confirmados oficialmente.
  - `Article` (autor, fecha de actualización) lo agrega `src/theme/DocItem/Footer`, y `BreadcrumbList` lo agrega Docusaurus. No duplicarlos.
  - Los objetos JSON-LD en TypeScript se tipan con `schema-dts`.
  - El autor y el publisher son siempre `https://www.araelespinosa.me/#person`, la misma entidad que el sitio de la gestoría.
- **`llms.txt`** se genera en cada build (`plugins/llms-txt`) a partir del `title` y la `description` de cada guía. No crear `static/llms.txt` a mano. Si se agrega una sección nueva de docs, sumarla en `SECTIONS`.
- **Enlaces internos:** usar rutas que existen; el build avisa de los enlaces rotos y hay que corregirlos.
- **Admonitions:** con `future.v4` solo funciona la sintaxis `:::warning[Título]`. La forma `:::warning Título` se ve como texto plano.
- **Newsletter:** el formulario de Kit (`customFields.kitFormId`) aparece en la home y al final de cada guía. No quitarlo.

## Marca

Mismos tokens que el sitio de la gestoría (`src/css/custom.css`): verde `#1E5A47`, neutros cálidos, IBM Plex Sans y el monograma "AE". Botón principal: "Agendar diagnóstico". Nunca prometer resultados ni presentarse como abogado.

## Comandos

- `pnpm start` levanta el sitio en local y `pnpm build` genera el sitio de producción (también genera `llms.txt` y los breadcrumbs).
- `pnpm typecheck` tiene errores previos en `CitizenshipMap`, `ImmigrationStats` y `sidebars-stats.ts`. No agregar errores nuevos.
