// Double-check unavailable IDs by also testing thumbnail availability
// A video is truly unavailable only if BOTH oembed=404 AND mqdefault.jpg=404
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'unavailable-ids.json'), 'utf8'));
const ids = data.unavailableIds;
console.log(`Verifying ${ids.length} IDs with thumbnail HEAD check...`);

async function checkThumb(id) {
  try {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(`https://img.youtube.com/vi/${id}/mqdefault.jpg`, {
      method: 'HEAD',
      signal: ctrl.signal,
    });
    clearTimeout(tid);
    // YouTube returns 200 for valid videos, 404 for deleted; sometimes fallback "No thumbnail" 120x90 image
    // Check content-length: dead videos usually return 120x90 placeholder (~1161 bytes)
    const cl = res.headers.get('content-length');
    return { id, status: res.status, size: cl ? parseInt(cl, 10) : null };
  } catch (e) {
    return { id, status: null, error: String(e).slice(0, 60) };
  }
}

async function runBatched(items, limit, worker, onProgress) {
  const results = new Array(items.length);
  let idx = 0, done = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (true) {
      const myIdx = idx++;
      if (myIdx >= items.length) return;
      results[myIdx] = await worker(items[myIdx]);
      done++;
      if (onProgress && done % 50 === 0) onProgress(done, items.length);
    }
  });
  await Promise.all(workers);
  return results;
}

const t0 = Date.now();
const results = await runBatched(ids, 40, checkThumb, (d, t) => {
  process.stdout.write(`\r  ${d}/${t} (${((Date.now()-t0)/1000).toFixed(1)}s)`);
});
process.stdout.write('\n');

// truly deleted = 404 OR (200 AND tiny placeholder size <2000 bytes indicating the default unavailable thumbnail)
const trulyDead = results.filter(r => r.status === 404 || (r.status === 200 && r.size !== null && r.size < 2500));
const suspiciouslyAlive = results.filter(r => r.status === 200 && (r.size === null || r.size >= 2500));
const errors = results.filter(r => r.status === null);

console.log(`  Truly dead (404 or tiny thumb): ${trulyDead.length}`);
console.log(`  Possibly alive (200 + normal thumb): ${suspiciouslyAlive.length}`);
console.log(`  Network errors: ${errors.length}`);

// Sample suspicious ones
if (suspiciouslyAlive.length > 0) {
  console.log('  Sample suspicious IDs (have thumbs but oembed failed):');
  suspiciouslyAlive.slice(0, 10).forEach(r => console.log(`    ${r.id} size=${r.size}`));
}

const outPath = path.join(__dirname, 'verified-unavailable.json');
fs.writeFileSync(outPath, JSON.stringify({
  generatedAt: new Date().toISOString(),
  trulyDeadIds: trulyDead.map(r => r.id),
  possiblyAliveIds: suspiciouslyAlive.map(r => r.id),
  errorIds: errors.map(r => r.id),
}, null, 2));
console.log(`Wrote ${outPath}`);
