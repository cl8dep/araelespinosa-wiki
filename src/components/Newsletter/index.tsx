import {useState, type FormEvent} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

type Status = 'idle' | 'sending' | 'done' | 'error';

export default function Newsletter({compact = false}: {compact?: boolean}) {
  const {siteConfig} = useDocusaurusContext();
  const formId = siteConfig.customFields?.kitFormId as string;
  const [status, setStatus] = useState<Status>('idle');

  // Hidden until the Kit form id is configured, so a broken form never ships.
  if (!formId) return null;
  const action = `https://app.kit.com/forms/${formId}/subscriptions`;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(action, {
        method: 'POST',
        body: new FormData(e.currentTarget),
        headers: {Accept: 'application/json'},
      });
      // Kit answers 200 with {status: "failed"} on errors, so check the body.
      const data = await res.json();
      // Kit's bot guard: the subscriber must pass a captcha on Kit's page to finish.
      if (data.status === 'quarantined' && data.url) {
        window.location.assign(data.url);
        return;
      }
      // GDPR consent, when enabled on the form, is collected on Kit's page as well.
      if (data.status === 'success' && data.consent?.enabled && data.consent.url) {
        window.location.assign(data.consent.url);
        return;
      }
      setStatus(data.status === 'success' ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className={compact ? styles.compact : styles.box} aria-labelledby="newsletter-title">
      <div className={styles.copy}>
        <h2 id="newsletter-title" className={styles.title}>
          Cambios en trámites migratorios, en tu correo
        </h2>
        <p className={styles.text}>
          Te aviso cuando cambian requisitos, costos o plazos en Uruguay. Sin spam, te das de baja cuando quieras.
        </p>
      </div>
      {status === 'done' ? (
        <p className={styles.success} role="status">
          Listo. Te llegará un correo para confirmar la suscripción.
        </p>
      ) : (
        <form className={styles.form} action={action} method="post" onSubmit={onSubmit}>
          <label htmlFor="newsletter-email" className={styles.srOnly}>
            Correo electrónico
          </label>
          <input
            id="newsletter-email"
            className={styles.input}
            type="email"
            name="email_address"
            placeholder="tu@correo.com"
            autoComplete="email"
            required
          />
          <button className={styles.button} type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Enviando…' : 'Suscribirme'}
          </button>
          {status === 'error' && (
            <p className={styles.error} role="alert">
              No se pudo completar la suscripción en este momento.
            </p>
          )}
        </form>
      )}
    </section>
  );
}
