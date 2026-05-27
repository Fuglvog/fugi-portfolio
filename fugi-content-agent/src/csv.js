import { stringify } from 'csv-stringify/sync';
import { appendFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

export const HEADERS = [
  'datetime',
  'platform',
  'caption',
  'media_prompt',
  'media_path',
  'media_kind',
  'media_mode',
  'media_template_id',
  'media_model',
  'source_image_url',
];

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
  appendFileSync(
    path,
    stringify([HEADERS.map((h) => row[h] ?? '')]),
  );
}
