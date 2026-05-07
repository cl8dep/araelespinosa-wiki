import React from 'react';
import type {VisaRequirement, VisaDestination} from '@site/src/types/visa';
import {REQUIREMENT_COLORS, REQUIREMENT_LABELS, REQUIREMENT_DESCRIPTIONS} from './visaColors';
import InfoTooltip from './InfoTooltip';
import styles from './styles.module.css';

interface Props {
  destinations: Record<string, VisaDestination>;
  mode: 'tourism' | 'transit';
}

export default function VisaLegend({destinations, mode}: Props): React.JSX.Element {
  const counts: Partial<Record<VisaRequirement, number>> = {};

  for (const dest of Object.values(destinations)) {
    const data = mode === 'transit' ? dest.transit : dest.tourism;
    if (!data) continue;
    const req = data.requirement;
    counts[req] = (counts[req] ?? 0) + 1;
  }

  const order: VisaRequirement[] = ['VF', 'VOA', 'ETA', 'VR', 'TF', 'TV'];
  const items = order.filter((r) => counts[r]);

  return (
    <div className={styles.legendSection}>
      <h4 className={styles.legendTitle}>Guía de requisitos</h4>
      <div className={styles.legendGrid}>
        {order.map((req) => (
          <div key={req} className={styles.legendCard}>
            <div className={styles.legendCardHeader}>
              <span
                className={styles.legendDot}
                style={{background: REQUIREMENT_COLORS[req]}}
              />
              <span className={styles.legendCardLabel}>{REQUIREMENT_LABELS[req]}</span>
              {counts[req] !== undefined && (
                <span className={styles.legendCount}>{counts[req]}</span>
              )}
              <InfoTooltip content={REQUIREMENT_DESCRIPTIONS[req]} />
            </div>
            <p className={styles.legendCardDesc}>{REQUIREMENT_DESCRIPTIONS[req]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
