#!/usr/bin/env node
// Sync design-systems/* from the upstream `getdesign` npm package.
//
// Usage:
//   1) curl -sL $(npm view getdesign dist.tarball) -o /tmp/getdesign.tgz
//      tar -xzf /tmp/getdesign.tgz -C /tmp
//   2) node scripts/sync-design-systems.mjs [/tmp/package/templates]
//
// The script re-creates each brand's design-systems/<slug>/DESIGN.md with a
// YAML frontmatter block carrying:
//   - category        (broad bucket, e.g. "Developer Tools")
//   - description     (one-liner from the upstream manifest)
//   - tags            (searchable facets, derived from category +
//                      per-system overrides)
//   - era             (modern | classic | retro | timeless)
//   - mood            (energetic | minimal | playful | luxurious | …)
//   - primary_color   (hex, when known — fed back as a hint to the agent)
//
// Hand-authored systems (default, warm-editorial) are not touched.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = process.argv[2] || '/tmp/package/templates';

const CATEGORY = {
  // AI & LLM
  claude: 'AI & LLM', cohere: 'AI & LLM', elevenlabs: 'AI & LLM',
  minimax: 'AI & LLM', 'mistral.ai': 'AI & LLM', ollama: 'AI & LLM',
  'opencode.ai': 'AI & LLM', replicate: 'AI & LLM', runwayml: 'AI & LLM',
  'together.ai': 'AI & LLM', voltagent: 'AI & LLM', 'x.ai': 'AI & LLM',
  // Developer Tools
  cursor: 'Developer Tools', expo: 'Developer Tools', lovable: 'Developer Tools',
  raycast: 'Developer Tools', superhuman: 'Developer Tools',
  vercel: 'Developer Tools', warp: 'Developer Tools',
  // Backend & Data
  clickhouse: 'Backend & Data', composio: 'Backend & Data',
  hashicorp: 'Backend & Data', mongodb: 'Backend & Data',
  posthog: 'Backend & Data', sanity: 'Backend & Data',
  sentry: 'Backend & Data', supabase: 'Backend & Data',
  // Productivity & SaaS
  cal: 'Productivity & SaaS', intercom: 'Productivity & SaaS',
  'linear.app': 'Productivity & SaaS', mintlify: 'Productivity & SaaS',
  notion: 'Productivity & SaaS', resend: 'Productivity & SaaS',
  zapier: 'Productivity & SaaS',
  // Design & Creative
  airtable: 'Design & Creative', clay: 'Design & Creative',
  figma: 'Design & Creative', framer: 'Design & Creative',
  miro: 'Design & Creative', webflow: 'Design & Creative',
  // Fintech & Crypto
  binance: 'Fintech & Crypto', coinbase: 'Fintech & Crypto',
  kraken: 'Fintech & Crypto', mastercard: 'Fintech & Crypto',
  revolut: 'Fintech & Crypto', stripe: 'Fintech & Crypto', wise: 'Fintech & Crypto',
  // E-Commerce & Retail
  airbnb: 'E-Commerce & Retail', meta: 'E-Commerce & Retail',
  nike: 'E-Commerce & Retail', shopify: 'E-Commerce & Retail',
  starbucks: 'E-Commerce & Retail',
  // Media & Consumer
  apple: 'Media & Consumer', ibm: 'Media & Consumer',
  nvidia: 'Media & Consumer', pinterest: 'Media & Consumer',
  playstation: 'Media & Consumer', spacex: 'Media & Consumer',
  spotify: 'Media & Consumer', theverge: 'Media & Consumer',
  uber: 'Media & Consumer', vodafone: 'Media & Consumer', wired: 'Media & Consumer',
  // Automotive
  bmw: 'Automotive', bugatti: 'Automotive', ferrari: 'Automotive',
  lamborghini: 'Automotive', renault: 'Automotive', tesla: 'Automotive',
};

// Default tag/era/mood derived from category. Picker filters use these
// when a per-system override hasn't been authored yet.
const CATEGORY_DEFAULTS = {
  'AI & LLM':              { tags: ['ai', 'tech', 'modern'],         era: 'modern', mood: 'minimal' },
  'Developer Tools':       { tags: ['developer', 'tech', 'modern'],  era: 'modern', mood: 'utilitarian' },
  'Backend & Data':        { tags: ['data', 'tech', 'enterprise'],   era: 'modern', mood: 'utilitarian' },
  'Productivity & SaaS':   { tags: ['saas', 'b2b', 'modern'],        era: 'modern', mood: 'minimal' },
  'Design & Creative':     { tags: ['creative', 'design', 'modern'], era: 'modern', mood: 'playful' },
  'Fintech & Crypto':      { tags: ['fintech', 'finance', 'modern'], era: 'modern', mood: 'confident' },
  'E-Commerce & Retail':   { tags: ['retail', 'consumer', 'modern'], era: 'modern', mood: 'warm' },
  'Media & Consumer':      { tags: ['consumer', 'lifestyle'],        era: 'modern', mood: 'energetic' },
  'Automotive':            { tags: ['automotive', 'luxury'],         era: 'modern', mood: 'luxurious' },
};

// Per-system overrides. Only systems with strong, opinionated identity get
// hand-curated metadata; others inherit from CATEGORY_DEFAULTS. Adding a
// row here is the primary way to expose a system in tag/mood filters.
const SYSTEM_OVERRIDES = {
  'linear.app':  { tags: ['saas', 'b2b', 'minimal', 'dark', 'futuristic'], mood: 'minimal',     primary_color: '#5e6ad2' },
  stripe:        { tags: ['fintech', 'developer', 'gradient', 'modern'],   mood: 'confident',   primary_color: '#635bff' },
  vercel:        { tags: ['developer', 'minimal', 'monochrome', 'dark'],   mood: 'minimal',     primary_color: '#000000' },
  apple:         { tags: ['consumer', 'minimal', 'premium', 'monochrome'], mood: 'minimal',     primary_color: '#000000' },
  notion:        { tags: ['saas', 'productivity', 'editorial', 'warm'],    mood: 'warm',        primary_color: '#000000' },
  airbnb:        { tags: ['consumer', 'travel', 'warm', 'rounded'],        mood: 'warm',        primary_color: '#ff385c' },
  spotify:       { tags: ['music', 'consumer', 'energetic', 'dark'],       mood: 'energetic',   primary_color: '#1db954' },
  tesla:         { tags: ['automotive', 'minimal', 'futuristic', 'dark'],  mood: 'minimal',     primary_color: '#cc0000' },
  ferrari:       { tags: ['automotive', 'luxury', 'sport', 'red'],         mood: 'luxurious',   primary_color: '#ff2800' },
  wired:         { tags: ['editorial', 'tech', 'bold', 'magazine'],        mood: 'bold',        primary_color: '#000000' },
  theverge:      { tags: ['editorial', 'tech', 'magazine', 'gradient'],    mood: 'energetic',   primary_color: '#5200ff' },
  pinterest:     { tags: ['consumer', 'social', 'visual', 'red'],          mood: 'playful',     primary_color: '#e60023' },
  figma:         { tags: ['design', 'creative', 'colorful', 'playful'],    mood: 'playful',     primary_color: '#a259ff' },
  framer:        { tags: ['design', 'creative', 'modern', 'gradient'],     mood: 'playful',     primary_color: '#0099ff' },
  raycast:       { tags: ['developer', 'productivity', 'dark', 'cli'],     mood: 'confident',   primary_color: '#ff6363' },
  warp:          { tags: ['developer', 'cli', 'dark', 'futuristic'],       mood: 'confident',   primary_color: '#01a4ff' },
  claude:        { tags: ['ai', 'editorial', 'warm', 'serif'],             mood: 'warm',        primary_color: '#cc785c' },
  'mistral.ai':  { tags: ['ai', 'minimal', 'editorial'],                   mood: 'minimal',     primary_color: '#ff7000' },
  cohere:        { tags: ['ai', 'modern', 'colorful', 'gradient'],         mood: 'energetic',   primary_color: '#39594d' },
  elevenlabs:    { tags: ['ai', 'audio', 'minimal'],                       mood: 'minimal',     primary_color: '#000000' },
  starbucks:     { tags: ['retail', 'cafe', 'warm', 'green'],              mood: 'warm',        primary_color: '#006241' },
  nike:          { tags: ['sport', 'consumer', 'bold', 'monochrome'],      mood: 'bold',        primary_color: '#000000' },
  coinbase:      { tags: ['fintech', 'crypto', 'modern', 'blue'],          mood: 'confident',   primary_color: '#0052ff' },
  binance:       { tags: ['fintech', 'crypto', 'dark', 'gold'],            mood: 'energetic',   primary_color: '#fcd535' },
  bmw:           { tags: ['automotive', 'luxury', 'precise', 'blue'],      mood: 'confident',   primary_color: '#1c69d4' },
  lamborghini:   { tags: ['automotive', 'luxury', 'sport', 'gold'],        mood: 'luxurious',   primary_color: '#000000' },
  bugatti:       { tags: ['automotive', 'luxury', 'editorial', 'blue'],    mood: 'luxurious',   primary_color: '#022840' },
  playstation:   { tags: ['gaming', 'consumer', 'futuristic', 'blue'],     mood: 'energetic',   primary_color: '#003791' },
  spacex:        { tags: ['aerospace', 'minimal', 'dark', 'futuristic'],   mood: 'minimal',     primary_color: '#000000' },
  shopify:       { tags: ['retail', 'commerce', 'green', 'modern'],        mood: 'warm',        primary_color: '#96bf48' },
  supabase:      { tags: ['developer', 'data', 'green', 'dark'],           mood: 'utilitarian', primary_color: '#3ecf8e' },
  posthog:       { tags: ['developer', 'analytics', 'playful', 'orange'],  mood: 'playful',     primary_color: '#f54e00' },
};

const slugOf = (b) => b.replace(/\./g, '-');

// Quote a YAML scalar value when it contains characters that the loader's
// minimal subset would otherwise mis-coerce (commas inside flow arrays,
// leading hash, etc.). Strings with embedded double-quotes get JSON-escaped.
function yamlScalar(value) {
  const s = String(value);
  if (s === '') return '""';
  if (/^[\w@./+:-]+$/.test(s) && !/^(true|false|null|~|-?\d+(\.\d+)?)$/i.test(s)) {
    return s;
  }
  return JSON.stringify(s);
}

function yamlBlock(map) {
  const lines = [];
  for (const [k, v] of Object.entries(map)) {
    if (v === undefined || v === null || v === '') continue;
    if (Array.isArray(v)) {
      if (v.length === 0) continue;
      lines.push(`${k}:`);
      for (const item of v) lines.push(`  - ${yamlScalar(item)}`);
    } else {
      lines.push(`${k}: ${yamlScalar(v)}`);
    }
  }
  return lines.join('\n');
}

function metadataFor(brand, description) {
  const cat = CATEGORY[brand];
  const baseDefaults = CATEGORY_DEFAULTS[cat] ?? {
    tags: [], era: 'modern', mood: 'modern',
  };
  const override = SYSTEM_OVERRIDES[brand] ?? {};
  // Merge tags: override list wins when present, falling back to category
  // defaults. We dedupe + lowercase to keep the picker filters tidy.
  const tagSource = override.tags ?? baseDefaults.tags;
  const tags = [...new Set(tagSource.map((t) => t.toLowerCase()))];
  return {
    category: cat,
    description,
    tags,
    era: override.era ?? baseDefaults.era,
    mood: override.mood ?? baseDefaults.mood,
    primary_color: override.primary_color,
  };
}

function main() {
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(path.join(SRC, 'manifest.json'), 'utf8'));
  } catch (err) {
    console.error(`Could not read manifest.json under ${SRC}: ${err.message}`);
    console.error('Did you extract the getdesign tarball? See scripts/sync-design-systems.mjs header.');
    process.exit(1);
  }

  const written = [];
  const skipped = [];

  for (const entry of manifest) {
    const { brand, file, description } = entry;
    const cat = CATEGORY[brand];
    if (!cat) { skipped.push(`${brand} (unmapped category)`); continue; }
    const slug = slugOf(brand);
    let raw;
    try {
      raw = readFileSync(path.join(SRC, file), 'utf8');
    } catch (err) {
      skipped.push(`${brand} (${err.message})`);
      continue;
    }
    const lines = raw.split(/\r?\n/);
    const h1 = lines.findIndex((l) => /^#\s+/.test(l));
    if (h1 < 0) { skipped.push(`${brand} (no H1)`); continue; }
    const head = lines.slice(0, h1 + 1);
    const tail = lines.slice(h1 + 1);
    while (tail[0] === '') tail.shift();

    const fmBlock = yamlBlock(metadataFor(brand, description));
    const body = [
      '---',
      fmBlock,
      '---',
      '',
      ...head,
      '',
      ...tail,
    ].join('\n');

    const dir = path.join(ROOT, 'design-systems', slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(path.join(dir, 'DESIGN.md'), body);
    written.push(slug);
  }

  console.log(`wrote ${written.length} design systems → design-systems/`);
  if (skipped.length) {
    console.log('skipped:');
    for (const s of skipped) console.log(`  - ${s}`);
  }
}

main();
