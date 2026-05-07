import React, {useState, useRef, useEffect, useCallback} from 'react';
import {Search, ChevronDown} from 'lucide-react';
import type {PassportListEntry} from '@site/src/types/visa';
import {COUNTRY_NAMES} from '@site/src/data/country-names';
import {getFlagUrl} from '@site/src/data/iso3-to-iso2';
import selectorStyles from './passportSelector.module.css';

const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

interface Props {
  passportList: PassportListEntry[];
  value: string;
  onChange: (iso3: string) => void;
}

function FlagImg({iso3, size = 20}: {iso3: string; size?: number}): React.JSX.Element {
  const url = getFlagUrl(iso3);
  if (!url) return <span style={{width: size, display: 'inline-block'}} />;
  return (
    <img
      src={url}
      alt={iso3}
      width={size}
      height={Math.round(size * 0.67)}
      style={{
        objectFit: 'cover',
        borderRadius: 2,
        flexShrink: 0,
        display: 'block',
      }}
      loading="lazy"
    />
  );
}

export default function PassportSelector({passportList, value, onChange}: Props): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = passportList.filter(({iso3}) => {
    const name = (COUNTRY_NAMES[iso3] ?? iso3).toLowerCase();
    const q = search.toLowerCase();
    return normalize(name).includes(normalize(search)) || iso3.toLowerCase().includes(search.toLowerCase());
  });

  // Cierra al hacer click fuera
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

  // Foco en el buscador al abrir
  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50);
      // Scroll al elemento seleccionado
      setTimeout(() => {
        const el = listRef.current?.querySelector('[data-selected="true"]') as HTMLElement;
        el?.scrollIntoView({block: 'nearest'});
      }, 60);
    }
  }, [open]);

  // Cerrar con Escape
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
      setSearch('');
    }
  }, []);

  const handleSelect = (iso3: string) => {
    onChange(iso3);
    setOpen(false);
    setSearch('');
  };

  const selectedName = COUNTRY_NAMES[value] ?? value;

  return (
    <div
      ref={containerRef}
      className={selectorStyles.wrapper}
      onKeyDown={handleKeyDown}>
      <label className={selectorStyles.label}>Pasaporte</label>

      {/* Trigger */}
      <button
        type="button"
        className={selectorStyles.trigger}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}>
        <FlagImg iso3={value} size={22} />
        <span className={selectorStyles.triggerName}>{selectedName}</span>
        <ChevronDown
          size={15}
          strokeWidth={2}
          className={`${selectorStyles.chevron} ${open ? selectorStyles.chevronOpen : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className={selectorStyles.dropdown}>
          <div className={selectorStyles.searchWrapper}>
            <Search size={13} strokeWidth={2} className={selectorStyles.searchIcon} />
            <input
              ref={searchRef}
              type="text"
              placeholder="Buscar país..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={selectorStyles.searchInput}
            />
          </div>

          <ul ref={listRef} className={selectorStyles.list} role="listbox">
            {filtered.length === 0 && (
              <li className={selectorStyles.noResults}>Sin resultados</li>
            )}
            {filtered.map(({iso3}) => (
              <li
                key={iso3}
                role="option"
                aria-selected={iso3 === value}
                data-selected={iso3 === value}
                className={`${selectorStyles.option} ${iso3 === value ? selectorStyles.optionSelected : ''}`}
                onClick={() => handleSelect(iso3)}
                onMouseDown={(e) => e.preventDefault()}>
                <FlagImg iso3={iso3} size={20} />
                <span className={selectorStyles.optionName}>
                  {COUNTRY_NAMES[iso3] ?? iso3}
                </span>
                <span className={selectorStyles.optionCode}>{iso3}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
