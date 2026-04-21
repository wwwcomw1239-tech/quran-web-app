// Verify each ID in batch8 via oEmbed
import fs from 'node:fs';

const c = fs.readFileSync('src/data/videos-batch8.ts', 'utf8');
const ids = [...c.matchAll(/youtubeId:\s*'([A-Za-z0-9_-]{11})'/g)].map(m => m[1]);
console.log(`Found ${ids.length} IDs in batch8. Verifying...`);

async function check(id) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
  try {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': 'Mozilla/5.0' } });
    clearTimeout(tid);
    return res.status === 200;
  } catch { return false; }
}

async function mapLimit(items, limit, fn) {
  const results = [];
  let i = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx]);
    }
  });
  await Promise.all(workers);
  return results;
}

const t0 = Date.now();
let done = 0;
const results = await mapLimit(ids, 15, async (id) => {
  const ok = await check(id);
  done++;
  if (done % 20 === 0) process.stdout.write(`\r  ${done}/${ids.length} (${((Date.now()-t0)/1000).toFixed(1)}s)`);
  return { id, ok };
});
process.stdout.write('\n');
const bad = results.filter(r => !r.ok);
console.log(`Available: ${results.length - bad.length} / ${results.length}`);
if (bad.length > 0) {
  console.log('Unavailable IDs:');
  bad.forEach(b => console.log('  ' + b.id));
  fs.writeFileSync('scripts/batch8-unavailable.json', JSON.stringify(bad.map(b => b.id)));
}
