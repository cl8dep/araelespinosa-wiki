import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Head from '@docusaurus/Head';
import {
  ClipboardList,
  Globe,
  RefreshCw,
  MessageCircle,
} from 'lucide-react';

import type {Graph} from 'schema-dts';
import Newsletter from '@site/src/components/Newsletter';
import styles from './index.module.css';

const SITE_URL = 'https://wiki.araelespinosa.me';

const MAIN_SITE = 'https://www.araelespinosa.me';

const jsonLd: Graph = {
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
      publisher: {'@id': `${MAIN_SITE}/#person`},
    },
    {
      '@type': 'Person',
      '@id': `${MAIN_SITE}/#person`,
      name: 'Arael Espinosa',
      jobTitle: 'Asesor en trámites migratorios',
      url: MAIN_SITE,
      sameAs: [
        SITE_URL,
        'https://instagram.com/arael_espinosa',
        'https://youtube.com/@elvlogdepaco',
        'https://tiktok.com/@arael_espinosa',
        'https://share.google/RJA7kHAySVSdbmWmF',
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
    iso2: 'cu',
    description: 'Trámites del Consulado de Uruguay en Cuba: visas, legalización de documentos y más.',
    link: '/docs/category/cuba',
  },
  {
    name: 'Panamá',
    iso2: 'pa',
    description: 'Recursos e información para cubanos en tránsito o residentes en Panamá.',
    link: '/docs/category/panamá',
  },
  {
    name: 'Uruguay',
    iso2: 'uy',
    description: 'Residencia legal, cédula de identidad, banca y más para migrantes en Uruguay.',
    link: '/docs/category/uruguay',
  },
];

function HomepageHeader() {
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <span className={styles.eyebrow}>La Wiki de Arael Espinosa</span>
        <Heading as="h1" className={styles.heroTitle}>
          Trámites de migración, sin complicaciones
        </Heading>
        <p className={styles.heroSubtitle}>
          Guías prácticas sobre residencia, cédula, pasaporte y trámites consulares.
          Información clara, actualizada y con fuentes oficiales.
        </p>
        <div className={styles.heroButtons}>
          <Link className="button button--lg button--primary" to="/docs/category/uruguay">
            Ver trámites en Uruguay
          </Link>
          <Link className="button button--lg button--outline button--primary" to="/docs/category/consulado-de-uruguay-en-cuba">
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
                <img
                  src={`https://flagcdn.com/w80/${c.iso2}.png`}
                  alt={`Bandera de ${c.name}`}
                  width={48}
                  height={36}
                  style={{borderRadius: 4, objectFit: 'cover', display: 'block'}}
                />
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
          <div>
            <Heading as="h2" className={styles.ctaTitle}>
              ¿Necesita ayuda con un trámite?
            </Heading>
            <p className={styles.ctaText}>
              Soy gestor y puedo asesorarle en la preparación de documentos y acompañarle
              durante todo el proceso migratorio o consular. Empezamos con una llamada de diagnóstico.
            </p>
          </div>
          <div className={styles.ctaButtons}>
            <a
              href="https://calendar.app.google/6ctCtPm8ackvGKa58"
              className={styles.ctaPrimary}
              target="_blank"
              rel="noopener noreferrer">
              Agendar llamada de diagnóstico
            </a>
            <a
              href="https://wa.me/59899598034"
              className={styles.ctaSecondary}
              target="_blank"
              rel="noopener noreferrer">
              <MessageCircle size={18} aria-hidden="true" />
              Escribir por WhatsApp
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
        <section className={styles.newsletterSection}>
          <div className="container">
            <Newsletter />
          </div>
        </section>
        <CTASection />
      </main>
    </Layout>
  );
}
