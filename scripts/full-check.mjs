// Full availability check across all data files
import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = 'src/data';
const files = fs.readdirSync(DATA_DIR).filter(f => /^(videos|shorts|kids)/.test(f) && f.endsWith('.ts'));
const idSet = new Set();
const idToFile = new Map();
for (const f of files) {
  const c = fs.readFileSync(path.join(DATA_DIR, f), 'utf8');
  const re = /youtubeId\s*:\s*['"]([A-Za-z0-9_-]{11})['"]/g;
  let m;
  while ((m = re.exec(c)) !== null) {
    if (!idSet.has(m[1])) {
      idSet.add(m[1]);
      idToFile.set(m[1], f);
    }
  }
}
const ids = [...idSet];
console.log(`Checking ${ids.length} unique IDs across ${files.length} files...`);

async function check(id) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
  try {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': 'Mozilla/5.0 (checker)' } });
    clearTimeout(tid);
    return res.status === 200 ? 'ok' : `bad_${res.status}`;
  } catch { return 'error'; }
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
const results = await mapLimit(ids, 30, async (id) => {
  const status = await check(id);
  done++;
  if (done % 100 === 0) process.stdout.write(`\r  ${done}/${ids.length} (${((Date.now()-t0)/1000).toFixed(1)}s)`);
  return { id, status };
});
process.stdout.write('\n');
const bad = results.filter(r => r.status !== 'ok');
console.log(`Available: ${results.length - bad.length} / ${results.length}`);
if (bad.length > 0) {
  const byFile = {};
  for (const b of bad) {
    const f = idToFile.get(b.id) || '(unknown)';
    byFile[f] = (byFile[f] || []);
    byFile[f].push(b.id);
  }
  console.log('Unavailable breakdown:');
  for (const [f, arr] of Object.entries(byFile)) {
    console.log(`  ${f}: ${arr.length}`);
  }
  fs.writeFileSync('scripts/full-check-unavailable.json', JSON.stringify({ ids: bad.map(b => b.id), byFile }, null, 2));
  console.log('Wrote scripts/full-check-unavailable.json');
}
