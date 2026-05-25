import { stringify } from 'csv-stringify/sync';
import { appendFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const HEADERS = ['datetime', 'platform', 'caption', 'art_prompt', 'media_path'];
const CSV_PATH = 'out/posts.csv';

export function appendPost(row) {
  mkdirSync(dirname(CSV_PATH), { recursive: true });
  if (!existsSync(CSV_PATH)) {
    writeFileSync(CSV_PATH, stringify([HEADERS]));
  }
  appendFileSync(CSV_PATH, stringify([[
    row.datetime,
    row.platform,
    row.caption,
    row.art_prompt,
    row.media_path ?? '',
  ]]));
}
