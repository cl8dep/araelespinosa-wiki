# La Wiki de Arael Espinosa

Guía práctica sobre migración y trámites consulares para ciudadanos cubanos en Uruguay y la región. Cubre residencia legal, cédula de identidad, pasaporte cubano, visas y más.

**Sitio en producción:** [wiki.araelespinosa.me](https://wiki.araelespinosa.me)

---

## Contenido

- **Uruguay** — Residencia legal, residencia por arraigo, cédula de identidad, banca
- **Consulado de Cuba en Uruguay** — Renovación de pasaporte cubano
- **Cuba** — Visa de turismo, reunificación familiar, trabajo y legalización de documentos (Consulado de Uruguay en Cuba)
- **Panamá** — Visa de tránsito para cubanos

## Stack

- [Docusaurus 3](https://docusaurus.io/) — generador de sitios estáticos
- React + TypeScript
- Markdown / MDX para el contenido
- Google Analytics 4

## Desarrollo local

Requiere Node.js 18+ y pnpm.

```bash
# Instalar dependencias
pnpm install

# Servidor de desarrollo
pnpm start

# Build de producción
pnpm build

# Previsualizar el build (necesario para probar BreadcrumbList schema)
pnpm build && pnpm serve
```

## Estructura del proyecto

```
docs/
├── migration/
│   ├── cuba/                        # Trámites desde Cuba
│   │   └── consulado-uruguay-en-cuba/
│   ├── panama/                      # Tránsito por Panamá
│   └── uruguay/                     # Trámites en Uruguay
│       ├── banking-and-finances/
│       ├── consulado-cuba-en-uruguay/
│       ├── otros/
│       └── tramites/
plugins/
└── breadcrumb-schema/               # Plugin local: inyecta BreadcrumbList JSON-LD
src/
├── components/
└── pages/
static/
```

## Licencia

Este proyecto está licenciado bajo la **GNU General Public License v3.0 (GPL-3.0)**.

Esto significa que:
- Puedes usar, estudiar y modificar el código libremente
- Cualquier obra derivada debe publicarse bajo la misma licencia GPL-3.0
- No puede convertirse en software privado o propietario
- Debes mantener la atribución al autor original

Ver [LICENSE](./LICENSE) para el texto completo.

**Autor:** Arael Espinosa — [wiki.araelespinosa.me](https://wiki.araelespinosa.me)

## Contribuciones

Ver [CONTRIBUTING.md](./CONTRIBUTING.md).
