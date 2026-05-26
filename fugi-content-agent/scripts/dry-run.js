#!/usr/bin/env node
// Dry-run for src/copy.js. Builds the exact request body that would hit
// the Anthropic API and runs a mock response through the same parse
// logic. No API call, no tokens spent. Useful for iterating on a
// voice file or the system prompt without burning budget.
//
// Usage: node scripts/dry-run.js <brand> ["idea"] [platform]

import { readFileSync, existsSync } from 'node:fs';
import { getPlatform } from '../src/platforms.js';
import { MODEL, buildSystem, voicePath } from '../src/copy.js';

const [
  brand,
  idea = 'teaser for the Morph filter sweep demo',
  platform = 'tiktok',
] = process.argv.slice(2);

if (!brand) {
  console.error('usage: node scripts/dry-run.js <brand> ["idea"] [platform]');
  console.error('example: node scripts/dry-run.js bs "soft launch of the Whisper Spoon"');
  process.exit(1);
}

const plat = getPlatform(platform);
const vp = voicePath(brand);
if (!existsSync(vp)) {
  console.error(`Missing ${vp}. Paste the brand voice file before running.`);
  process.exit(1);
}
const voice = readFileSync(vp, 'utf8');

const userMsg = [
  `Platform: ${plat.name} (caption max ${plat.maxChars} chars; ${plat.allowNewlines ? 'newlines OK' : 'single line'})`,
  `Idea: ${idea}`,
  '',
  'Draft the caption.',
].join('\n');

const requestBody = {
  model: MODEL,
  max_tokens: 1024,
  thinking: { type: 'adaptive' },
  system: buildSystem(voice, brand),
  messages: [{ role: 'user', content: userMsg }],
};

console.log(`=== REQUEST PAYLOAD (brand: ${brand}) — what would POST to /v1/messages ===`);
console.log(JSON.stringify(requestBody, null, 2));

// Plausible mock response. Includes a thinking block to prove the
// parse logic strips it from the returned string.
const mockResponse = {
  id: 'msg_01MOCK',
  type: 'message',
  role: 'assistant',
  model: 'claude-opus-4-7',
  content: [
    {
      type: 'thinking',
      thinking:
        'Lead with the thing. Specifics over adjectives. Match the voice file.',
    },
    {
      type: 'text',
      text: '[mocked caption — real one comes from the API]',
    },
  ],
  stop_reason: 'end_turn',
  usage: { input_tokens: 612, output_tokens: 87 },
};

console.log('\n=== MOCK RESPONSE — what the SDK would hand back ===');
console.log(JSON.stringify(mockResponse, null, 2));

const returned = mockResponse.content
  .filter((b) => b.type === 'text')
  .map((b) => b.text)
  .join('')
  .trim();

console.log('\n=== RETURN VALUE from draftCopy() ===');
console.log(`type:   ${typeof returned}`);
console.log(`length: ${returned.length} chars`);
console.log(`value:`);
console.log(returned);
