// Final recheck of batch7 IDs right before deployment
import fs from 'node:fs';

const b7 = fs.readFileSync('src/data/videos-batch7.ts', 'utf8');
const re = /youtubeId: '([A-Za-z0-9_-]{11})'/g;
const ids = [];
let m;
while ((m = re.exec(b7)) !== null) ids.push(m[1]);
console.log(`Rechecking ${ids.length} batch7 IDs...`);

async function verify(id) {
  try {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 8000);
    const [oe, th] = await Promise.all([
      fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`, { signal: ctrl.signal }),
      fetch(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`, { method: 'HEAD', signal: ctrl.signal }),
    ]);
    clearTimeout(tid);
    const oeOk = oe.status === 200;
    const thLen = Number(th.headers.get('content-length') || 0);
    const thOk = th.status === 200 && thLen > 2000;
    return { id, ok: oeOk && thOk, oe: oe.status, th: thLen };
  } catch {
    return { id, ok: false, oe: 0, th: 0 };
  }
}

async function mapLimit(items, n, fn) {
  const r = []; let i = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (i < items.length) { const idx = i++; try { r[idx] = await fn(items[idx], idx); } catch { r[idx] = null; } }
  }));
  return r;
}

const results = await mapLimit(ids, 15, async (id, idx) => {
  const r = await verify(id);
  if (idx % 50 === 0) console.log(`  ${idx}/${ids.length}`);
  return r;
});

const bad = results.filter(r => r && !r.ok);
console.log(`\n✅ OK: ${results.filter(r => r && r.ok).length}/${ids.length}`);
console.log(`❌ Bad: ${bad.length}`);
if (bad.length) {
  fs.writeFileSync('scripts/batch7-bad.json', JSON.stringify(bad, null, 2));
  console.log('Bad IDs:', bad.map(b => b.id).slice(0, 20));
}
