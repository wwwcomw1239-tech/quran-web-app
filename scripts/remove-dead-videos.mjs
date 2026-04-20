// Remove unavailable video entries from all data files
// Uses regex to match each { ..., youtubeId: 'ID', ... }, entry block
// Safe: only removes entries whose youtubeId is in the dead-list.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '..', 'src', 'data');

const deadData = JSON.parse(fs.readFileSync(path.join(__dirname, 'verified-unavailable.json'), 'utf8'));
const deadSet = new Set(deadData.trulyDeadIds);
console.log(`Removing ${deadSet.size} dead video entries...`);

const FILES = [
  'videos.ts',
  'videos-additions.ts',
  'videos-batch2.ts',
  'videos-batch3.ts',
  'videos-batch4.ts',
  'shorts.ts',
  'shorts-additions.ts',
  'shorts-batch2.ts',
  'shorts-batch3.ts',
  'shorts-batch4.ts',
  'shorts-batch5.ts',
  'kids.ts',
  'kids-additions.ts',
  'kids-batch2.ts',
  'kids-batch3.ts',
];

// Match a video/short/kid entry object (single-line).
// We parse line-by-line. An entry line looks like:
//   { id: 'x', youtubeId: 'YYY', title: '...', ... },
// Sometimes they span multiple lines, but in this project most are single-line.
// Strategy: parse balanced-braces entries by scanning for "{ ... }," blocks
// starting at a line.

function removeDeadFromContent(content, deadSet) {
  // Split into lines, then for each line, if it contains youtubeId and the ID is dead, drop it.
  // If the entry spans multiple lines we need a smarter approach.
  // Inspecting data: entries are mostly single-line. But some may span multi-line.
  // We use block-parser:
  //   find { ... youtubeId: 'ID' ... }, as a minimal balanced block.

  // Simple approach: find every `{ id:` opening, then find the matching `},\n` closing at same depth.
  // Then within that block, check youtubeId; if dead, remove.

  const lines = content.split('\n');
  const out = [];
  let removedCount = 0;
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Try to detect start of an object entry: contains `{ id:` or `{id:`
    // And a youtubeId somewhere within.
    const startIdx = line.search(/\{\s*id\s*:/);
    if (startIdx >= 0) {
      // collect until matching close `},` or `}` at same depth
      let depth = 0;
      let block = '';
      let j = i;
      let foundEnd = -1;
      for (; j < lines.length; j++) {
        const l = lines[j];
        for (let k = 0; k < l.length; k++) {
          const ch = l[k];
          if (ch === '{') depth++;
          else if (ch === '}') {
            depth--;
            if (depth === 0) {
              // include this line fully (and comma if next)
              foundEnd = j;
              break;
            }
          }
        }
        block += l + '\n';
        if (foundEnd >= 0) break;
      }

      if (foundEnd >= 0) {
        // Extract youtubeId from block
        const m = block.match(/youtubeId\s*:\s*['"]([A-Za-z0-9_-]+)['"]/);
        if (m && deadSet.has(m[1])) {
          // remove this block (all lines from i to foundEnd)
          // Also try to consume trailing comma if it's on same line as closing brace
          // but since we keep original structure, we just skip these lines.
          removedCount++;
          i = foundEnd + 1;
          continue;
        }
      }
    }
    out.push(line);
    i++;
  }
  return { content: out.join('\n'), removed: removedCount };
}

let totalRemoved = 0;
for (const file of FILES) {
  const fp = path.join(DATA_DIR, file);
  if (!fs.existsSync(fp)) continue;
  const orig = fs.readFileSync(fp, 'utf8');
  const { content, removed } = removeDeadFromContent(orig, deadSet);
  if (removed > 0) {
    fs.writeFileSync(fp, content, 'utf8');
    console.log(`  ${file}: removed ${removed} entries`);
    totalRemoved += removed;
  } else {
    console.log(`  ${file}: no changes`);
  }
}
console.log(`Total removed: ${totalRemoved}`);
