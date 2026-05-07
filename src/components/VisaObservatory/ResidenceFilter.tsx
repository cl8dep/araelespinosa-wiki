import React, {useState, useRef, useEffect} from 'react';
import {Search, X, ChevronDown, Check, Home} from 'lucide-react';
import {COUNTRY_NAMES} from '@site/src/data/country-names';
import {getFlagUrl} from '@site/src/data/iso3-to-iso2';
import styles from './destinationFilter.module.css';

const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

interface Props {
  availableResidences: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

function FlagImg({iso3}: {iso3: string}): React.JSX.Element {
  const url = getFlagUrl(iso3);
  if (!url) return <></>;
  return (
    <img
      src={url}
      alt=""
      width={16}
      height={11}
      style={{objectFit: 'cover', borderRadius: 2, flexShrink: 0}}
      loading="lazy"
    />
  );
}

export default function ResidenceFilter({availableResidences, selected, onChange}: Props): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 40);
  }, [open]);

  const filtered = availableResidences.filter((iso3) => {
    const name = (COUNTRY_NAMES[iso3] ?? iso3).toLowerCase();
    const q = normalize(search);
    return normalize(name).includes(q) || iso3.toLowerCase().includes(q);
  });

  const toggle = (iso3: string) => {
    if (selected.includes(iso3)) {
      onChange(selected.filter((s) => s !== iso3));
    } else {
      onChange([...selected, iso3]);
    }
  };

  const removeChip = (e: React.MouseEvent, iso3: string) => {
    e.stopPropagation();
    onChange(selected.filter((s) => s !== iso3));
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const hasSelection = selected.length > 0;

  return (
    <div ref={containerRef} className={styles.wrapper}>
      {/* Trigger */}
      <div
        className={`${styles.trigger} ${open ? styles.triggerOpen : ''}`}
        onClick={() => setOpen((o) => !o)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setOpen((o) => !o)}>

        {!hasSelection && (
          <span className={styles.placeholder}>
            <Home size={14} strokeWidth={2} style={{opacity: 0.45, flexShrink: 0}} />
            Cualquier residencia
          </span>
        )}

        {hasSelection && (
          <div className={styles.chips}>
            {selected.slice(0, 4).map((iso3) => (
              <span key={iso3} className={styles.chip}>
                <FlagImg iso3={iso3} />
                <span className={styles.chipName}>{COUNTRY_NAMES[iso3] ?? iso3}</span>
                <button
                  className={styles.chipRemove}
                  onClick={(e) => removeChip(e, iso3)}
                  tabIndex={-1}
                  aria-label={`Quitar ${iso3}`}>
                  ×
                </button>
              </span>
            ))}
            {selected.length > 4 && (
              <span className={styles.chipMore}>+{selected.length - 4}</span>
            )}
          </div>
        )}

        <div className={styles.actions}>
          {hasSelection && (
            <button className={styles.clearBtn} onClick={clearAll} title="Limpiar selección">
              <X size={13} strokeWidth={2.5} />
            </button>
          )}
          <ChevronDown
            size={15}
            strokeWidth={2}
            className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
          />
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <div className={styles.searchWrapper}>
              <Search size={13} strokeWidth={2} className={styles.searchIcon} />
              <input
                ref={searchRef}
                type="text"
                placeholder="Buscar país..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
                onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
              />
            </div>
            {hasSelection && (
              <button className={styles.clearAllBtn} onClick={(e) => { clearAll(e); setOpen(false); }}>
                Limpiar ({selected.length})
              </button>
            )}
          </div>

          <ul className={styles.list}>
            {filtered.length === 0 && (
              <li className={styles.noResults}>Sin resultados</li>
            )}
            {filtered.map((iso3) => {
              const isSelected = selected.includes(iso3);
              return (
                <li
                  key={iso3}
                  className={`${styles.option} ${isSelected ? styles.optionSelected : ''}`}
                  onClick={() => toggle(iso3)}
                  onMouseDown={(e) => e.preventDefault()}>
                  <span className={`${styles.checkbox} ${isSelected ? styles.checkboxChecked : ''}`}>
                    {isSelected && <Check size={10} strokeWidth={3} />}
                  </span>
                  <FlagImg iso3={iso3} />
                  <span className={styles.optionName}>{COUNTRY_NAMES[iso3] ?? iso3}</span>
                  <span className={styles.optionCode}>{iso3}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
