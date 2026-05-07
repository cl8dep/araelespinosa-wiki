#!/usr/bin/env node
/**
 * Valida que todos los archivos en static/data/passports/*.json
 * cumplan el esquema esperado. Sale con código 1 si hay errores.
 *
 * Uso: node scripts/validate-passport-data.mjs
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PASSPORTS_DIR = join(__dirname, '..', 'static', 'data', 'passports');

const VALID_REQUIREMENTS = new Set(['VF', 'VR', 'VOA', 'ETA', 'TF', 'TV']);

let errors = 0;

function err(file, msg) {
  console.error(`❌ ${file}: ${msg}`);
  errors++;
}

function validateException(exc, context, file) {
  if (typeof exc.condition !== 'string' || !exc.condition.trim())
    err(file, `${context}.condition debe ser string no vacío`);
  if (!VALID_REQUIREMENTS.has(exc.result))
    err(file, `${context}.result inválido: "${exc.result}" (válidos: ${[...VALID_REQUIREMENTS].join(', ')})`);
  if (exc.source !== null && typeof exc.source !== 'string')
    err(file, `${context}.source debe ser string o null`);
  if (exc.sourceUrl != null && typeof exc.sourceUrl !== 'string')
    err(file, `${context}.sourceUrl debe ser string o undefined`);
  if (exc.verified != null && typeof exc.verified !== 'boolean')
    err(file, `${context}.verified debe ser boolean o undefined`);
}

function validateTourism(t, context, file) {
  if (!VALID_REQUIREMENTS.has(t.requirement))
    err(file, `${context}.requirement inválido: "${t.requirement}"`);
  if (t.maxStay != null && typeof t.maxStay !== 'string')
    err(file, `${context}.maxStay debe ser string`);
  if (t.exceptions != null) {
    if (!Array.isArray(t.exceptions))
      err(file, `${context}.exceptions debe ser array`);
    else
      t.exceptions.forEach((exc, i) => validateException(exc, `${context}.exceptions[${i}]`, file));
  }
}

function validateTransit(t, context, file) {
  if (!VALID_REQUIREMENTS.has(t.requirement))
    err(file, `${context}.requirement inválido: "${t.requirement}"`);
  if (t.airsideOnly != null && typeof t.airsideOnly !== 'boolean')
    err(file, `${context}.airsideOnly debe ser boolean`);
  if (t.landsideRequirement != null && !VALID_REQUIREMENTS.has(t.landsideRequirement))
    err(file, `${context}.landsideRequirement inválido: "${t.landsideRequirement}"`);
  if (t.maxStay != null && typeof t.maxStay !== 'string')
    err(file, `${context}.maxStay debe ser string`);
  if (t.exceptions != null) {
    if (!Array.isArray(t.exceptions))
      err(file, `${context}.exceptions debe ser array`);
    else
      t.exceptions.forEach((exc, i) => validateException(exc, `${context}.exceptions[${i}]`, file));
  }
}

const files = readdirSync(PASSPORTS_DIR).filter((f) => f.endsWith('.json'));
console.log(`🔍 Validando ${files.length} archivos en ${PASSPORTS_DIR}...`);

for (const filename of files) {
  const filePath = join(PASSPORTS_DIR, filename);
  let data;
  try {
    data = JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (e) {
    err(filename, `JSON inválido: ${e.message}`);
    continue;
  }

  if (typeof data.passport !== 'string')
    err(filename, 'campo "passport" debe ser string');
  if (typeof data.updated !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.updated))
    err(filename, 'campo "updated" debe tener formato YYYY-MM-DD');
  if (typeof data.destinations !== 'object' || data.destinations == null)
    err(filename, 'campo "destinations" debe ser objeto');

  for (const [iso3, dest] of Object.entries(data.destinations ?? {})) {
    const ctx = `destinations.${iso3}`;
    if (!dest.tourism)
      err(filename, `${ctx}: falta campo "tourism"`);
    else
      validateTourism(dest.tourism, `${ctx}.tourism`, filename);
    if (dest.transit)
      validateTransit(dest.transit, `${ctx}.transit`, filename);
    if (dest.reviewed != null && typeof dest.reviewed !== 'boolean')
      err(filename, `${ctx}.reviewed debe ser boolean`);
  }
}

if (errors === 0) {
  console.log(`✅ Todos los archivos son válidos`);
  process.exit(0);
} else {
  console.error(`\n💥 ${errors} error${errors > 1 ? 'es' : ''} encontrado${errors > 1 ? 's' : ''}`);
  process.exit(1);
}
