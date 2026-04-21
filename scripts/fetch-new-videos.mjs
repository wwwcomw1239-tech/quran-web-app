// =========================================================
// Fetch and verify 300+ new Islamic/Quran videos from YouTube
// =========================================================
// Improvements v2:
//   - User-Agent rotation
//   - Delay between search requests (anti rate-limit)
//   - Incremental save (resumable)
//   - Retry with backoff when search returns empty
// =========================================================

import fs from 'node:fs';

const existing = new Set(JSON.parse(fs.readFileSync('scripts/existing-ids.json', 'utf8')));
console.log(`Loaded ${existing.size} existing IDs to exclude.`);

// Rich pool of search queries, each with target category
const SEARCH_QUERIES = [
  // === تفسير القرآن ===
  { q: 'تفسير ابن عثيمين', category: 'تفسير القرآن', scholar: 'الشيخ ابن عثيمين' },
  { q: 'تفسير ابن عثيمين سورة البقرة', category: 'تفسير القرآن', scholar: 'الشيخ ابن عثيمين' },
  { q: 'تفسير ابن عثيمين جزء عم', category: 'تفسير القرآن', scholar: 'الشيخ ابن عثيمين' },
  { q: 'تفسير الشعراوي كامل', category: 'تفسير القرآن', scholar: 'الشيخ الشعراوي' },
  { q: 'تفسير الشعراوي سورة البقرة', category: 'تفسير القرآن', scholar: 'الشيخ الشعراوي' },
  { q: 'تفسير الشعراوي سورة الكهف', category: 'تفسير القرآن', scholar: 'الشيخ الشعراوي' },
  { q: 'تفسير الشعراوي سورة يس', category: 'تفسير القرآن', scholar: 'الشيخ الشعراوي' },
  { q: 'تفسير الشعراوي سورة يوسف', category: 'تفسير القرآن', scholar: 'الشيخ الشعراوي' },
  { q: 'خواطر الشعراوي القرآن', category: 'تفسير القرآن', scholar: 'الشيخ الشعراوي' },
  { q: 'تفسير صالح الفوزان', category: 'تفسير القرآن', scholar: 'الشيخ صالح الفوزان' },
  { q: 'تفسير ابن باز', category: 'تفسير القرآن', scholar: 'الشيخ ابن باز' },
  { q: 'تفسير سعد الشثري', category: 'تفسير القرآن', scholar: 'الشيخ سعد الشثري' },
  { q: 'تفسير مساعد الطيار', category: 'تفسير القرآن', scholar: 'د. مساعد الطيار' },
  { q: 'تفسير عبد الرزاق البدر', category: 'تفسير القرآن', scholar: 'الشيخ عبدالرزاق البدر' },
  { q: 'تفسير سورة الفاتحة شرح', category: 'تفسير القرآن', scholar: 'علماء التفسير' },
  { q: 'تفسير سورة آل عمران', category: 'تفسير القرآن', scholar: 'علماء التفسير' },
  { q: 'تفسير سورة النور', category: 'تفسير القرآن', scholar: 'علماء التفسير' },
  { q: 'تفسير سورة الرحمن', category: 'تفسير القرآن', scholar: 'علماء التفسير' },
  { q: 'تفسير سورة الملك', category: 'تفسير القرآن', scholar: 'علماء التفسير' },
  { q: 'تفسير السعدي', category: 'تفسير القرآن', scholar: 'الشيخ السعدي' },

  // === تدبر وتأملات ===
  { q: 'تدبر القرآن الكريم', category: 'تدبر وتأملات', scholar: 'علماء' },
  { q: 'تدبر عبد الرزاق البدر', category: 'تدبر وتأملات', scholar: 'الشيخ عبدالرزاق البدر' },
  { q: 'تأملات في سور القرآن', category: 'تدبر وتأملات', scholar: 'علماء' },
  { q: 'تدبرات قرآنية عائض القرني', category: 'تدبر وتأملات', scholar: 'الشيخ عائض القرني' },
  { q: 'خواطر إيمانية قرآنية', category: 'تدبر وتأملات', scholar: 'علماء' },
  { q: 'الشيخ خالد الجبير تدبر القرآن', category: 'تدبر وتأملات', scholar: 'الشيخ خالد الجبير' },
  { q: 'تدبر سورة الكهف', category: 'تدبر وتأملات', scholar: 'علماء' },
  { q: 'تدبر سورة الفاتحة', category: 'تدبر وتأملات', scholar: 'علماء' },
  { q: 'وقفات مع آيات القرآن', category: 'تدبر وتأملات', scholar: 'علماء' },
  { q: 'محمد راتب النابلسي تدبر', category: 'تدبر وتأملات', scholar: 'د. محمد راتب النابلسي' },
  { q: 'دروس الحرم تدبر القرآن', category: 'تدبر وتأملات', scholar: 'علماء الحرم' },

  // === أحكام التلاوة والتجويد ===
  { q: 'تجويد أيمن سويد شرح', category: 'أحكام التلاوة والتجويد', scholar: 'د. أيمن سويد' },
  { q: 'تعلم التجويد للمبتدئين', category: 'أحكام التلاوة والتجويد', scholar: 'علماء التجويد' },
  { q: 'أحكام النون الساكنة والتنوين', category: 'أحكام التلاوة والتجويد', scholar: 'علماء التجويد' },
  { q: 'أحكام الميم الساكنة', category: 'أحكام التلاوة والتجويد', scholar: 'علماء التجويد' },
  { q: 'أحكام المدود في التجويد', category: 'أحكام التلاوة والتجويد', scholar: 'علماء التجويد' },
  { q: 'مخارج الحروف تعليم', category: 'أحكام التلاوة والتجويد', scholar: 'علماء التجويد' },
  { q: 'صفات الحروف التجويد', category: 'أحكام التلاوة والتجويد', scholar: 'علماء التجويد' },
  { q: 'الوقف والابتداء في القرآن', category: 'أحكام التلاوة والتجويد', scholar: 'علماء التجويد' },

  // === علوم القرآن ===
  { q: 'علوم القرآن مساعد الطيار', category: 'علوم القرآن', scholar: 'د. مساعد الطيار' },
  { q: 'علوم القرآن عبد الكريم الخضير', category: 'علوم القرآن', scholar: 'الشيخ عبدالكريم الخضير' },
  { q: 'أسباب نزول القرآن', category: 'علوم القرآن', scholar: 'علماء' },
  { q: 'المحكم والمتشابه في القرآن', category: 'علوم القرآن', scholar: 'علماء' },
  { q: 'الناسخ والمنسوخ', category: 'علوم القرآن', scholar: 'علماء' },
  { q: 'جمع القرآن الكريم', category: 'علوم القرآن', scholar: 'علماء' },
  { q: 'القراءات القرآنية', category: 'علوم القرآن', scholar: 'علماء' },
  { q: 'فضائل القرآن الكريم', category: 'علوم القرآن', scholar: 'علماء' },
  { q: 'إعجاز البياني القرآن محاضرة', category: 'علوم القرآن', scholar: 'علماء' },

  // === قصص القرآن ===
  { q: 'قصص الأنبياء نبيل العوضي', category: 'قصص القرآن', scholar: 'الشيخ نبيل العوضي' },
  { q: 'قصص القرآن محمد العريفي', category: 'قصص القرآن', scholar: 'الشيخ محمد العريفي' },
  { q: 'قصة سيدنا يوسف القرآن', category: 'قصص القرآن', scholar: 'علماء' },
  { q: 'قصة سيدنا موسى مع الخضر', category: 'قصص القرآن', scholar: 'علماء' },
  { q: 'قصة أصحاب الكهف القرآن', category: 'قصص القرآن', scholar: 'علماء' },
  { q: 'قصة سيدنا إبراهيم والنار', category: 'قصص القرآن', scholar: 'علماء' },
  { q: 'قصة سيدنا نوح والطوفان', category: 'قصص القرآن', scholar: 'علماء' },
  { q: 'قصة سيدنا سليمان في القرآن', category: 'قصص القرآن', scholar: 'علماء' },
  { q: 'قصة ذو القرنين', category: 'قصص القرآن', scholar: 'علماء' },
  { q: 'قصة أصحاب الأخدود', category: 'قصص القرآن', scholar: 'علماء' },
  { q: 'قصة قارون في القرآن', category: 'قصص القرآن', scholar: 'علماء' },
  { q: 'قصة سيدنا محمد من القرآن', category: 'قصص القرآن', scholar: 'علماء' },
  { q: 'قصص القرآن للأطفال', category: 'قصص القرآن', scholar: 'علماء' },

  // === إعجاز القرآن ===
  { q: 'إعجاز القرآن العلمي', category: 'إعجاز القرآن', scholar: 'علماء' },
  { q: 'الإعجاز البياني في القرآن', category: 'إعجاز القرآن', scholar: 'علماء' },
  { q: 'عبد الدائم الكحيل إعجاز', category: 'إعجاز القرآن', scholar: 'عبد الدائم الكحيل' },
  { q: 'زغلول النجار إعجاز علمي', category: 'إعجاز القرآن', scholar: 'د. زغلول النجار' },
  { q: 'الإعجاز العددي في القرآن', category: 'إعجاز القرآن', scholar: 'علماء' },
  { q: 'الإعجاز الغيبي في القرآن', category: 'إعجاز القرآن', scholar: 'علماء' },
  { q: 'الإعجاز التشريعي في القرآن', category: 'إعجاز القرآن', scholar: 'علماء' },
  { q: 'إعجاز قرآني في خلق الإنسان', category: 'إعجاز القرآن', scholar: 'علماء' },
  { q: 'إعجاز قرآني في الفلك', category: 'إعجاز القرآن', scholar: 'علماء' },
  { q: 'إعجاز قرآني البحار', category: 'إعجاز القرآن', scholar: 'علماء' },
];

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
];

function pickUA() { return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]; }
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchPage(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 20000);
      const res = await fetch(url, {
        signal: ctrl.signal,
        headers: {
          'User-Agent': pickUA(),
          'Accept-Language': 'ar-EG,ar;q=0.9,en;q=0.8',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Cache-Control': 'no-cache',
        },
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

async function searchYoutube(q) {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}&hl=ar&gl=SA`;
  const html = await fetchPage(url);
  if (!html) return [];
  return extractIds(html);
}

async function verifyOEmbed(id) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
  try {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': pickUA() },
    });
    clearTimeout(tid);
    if (res.status === 200) {
      const j = await res.json().catch(() => null);
      if (!j) return { ok: false };
      return { ok: true, title: (j.title || '').trim(), author: (j.author_name || '').trim() };
    }
    return { ok: false };
  } catch {
    return { ok: false };
  }
}

async function verifyThumb(id) {
  const url = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  try {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(url, { method: 'HEAD', signal: ctrl.signal });
    clearTimeout(tid);
    const len = Number(res.headers.get('content-length') || 0);
    return res.status === 200 && len > 2000;
  } catch {
    return false;
  }
}

async function verifyVideo(id) {
  const [oe, th] = await Promise.all([verifyOEmbed(id), verifyThumb(id)]);
  return { id, available: oe.ok && th, title: oe.title || '', author: oe.author || '' };
}

async function mapLimit(items, limit, fn) {
  const results = [];
  let i = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (i < items.length) {
      const idx = i++;
      try { results[idx] = await fn(items[idx], idx); }
      catch { results[idx] = null; }
    }
  });
  await Promise.all(workers);
  return results;
}

// ===== MAIN =====
async function main() {
  console.log('\n=== Phase 1: Collecting candidates from searches ===');
  const candidates = new Map();

  // Load prior candidates if present (resume)
  if (fs.existsSync('scripts/candidates.json')) {
    try {
      const prior = JSON.parse(fs.readFileSync('scripts/candidates.json', 'utf8'));
      for (const p of prior) {
        if (!existing.has(p.id)) candidates.set(p.id, { category: p.category, scholar: p.scholar, query: p.query });
      }
      console.log(`  Resumed with ${candidates.size} prior candidates.`);
    } catch {}
  }

  let zeroStreak = 0;
  for (let i = 0; i < SEARCH_QUERIES.length; i++) {
    const s = SEARCH_QUERIES[i];
    const ids = await searchYoutube(s.q);
    let added = 0;
    for (const id of ids) {
      if (existing.has(id)) continue;
      if (!candidates.has(id)) {
        candidates.set(id, { category: s.category, scholar: s.scholar, query: s.q });
        added++;
      }
    }
    console.log(`  [${i+1}/${SEARCH_QUERIES.length}] "${s.q}": ${ids.length} raw, ${added} new (total: ${candidates.size})`);

    // Save incrementally every 5 queries
    if ((i + 1) % 5 === 0) {
      fs.writeFileSync('scripts/candidates.json',
        JSON.stringify([...candidates.entries()].map(([id, v]) => ({ id, ...v })), null, 2));
    }

    // Rate limiting handling: if we hit zero, wait longer & increment streak
    if (ids.length === 0) {
      zeroStreak++;
      const wait = Math.min(30000, 5000 + zeroStreak * 5000);
      console.log(`    ⚠️  zero result, backing off ${wait/1000}s (streak=${zeroStreak})`);
      await sleep(wait);
      // after 5 zeros, break
      if (zeroStreak >= 5 && candidates.size >= 400) {
        console.log('  ⏭️  Enough candidates and too many zero responses — skipping remaining searches.');
        break;
      }
    } else {
      zeroStreak = 0;
      await sleep(1800); // polite delay ~1.8s between successful searches
    }

    // Early exit if we already have 700+ candidates
    if (candidates.size >= 700) {
      console.log('  ✅ Reached 700 candidates — stopping search phase.');
      break;
    }
  }

  // Final save
  fs.writeFileSync('scripts/candidates.json',
    JSON.stringify([...candidates.entries()].map(([id, v]) => ({ id, ...v })), null, 2));
  console.log(`\n  Total unique candidates: ${candidates.size}`);

  // ===== Phase 2: Verify =====
  const allIds = [...candidates.keys()];
  const toVerify = allIds.slice(0, 800);
  console.log(`\n=== Phase 2: Verifying ${toVerify.length} candidates (concurrency=15) ===`);

  let done = 0;
  const results = await mapLimit(toVerify, 15, async (id) => {
    const r = await verifyVideo(id);
    done++;
    if (done % 50 === 0) console.log(`  ${done}/${toVerify.length}`);
    return r;
  });

  const verified = results.filter(r => r && r.available);
  console.log(`\n  Available: ${verified.length}/${toVerify.length}`);

  // Enrich
  const enriched = verified.map(r => {
    const c = candidates.get(r.id);
    return {
      youtubeId: r.id,
      title: r.title,
      author: r.author,
      category: c.category,
      scholar: c.scholar,
      query: c.query,
    };
  });

  // Dedupe by title+author
  const seen = new Set();
  const deduped = [];
  for (const v of enriched) {
    const k = (v.title + '||' + v.author).toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    deduped.push(v);
  }
  const clean = deduped.filter(v => v.title && v.title.length > 5);
  fs.writeFileSync('scripts/verified-new.json', JSON.stringify(clean, null, 2));
  console.log(`\n✅ Wrote ${clean.length} verified entries to scripts/verified-new.json`);

  const byCat = {};
  for (const v of clean) byCat[v.category] = (byCat[v.category] || 0) + 1;
  console.log('\n  Distribution by category:');
  for (const [k, v] of Object.entries(byCat)) console.log(`    ${k}: ${v}`);
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
