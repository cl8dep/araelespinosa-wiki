import React, {useState, useEffect, useCallback, useRef} from 'react';
import {useHistory, useLocation} from '@docusaurus/router';
import {AlertTriangle, Loader2, Link, Check, MapIcon, ChevronDown} from 'lucide-react';
import {COUNTRY_NAMES} from '@site/src/data/country-names';
import type {PassportData, PassportListEntry} from '@site/src/types/visa';
import VisaMap from './VisaMap';
import VisaLegend from './VisaLegend';
import VisaResultsTable from './VisaResultsTable';
import PassportSelector from './PassportSelector';
import DestinationFilter from './DestinationFilter';
import ResidenceFilter from './ResidenceFilter';
import styles from './styles.module.css';

interface Props {
  passportList: PassportListEntry[];
}

const DEFAULT_PASSPORT = 'CUB';

function parseParams(search: string): {passport: string; destinations: string[]; residence: string[]} {
  const p = new URLSearchParams(search);
  const passport = p.get('passport')?.toUpperCase() ?? DEFAULT_PASSPORT;
  const destinations = p.get('destinations')
    ?.split(',')
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean) ?? [];
  const residence = p.get('residence')
    ?.split(',')
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean) ?? [];
  return {passport, destinations, residence};
}

export default function VisaObservatory({passportList}: Props): React.JSX.Element {
  const location = useLocation();
  const history = useHistory();

  const {passport: initialPassport, destinations: initialDestinations, residence: initialResidence} = parseParams(location.search);

  const [passportIso3, setPassportIso3] = useState(initialPassport);
  const [passportData, setPassportData] = useState<PassportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [destinationFilter, setDestinationFilter] = useState<string[]>(initialDestinations);
  const [residenceFilter, setResidenceFilter] = useState<string[]>(initialResidence);
  const [selectedIso3, setSelectedIso3] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [mapOpen, setMapOpen] = useState(true);

  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const params = new URLSearchParams();
    if (passportIso3 !== DEFAULT_PASSPORT) params.set('passport', passportIso3);
    if (destinationFilter.length > 0) params.set('destinations', destinationFilter.join(','));
    if (residenceFilter.length > 0) params.set('residence', residenceFilter.join(','));
    const search = params.toString();
    history.replace({search: search ? `?${search}` : ''});
  }, [passportIso3, destinationFilter, residenceFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPassport = useCallback(async (iso3: string) => {
    setLoading(true);
    setError(null);
    setSelectedIso3(null);
    try {
      const res = await fetch(`/data/passports/${iso3}.json`);
      if (!res.ok) throw new Error(`No se encontraron datos para ${iso3}`);
      const data: PassportData = await res.json();
      setPassportData(data);
    } catch (e) {
      setError((e as Error).message);
      setPassportData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPassport(passportIso3);
  }, [passportIso3, loadPassport]);

  const handleCountryClick = (iso3: string) => {
    setSelectedIso3((prev) => (prev === iso3 ? null : iso3));
    setTimeout(() => {
      const row = document.getElementById(`visa-row-${iso3}`);
      row?.scrollIntoView({behavior: 'smooth', block: 'nearest'});
    }, 50);
  };

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const destinations: Record<string, import('@site/src/types/visa').VisaDestination> = passportData?.destinations ?? {};
  const allDestinationKeys = Object.keys(destinations);

  const availableResidences = React.useMemo(() => {
    const set = new Set<string>();
    for (const dest of Object.values(destinations)) {
      for (const exc of dest.tourism?.exceptions ?? []) {
        for (const r of exc.residenceCountries ?? []) set.add(r);
      }
      for (const exc of dest.transit?.exceptions ?? []) {
        for (const r of exc.residenceCountries ?? []) set.add(r);
      }
    }
    return Array.from(set).sort();
  }, [destinations]);

  const visibleDestinations =
    destinationFilter.length === 0
      ? destinations
      : Object.fromEntries(
          Object.entries(destinations).filter(([iso3]) => destinationFilter.includes(iso3)),
        );

  const totalVisible = Object.keys(visibleDestinations).length;

  return (
    <div className={styles.observatory}>
      <div className={styles.controls}>
        <PassportSelector
          passportList={passportList}
          value={passportIso3}
          onChange={(iso3) => {
            setPassportIso3(iso3);
            setDestinationFilter([]);
            setResidenceFilter([]);
          }}
        />

        <ResidenceFilter
          availableResidences={availableResidences}
          selected={residenceFilter}
          onChange={setResidenceFilter}
        />

        <DestinationFilter
          allDestinations={allDestinationKeys}
          selected={destinationFilter}
          onChange={setDestinationFilter}
        />

        <button
          className={styles.copyUrlBtn}
          onClick={handleCopyUrl}
          title="Copiar enlace">
          {copied ? <Check size={14} strokeWidth={2.5} /> : <Link size={14} strokeWidth={2} />}
          <span>{copied ? 'Copiado' : 'Copiar enlace'}</span>
        </button>
      </div>

      {loading && (
        <div className={styles.loading}>
          <Loader2 size={24} strokeWidth={2} style={{animation: 'spin 1s linear infinite', opacity: 0.5}} />
          <span>Cargando datos...</span>
        </div>
      )}
      {error && (
        <div className={styles.emptyState}>
          <AlertTriangle size={32} strokeWidth={1.5} style={{opacity: 0.5}} />
          <p>{error}</p>
        </div>
      )}
      {!loading && !error && passportData && (
        <>
          <div className={styles.metaRow}>
            <span className={styles.metaUpdated}>
              Actualizado: {passportData.updated}
            </span>
            <span className={styles.metaCount}>
              {destinationFilter.length > 0
                ? `${totalVisible} de ${Object.keys(destinations).length} países`
                : `${totalVisible} países`}
            </span>
          </div>

          <div className={styles.mapToggleHeader}>
            <button
              className={styles.mapToggleBtn}
              onClick={() => setMapOpen((o) => !o)}>
              <MapIcon size={14} strokeWidth={2} />
              <span>Mapa</span>
              <ChevronDown
                size={14}
                strokeWidth={2}
                style={{transform: mapOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s'}}
              />
            </button>
          </div>

          {mapOpen && (
            <VisaMap
              destinations={destinations}
              filteredDestinations={destinationFilter.length > 0 ? new Set(destinationFilter) : null}
              mode="tourism"
              passportIso3={passportIso3}
              selectedIso3={selectedIso3}
              onCountryClick={handleCountryClick}
            />
          )}

          <div style={{marginTop: 16, width: '100%', display: 'block'}}>
            <VisaResultsTable
              destinations={visibleDestinations}
              mode="tourism"
              query=""
              selectedIso3={selectedIso3}
              onRowClick={handleCountryClick}
              residenceFilter={residenceFilter}
            />
          </div>

          <VisaLegend destinations={destinations} mode="tourism" />
        </>
      )}
    </div>
  );
}
