#!/usr/bin/env node
// Transform internal posts.csv → per-platform Publer-shaped CSVs.
// Reads:  out/<brand>/posts.csv  (datetime, platform, caption, art_prompt, media_path)
// Writes: out/<brand>/publer/<platform>.csv  (Publer's 12-column schema)
//
// Convention: 1 brand = 1 Publer Workspace. Within a Workspace, import each
// per-platform file separately and select only that platform's connected
// accounts at upload.
//
// Usage: node scripts/to-publer.js <brand>

import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import { csvPath } from '../src/csv.js';

const PUBLER_HEADERS = [
  'Date - Intl. format or prompt',
  'Text',
  'Link(s) - Separated by comma for FB carousels',
  'Media URL(s) - Separated by comma',
  'Title - For the video, pin, PDF ..',
  'Label(s) - Separated by comma',
  'Alt text(s) - Separated by ||',
  'Comment(s) - Separated by ||',
  'Pin board, FB album, or Google category',
  'Post subtype - I.e. story, reel, PDF ..',
  'CTA - For Facebook links or Google',
  'Reminder - For stories, reels, shorts, and TikToks',
];

function looksLocalPath(s) {
  if (!s) return false;
  if (/^https?:\/\//i.test(s)) return false;
  return true;
}

function toPublerRow({ datetime, caption, media_path }) {
  return [
    datetime ?? '',
    caption ?? '',
    '',
    media_path ?? '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ];
}

const [brand] = process.argv.slice(2);
if (!brand) {
  console.error('usage: node scripts/to-publer.js <brand>');
  process.exit(1);
}

const src = csvPath(brand);
if (!existsSync(src)) {
  console.error(`Missing ${src}. Run the orchestrator first.`);
  process.exit(1);
}

const rows = parse(readFileSync(src, 'utf8'), { columns: true, skip_empty_lines: true });
if (rows.length === 0) {
  console.error(`${src} has no data rows.`);
  process.exit(1);
}

const byPlatform = new Map();
for (const r of rows) {
  if (!r.platform) {
    console.error(`row missing platform — skipped: ${JSON.stringify(r)}`);
    continue;
  }
  if (!byPlatform.has(r.platform)) byPlatform.set(r.platform, []);
  byPlatform.get(r.platform).push(r);
}

const outDir = `out/${brand}/publer`;
mkdirSync(outDir, { recursive: true });

let mediaWarnings = 0;
for (const [platform, rs] of byPlatform) {
  const publerRows = rs.map((r) => {
    if (looksLocalPath(r.media_path)) {
      console.error(
        `warn: ${platform} row has non-URL media_path "${r.media_path}" — Publer needs a public URL`,
      );
      mediaWarnings += 1;
    }
    return toPublerRow(r);
  });
  const path = `${outDir}/${platform}.csv`;
  writeFileSync(path, stringify([PUBLER_HEADERS, ...publerRows]));
  console.log(`wrote ${path} (${publerRows.length} rows)`);
}

if (mediaWarnings > 0) {
  console.error(
    `\n${mediaWarnings} row(s) had local media paths. Upload to S3/Cloudinary/Drive (public link) and replace media_path before importing to Publer.`,
  );
}
