// Build videos-batch8.ts from scripts/selected-200.json
import fs from 'node:fs';

const videos = JSON.parse(fs.readFileSync('scripts/selected-200.json', 'utf8'));
console.log(`Building videos-batch8.ts from ${videos.length} videos.`);

// Category list in Arabic (must match VideoCategory type)
const VALID_CATEGORIES = new Set([
  'تفسير القرآن',
  'تدبر وتأملات',
  'أحكام التلاوة والتجويد',
  'علوم القرآن',
  'قصص القرآن',
  'إعجاز القرآن',
]);

function tsEscape(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' ').replace(/\r/g, '');
}

const lines = [];
lines.push('// ============================================');
lines.push('// VIDEOS BATCH 8 - 200 NEW VERIFIED VIDEOS');
lines.push('// All videos verified via YouTube oEmbed API');
lines.push('// Filtered for content: no women on camera, no Shia, no music');
lines.push('// Curated from trusted Sunni scholars\' channels');
lines.push('// Date: ' + new Date().toISOString().slice(0, 10));
lines.push('// ============================================');
lines.push('');
lines.push("import type { QuranVideo } from './videos';");
lines.push('');
lines.push('export const additionalVideosBatch8: QuranVideo[] = [');

videos.forEach((v, i) => {
  const cat = VALID_CATEGORIES.has(v.category) ? v.category : 'تفسير القرآن';
  const title = tsEscape(v.title).slice(0, 300);
  const scholar = tsEscape(v.scholar || 'علماء');
  const author = tsEscape(v.author || '');
  const desc = author ? `من قناة ${author}` : '';
  lines.push(
    `  { id: 'b8_v${i + 1}', youtubeId: '${v.youtubeId}', title: '${title}', scholar: '${scholar}', category: '${cat}', description: '${tsEscape(desc)}' },`
  );
});

lines.push('];');
lines.push('');

const out = lines.join('\n');
fs.writeFileSync('src/data/videos-batch8.ts', out, 'utf8');
console.log(`✅ Wrote src/data/videos-batch8.ts (${videos.length} entries)`);
