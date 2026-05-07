import React, {useState} from 'react';
import {Star, MapPin} from 'lucide-react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';
import type {VisaDestination} from '@site/src/types/visa';
import {NUMERIC_TO_ISO3} from '@site/src/data/iso3-to-numeric';
import {COUNTRY_NAMES} from '@site/src/data/country-names';
import {REQUIREMENT_COLORS, REQUIREMENT_LABELS} from './visaColors';
import styles from './styles.module.css';

const GEO_URL =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// [longitude, latitude] centroids for passport origin markers
const COUNTRY_CENTROIDS: Record<string, [number, number]> = {
  CUB: [-79.5, 21.5],
  VEN: [-66.0, 8.0],
  MEX: [-102.5, 23.0],
  COL: [-74.3, 4.5],
  ARG: [-63.6, -38.4],
  BRA: [-51.9, -14.2],
  PER: [-75.0, -9.2],
};

const NO_DATA_COLOR = '#d1d5db';
const HOVER_TINT = 0.8;

function lighten(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * (1 - HOVER_TINT));
  return `rgb(${mix(r)},${mix(g)},${mix(b)})`;
}

interface Props {
  destinations: Record<string, VisaDestination>;
  /** Si no es null, solo estos países se muestran con color; el resto se opaca */
  filteredDestinations: Set<string> | null;
  mode: 'tourism' | 'transit';
  passportIso3: string;
  selectedIso3: string | null;
  onCountryClick: (iso3: string) => void;
}

interface TooltipState {
  iso3: string;
  name: string;
  x: number;
  y: number;
}

export default function VisaMap({
  destinations,
  filteredDestinations,
  mode,
  passportIso3,
  selectedIso3,
  onCountryClick,
}: Props): React.JSX.Element {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  return (
    <div className={styles.mapContainer}>
      {tooltip && (
        <div
          className={styles.tooltip}
          style={{left: tooltip.x + 14, top: tooltip.y - 12}}>
          <strong>{tooltip.name}</strong>
          {(() => {
            const dest = destinations[tooltip.iso3];
            const data = mode === 'transit' ? dest?.transit : dest?.tourism;
            if (!data) return <div className={styles.tooltipRequirement}>Sin datos</div>;
            const hasExceptions = data.exceptions && data.exceptions.length > 0;
            return (
              <>
                <div className={styles.tooltipRequirement}>
                  {REQUIREMENT_LABELS[data.requirement]}
                </div>
                {hasExceptions && (
                  <div className={styles.tooltipExceptions} style={{display:'flex',alignItems:'center',gap:4}}>
                    <Star size={11} fill="currentColor" strokeWidth={0} />
                    {data.exceptions!.length} excepción{data.exceptions!.length > 1 ? 'es' : ''}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}

      <ComposableMap
        projectionConfig={{scale: 140}}
        style={{width: '100%', height: 'auto'}}>
        <ZoomableGroup>
          <Geographies geography={GEO_URL}>
            {({geographies}) =>
              geographies.map((geo) => {
                const numericId = String(geo.id).padStart(3, '0');
                const iso3 = NUMERIC_TO_ISO3[numericId];
                const isPassport = iso3 === passportIso3;
                const dest = iso3 ? destinations[iso3] : undefined;
                const data = mode === 'transit' ? dest?.transit : dest?.tourism;
                const req = data?.requirement;

                const isDimmed =
                  filteredDestinations !== null &&
                  iso3 !== undefined &&
                  !isPassport &&
                  !filteredDestinations.has(iso3);

                let fill = NO_DATA_COLOR;
                if (isPassport) fill = '#94a3b8';
                else if (req) fill = REQUIREMENT_COLORS[req];
                if (isDimmed) fill = '#e5e7eb';

                const isSelected = iso3 === selectedIso3;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isSelected ? lighten(fill) : fill}
                    stroke="#fff"
                    strokeWidth={0.4}
                    style={{
                      default: {outline: 'none'},
                      hover: {
                        fill: iso3 && !isPassport ? lighten(fill) : fill,
                        outline: 'none',
                        cursor: iso3 && !isPassport ? 'pointer' : 'default',
                        stroke: isSelected ? '#334155' : '#fff',
                        strokeWidth: isSelected ? 1.5 : 0.4,
                      },
                      pressed: {outline: 'none'},
                    }}
                    onMouseEnter={(e) => {
                      if (iso3 && !isPassport) {
                        setTooltip({
                          iso3,
                          name: COUNTRY_NAMES[iso3] ?? iso3,
                          x: e.clientX,
                          y: e.clientY,
                        });
                      }
                    }}
                    onMouseMove={(e) => {
                      if (iso3 && !isPassport) {
                        setTooltip((prev) =>
                          prev ? {...prev, x: e.clientX, y: e.clientY} : null,
                        );
                      }
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    onClick={() => {
                      if (iso3 && !isPassport && dest) {
                        onCountryClick(iso3);
                        setTooltip(null);
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
          {COUNTRY_CENTROIDS[passportIso3] && (
            <Marker coordinates={COUNTRY_CENTROIDS[passportIso3]}>
              <MapPin
                size={16}
                strokeWidth={2}
                fill="#1e40af"
                color="#fff"
                style={{transform: 'translate(-8px, -16px)', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))'}}
              />
            </Marker>
          )}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
