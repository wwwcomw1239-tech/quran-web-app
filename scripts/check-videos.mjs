// ========================================================
// Check YouTube video availability for all videos in data
// ========================================================
// Uses YouTube oEmbed API (no API key needed)
// Strategy:
//   - Extract all youtubeId occurrences from every *.ts data file
//   - Check each in parallel batches (concurrency limited)
//   - Mark unavailable IDs
//   - Write report to scripts/unavailable-ids.json
// ========================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '..', 'src', 'data');

// Files to check (video-related only)
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

function extractYoutubeIds(content) {
  // matches: youtubeId: 'XXXX' OR youtubeId: "XXXX"
  const re = /youtubeId\s*:\s*['"]([A-Za-z0-9_-]{6,20})['"]/g;
  const ids = new Set();
  let m;
  while ((m = re.exec(content)) !== null) {
    ids.add(m[1]);
  }
  return ids;
}

async function collectAllIds() {
  const all = new Set();
  for (const file of FILES) {
    const fp = path.join(DATA_DIR, file);
    if (!fs.existsSync(fp)) continue;
    const c = fs.readFileSync(fp, 'utf8');
    const ids = extractYoutubeIds(c);
    for (const id of ids) all.add(id);
  }
  return [...all];
}

// Use oEmbed to check if a video exists & is embeddable
// Returns { available: bool, reason?: string }
async function checkVideo(id, attempt = 1) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
  try {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (checker)' },
    });
    clearTimeout(tid);
    if (res.status === 200) return { id, available: true };
    if (res.status === 401 || res.status === 403) return { id, available: false, reason: `status_${res.status}_embed_disabled` };
    if (res.status === 404) return { id, available: false, reason: 'not_found' };
    // Other statuses: retry once
    if (attempt < 2) {
      await new Promise((r) => setTimeout(r, 500 * attempt));
      return checkVideo(id, attempt + 1);
    }
    return { id, available: false, reason: `status_${res.status}` };
  } catch (e) {
    if (attempt < 3) {
      await new Promise((r) => setTimeout(r, 700 * attempt));
      return checkVideo(id, attempt + 1);
    }
    return { id, available: null, reason: `network_error: ${String(e).slice(0, 50)}` };
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
  console.log('[check-videos] Collecting youtube IDs...');
  const ids = await collectAllIds();
  console.log(`[check-videos] Found ${ids.length} unique IDs`);

  const CONCURRENCY = 30;
  const t0 = Date.now();
  const results = await runWithConcurrency(ids, CONCURRENCY, checkVideo, (d, t) => {
    const el = ((Date.now() - t0) / 1000).toFixed(1);
    process.stdout.write(`\r[check-videos] ${d}/${t}  (${el}s)`);
  });
  process.stdout.write('\n');

  const unavailable = [];
  const networkErrors = [];
  const available = [];
  for (const r of results) {
    if (r.available === true) available.push(r.id);
    else if (r.available === false) unavailable.push({ id: r.id, reason: r.reason });
    else networkErrors.push({ id: r.id, reason: r.reason });
  }

  console.log(`[check-videos] Available: ${available.length}`);
  console.log(`[check-videos] Unavailable: ${unavailable.length}`);
  console.log(`[check-videos] Network errors (will retry): ${networkErrors.length}`);

  // Retry network errors once more in serial
  if (networkErrors.length > 0) {
    console.log('[check-videos] Retrying network errors...');
    const retryResults = await runWithConcurrency(
      networkErrors.map((r) => r.id),
      10,
      (id) => checkVideo(id, 1),
    );
    for (const r of retryResults) {
      if (r.available === true) available.push(r.id);
      else if (r.available === false) unavailable.push({ id: r.id, reason: r.reason });
      else unavailable.push({ id: r.id, reason: r.reason || 'network_final' });
    }
  }

  const out = {
    generatedAt: new Date().toISOString(),
    totalChecked: ids.length,
    available: available.length,
    unavailable: unavailable.length,
    unavailableIds: unavailable.map((u) => u.id),
    unavailableDetails: unavailable,
  };
  const outFile = path.join(__dirname, 'unavailable-ids.json');
  fs.writeFileSync(outFile, JSON.stringify(out, null, 2), 'utf8');
  console.log(`[check-videos] Wrote ${outFile}`);
  console.log(`[check-videos] Unavailable IDs count: ${unavailable.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
