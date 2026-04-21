// ========================================================
// Collect new videos from trusted Sunni scholar channels
// ========================================================
// Strategy:
//   1. For each trusted source (channel upload list or playlist),
//      fetch HTML and extract video IDs (+ titles)
//   2. Filter against existing IDs (avoid dupes)
//   3. Verify via oEmbed (available + embeddable)
//   4. Filter by title-based blocklist (music / Shia / women-presenting)
//   5. Output candidates to scripts/new-videos-candidates.json
// ========================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '..', 'src', 'data');

// Collect all existing IDs from the codebase (to avoid duplicates)
function collectExistingIds() {
  const ids = new Set();
  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.ts'));
  for (const f of files) {
    const c = fs.readFileSync(path.join(DATA_DIR, f), 'utf8');
    const re = /youtubeId\s*:\s*['"]([A-Za-z0-9_-]{6,20})['"]/g;
    let m;
    while ((m = re.exec(c)) !== null) ids.add(m[1]);
  }
  return ids;
}

// Trusted playlists / channels (Sunni mainstream, audio-focus)
// Each source:
//   { url: "<playlist or channel /videos URL>", scholar: "<Arabic name>", category: "<tag>" }
// URLs below point to playlists/channels of recognized Sunni scholars
// where content is mainly audio lectures (no female presenters, no music).
const SOURCES = [
  // Ibn Uthaymeen — official: many playlists
  { url: 'https://www.youtube.com/@Dr_Othman_Alkamees/videos', scholar: 'د. عثمان الخميس', category: 'تفسير القرآن' },
  { url: 'https://www.youtube.com/@dr-othman-alkamees/videos', scholar: 'د. عثمان الخميس', category: 'تفسير القرآن' },

  // Shaykh Ibn Baz official
  { url: 'https://www.youtube.com/@binbazofficial/videos', scholar: 'الشيخ ابن باز', category: 'تفسير القرآن' },
  { url: 'https://www.youtube.com/@BinBazOfficial/videos', scholar: 'الشيخ ابن باز', category: 'تفسير القرآن' },

  // Shaykh Al-Fawzan  
  { url: 'https://www.youtube.com/@alfawzan_channel/videos', scholar: 'الشيخ صالح الفوزان', category: 'تفسير القرآن' },

  // Shaykh Abdul-Razzaq al-Badr
  { url: 'https://www.youtube.com/@Al-Badr_Abd/videos', scholar: 'الشيخ عبد الرزاق البدر', category: 'تدبر وتأملات' },

  // Shaykh Al-Khudayr
  { url: 'https://www.youtube.com/@alkhudheirnet/videos', scholar: 'الشيخ عبد الكريم الخضير', category: 'علوم القرآن' },

  // Shaykh al-Rahili
  { url: 'https://www.youtube.com/@AlRaheliOfficial/videos', scholar: 'الشيخ سليمان الرحيلي', category: 'تدبر وتأملات' },

  // Shaykh Mustafa Al-Adawi
  { url: 'https://www.youtube.com/@MustafaAlAdawy/videos', scholar: 'الشيخ مصطفى العدوي', category: 'تفسير القرآن' },

  // Shaykh Saleh Al-Maghamsi
  { url: 'https://www.youtube.com/@almaghamsi_official/videos', scholar: 'الشيخ صالح المغامسي', category: 'تدبر وتأملات' },

  // Shaykh Abdulmohsin Al-Abbad
  { url: 'https://www.youtube.com/@abdalmuhsen_abbad/videos', scholar: 'الشيخ عبد المحسن العباد', category: 'علوم القرآن' },

  // Shaykh Al-Shinqeety
  { url: 'https://www.youtube.com/@shinqeety/videos', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'تفسير القرآن' },

  // Shaykh Nabil Al-Awdi
  { url: 'https://www.youtube.com/@alawdy/videos', scholar: 'الشيخ نبيل العوضي', category: 'قصص القرآن' },

  // Dr. Ayman Suwaid (Tajweed)
  { url: 'https://www.youtube.com/@DrAymanSuwayd/videos', scholar: 'د. أيمن سويد', category: 'أحكام التلاوة والتجويد' },

  // Shaykh Al-Areefi
  { url: 'https://www.youtube.com/@alarefe/videos', scholar: 'الشيخ محمد العريفي', category: 'قصص القرآن' },

  // Shaykh Al-Mouneujjid
  { url: 'https://www.youtube.com/@almunajjid/videos', scholar: 'الشيخ محمد صالح المنجد', category: 'تفسير القرآن' },

  // Shaykh Sa'd ibn Nassir Al-Shithry
  { url: 'https://www.youtube.com/@saadalshathry/videos', scholar: 'الشيخ سعد الشثري', category: 'تفسير القرآن' },

  // Shaykh Abdul-Muhsin Al-Qasim
  { url: 'https://www.youtube.com/@AlQasim7/videos', scholar: 'الشيخ عبد المحسن القاسم', category: 'تفسير القرآن' },

  // Shaykh Abdul-Razzaq al-Badr playlists
  { url: 'https://www.youtube.com/@shaikhabdelrazzaq/videos', scholar: 'الشيخ عبد الرزاق البدر', category: 'تدبر وتأملات' },

  // Dr. Fadel As-Samaraei (لمسات بيانية)
  { url: 'https://www.youtube.com/@AlSamaraei/videos', scholar: 'د. فاضل السامرائي', category: 'علوم القرآن' },
  { url: 'https://www.youtube.com/@drfadelsamerraee/videos', scholar: 'د. فاضل السامرائي', category: 'علوم القرآن' },

  // Dr. Musaed Al-Tayyar
  { url: 'https://www.youtube.com/@mosaedaltyar/videos', scholar: 'د. مساعد الطيار', category: 'علوم القرآن' },

  // Sheikh Saeed bin Musfer
  { url: 'https://www.youtube.com/@SaidMusfer/videos', scholar: 'الشيخ سعيد بن مسفر', category: 'تدبر وتأملات' },

  // Ibn Uthaymin via a well-known channel
  { url: 'https://www.youtube.com/@binothaymeen/videos', scholar: 'الشيخ ابن عثيمين', category: 'تفسير القرآن' },
  { url: 'https://www.youtube.com/@dar-othaimeen/videos', scholar: 'الشيخ ابن عثيمين', category: 'تفسير القرآن' },

  // Al-Albani (audio sessions)
  { url: 'https://www.youtube.com/@alalbani-islamweb/videos', scholar: 'الشيخ الألباني', category: 'علوم القرآن' },
];

async function fetchHtml(url) {
  try {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 15000);
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ar,en-US;q=0.9,en;q=0.8',
      },
    });
    clearTimeout(tid);
    if (!res.ok) return null;
    return await res.text();
  } catch (e) {
    return null;
  }
}

// From the HTML page (channel /videos), extract videoId + title pairs
// YouTube embeds a big ytInitialData JSON. We pattern-match for videoId + title.
function extractVideosFromHtml(html) {
  const out = new Map(); // id -> title
  if (!html) return out;
  // Pattern: "videoId":"XXXXXXXXXXX","thumbnail":... "title":{"runs":[{"text":"..."
  const re = /"videoId":"([A-Za-z0-9_-]{11})"[^}]*?"title":\{"runs":\[\{"text":"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const id = m[1];
    let title = m[2].replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
    title = title.replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\\n/g, ' ');
    if (!out.has(id)) out.set(id, title);
  }
  // Alternative pattern: "title":{"accessibility":... simpleText":"..."
  const re2 = /"videoId":"([A-Za-z0-9_-]{11})"[\s\S]{0,500}?"title":\{"simpleText":"((?:[^"\\]|\\.)*)"/g;
  while ((m = re2.exec(html)) !== null) {
    const id = m[1];
    let title = m[2].replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
    title = title.replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\\n/g, ' ');
    if (!out.has(id)) out.set(id, title);
  }
  return out;
}

// Title-based blocklist (aggressive)
const BLOCKLIST_PATTERNS = [
  /كمال الحيدري/i, /الحيدري/i, /آية الله/i, /السيستاني/i, /الخميني/i, /الخامنئي/i,
  /الشيرازي/i, /القزويني/i, /الموسوي/i, /السيد حسن نصر/i, /نصر الله/i,
  /ياسر الحبيب/i, /العتابي/i, /المدرسي/i, /الصدر/i, /الشيعة/i, /شيعي/i,
  /الرافض/i, /تفسير المرتضى/i, /الثقلين/i, /دار البلاغ/i,
  /موسيق[يى]/i, /أغنية/i, /أغاني/i, /مهرجان/i, /مطرب/i,
  /اختلاط/i, /نادين البدير/i, /علي منصور كيالي/i, /كيالي/i,
  /Sherif Gaber/i, /شريف جابر/i,
  /الشيخة /, /الدكتورة /, /القارئة /, /الأخت /, /امرأة تقرأ/,
  /مريم /, /سارة /, /فاطمة /, /هدى /, /رنا /, /دينا /, /ياسمين /,
  /بنت /, /فتاة /, /الإسرائيلي/i, /تحول إلى مسيحي/, /ملحد/,
];

function isBlocked(title, scholar) {
  const text = `${title} ${scholar}`;
  return BLOCKLIST_PATTERNS.some((re) => re.test(text));
}

// Availability check via oEmbed  
async function checkAvailable(id) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
  try {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (checker)' },
    });
    clearTimeout(tid);
    return res.status === 200;
  } catch {
    return false;
  }
}

async function runWithConcurrency(items, limit, worker, onProgress) {
  const results = new Array(items.length);
  let idx = 0;
  let done = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (true) {
      const myIdx = idx++;
      if (myIdx >= items.length) return;
      results[myIdx] = await worker(items[myIdx], myIdx);
      done++;
      if (onProgress && done % 25 === 0) onProgress(done, items.length);
    }
  });
  await Promise.all(workers);
  return results;
}

async function main() {
  console.log('[collect] Reading existing IDs...');
  const existing = collectExistingIds();
  console.log(`[collect] Existing IDs: ${existing.size}`);

  const candidates = []; // { id, title, scholar, category }
  const seenIds = new Set();

  for (const src of SOURCES) {
    process.stdout.write(`[collect] Fetching ${src.url} ... `);
    const html = await fetchHtml(src.url);
    if (!html) {
      console.log('FAIL');
      continue;
    }
    const videos = extractVideosFromHtml(html);
    let added = 0;
    for (const [id, title] of videos) {
      if (existing.has(id) || seenIds.has(id)) continue;
      if (isBlocked(title, src.scholar)) continue;
      seenIds.add(id);
      candidates.push({ id, title, scholar: src.scholar, category: src.category });
      added++;
    }
    console.log(`OK (extracted ${videos.size}, new ${added})`);
  }

  console.log(`[collect] Total new candidates before availability check: ${candidates.length}`);

  // Verify availability in parallel
  console.log('[collect] Verifying availability via oEmbed...');
  const t0 = Date.now();
  const availResults = await runWithConcurrency(
    candidates,
    20,
    (c) => checkAvailable(c.id).then((ok) => ({ ...c, ok })),
    (d, t) => {
      const el = ((Date.now() - t0) / 1000).toFixed(1);
      process.stdout.write(`\r[collect] ${d}/${t} (${el}s)`);
    }
  );
  process.stdout.write('\n');

  const available = availResults.filter((r) => r.ok);
  console.log(`[collect] Available: ${available.length} / ${candidates.length}`);

  const outFile = path.join(__dirname, 'new-videos-candidates.json');
  fs.writeFileSync(
    outFile,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        totalCandidates: candidates.length,
        available: available.length,
        items: available.map((a) => ({ id: a.id, title: a.title, scholar: a.scholar, category: a.category })),
      },
      null,
      2
    ),
    'utf8'
  );
  console.log(`[collect] Wrote ${outFile}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
