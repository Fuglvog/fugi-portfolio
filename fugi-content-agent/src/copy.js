import { readFileSync, existsSync } from 'node:fs';
import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config';
import { getPlatform } from './platforms.js';

export const MODEL = 'claude-opus-4-7';

export function voicePath(brand) {
  if (!brand || typeof brand !== 'string') {
    throw new Error('brand (string) required — e.g. "fugi" or "bs". No default to prevent cross-contamination.');
  }
  return `brands/${brand}/voice_guidelines.md`;
}

function loadVoice(brand) {
  const path = voicePath(brand);
  if (!existsSync(path)) {
    throw new Error(`Missing ${path}. Paste the brand voice file before drafting.`);
  }
  return readFileSync(path, 'utf8');
}

export function buildSystem(voice, brand) {
  return [
    `You draft social-media captions for the "${brand}" brand. The voice guidelines below are the authority — match them. Never break voice for engagement bait, hype, or "thrilled to announce" filler. Return only the caption text — no preamble, no quotes, no notes, no explanation.`,
    '',
    '--- VOICE GUIDELINES ---',
    voice,
  ].join('\n');
}

export async function draftCopy({ brand, idea, platform }) {
  if (!idea || typeof idea !== 'string') {
    throw new Error('draftCopy: idea (string) required');
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not set. Copy .env.example to .env and fill it in.');
  }

  const plat = getPlatform(platform);
  const voice = loadVoice(brand);
  const client = new Anthropic();

  const userMsg = [
    `Platform: ${plat.name} (caption max ${plat.maxChars} chars; ${plat.allowNewlines ? 'newlines OK' : 'single line'})`,
    `Idea: ${idea}`,
    '',
    'Draft the caption.',
  ].join('\n');

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    thinking: { type: 'adaptive' },
    system: buildSystem(voice, brand),
    messages: [{ role: 'user', content: userMsg }],
  });

  return response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();
}

// CLI: node src/copy.js <brand> "idea" [platform]
const isCli = import.meta.url === `file://${process.argv[1]}`;
if (isCli) {
  const [brand, idea, platform = 'tiktok'] = process.argv.slice(2);
  if (!brand || !idea) {
    console.error('usage: node src/copy.js <brand> "idea text" [platform]');
    process.exit(1);
  }
  draftCopy({ brand, idea, platform })
    .then((caption) => console.log(caption))
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
}
