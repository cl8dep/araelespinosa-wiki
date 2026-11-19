// Local Docusaurus plugin: generates /llms.txt from the docs metadata at build time,
// so the file never drifts from the published guides.

const fs = require('fs');
const path = require('path');

const SECTIONS = [
  {title: 'Uruguay', match: (p) => p.startsWith('/docs/migration/uruguay/') && !p.includes('/consulado-cuba-en-uruguay/')},
  {title: 'Consulado de Cuba en Uruguay (Montevideo)', match: (p) => p.includes('/consulado-cuba-en-uruguay/')},
  {title: 'Cuba — Consulado de Uruguay en La Habana', match: (p) => p.startsWith('/docs/migration/cuba/')},
  {title: 'Panamá', match: (p) => p.startsWith('/docs/migration/panama/')},
  {title: 'Estadísticas oficiales de migración', match: (p) => p.startsWith('/stats/')},
];

const HEADER = `# La Wiki de Arael Espinosa

> Guía práctica sobre migración y trámites consulares para personas cubanas y venezolanas en Uruguay y la región. Cubre residencia legal, cédula de identidad, pasaporte cubano, visas, legalización de documentos y estadísticas oficiales sobre inmigración, con fuentes oficiales.

El sitio está organizado por país y tipo de trámite. Cada página detalla requisitos, costos, tiempos y formularios. El autor es Arael Espinosa, asesor en trámites migratorios en Uruguay (https://www.araelespinosa.me). La información no constituye asesoramiento letrado.

- Agendar llamada de diagnóstico: https://calendar.app.google/6ctCtPm8ackvGKa58
- Contacto gestoría: gestoria@araelespinosa.me
- WhatsApp: +598 99 598 034
- Sitio de la gestoría: https://www.araelespinosa.me
`;

const FOOTER = (url) => `## Observatorio de Visas

Herramienta interactiva con requisitos de visa por país de destino para pasaportes latinoamericanos. Incluye excepciones por residencia en terceros países, acuerdos bilaterales y condiciones de tránsito. Datos base: dataset open-source passport-index-data (MIT, 199 países). Excepciones documentadas manualmente con fuentes oficiales (decretos, resoluciones).

- [Observatorio de Visas](${url}/visas): Consulta interactiva de requisitos por pasaporte y destino, con excepciones y condiciones de tránsito.
- [Dataset público — Cuba](${url}/data/passports/CUB.json): Requisitos de visa para pasaporte cubano en formato JSON.
- [Dataset público — Venezuela](${url}/data/passports/VEN.json): Requisitos de visa para pasaporte venezolano en formato JSON.
- [Índice de datasets](${url}/data/passports/index.json): Listado de todos los pasaportes disponibles con sus URLs.

## Optional

- [Términos y condiciones](${url}/terms): Aviso legal, descargo de responsabilidad y alcance de la información publicada.
- [Introducción general](${url}/docs/migration/intro): Contexto sobre el sitio, audiencia objetivo y cómo usar la documentación.
`;

module.exports = function llmsTxtPlugin() {
  let docs = [];
  return {
    name: 'llms-txt-plugin',
    async allContentLoaded({allContent}) {
      const instances = allContent['docusaurus-plugin-content-docs'] || {};
      docs = Object.values(instances).flatMap((instance) =>
        instance.loadedVersions.flatMap((version) => version.docs),
      );
    },
    async postBuild({siteConfig, outDir}) {
      const url = siteConfig.url;
      const sections = SECTIONS.map(({title, match}) => {
        const items = docs
          .filter((d) => match(d.permalink) && !d.permalink.endsWith('/intro'))
          .sort((a, b) => a.permalink.localeCompare(b.permalink))
          .map((d) => `- [${d.title}](${url}${d.permalink}): ${d.description}`);
        return items.length ? `## ${title}\n\n${items.join('\n')}\n` : '';
      }).filter(Boolean);
      const body = [HEADER, ...sections, FOOTER(url)].join('\n');
      fs.writeFileSync(path.join(outDir, 'llms.txt'), body, 'utf8');
    },
  };
};
