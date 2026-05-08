import React from 'react';
import type {VisaDestination, VisaException, VisaRequirement} from '@site/src/types/visa';
import {COUNTRY_NAMES} from '@site/src/data/country-names';
import {ISO3_TO_ISO2} from '@site/src/data/iso3-to-iso2';
import {Search, PlaneTakeoff, DoorOpen, CheckCircle, HelpCircle} from 'lucide-react';
import {REQUIREMENT_COLORS, REQUIREMENT_DESCRIPTIONS, REQUIREMENT_LABELS} from './visaColors';
import VisaReqIcon from './VisaReqIcon';
import InfoTooltip from './InfoTooltip';
import styles from './styles.module.css';

interface Props {
  destinations: Record<string, VisaDestination>;
  mode: 'tourism' | 'transit';
  query: string;
  selectedIso3: string | null;
  onRowClick: (iso3: string) => void;
  residenceFilter?: string[];
}

function getEffectiveException(exceptions: VisaException[], residenceFilter: string[]): VisaException | null {
  if (residenceFilter.length === 0) return null;
  return exceptions.find(
    (exc) => exc.residenceCountries?.some((r) => residenceFilter.includes(r)),
  ) ?? null;
}

function VerifiedBadge({verified}: {verified?: boolean}): React.JSX.Element {
  if (verified) {
    return (
      <InfoTooltip content="Excepción verificada con fuente oficial">
        <span className={styles.verifiedBadge}>
          <CheckCircle size={11} strokeWidth={2} /> Verificada
        </span>
      </InfoTooltip>
    );
  }
  return (
    <InfoTooltip content="Sin fuente oficial citada — puede requerir verificación adicional">
      <span className={`${styles.verifiedBadge} ${styles.unverifiedBadge}`}>
        <HelpCircle size={11} strokeWidth={2} /> Sin verificar
      </span>
    </InfoTooltip>
  );
}

function ExceptionRow({exc}: {exc: VisaException; key?: number}): React.JSX.Element {
  return (
    <div className={styles.exception}>
      <span className={styles.exceptionArrow}>→</span>
      <span>
        {exc.condition}: {REQUIREMENT_LABELS[exc.result]}
        <span className={styles.exceptionMeta}>
          <VerifiedBadge verified={exc.verified} />
          {exc.source && (
            <span className={styles.exceptionSource}>
              {exc.sourceUrl
                ? <a href={exc.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.exceptionSourceLink}>{exc.source}</a>
                : exc.source}
            </span>
          )}
        </span>
      </span>
    </div>
  );
}

function ReqBadge({req}: {req: VisaRequirement}): React.JSX.Element {
  return (
    <InfoTooltip content={REQUIREMENT_DESCRIPTIONS[req]}>
      <span
        className={styles.reqBadge}
        style={{
          background: REQUIREMENT_COLORS[req] + '22',
          color: REQUIREMENT_COLORS[req],
          border: `1px solid ${REQUIREMENT_COLORS[req]}44`,
          cursor: 'help',
        }}>
        <VisaReqIcon req={req} /> {REQUIREMENT_LABELS[req]}
      </span>
    </InfoTooltip>
  );
}

export default function VisaResultsTable({
  destinations,
  mode,
  query,
  selectedIso3,
  onRowClick,
  residenceFilter = [],
}: Props): React.JSX.Element {
  const normalize = (s: string) =>
    s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const q = normalize(query.trim());

  const rows = Object.entries(destinations)
    .filter(([iso3]) => {
      if (!q) return true;
      const name = normalize(COUNTRY_NAMES[iso3] ?? iso3);
      return name.includes(q) || iso3.toLowerCase().includes(q);
    })
    .sort(([a], [b]) => {
      const na = COUNTRY_NAMES[a] ?? a;
      const nb = COUNTRY_NAMES[b] ?? b;
      return na.localeCompare(nb, 'es');
    });

  if (rows.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Search size={32} strokeWidth={1.5} style={{opacity: 0.4}} />
        <p>No se encontraron países para &ldquo;{query}&rdquo;</p>
      </div>
    );
  }

  // Mobile card view
  const mobileView = (
    <div className={styles.mobileCards}>
      {rows.map(([iso3, dest]) => {
        const tourism = dest.tourism;
        const transit = dest.transit;
        const tourismExceptions = tourism?.exceptions ?? [];
        const transitExceptions = transit?.exceptions ?? [];
        const hasAnyException = tourismExceptions.length > 0 || transitExceptions.length > 0;
        const effectiveTourismMobile = getEffectiveException(tourismExceptions, residenceFilter);
        const effectiveTransitMobile = getEffectiveException(transitExceptions, residenceFilter);

        return (
          <div
            key={iso3}
            className={`${styles.mobileCard}${selectedIso3 === iso3 ? ` ${styles.highlighted}` : ''}`}
            onClick={() => onRowClick(iso3)}
            id={`visa-row-${iso3}`}>
            <div className={styles.mobileCardHeader}>
              <div className={styles.mobileCardCountry}>
                {ISO3_TO_ISO2[iso3] && (
                  <img
                    src={`https://flagcdn.com/w40/${ISO3_TO_ISO2[iso3]}.png`}
                    alt=""
                    width={22}
                    height={16}
                    style={{borderRadius: 2, objectFit: 'cover', flexShrink: 0}}
                  />
                )}
                <span>{COUNTRY_NAMES[iso3] ?? iso3}</span>
                <span className={styles.mobileCardIso}>{iso3}</span>
              </div>
            </div>
            <div className={styles.mobileCardBadges}>
              {tourism && (
                <div className={styles.mobileCardBadgeGroup}>
                  <span className={styles.mobileCardBadgeLabel}>Turismo</span>
                  {effectiveTourismMobile ? (
                    <div style={{display: 'flex', flexDirection: 'column', gap: 2}}>
                      <span style={{fontSize: 10, color: 'var(--ifm-color-success)', fontWeight: 600, textTransform: 'uppercase'}}>con tu residencia</span>
                      <ReqBadge req={effectiveTourismMobile.result} />
                      <span style={{opacity: 0.45}}><ReqBadge req={tourism.requirement} /></span>
                    </div>
                  ) : (
                    <ReqBadge req={tourism.requirement} />
                  )}
                </div>
              )}
              {transit && (
                <div className={styles.mobileCardBadgeGroup}>
                  <span className={styles.mobileCardBadgeLabel}>Tránsito</span>
                  {effectiveTransitMobile ? (
                    <div style={{display: 'flex', flexDirection: 'column', gap: 2}}>
                      <span style={{fontSize: 10, color: 'var(--ifm-color-success)', fontWeight: 600, textTransform: 'uppercase'}}>con tu residencia</span>
                      <ReqBadge req={effectiveTransitMobile.result} />
                      <span style={{opacity: 0.45}}><ReqBadge req={transit.requirement} /></span>
                    </div>
                  ) : (
                    <div style={{display: 'flex', flexDirection: 'column', gap: 2}}>
                      <ReqBadge req={transit.requirement} />
                      {transit.maxStay && (
                        <span style={{fontSize: 10, color: 'var(--ifm-color-content-secondary)'}}>
                          Máx. {transit.maxStay}
                        </span>
                      )}
                      {transit.notes && (
                        <span style={{fontSize: 10, color: 'var(--ifm-color-content-secondary)'}}>
                          {transit.notes}
                        </span>
                      )}
                      {transit.airsideOnly !== undefined && (
                        <span style={{fontSize: 10, color: 'var(--ifm-color-content-secondary)'}}>
                          {transit.airsideOnly ? 'Solo área internacional' : 'Puede salir del aeropuerto'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            {hasAnyException && (
              <div className={styles.mobileCardExceptions}>
                <div className={styles.mobileCardExceptionsLabel}>Excepciones</div>
                {tourismExceptions.length > 0 && (
                  <div className={styles.exceptionGroup}>
                    <span className={styles.exceptionGroupLabel}>Turismo</span>
                    {tourismExceptions.map((exc, i) => (
                      <div key={i}><ExceptionRow exc={exc} /></div>
                    ))}
                  </div>
                )}
                {transitExceptions.length > 0 && (
                  <div className={styles.exceptionGroup}>
                    <span className={styles.exceptionGroupLabel}>Tránsito</span>
                    {transitExceptions.map((exc, i) => (
                      <div key={i}><ExceptionRow exc={exc} /></div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div style={{width: '100%', display: 'block'}}>
      {mobileView}
      <table className={styles.resultsTable}>
        <thead>
          <tr>
            <th>País destino</th>
            <th>Turismo</th>
            <th>Tránsito</th>
            <th>Excepciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([iso3, dest]) => {
            const tourism = dest.tourism;
            const transit = dest.transit;
            const tourismExceptions = tourism?.exceptions ?? [];
            const transitExceptions = transit?.exceptions ?? [];
            const hasAnyException = tourismExceptions.length > 0 || transitExceptions.length > 0;
            const showLabels = hasAnyException;

            const effectiveTourism = getEffectiveException(tourismExceptions, residenceFilter);
            const effectiveTransit = getEffectiveException(transitExceptions, residenceFilter);

            return (
              <tr
                key={iso3}
                className={selectedIso3 === iso3 ? styles.highlighted : ''}
                onClick={() => onRowClick(iso3)}
                id={`visa-row-${iso3}`}>
                <td>
                  <div className={styles.countryCell}>
                    {ISO3_TO_ISO2[iso3] && (
                      <img
                        src={`https://flagcdn.com/w40/${ISO3_TO_ISO2[iso3]}.png`}
                        alt=""
                        width={20}
                        height={15}
                        style={{borderRadius: 2, objectFit: 'cover', flexShrink: 0}}
                      />
                    )}
                    <span>{COUNTRY_NAMES[iso3] ?? iso3}</span>
                    <span style={{fontSize: 11, color: 'var(--ifm-color-emphasis-500)'}}>
                      {iso3}
                    </span>
                    {dest.reviewed && (
                      <InfoTooltip content="Dato revisado y verificado manualmente">
                        <span className={styles.reviewedDot} />
                      </InfoTooltip>
                    )}
                  </div>
                </td>
                <td>
                  {tourism ? (
                    <div style={{display: 'flex', flexDirection: 'column', gap: 3}}>
                      {effectiveTourism ? (
                        <>
                          <span style={{fontSize: 10, color: 'var(--ifm-color-success)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em'}}>
                            con tu residencia
                          </span>
                          <ReqBadge req={effectiveTourism.result} />
                          <span style={{opacity: 0.45, display: 'flex', flexDirection: 'column', gap: 2}}>
                            <ReqBadge req={tourism.requirement} />
                          </span>
                        </>
                      ) : (
                        <>
                          <ReqBadge req={tourism.requirement} />
                          {tourism.maxStay && (
                            <span style={{fontSize: 11, color: 'var(--ifm-color-content-secondary)'}}>
                              Máx. {tourism.maxStay}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  ) : <span style={{color: 'var(--ifm-color-emphasis-400)'}}>—</span>}
                </td>
                <td>
                  {transit ? (
                    <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
                      {effectiveTransit ? (
                        <>
                          <span style={{fontSize: 10, color: 'var(--ifm-color-success)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em'}}>
                            con tu residencia
                          </span>
                          <ReqBadge req={effectiveTransit.result} />
                          <span style={{opacity: 0.45}}>
                            <ReqBadge req={transit.requirement} />
                          </span>
                        </>
                      ) : (
                        <>
                          <ReqBadge req={transit.requirement} />
                          {transit.maxStay && (
                            <span style={{fontSize: 11, color: 'var(--ifm-color-content-secondary)'}}>
                              Máx. {transit.maxStay}
                            </span>
                          )}
                          {transit.notes && (
                            <span style={{fontSize: 11, color: 'var(--ifm-color-content-secondary)'}}>
                              {transit.notes}
                            </span>
                          )}
                          {transit.airsideOnly !== undefined && (
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: 4,
                              fontSize: 11, color: 'var(--ifm-color-content-secondary)',
                            }}>
                              {transit.airsideOnly
                                ? <><PlaneTakeoff size={11} strokeWidth={2} /> Solo área internacional</>
                                : <><DoorOpen size={11} strokeWidth={2} /> Puede salir del aeropuerto</>}
                              <InfoTooltip content={
                                transit.airsideOnly
                                  ? 'Debes permanecer en el área internacional del aeropuerto. No puedes pasar por migración ni salir del recinto aeroportuario.'
                                  : 'Puedes pasar por migración y salir del aeropuerto durante la escala, sujeto a las condiciones de tu visa.'
                              } />
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <span style={{color: 'var(--ifm-color-emphasis-400)'}}>—</span>
                  )}
                </td>
                <td className={styles.exceptionsCell}>
                  {!hasAnyException ? (
                    <span style={{color: 'var(--ifm-color-emphasis-400)'}}>—</span>
                  ) : (
                    <>
                      {tourismExceptions.length > 0 && (
                        <div className={styles.exceptionGroup}>
                          {showLabels && (
                            <span className={styles.exceptionGroupLabel}>Turismo</span>
                          )}
                          {tourismExceptions.map((exc, i) => (
                            <div key={i}><ExceptionRow exc={exc} /></div>
                          ))}
                        </div>
                      )}
                      {transitExceptions.length > 0 && (
                        <div className={styles.exceptionGroup}>
                          {showLabels && (
                            <span className={styles.exceptionGroupLabel}>Tránsito</span>
                          )}
                          {transitExceptions.map((exc, i) => (
                            <div key={i}><ExceptionRow exc={exc} /></div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
