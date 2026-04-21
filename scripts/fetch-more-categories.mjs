// Fetch additional videos focusing on under-represented categories
import fs from 'node:fs';

const existing = new Set(JSON.parse(fs.readFileSync('scripts/existing-ids.json', 'utf8')));
const priorVerified = JSON.parse(fs.readFileSync('scripts/verified-new.json', 'utf8'));
const priorIds = new Set(priorVerified.map(v => v.youtubeId));
console.log(`Existing: ${existing.size}, prior verified: ${priorIds.size}`);

const QUERIES = [
  // تدبر وتأملات
  { q: 'تدبر عبد الرزاق البدر', category: 'تدبر وتأملات', scholar: 'الشيخ عبدالرزاق البدر' },
  { q: 'تدبر القرآن عائض القرني', category: 'تدبر وتأملات', scholar: 'الشيخ عائض القرني' },
  { q: 'تدبر خالد الجبير', category: 'تدبر وتأملات', scholar: 'الشيخ خالد الجبير' },
  { q: 'وقفات قرآنية مؤثرة', category: 'تدبر وتأملات', scholar: 'علماء' },
  { q: 'تدبر سورة الكهف', category: 'تدبر وتأملات', scholar: 'علماء' },
  { q: 'تدبر سورة يس', category: 'تدبر وتأملات', scholar: 'علماء' },
  { q: 'تدبر سورة الفاتحة', category: 'تدبر وتأملات', scholar: 'علماء' },
  { q: 'تدبر آيات قصيرة', category: 'تدبر وتأملات', scholar: 'علماء' },
  { q: 'محمد راتب النابلسي قرآن', category: 'تدبر وتأملات', scholar: 'د. محمد راتب النابلسي' },
  { q: 'أحمد السيد تدبر القرآن', category: 'تدبر وتأملات', scholar: 'الشيخ أحمد السيد' },

  // قصص القرآن
  { q: 'قصص الأنبياء نبيل العوضي', category: 'قصص القرآن', scholar: 'الشيخ نبيل العوضي' },
  { q: 'قصة يوسف في القرآن', category: 'قصص القرآن', scholar: 'علماء' },
  { q: 'قصة موسى في القرآن', category: 'قصص القرآن', scholar: 'علماء' },
  { q: 'قصة نوح في القرآن', category: 'قصص القرآن', scholar: 'علماء' },
  { q: 'قصة إبراهيم في القرآن', category: 'قصص القرآن', scholar: 'علماء' },
  { q: 'قصة سليمان في القرآن', category: 'قصص القرآن', scholar: 'علماء' },
  { q: 'قصة أصحاب الكهف', category: 'قصص القرآن', scholar: 'علماء' },
  { q: 'قصة ذو القرنين', category: 'قصص القرآن', scholar: 'علماء' },
  { q: 'قصة أصحاب الأخدود', category: 'قصص القرآن', scholar: 'علماء' },
  { q: 'قصص القرآن محمد العريفي', category: 'قصص القرآن', scholar: 'الشيخ محمد العريفي' },

  // إعجاز القرآن
  { q: 'إعجاز علمي القرآن', category: 'إعجاز القرآن', scholar: 'علماء' },
  { q: 'الإعجاز البياني القرآن', category: 'إعجاز القرآن', scholar: 'علماء' },
  { q: 'زغلول النجار إعجاز علمي', category: 'إعجاز القرآن', scholar: 'د. زغلول النجار' },
  { q: 'عبد الدائم الكحيل إعجاز', category: 'إعجاز القرآن', scholar: 'عبد الدائم الكحيل' },
  { q: 'إعجاز القرآن الغيبي', category: 'إعجاز القرآن', scholar: 'علماء' },
  { q: 'إعجاز القرآن التشريعي', category: 'إعجاز القرآن', scholar: 'علماء' },
  { q: 'إعجاز القرآن العددي', category: 'إعجاز القرآن', scholar: 'علماء' },
  { q: 'فاضل السامرائي إعجاز', category: 'إعجاز القرآن', scholar: 'د. فاضل السامرائي' },

  // علوم القرآن
  { q: 'علوم القرآن الخضير', category: 'علوم القرآن', scholar: 'الشيخ عبدالكريم الخضير' },
  { q: 'أسباب نزول الآيات', category: 'علوم القرآن', scholar: 'علماء' },
  { q: 'المكي والمدني', category: 'علوم القرآن', scholar: 'علماء' },
  { q: 'جمع القرآن الكريم', category: 'علوم القرآن', scholar: 'علماء' },
  { q: 'القراءات السبع', category: 'علوم القرآن', scholar: 'علماء' },
  { q: 'فاضل السامرائي لمسات بيانية', category: 'علوم القرآن', scholar: 'د. فاضل السامرائي' },
  { q: 'محاضرات علوم القرآن', category: 'علوم القرآن', scholar: 'علماء' },

  // أحكام التلاوة والتجويد
  { q: 'أيمن سويد تجويد', category: 'أحكام التلاوة والتجويد', scholar: 'د. أيمن سويد' },
  { q: 'أحكام التجويد للمبتدئين', category: 'أحكام التلاوة والتجويد', scholar: 'علماء التجويد' },
  { q: 'النون الساكنة والتنوين', category: 'أحكام التلاوة والتجويد', scholar: 'علماء التجويد' },
  { q: 'أحكام الميم الساكنة', category: 'أحكام التلاوة والتجويد', scholar: 'علماء التجويد' },
  { q: 'المدود في التجويد', category: 'أحكام التلاوة والتجويد', scholar: 'علماء التجويد' },
  { q: 'الإدغام والإخفاء', category: 'أحكام التلاوة والتجويد', scholar: 'علماء التجويد' },
];

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
];
const pickUA = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchPage(url) {
  for (let i = 0; i < 3; i++) {
    try {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 20000);
      const res = await fetch(url, {
        signal: ctrl.signal,
        headers: {
          'User-Agent': pickUA(),
          'Accept-Language': 'ar-EG,ar;q=0.9,en;q=0.8',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });
      clearTimeout(tid);
      if (res.ok) return await res.text();
    } catch {}
    await sleep(2000 + i * 3000);
  }
  return null;
}
function extractIds(html) {
  const s = new Set();
  for (const m of html.matchAll(/"videoId":"([A-Za-z0-9_-]{11})"/g)) s.add(m[1]);
  return [...s];
}
async function searchYoutube(q) {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}&hl=ar&gl=SA`;
  const html = await fetchPage(url);
  if (!html) return [];
  return extractIds(html);
}
async function verifyOEmbed(id) {
  try {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`,
      { signal: ctrl.signal, headers: { 'User-Agent': pickUA() } });
    clearTimeout(tid);
    if (res.status === 200) {
      const j = await res.json().catch(() => null);
      return j ? { ok: true, title: (j.title || '').trim(), author: (j.author_name || '').trim() } : { ok: false };
    }
    return { ok: false };
  } catch { return { ok: false }; }
}
async function verifyThumb(id) {
  try {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`, { method: 'HEAD', signal: ctrl.signal });
    clearTimeout(tid);
    return res.status === 200 && Number(res.headers.get('content-length') || 0) > 2000;
  } catch { return false; }
}
async function verifyVideo(id) {
  const [oe, th] = await Promise.all([verifyOEmbed(id), verifyThumb(id)]);
  return { id, available: oe.ok && th, title: oe.title || '', author: oe.author || '' };
}
async function mapLimit(items, limit, fn) {
  const r = []; let i = 0;
  await Promise.all(Array.from({ length: limit }, async () => {
    while (i < items.length) { const idx = i++; try { r[idx] = await fn(items[idx], idx); } catch { r[idx] = null; } }
  }));
  return r;
}

// ===== MAIN =====
async function main() {
  const candidates = new Map();
  let zeroStreak = 0;

  for (let i = 0; i < QUERIES.length; i++) {
    const s = QUERIES[i];
    const ids = await searchYoutube(s.q);
    let added = 0;
    for (const id of ids) {
      if (existing.has(id) || priorIds.has(id)) continue;
      if (!candidates.has(id)) {
        candidates.set(id, { category: s.category, scholar: s.scholar, query: s.q });
        added++;
      }
    }
    console.log(`  [${i+1}/${QUERIES.length}] "${s.q}": ${ids.length} raw, ${added} new (total: ${candidates.size})`);
    if (ids.length === 0) {
      zeroStreak++;
      await sleep(Math.min(30000, 5000 + zeroStreak * 5000));
      if (zeroStreak >= 6 && candidates.size >= 150) break;
    } else {
      zeroStreak = 0;
      await sleep(1800);
    }
  }

  console.log(`\nTotal new candidates: ${candidates.size}`);
  const ids = [...candidates.keys()];
  console.log(`Verifying ${ids.length}...`);
  let done = 0;
  const results = await mapLimit(ids, 15, async (id) => {
    const r = await verifyVideo(id);
    done++;
    if (done % 30 === 0) console.log(`  ${done}/${ids.length}`);
    return r;
  });
  const verified = results.filter(r => r && r.available);
  console.log(`Verified: ${verified.length}/${ids.length}`);

  const enriched = verified.map(r => {
    const c = candidates.get(r.id);
    return { youtubeId: r.id, title: r.title, author: r.author, category: c.category, scholar: c.scholar, query: c.query };
  });
  const seen = new Set();
  const clean = [];
  for (const v of enriched) {
    const k = (v.title + '||' + v.author).toLowerCase();
    if (seen.has(k) || !v.title || v.title.length < 5) continue;
    seen.add(k);
    clean.push(v);
  }

  // Merge with prior
  const all = [...priorVerified];
  const seenAll = new Set(all.map(v => v.youtubeId));
  for (const v of clean) if (!seenAll.has(v.youtubeId)) { all.push(v); seenAll.add(v.youtubeId); }

  fs.writeFileSync('scripts/verified-new.json', JSON.stringify(all, null, 2));
  console.log(`\n✅ Total combined verified: ${all.length}`);

  const byCat = {};
  for (const v of all) byCat[v.category] = (byCat[v.category] || 0) + 1;
  console.log('\nDistribution:');
  for (const [k, v] of Object.entries(byCat)) console.log(`  ${k}: ${v}`);
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
