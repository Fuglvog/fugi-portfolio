import { stringify } from 'csv-stringify/sync';
import { appendFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const HEADERS = ['datetime', 'platform', 'caption', 'art_prompt', 'media_path'];

export function csvPath(brand) {
  if (!brand || typeof brand !== 'string') {
    throw new Error('csvPath: brand (string) required');
  }
  return `out/${brand}/posts.csv`;
}

export function appendPost(row, brand) {
  const path = csvPath(brand);
  mkdirSync(dirname(path), { recursive: true });
  if (!existsSync(path)) {
    writeFileSync(path, stringify([HEADERS]));
  }
  appendFileSync(path, stringify([[
    row.datetime,
    row.platform,
    row.caption,
    row.art_prompt,
    row.media_path ?? '',
  ]]));
}
