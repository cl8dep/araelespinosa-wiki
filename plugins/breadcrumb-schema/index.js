// Local Docusaurus plugin: injects BreadcrumbList JSON-LD into every page
// Uses postBuild hook — no swizzling required.
// Inspired by @stackql/docusaurus-plugin-structured-data (MIT)

const fs = require('fs');
const path = require('path');

const LABEL_MAP = {
  // Route segments → human-readable labels
  docs: 'Documentación',
  migration: 'Documentación',
  stats: 'Estadísticas',
  // Countries
  uruguay: 'Uruguay',
  cuba: 'Cuba',
  panama: 'Panamá',
  // Uruguay sections
  tramites: 'Trámites',
  cedula: 'Cédula de identidad',
  'banking-and-finances': 'Banca y Finanzas',
  otros: 'Otros',
  'consulado-cuba-en-uruguay': 'Consulado de Cuba en Uruguay',
  'consulado-uruguay-en-cuba': 'Consulado de Uruguay en Cuba',
  // Pages
  intro: 'Introducción',
  contacto: 'Contacto',
  'residencia-legal': 'Residencia Legal Definitiva',
  'residencia-por-arraigo': 'Residencia por Arraigo',
  'renovacion-cedula-solicitante-refugio': 'Renovación de Cédula para Solicitantes de Refugio',
  'visa-de-turismo': 'Visa de Turismo',
  'visa-de-trabajo': 'Visa de Trabajo',
  'visa-de-reunificacion-familiar': 'Visa de Reunificación Familiar',
  'legalizacion-documentos': 'Legalización de Documentos',
  'recomendaciones-carta-invitacion': 'Recomendaciones para Carta de Invitación',
  'visa-de-transito': 'Visa de Tránsito',
  'visa-transito-panama': 'Visa de Tránsito',
  'renovacion-pasaporte': 'Renovación de Pasaporte Cubano',
  'tarjetas-debito-no-bancos': 'Tarjetas de Débito sin Banco',
  'envio-de-documentos': 'Envío de Documentos',
};

function getLabel(segment) {
  return LABEL_MAP[segment] || segment.replace(/-/g, ' ');
}

function buildBreadcrumbList(routePath, baseUrl) {
  // Strip leading/trailing slashes, split into segments
  const segments = routePath.replace(/^\/|\/$/g, '').split('/').filter(Boolean);

  // Always start with Home
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Inicio',
      item: baseUrl,
    },
  ];

  // Build intermediate crumbs (skip the last segment — that's the current page)
  let accumulated = baseUrl;
  for (let i = 0; i < segments.length - 1; i++) {
    accumulated = `${accumulated}/${segments[i]}`;
    items.push({
      '@type': 'ListItem',
      position: items.length + 1,
      name: getLabel(segments[i]),
      item: accumulated,
    });
  }

  // Last segment = current page (no item URL per schema.org spec)
  const lastSegment = segments[segments.length - 1];
  if (lastSegment) {
    items.push({
      '@type': 'ListItem',
      position: items.length + 1,
      name: getLabel(lastSegment),
    });
  }

  // Only emit breadcrumbs with more than 1 item (no point on the homepage)
  if (items.length <= 1) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${baseUrl}${routePath}#breadcrumb`,
    itemListElement: items,
  };
}

module.exports = function breadcrumbSchemaPlugin(_context, _options) {
  return {
    name: 'breadcrumb-schema-plugin',
    async postBuild({ siteConfig, routesPaths, outDir }) {
      // Lazy-require jsdom inside postBuild to avoid jiti evaluation errors
      // when Docusaurus loads the plugin config during the build setup phase.
      const { JSDOM } = require('jsdom');
      const baseUrl = siteConfig.url;
      const ignored = ['/404', '/search', '/tags'];

      await Promise.all(
        routesPaths.map(async (routePath) => {
          // Skip non-content routes
          if (ignored.some((p) => routePath.startsWith(p))) return;
          if (routePath === '/') return;

          const breadcrumb = buildBreadcrumbList(routePath, baseUrl);
          if (!breadcrumb) return;

          // Resolve path to the generated HTML file
          const htmlPath = path.join(
            outDir,
            routePath.endsWith('/') ? routePath : `${routePath}/`,
            'index.html'
          );

          if (!fs.existsSync(htmlPath)) return;

          const html = fs.readFileSync(htmlPath, 'utf8');
          const dom = new JSDOM(html);
          const document = dom.window.document;

          // Avoid duplicating if already present
          const existing = [...document.querySelectorAll('script[type="application/ld+json"]')];
          const alreadyHasBreadcrumb = existing.some((s) => {
            try { return JSON.parse(s.innerHTML)['@type'] === 'BreadcrumbList'; } catch { return false; }
          });
          if (alreadyHasBreadcrumb) return;

          const script = document.createElement('script');
          script.type = 'application/ld+json';
          script.innerHTML = JSON.stringify(breadcrumb);
          document.head.appendChild(script);

          fs.writeFileSync(htmlPath, dom.serialize(), 'utf8');
        })
      );
    },
  };
};
