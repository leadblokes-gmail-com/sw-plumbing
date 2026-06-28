/* ============================================================
 *  Higgsfield AI → S & W Plumbing image generator
 *  Generates on-brand imagery via the Higgsfield API, optimises
 *  each result to WebP, and drops it in public/images/ ready to
 *  wire into the site.
 *
 *  Usage:
 *    1. Put your key in .env →  HIGGSFIELD_API_KEY=hf_xxx
 *    2. npm run gen:images
 *
 *  NOTE: endpoint/params below follow Higgsfield's public API
 *  shape (Bearer auth, POST /v1/generations, poll by id). If your
 *  dashboard docs differ slightly, tweak API_BASE / buildBody().
 *  The script logs the raw API response so mismatches are obvious.
 * ============================================================ */
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT_DIR = resolve(ROOT, 'public/images');

// --- load .env (simple parser, no dependency) ---
function loadEnv() {
  const p = resolve(ROOT, '.env');
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
loadEnv();

const API_KEY = process.env.HIGGSFIELD_API_KEY;
const API_BASE = process.env.HIGGSFIELD_API_BASE || 'https://api.higgsfield.ai';
const MODEL = process.env.HIGGSFIELD_MODEL || 'soul'; // photoreal model; "flux" also common

if (!API_KEY) {
  console.error('\n✗ HIGGSFIELD_API_KEY is not set. Add it to .env (see .env.example).\n');
  process.exit(1);
}

// --- the brand image set: prompt + output file + target crop ---
const NEG = 'no text, no watermark, no logo, no people faces, not cartoon, not 3d render';
const JOBS = [
  {
    file: 'hero-work.webp',
    w: 1600,
    h: 1067,
    prompt:
      "Cinematic close-up of a professional plumber's hands tightening a chrome pipe fitting under a sink, dramatic low-key lighting, shallow depth of field, dark moody background, subtle cool rim light, photorealistic editorial commercial photography, 35mm",
  },
  {
    file: 'van.webp',
    w: 1600,
    h: 1067,
    prompt:
      'A clean white tradesman work van parked on a leafy Australian bayside street at golden hour, professional, photorealistic, cinematic, shallow depth of field',
  },
  {
    file: 'tools.webp',
    w: 1600,
    h: 1067,
    prompt:
      'Top-down flat lay of professional plumbing tools, pipe wrench, brass fittings, copper pipe on a dark slate surface, dramatic side lighting, premium product photography, minimal, subtle green accent light',
  },
  {
    file: 'job-hotwater.webp',
    w: 1200,
    h: 900,
    prompt:
      'Photorealistic close-up of a new stainless steel hot water system installed in a tidy residential garage, clean professional plumbing, soft natural light, commercial photography',
  },
];

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
};

const buildBody = (job) => ({
  task: 'text-to-image',
  model: MODEL,
  prompt: job.prompt,
  negative_prompt: NEG,
  width: job.w,
  height: job.h,
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function generate(job) {
  console.log(`\n▸ ${job.file} — submitting…`);
  const res = await fetch(`${API_BASE}/v1/generations`, {
    method: 'POST',
    headers,
    body: JSON.stringify(buildBody(job)),
  });
  const created = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error(`  ✗ submit failed (${res.status}):`, JSON.stringify(created).slice(0, 300));
    return false;
  }
  const id = created.id || created.generation_id || created.data?.id;
  if (!id) {
    console.error('  ✗ no generation id in response:', JSON.stringify(created).slice(0, 300));
    return false;
  }

  // poll
  let url;
  for (let i = 0; i < 60; i++) {
    await sleep(3000);
    const s = await fetch(`${API_BASE}/v1/generations/${id}`, { headers });
    const j = await s.json().catch(() => ({}));
    const status = j.status || j.state;
    if (status === 'completed' || status === 'succeeded') {
      url =
        j.output?.url || j.output_url || j.result?.url || (Array.isArray(j.output) ? j.output[0]?.url : undefined);
      break;
    }
    if (status === 'failed' || status === 'error') {
      console.error('  ✗ generation failed:', JSON.stringify(j).slice(0, 300));
      return false;
    }
    process.stdout.write('.');
  }
  if (!url) {
    console.error('\n  ✗ timed out / no output URL.');
    return false;
  }

  // download + optimise
  const img = Buffer.from(await (await fetch(url)).arrayBuffer());
  mkdirSync(OUT_DIR, { recursive: true });
  const out = resolve(OUT_DIR, job.file);
  const info = await sharp(img)
    .resize(job.w, job.h, { fit: 'cover' })
    .modulate({ brightness: 0.95, saturation: 0.8 })
    .webp({ quality: 76 })
    .toFile(out);
  console.log(`\n  ✓ saved public/images/${job.file} (${Math.round(info.size / 1024)} KB)`);
  return true;
}

const ok = [];
for (const job of JOBS) {
  try {
    if (await generate(job)) ok.push(job.file);
  } catch (e) {
    console.error(`  ✗ ${job.file}:`, e.message);
  }
}
console.log(`\nDone. Generated ${ok.length}/${JOBS.length}: ${ok.join(', ') || '(none)'}`);
console.log('Next: tell me to wire these into the site.\n');
