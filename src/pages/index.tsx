import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Head from '@docusaurus/Head';
import {
  ClipboardList,
  Globe,
  RefreshCw,
  MapPin,
  MessageCircle,
  Mail,
} from 'lucide-react';

import styles from './index.module.css';

const SITE_URL = 'https://blog.araelespinosa.me';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'La Wiki de Arael Espinosa',
      description:
        'Guía práctica sobre migración y trámites consulares — residencia, cédula, pasaporte y más, explicados en detalle.',
      inLanguage: 'es',
      publisher: {
        '@id': `${SITE_URL}/#organization`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Arael Espinosa',
      url: SITE_URL,
      sameAs: [
        'https://instagram.com/araeal_espinosa',
        'https://youtube.com/@elvlogdepaco',
        'https://tiktok.com/@arael_espinosa',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: 'gestoria@araelespinosa.me',
        availableLanguage: 'Spanish',
      },
    },
  ],
};

const features = [
  {
    Icon: ClipboardList,
    title: 'Trámites explicados paso a paso',
    description:
      'Residencia, cédula, pasaporte cubano, visas y más. Cada trámite detallado con requisitos, costos y tiempos reales.',
  },
  {
    Icon: Globe,
    title: 'Información por país',
    description:
      'Guías organizadas por destino: Uruguay, Cuba, Panamá. Encuentre lo que necesita sin perderse en trámites que no aplican.',
  },
  {
    Icon: RefreshCw,
    title: 'Contenido actualizado',
    description:
      'La información se revisa y actualiza regularmente en base a cambios oficiales. Siempre con la fuente indicada.',
  },
];

const countries = [
  {
    name: 'Cuba',
    description: 'Trámites del Consulado de Uruguay en Cuba: visas, legalización de documentos y más.',
    link: '/docs/migration/cuba',
  },
  {
    name: 'Panamá',
    description: 'Recursos e información para cubanos en tránsito o residentes en Panamá.',
    link: '/docs/migration/panama',
  },
  {
    name: 'Uruguay',
    description: 'Residencia legal, cédula de identidad, banca y más para migrantes en Uruguay.',
    link: '/docs/migration/uruguay',
  },
];

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className={styles.heroTitle}>
          Trámites de migración, sin complicaciones
        </Heading>
        <p className={styles.heroSubtitle}>
          Guías prácticas sobre residencia, cédula, pasaporte y trámites consulares.
          Información clara, actualizada y con fuentes oficiales.
        </p>
        <div className={styles.heroButtons}>
          <Link className="button button--lg button--secondary" to="/docs/migration/uruguay">
            Ver trámites en Uruguay
          </Link>
          <Link className={clsx('button button--lg', styles.buttonOutline)} to="/docs/migration/cuba">
            Consulado de Uruguay en Cuba
          </Link>
        </div>
      </div>
    </header>
  );
}

function FeaturesSection() {
  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          ¿Qué encontrará en este sitio?
        </Heading>
        <div className={styles.featuresGrid}>
          {features.map(({Icon, title, description}, i) => (
            <div key={i} className={styles.featureCard}>
              <div className={styles.featureIconWrap}>
                <Icon size={28} strokeWidth={1.75} />
              </div>
              <h3 className={styles.featureTitle}>{title}</h3>
              <p className={styles.featureDesc}>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CountriesSection() {
  return (
    <section className={styles.countriesSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Documentación por país
        </Heading>
        <div className={styles.countriesGrid}>
          {countries.map((c, i) => (
            <Link key={i} to={c.link} className={styles.countryCard}>
              <div className={styles.countryIconWrap}>
                <MapPin size={24} strokeWidth={1.75} />
              </div>
              <h3 className={styles.countryName}>{c.name}</h3>
              <p className={styles.countryDesc}>{c.description}</p>
              <span className={styles.countryLink}>Ver guías →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className={styles.ctaSection}>
      <div className="container">
        <div className={styles.ctaBox}>
          <Heading as="h2" className={styles.ctaTitle}>
            ¿Necesita ayuda con un trámite?
          </Heading>
          <p className={styles.ctaText}>
            Soy gestor y puedo asesorarle en la preparación de documentos y acompañarle
            durante todo el proceso migratorio o consular.
          </p>
          <div className={styles.ctaButtons}>
            <a
              href="https://wa.me/59899598034"
              className="button button--lg button--success"
              target="_blank"
              rel="noopener noreferrer">
              <MessageCircle size={18} style={{marginRight: '0.5rem', verticalAlign: 'middle'}} />
              +598 99 598 034
            </a>
            <a
              href="mailto:gestoria@araelespinosa.me"
              className={clsx('button button--lg', styles.buttonOutlineDark)}>
              <Mail size={18} style={{marginRight: '0.5rem', verticalAlign: 'middle'}} />
              gestoria@araelespinosa.me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Trámites de migración explicados"
      description="Guía práctica sobre migración a Uruguay y trámites consulares — residencia, cédula, pasaporte y más, explicados en detalle con fuentes oficiales.">
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Head>
      <HomepageHeader />
      <main>
        <FeaturesSection />
        <CountriesSection />
        <CTASection />
      </main>
    </Layout>
  );
}
