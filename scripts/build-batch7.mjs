// Build videos-batch7.ts from verified-new.json
// Select 300 videos with balanced distribution across 6 categories
import fs from 'node:fs';

const verified = JSON.parse(fs.readFileSync('scripts/verified-new.json', 'utf8'));
console.log(`Loaded ${verified.length} verified entries.`);

// Target distribution (= 300)
const TARGETS = {
  'تفسير القرآن': 70,
  'تدبر وتأملات': 55,
  'قصص القرآن': 55,
  'إعجاز القرآن': 45,
  'علوم القرآن': 40,
  'أحكام التلاوة والتجويد': 35,
};
const TOTAL_TARGET = Object.values(TARGETS).reduce((a, b) => a + b, 0);
console.log('Target total:', TOTAL_TARGET);

// Group by category
const byCat = {};
for (const v of verified) {
  if (!byCat[v.category]) byCat[v.category] = [];
  byCat[v.category].push(v);
}

// Dedup by title prefix (first 30 chars) to avoid near-duplicates like "التفسير - الحلقة 1", "- 2", ...
// Actually keep diverse titles.  We'll rank by:
//   - prefer "official" / "قناة" in author
//   - prefer shorter query-based (more general)
// Simple: keep only first occurrence per normalized-title-key

// Normalize title key: strip numbers, common words, punctuation
function titleKey(title) {
  return title
    .replace(/[0-9٠-٩]/g, '')
    .replace(/[\s\-_،.:؛"'()«»\[\]]+/g, ' ')
    .trim()
    .slice(0, 40)
    .toLowerCase();
}

// Filter out entries that look like shorts or too-specific episode numbers? — actually keep diverse.
// Limit per scholar to ensure diversity
const PER_SCHOLAR_CAP = 18; // avoid flooding from a single scholar

function pickFromCategory(list, target) {
  const picked = [];
  const seenKeys = new Set();
  const scholarCount = {};
  // Shuffle deterministically (by id) for fairness
  const sorted = [...list].sort((a, b) => a.youtubeId.localeCompare(b.youtubeId));
  for (const v of sorted) {
    if (picked.length >= target) break;
    const key = titleKey(v.title);
    if (seenKeys.has(key)) continue;
    const sc = v.author || v.scholar || 'unknown';
    if ((scholarCount[sc] || 0) >= PER_SCHOLAR_CAP) continue;
    scholarCount[sc] = (scholarCount[sc] || 0) + 1;
    seenKeys.add(key);
    picked.push(v);
  }
  // Fallback: if below target, relax scholar cap
  if (picked.length < target) {
    for (const v of sorted) {
      if (picked.length >= target) break;
      if (picked.some(p => p.youtubeId === v.youtubeId)) continue;
      const key = titleKey(v.title);
      if (seenKeys.has(key)) continue;
      seenKeys.add(key);
      picked.push(v);
    }
  }
  return picked;
}

const selected = [];
for (const [cat, target] of Object.entries(TARGETS)) {
  const list = byCat[cat] || [];
  const picked = pickFromCategory(list, target);
  console.log(`  ${cat}: picked ${picked.length}/${target} (from ${list.length} available)`);
  selected.push(...picked);
}

// If we fell short of 300, top up from largest categories
if (selected.length < TOTAL_TARGET) {
  console.log(`Short by ${TOTAL_TARGET - selected.length}, topping up...`);
  const chosenIds = new Set(selected.map(s => s.youtubeId));
  for (const cat of ['تفسير القرآن', 'تدبر وتأملات', 'قصص القرآن']) {
    for (const v of (byCat[cat] || [])) {
      if (selected.length >= TOTAL_TARGET) break;
      if (chosenIds.has(v.youtubeId)) continue;
      chosenIds.add(v.youtubeId);
      selected.push(v);
    }
  }
}

console.log(`\nFinal count: ${selected.length}`);

// Escape single quotes for TS string literals
function escSingle(s) {
  return (s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

// Build TS file
const lines = [
  '// ============================================',
  '// VIDEOS BATCH 7 - 100% VERIFIED NEW VIDEOS',
  '// 300 new videos fetched from trusted YouTube scholars',
  '// Verified via oEmbed API + Thumbnail HEAD check',
  '// Date: 2026-04-21',
  '// ============================================',
  '',
  "import type { QuranVideo } from './videos';",
  '',
  'export const additionalVideosBatch7: QuranVideo[] = [',
];

selected.forEach((v, idx) => {
  const id = `b7_v${idx + 1}`;
  const title = escSingle(v.title);
  const scholar = escSingle(v.author || v.scholar || 'علماء');
  const desc = `من قناة ${escSingle(v.author || 'علماء')}`;
  lines.push(`  { id: '${id}', youtubeId: '${v.youtubeId}', title: '${title}', scholar: '${scholar}', category: '${v.category}', description: '${desc}' },`);
});
lines.push('];');
lines.push('');

fs.writeFileSync('src/data/videos-batch7.ts', lines.join('\n'));
console.log(`\n✅ Wrote src/data/videos-batch7.ts (${selected.length} entries)`);

// Category summary
const finalCat = {};
for (const v of selected) finalCat[v.category] = (finalCat[v.category] || 0) + 1;
console.log('\nFinal distribution:');
for (const [k, v] of Object.entries(finalCat)) console.log(`  ${k}: ${v}`);
