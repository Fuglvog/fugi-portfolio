#!/usr/bin/env node
// Dry-run for src/copy.js. Builds the exact request body that would hit
// the Anthropic API and runs a mock response through the same parse
// logic. No API call, no tokens spent. Useful for iterating on the
// voice file or the system prompt without burning budget.
//
// Usage: node scripts/dry-run.js ["idea"] [platform]

import { readFileSync } from 'node:fs';
import { getPlatform } from '../src/platforms.js';
import { MODEL, buildSystem } from '../src/copy.js';

const [
  idea = 'teaser for the Morph filter sweep demo',
  platform = 'tiktok',
] = process.argv.slice(2);

const plat = getPlatform(platform);
const voice = readFileSync('brand/voice_guidelines.md', 'utf8');

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
  system: buildSystem(voice),
  messages: [{ role: 'user', content: userMsg }],
};

console.log('=== REQUEST PAYLOAD — what would POST to /v1/messages ===');
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
        'TikTok wants a punchy first line. Voice file: lead with the thing, specifics over adjectives, no hype. Name the synth and the technique.',
    },
    {
      type: 'text',
      text: 'Morph. Filter sweep, no drums. Cutoff opens slow across 32 bars while the saturator melts the top end.\n\nfull demo tomorrow.',
    },
  ],
  stop_reason: 'end_turn',
  usage: { input_tokens: 612, output_tokens: 87 },
};

console.log('\n=== MOCK RESPONSE — what the SDK would hand back ===');
console.log(JSON.stringify(mockResponse, null, 2));

// Same parse logic as draftCopy() in src/copy.js.
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
