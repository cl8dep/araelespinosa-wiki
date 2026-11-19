import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';

export default function NotFound(): ReactNode {
  return (
    <Layout title="Página no encontrada">
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          padding: '2rem',
          textAlign: 'center',
        }}>
        <Heading as="h1" style={{fontSize: '5rem', marginBottom: '0.5rem'}}>
          404
        </Heading>
        <Heading as="h2" style={{marginBottom: '1rem'}}>
          Página no encontrada
        </Heading>
        <p style={{maxWidth: '480px', color: '#666', marginBottom: '2rem'}}>
          La página que buscás no existe o fue movida. Podés explorar el contenido
          disponible desde los enlaces de abajo.
        </p>
        <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center'}}>
          <Link className="button button--primary button--lg" to="/">
            Inicio
          </Link>
          <Link className="button button--secondary button--lg" to="/docs/migration/intro">
            Migración
          </Link>
          <Link className="button button--secondary button--lg" to="/stats/intro">
            Estadísticas
          </Link>
        </div>
      </main>
    </Layout>
  );
}
