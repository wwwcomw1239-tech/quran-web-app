// Fetch additional videos for under-represented categories
import fs from 'node:fs';

const existing = new Set(JSON.parse(fs.readFileSync('scripts/existing-ids.json', 'utf8')));
const prior = JSON.parse(fs.readFileSync('scripts/verified-new.json', 'utf8'));
for (const p of prior) existing.add(p.youtubeId);
console.log(`Excluding ${existing.size} known IDs.`);

const QUERIES = [
  // Tajweed
  { q: 'شرح التجويد أيمن سويد', category: 'أحكام التلاوة والتجويد', scholar: 'د. أيمن سويد' },
  { q: 'أحكام النون الساكنة شرح', category: 'أحكام التلاوة والتجويد', scholar: 'علماء التجويد' },
  { q: 'مخارج الحروف شرح تجويد', category: 'أحكام التلاوة والتجويد', scholar: 'علماء التجويد' },
  { q: 'أحكام المدود شرح', category: 'أحكام التلاوة والتجويد', scholar: 'علماء التجويد' },
  { q: 'تعلم التجويد للمبتدئين درس', category: 'أحكام التلاوة والتجويد', scholar: 'علماء التجويد' },
  // Stories
  { q: 'قصص الأنبياء نبيل العوضي', category: 'قصص القرآن', scholar: 'الشيخ نبيل العوضي' },
  { q: 'قصة يوسف الشعراوي', category: 'قصص القرآن', scholar: 'الشيخ الشعراوي' },
  { q: 'قصة موسى والخضر', category: 'قصص القرآن', scholar: 'علماء' },
  { q: 'قصة أصحاب الكهف ابن عثيمين', category: 'قصص القرآن', scholar: 'الشيخ ابن عثيمين' },
  { q: 'قصص القرآن العريفي', category: 'قصص القرآن', scholar: 'الشيخ محمد العريفي' },
  { q: 'قصة ابراهيم مع النمرود', category: 'قصص القرآن', scholar: 'علماء' },
  // I'jaz
  { q: 'إعجاز علمي زغلول النجار', category: 'إعجاز القرآن', scholar: 'د. زغلول النجار' },
  { q: 'إعجاز بياني السامرائي', category: 'إعجاز القرآن', scholar: 'د. فاضل السامرائي' },
  { q: 'إعجاز القرآن عبد الدائم الكحيل', category: 'إعجاز القرآن', scholar: 'عبد الدائم الكحيل' },
  { q: 'الإعجاز العددي للقرآن', category: 'إعجاز القرآن', scholar: 'علماء' },
  { q: 'إعجاز القرآن الغيبي', category: 'إعجاز القرآن', scholar: 'علماء' },
  // Uloom al-Quran
  { q: 'علوم القرآن مساعد الطيار محاضرة', category: 'علوم القرآن', scholar: 'د. مساعد الطيار' },
  { q: 'أسباب نزول القرآن درس', category: 'علوم القرآن', scholar: 'علماء' },
  { q: 'الناسخ والمنسوخ في القرآن', category: 'علوم القرآن', scholar: 'علماء' },
  { q: 'القراءات العشر شرح', category: 'علوم القرآن', scholar: 'علماء' },
  { q: 'جمع القرآن وتدوينه', category: 'علوم القرآن', scholar: 'علماء' },
  { q: 'فضائل سور القرآن الكريم', category: 'علوم القرآن', scholar: 'علماء' },
];

const UAS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/17.1 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
];
const pickUA = () => UAS[Math.floor(Math.random()*UAS.length)];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchPage(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 20000);
      const res = await fetch(url, {
        signal: ctrl.signal,
        headers: { 'User-Agent': pickUA(), 'Accept-Language': 'ar-EG,ar;q=0.9,en;q=0.8' },
      });
      clearTimeout(tid);
      if (res.ok) return await res.text();
    } catch {}
    await sleep(2000 + i * 2000);
  }
  return null;
}

function extractIds(html) {
  const set = new Set();
  const re = /"videoId":"([A-Za-z0-9_-]{11})"/g;
  let m;
  while ((m = re.exec(html)) !== null) set.add(m[1]);
  return [...set];
}

async function verifyOEmbed(id) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
  try {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': pickUA() } });
    clearTimeout(tid);
    if (res.status === 200) {
      const j = await res.json().catch(() => null);
      if (!j) return null;
      return { ok: true, title: (j.title||'').trim(), author: (j.author_name||'').trim() };
    }
    return null;
  } catch { return null; }
}

async function mapLimit(items, limit, fn) {
  const results = [];
  let i = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (i < items.length) {
      const idx = i++;
      try { results[idx] = await fn(items[idx], idx); } catch { results[idx] = null; }
    }
  });
  await Promise.all(workers);
  return results;
}

async function main() {
  const candidates = new Map();
  for (let i = 0; i < QUERIES.length; i++) {
    const s = QUERIES[i];
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(s.q)}&hl=ar&gl=SA`;
    const html = await fetchPage(url);
    const ids = html ? extractIds(html) : [];
    let added = 0;
    for (const id of ids) {
      if (existing.has(id) || candidates.has(id)) continue;
      candidates.set(id, { category: s.category, scholar: s.scholar, query: s.q });
      added++;
    }
    console.log(`[${i+1}/${QUERIES.length}] "${s.q}": ${ids.length} raw, ${added} new (total: ${candidates.size})`);
    await sleep(ids.length === 0 ? 8000 : 1500);
  }
  const allIds = [...candidates.keys()];
  console.log(`\nVerifying ${allIds.length} candidates...`);
  let done = 0;
  const results = await mapLimit(allIds, 15, async (id) => {
    const r = await verifyOEmbed(id);
    done++;
    if (done % 50 === 0) console.log(`  ${done}/${allIds.length}`);
    if (!r) return null;
    return { youtubeId: id, title: r.title, author: r.author, ...candidates.get(id) };
  });
  const verified = results.filter(Boolean);
  console.log(`\nVerified: ${verified.length}`);

  const out = [...prior, ...verified];
  // dedup by youtubeId
  const seen = new Set();
  const dedup = [];
  for (const v of out) {
    if (seen.has(v.youtubeId)) continue;
    seen.add(v.youtubeId); dedup.push(v);
  }
  fs.writeFileSync('scripts/verified-new.json', JSON.stringify(dedup, null, 2));
  console.log(`Total verified (incl. prior): ${dedup.length}`);
}

main().catch(e => { console.error(e); process.exit(1); });
