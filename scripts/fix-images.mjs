// Re-encode every /public/assets/*.jpg to REAL JPEG bytes.
// Some assets were PNG bytes with a .jpg name, which Vercel (nosniff) refuses
// to decode. This normalises them so the extension matches the content.
import sharp from 'sharp';
import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';

const dir = 'public/assets';
for (const f of readdirSync(dir)) {
  if (!f.toLowerCase().endsWith('.jpg')) continue;
  const p = `${dir}/${f}`;
  const before = statSync(p).size;
  const out = await sharp(readFileSync(p))
    .resize({ width: 1400, withoutEnlargement: true }) // cap width for web perf
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  writeFileSync(p, out);
  console.log(`${f}: ${(before / 1024).toFixed(0)}KB -> ${(out.length / 1024).toFixed(0)}KB`);
}
