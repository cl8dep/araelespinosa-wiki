import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'La Wiki de Arael Espinosa',
  tagline: 'Dando una mano',
  favicon: 'img/favicon.ico',

  future: {
    v4: true, 
  },

  // Set the production url of your site here
  url: 'https://wiki.araelespinosa.me',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'cl8dep', // Usually your GitHub org/user name.
  projectName: 'araelespinosa-blog', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },

  plugins: [
    './plugins/breadcrumb-schema',
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'statistics',
        path: 'stats',
        routeBasePath: 'stats',
        sidebarPath: './sidebars-stats.ts',
        onInlineTags: 'warn',
        showLastUpdateTime: true,
        showLastUpdateAuthor: false,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/cl8dep/araelespinosa-blog/blob/master/sidebars.ts',
          onInlineTags: "warn",
          showLastUpdateTime: true,
          showLastUpdateAuthor: false,
        },
        // blog: {
        //   showReadingTime: true,
        //   feedOptions: {
        //     type: ['rss', 'atom'],
        //     xslt: true,
        //   },
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl:
        //     'https://github.com/cl8dep/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        //   // Useful options to enforce blogging best practices
        //   onInlineTags: 'throw',
        //   onInlineAuthors: 'throw',
        //   onUntruncatedBlogPosts: 'warn',
        // },
        gtag: {
          trackingID: 'G-NCTK7XCTSL',
          anonymizeIP: true,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'monthly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
          createSitemapItems: async (params) => {
            const {defaultCreateSitemapItems, ...rest} = params;
            const items = await defaultCreateSitemapItems(rest);
            return items.map((item) => {
              // Home page
              if (item.url === 'https://wiki.araelespinosa.me/') {
                return {...item, priority: 1.0, changefreq: 'weekly'};
              }
              // Visa Observatory
              if (item.url.includes('/visas')) {
                return {...item, priority: 0.9, changefreq: 'weekly'};
              }
              // Main doc landing pages
              if (item.url.match(/\/docs\/migration\/(uruguay|cuba|panama)$/)) {
                return {...item, priority: 0.8};
              }
              // Individual tramite/procedural pages
              if (item.url.includes('/docs/migration/')) {
                return {...item, priority: 0.7};
              }
              // Contact, intro and secondary pages
              return {...item, priority: 0.4};
            });
          },
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    metadata: [
      {
        name: 'description',
        content:
          'Guía práctica sobre migración a Uruguay — trámites de residencia, cédula, banca y estadísticas oficiales sobre inmigración, explicados en detalle.',
      },
      {name: 'og:type', content: 'website'},
      {name: 'og:locale', content: 'es_UY'},
      {name: 'og:site_name', content: 'La Wiki de Arael Espinosa'},
      {
        name: 'og:description',
        content:
          'Guía práctica sobre migración a Uruguay — trámites de residencia, cédula, banca y estadísticas oficiales sobre inmigración, explicados en detalle.',
      },
      {name: 'og:image', content: 'https://wiki.araelespinosa.me/img/docusaurus-social-card.jpg'},
      {name: 'og:image:width', content: '1200'},
      {name: 'og:image:height', content: '630'},
      {name: 'twitter:card', content: 'summary_large_image'},
      {name: 'twitter:site', content: '@arael_espinosa'},
      {
        name: 'twitter:description',
        content:
          'Guía práctica sobre migración a Uruguay — trámites de residencia, cédula, banca y estadísticas oficiales.',
      },
      {name: 'twitter:image', content: 'https://wiki.araelespinosa.me/img/docusaurus-social-card.jpg'},
    ],
    navbar: {
      title: 'La Wiki de Arael Espinosa',
      logo: {
        alt: 'La Wiki de Arael Espinosa',
        src: 'img/favicon-32x32.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentación',
        },
        {
          type: 'docSidebar',
          sidebarId: 'statisticsSidebar',
          docsPluginId: 'statistics',
          position: 'left',
          label: 'Estadísticas',
        },
        {to: '/visas', label: 'Visas', position: 'left'},
        {
          href: 'https://github.com/cl8dep/araelespinosa-blog',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentación',
          items: [
            {
              label: 'Migración',
              to: '/docs/migration',
            },
          ],
        },
        {
          title: 'Legal',
          items: [
            {
              label: 'Términos y condiciones',
              to: '/terms',
            },
          ],
        },
        {
          title: 'Mis Redes Sociales',
          items: [
            {
              label: 'Instagram',
              href: 'https://instagram.com/araeal_espinosa',
            },
            {
              label: 'Youtube',
              href: 'https://youtube.com/@elvlogdepaco',
            },
            {
              label: 'TikTok',
              href: 'https://tiktok.com/@arael_espinosa',
            },
          ],
        },
        {
          title: 'Gestoría',
          items: [
            {
              label: 'WhatsApp',
              href: 'https://wa.me/59899598034',
            },
            {
              label: 'Email',
              href: 'mailto:gestoria@araelespinosa.me',
            },
          ],
        },
        // {
        //   title: 'More',
        //   items: [
        //     {
        //       label: 'Blog',
        //       to: '/blog',
        //     },
        //     {
        //       label: 'GitHub',
        //       href: 'https://github.com/facebook/docusaurus',
        //     },
        //   ],
        // },
      ],
      copyright: `Copyright © Arael Espinosa, ${new Date().getFullYear()}. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
