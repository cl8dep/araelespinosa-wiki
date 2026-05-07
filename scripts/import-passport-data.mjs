#!/usr/bin/env node
/**
 * Descarga el dataset passport-index-tidy-iso3.csv y genera:
 *   - static/data/passports/{ISO3}.json  (uno por país de origen)
 *   - src/data/passport-list.json         (lista de pasaportes disponibles)
 *
 * Si ya existe un archivo para un pasaporte, preserva las excepciones manuales.
 * Uso: node scripts/import-passport-data.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PASSPORTS_DIR = join(ROOT, 'static', 'data', 'passports');
const PASSPORT_LIST_FILE = join(ROOT, 'src', 'data', 'passport-list.json');

const CSV_URL =
  'https://raw.githubusercontent.com/imorte/passport-index-data/main/passport-index-tidy-iso3.csv';

/** Convierte el valor del CSV al código interno */
function mapRequirement(raw) {
  const v = raw.trim().toLowerCase();
  if (!v || v === '-1') return null; // mismo país
  if (v === 'visa free') return 'VF';
  if (v === 'visa on arrival') return 'VOA';
  if (v === 'e-visa') return 'ETA';
  if (v === 'eta') return 'ETA';
  if (v === 'visa required') return 'VR';
  if (v === 'no admission') return 'VR'; // tratado como visa requerida
  // Número de días (ej: "90") → visa free con límite de días
  if (/^\d+$/.test(v)) return 'VF';
  // Fallback
  return 'VR';
}

async function main() {
  console.log('⬇️  Descargando dataset...');
  const res = await fetch(CSV_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  const csv = await res.text();

  console.log('📊 Procesando CSV...');
  const lines = csv.trim().split('\n');
  const header = lines[0].toLowerCase();
  if (!header.includes('passport')) {
    throw new Error('Formato inesperado del CSV: ' + header);
  }

  // Agrupa por país de origen
  const byPassport = {};
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    if (parts.length < 3) continue;
    const [passport, destination, requirement] = parts;
    const p = passport.trim().toUpperCase();
    const d = destination.trim().toUpperCase();
    const req = mapRequirement(requirement);
    if (!req) continue; // mismo país
    if (!byPassport[p]) byPassport[p] = {};
    byPassport[p][d] = req;
  }

  mkdirSync(PASSPORTS_DIR, { recursive: true });
  mkdirSync(dirname(PASSPORT_LIST_FILE), { recursive: true });

  const today = new Date().toISOString().slice(0, 10);
  const passportCodes = Object.keys(byPassport).sort();
  let created = 0;
  let updated = 0;
  const warnings = [];

  for (const iso3 of passportCodes) {
    const filePath = join(PASSPORTS_DIR, `${iso3}.json`);
    const newDestinations = byPassport[iso3];

    let existing = null;
    if (existsSync(filePath)) {
      try {
        existing = JSON.parse(readFileSync(filePath, 'utf8'));
      } catch {
        // archivo corrupto, sobreescribir
      }
    }

    // Construir el objeto destinations
    const destinations = {};
    for (const dest of Object.keys(newDestinations).sort()) {
      const req = newDestinations[dest];
      const existingDest = existing?.destinations?.[dest];
      const existingTourism = existingDest?.tourism ?? {};

      // Alerta si el requirement base cambió y el destino tiene excepciones curadas
      const prevReq = existingTourism.requirement;
      if (prevReq && prevReq !== req && existingTourism.exceptions?.length > 0) {
        warnings.push(
          `  ⚠️  ${iso3} → ${dest}: requirement cambió ${prevReq} → ${req} (tiene ${existingTourism.exceptions.length} excepción/es de turismo)`
        );
      }
      // Alerta similar para transit si tiene excepciones
      if (existingDest?.transit?.exceptions?.length > 0 && prevReq && prevReq !== req) {
        warnings.push(
          `  ⚠️  ${iso3} → ${dest}: requirement cambió ${prevReq} → ${req} (tiene ${existingDest.transit.exceptions.length} excepción/es de tránsito)`
        );
      }

      // Solo actualiza `requirement` desde el CSV; preserva todo lo demás curado
      const tourism = {
        requirement: req,
      };
      if (existingTourism.exceptions)        tourism.exceptions        = existingTourism.exceptions;
      if (existingTourism.maxStay)           tourism.maxStay           = existingTourism.maxStay;
      if (existingTourism.notes)             tourism.notes             = existingTourism.notes;

      destinations[dest] = { tourism };

      // Preservar campos curados a nivel de destino
      if (existingDest?.transit)             destinations[dest].transit   = existingDest.transit;
      if (existingDest?.reviewed != null)    destinations[dest].reviewed  = existingDest.reviewed;
      if (existingDest?.notes)               destinations[dest].notes     = existingDest.notes;
    }

    // Preservar destinos con excepciones manuales que no estén en el dataset
    if (existing?.destinations) {
      for (const [dest, data] of Object.entries(existing.destinations)) {
        if (!destinations[dest] && (data.tourism?.exceptions || data.transit)) {
          destinations[dest] = data;
        }
      }
    }

    const output = {
      passport: iso3,
      updated: today,
      destinations,
    };

    writeFileSync(filePath, JSON.stringify(output, null, 2), 'utf8');
    if (existing) updated++;
    else created++;
  }

  // Generar passport-list.json
  const passportList = passportCodes.map((iso3) => ({ iso3 }));
  writeFileSync(PASSPORT_LIST_FILE, JSON.stringify(passportList, null, 2), 'utf8');

  console.log(`✅ ${created} archivos creados, ${updated} actualizados`);
  console.log(`📋 passport-list.json generado con ${passportList.length} países`);
  console.log(`📁 Archivos en: ${PASSPORTS_DIR}`);

  if (warnings.length > 0) {
    console.warn(`\n⚠️  ${warnings.length} destino(s) con excepciones curadas cuyo requirement base cambió — revisar manualmente:\n`);
    warnings.forEach((w) => console.warn(w));
    console.warn('\nEstos destinos se actualizaron igual, pero sus excepciones pueden haber quedado desactualizadas.');
  }
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
