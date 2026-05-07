import React from 'react';
import {AlertTriangle} from 'lucide-react';
import Layout from '@theme/Layout';
import VisaObservatory from '@site/src/components/VisaObservatory';
import passportListData from '@site/src/data/passport-list.json';
import type {PassportListEntry} from '@site/src/types/visa';

const AVAILABLE_PASSPORTS = new Set(['CUB', 'VEN']);
const passportList = (passportListData as PassportListEntry[]).filter(
  (p) => AVAILABLE_PASSPORTS.has(p.iso3),
);

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Dataset',
      name: 'Observatorio de Visas — Requisitos para pasaportes latinoamericanos',
      description:
        'Requisitos de visa por país de destino para pasaportes latinoamericanos, incluyendo excepciones por residencia en terceros países, acuerdos bilaterales y condiciones de tránsito. Datos base: passport-index-data (MIT). Excepciones documentadas manualmente con fuentes oficiales.',
      url: 'https://wiki.araelespinosa.me/visas',
      creator: {
        '@type': 'Person',
        name: 'Arael Espinosa',
        url: 'https://wiki.araelespinosa.me',
        email: 'contacto@araelespinosa.me',
      },
      license: 'https://opensource.org/licenses/MIT',
      isBasedOn: 'https://github.com/imorte/passport-index-data',
      inLanguage: 'es',
      distribution: [
        {
          '@type': 'DataDownload',
          encodingFormat: 'application/json',
          contentUrl: 'https://wiki.araelespinosa.me/data/passports/CUB.json',
          name: 'Pasaporte cubano — requisitos por destino',
        },
        {
          '@type': 'DataDownload',
          encodingFormat: 'application/json',
          contentUrl: 'https://wiki.araelespinosa.me/data/passports/VEN.json',
          name: 'Pasaporte venezolano — requisitos por destino',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Necesitan visa los cubanos para viajar a Panamá?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Los ciudadanos cubanos necesitan visa para turismo en Panamá. Sin embargo, quienes posean residencia vigente o visa múltiple previamente utilizada con al menos 6 meses de vigencia emitida por Canadá, EE.UU., Australia, Corea del Sur, Japón, Reino Unido, Irlanda del Norte, Singapur o cualquier Estado de la Unión Europea pueden ingresar sin visa. Para tránsito, aplican excepciones similares según el Decreto Ejecutivo 30 del 27 de mayo de 2023.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Pueden los cubanos hacer tránsito en Argentina sin visa?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Los cubanos pueden hacer tránsito en Argentina sin visa siempre que permanezcan en el área internacional del aeropuerto. Si necesitan salir del área internacional, se requiere visa de tránsito.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Necesitan visa los cubanos para viajar a Chile?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Los ciudadanos cubanos necesitan visa para viajar a Chile como turistas. Existe una excepción para quienes posean residencia legal en Uruguay por 2 años o más, quienes pueden ingresar sin visa.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Dónde puedo acceder a los datos de requisitos de visa para pasaportes latinoamericanos?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Los datos están disponibles públicamente en formato JSON en https://wiki.araelespinosa.me/data/passports/{ISO3}.json, donde ISO3 es el código de tres letras del país (ej. CUB para Cuba, VEN para Venezuela). La fuente base es el dataset open-source passport-index-data en GitHub.',
          },
        },
      ],
    },
  ],
};

export default function VisasPage(): React.JSX.Element {
  return (
    <Layout
      title="Observatorio de Visas"
      description="Requisitos de visa para pasaportes latinoamericanos: acuerdos especiales, excepciones por residencia y visas de tránsito.">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />
      <div
        style={{
          background: 'linear-gradient(135deg, #68b4d9 0%, #2e86de 100%)',
          padding: '48px 24px 40px',
          color: '#fff',
        }}>
        <div style={{maxWidth: 960, margin: '0 auto'}}>
          <h1 style={{margin: 0, fontSize: '2rem', fontWeight: 700}}>
            Observatorio de Visas
          </h1>
          <p style={{margin: '12px 0 0', fontSize: '1.05rem', opacity: 0.9, maxWidth: 620}}>
            Requisitos de visa más allá de lo genérico: excepciones por residencia en terceros países,
            acuerdos bilaterales y visas de tránsito para pasaportes latinoamericanos.
          </p>
        </div>
      </div>

      <main
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '32px 24px 64px',
          overflowX: 'hidden',
        }}>
        <div
          style={{
            background: 'var(--ifm-color-warning-contrast-background, #fffbeb)',
            border: '1px solid var(--ifm-color-warning-dark, #d97706)',
            borderRadius: 8,
            padding: '14px 16px',
            marginBottom: 28,
            fontSize: 13,
            color: 'var(--ifm-color-warning-darkest, #92400e)',
            lineHeight: 1.6,
          }}>
          <p style={{margin: '0 0 8px'}}>
            <AlertTriangle size={14} strokeWidth={2} style={{verticalAlign: 'middle', marginRight: 6}} />
            <strong>Funcionalidad en prueba.</strong> Esta herramienta está en desarrollo activo y los datos pueden contener errores o estar desactualizados.
          </p>
          <p style={{margin: '0 0 8px'}}>
            <strong>Fuente de datos:</strong> La información base proviene del dataset open-source{' '}
            <a
              href="https://github.com/imorte/passport-index-data"
              target="_blank"
              rel="noopener noreferrer"
              style={{color: 'inherit', fontWeight: 600}}>
              passport-index-data
            </a>{' '}
            (ene/feb 2026, licencia MIT), que consolida requisitos de visa para 199 países.
            Las excepciones por residencia, acuerdos bilaterales y condiciones de tránsito se documentan manualmente a partir de fuentes oficiales de cada país.
          </p>
          <p style={{margin: '0 0 8px'}}>
            <strong>Verificación:</strong> Los datos base pueden consultarse directamente en el{' '}
            <a
              href="https://github.com/imorte/passport-index-data"
              target="_blank"
              rel="noopener noreferrer"
              style={{color: 'inherit', fontWeight: 600}}>
              repositorio del dataset
            </a>.
            Las excepciones manuales incluyen su fuente cuando está disponible (decreto, resolución oficial, etc.).
          </p>
          <p style={{margin: 0}}>
            <strong>¿Encontraste un error?</strong> Escríbeme a{' '}
            <a href="mailto:contacto@araelespinosa.me" style={{color: 'inherit', fontWeight: 600}}>
              contacto@araelespinosa.me
            </a>{' '}
            indicando el país afectado, el error observado y, si es posible, la fuente oficial que lo respalda.
            Verifica siempre con fuentes oficiales antes de viajar.
          </p>
        </div>

        <VisaObservatory passportList={passportList} />
      </main>
    </Layout>
  );
}
