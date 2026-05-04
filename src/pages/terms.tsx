import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

const LAST_UPDATED = '26 de abril de 2026';
const CONTACT_EMAIL = 'gestoria@araelespinosa.me';
const SITE_URL = 'https://wiki.araelespinosa.me';

export default function Terms(): ReactNode {
  return (
    <Layout
      title="Términos y condiciones"
      description="Términos y condiciones de uso del sitio La Wiki de Arael Espinosa, incluyendo descargos de responsabilidad sobre el contenido publicado.">
      <main
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '3rem 1.5rem',
          lineHeight: '1.7',
        }}>
        <Heading as="h1">Términos y condiciones de uso</Heading>
        <p style={{color: '#888', marginBottom: '2rem'}}>
          Última actualización: {LAST_UPDATED}
        </p>

        <p>
          Al acceder y utilizar el sitio web{' '}
          <strong>La Wiki de Arael Espinosa</strong> (en adelante, "el Sitio"),
          ubicado en <a href={SITE_URL}>{SITE_URL}</a>, usted acepta los
          presentes términos y condiciones de uso. Si no está de acuerdo con
          alguno de ellos, le pedimos que se abstenga de utilizar el Sitio.
        </p>

        <Heading as="h2">1. Naturaleza del contenido</Heading>
        <p>
          El Sitio tiene carácter exclusivamente <strong>informativo y
          divulgativo</strong>. Los contenidos publicados — incluyendo guías de
          trámites migratorios, estadísticas y cualquier otro material — se
          elaboran con el objetivo de facilitar el acceso a información de
          dominio público y simplificar su comprensión.
        </p>
        <p>
          El contenido publicado <strong>no constituye asesoramiento legal,
          jurídico, contable, migratorio ni de ningún otro tipo</strong>. No
          debe interpretarse como una opinión profesional ni como una
          recomendación de acción específica para ningún caso particular.
        </p>

        <Heading as="h2">2. Descargo de responsabilidad</Heading>
        <p>
          Arael Espinosa y el Sitio no se responsabilizan por:
        </p>
        <ul>
          <li>
            Decisiones tomadas por el usuario con base en la información
            publicada en el Sitio.
          </li>
          <li>
            Errores, omisiones, inexactitudes o desactualizaciones en el
            contenido, aun cuando se ponga el mayor cuidado en su elaboración.
          </li>
          <li>
            Cambios normativos, reglamentarios o de procedimientos
            administrativos que ocurran con posterioridad a la publicación de
            un artículo y que no hayan sido actualizados aún en el Sitio.
          </li>
          <li>
            Resultados desfavorables derivados del uso de la información
            publicada para gestionar trámites, solicitudes o cualquier otra
            acción ante organismos públicos o privados.
          </li>
          <li>
            El contenido de sitios web de terceros enlazados desde el Sitio.
          </li>
        </ul>

        <Heading as="h2">3. Fuentes de información</Heading>
        <p>
          La información publicada en el Sitio puede provenir de fuentes
          oficiales (organismos gubernamentales, publicaciones académicas,
          respuestas a solicitudes de acceso a información pública, etc.) o de
          la experiencia y conocimiento propio del autor. En todos los casos, se
          procura citar la fuente correspondiente.
        </p>
        <p>
          Las fuentes oficiales citadas son responsables de la información que
          publican. Cualquier discrepancia entre lo publicado en el Sitio y la
          normativa o procedimientos vigentes debe resolverse consultando
          directamente a las fuentes oficiales.
        </p>

        <Heading as="h2">4. Actualización del contenido</Heading>
        <p>
          El Sitio se actualiza de forma periódica pero no garantiza que todo el
          contenido refleje el estado más reciente de la normativa, los
          procedimientos o los datos estadísticos publicados. Se recomienda
          verificar la vigencia de la información antes de actuar en base a ella.
        </p>

        <Heading as="h2">5. Propiedad intelectual</Heading>
        <p>
          Los textos, visualizaciones y demás contenidos originales publicados en
          el Sitio son propiedad de Arael Espinosa, salvo que se indique lo
          contrario. Queda permitida su reproducción parcial con fines no
          comerciales, siempre que se cite la fuente y se incluya un enlace al
          Sitio.
        </p>
        <p>
          Los datos estadísticos y documentos oficiales reproducidos en el Sitio
          pertenecen a sus respectivos organismos emisores y se publican bajo el
          principio de acceso a la información pública.
        </p>

        <Heading as="h2">6. Modificaciones</Heading>
        <p>
          El Sitio se reserva el derecho de modificar estos términos en cualquier
          momento. Los cambios entrarán en vigor a partir de su publicación en
          esta página. Se recomienda revisarla periódicamente.
        </p>

        <Heading as="h2">7. Contacto</Heading>
        <p>
          Ante consultas relacionadas con el contenido del Sitio o estos términos,
          puede escribir a:{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </main>
    </Layout>
  );
}
