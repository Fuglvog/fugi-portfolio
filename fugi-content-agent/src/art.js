// ART task: fal.ai image generation.
//
// Reads brand fal_ai_templates.md, picks a template based on caption
// mode + platform, fills the {SUBJECT} slot, calls fal.ai, returns
// image URL(s) to write back into posts.csv as media_path.
//
// ESM conversion of operator-provided art.js. Behavior unchanged.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fal from '@fal-ai/serverless-client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

fal.config({ credentials: process.env.FAL_KEY });

const BRANDS_DIR = path.join(__dirname, '..', 'brands');

const PLATFORM_ASPECT = {
  youtube: '9:16',
  tiktok:  '9:16',
  ig:      '1:1',
  x:       '1:1',
};

const ASPECT_TO_FAL_SIZE = {
  '9:16':  'portrait_16_9',
  '16:9':  'landscape_16_9',
  '1:1':   'square_hd',
  '4:5':   'portrait_4_3',
};

export function loadTemplates(brand) {
  const filePath = path.join(BRANDS_DIR, brand, 'fal_ai_templates.md');
  if (!fs.existsSync(filePath)) {
    throw new Error(`No fal_ai_templates.md for brand "${brand}"`);
  }

  const md = fs.readFileSync(filePath, 'utf8');
  const templates = [];

  const blockRe = /```yaml\n([\s\S]*?)\n```/g;
  let match;
  while ((match = blockRe.exec(md)) !== null) {
    const yamlBody = match[1];
    const parsed = parseSimpleYaml(yamlBody);
    if (parsed.id && parsed.prompt) templates.push(parsed);
  }

  if (templates.length === 0) {
    throw new Error(`No valid templates found in ${filePath}`);
  }
  return templates;
}

export function parseSimpleYaml(text) {
  const lines = text.split('\n');
  const out = {};
  let currentKey = null;
  let multiline = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headerMatch = line.match(/^(\w+):\s*(.*)$/);

    if (headerMatch) {
      if (currentKey) {
        out[currentKey] = multiline.join(' ').trim();
        multiline = [];
      }
      const [, key, val] = headerMatch;
      if (val === '|' || val === '') {
        currentKey = key;
        multiline = [];
      } else {
        out[key] = val.trim();
        currentKey = null;
      }
    } else if (currentKey) {
      multiline.push(line.trim());
    }
  }
  if (currentKey) out[currentKey] = multiline.join(' ').trim();
  return out;
}

const COZY_KEYWORDS = [
  'cozy', 'tucked', 'sleep', 'nap', 'warm', 'blanket', 'soft',
  'sahur', 'bebe', 'bed', 'comfy', 'pillow', 'rest',
];
const CURSED_KEYWORDS = [
  'cartel', 'mexico', 'breaking', 'sock', 'fugglypizza', 'pizza',
  'mafia', 'desert', 'meth', 'tralalero', 'tung',
];

export function inferMode(caption, idea) {
  const text = `${caption} ${idea}`.toLowerCase();
  const cozyHits = COZY_KEYWORDS.filter((k) => text.includes(k)).length;
  const cursedHits = CURSED_KEYWORDS.filter((k) => text.includes(k)).length;

  if (cursedHits > cozyHits) return 'cursed';
  if (cozyHits > 0) return 'cozy';
  if (caption.length < 20) return 'deep_fried';
  return 'cozy';
}

export function pickTemplate(templates, { mode, platform }) {
  const aspect = PLATFORM_ASPECT[platform] || '1:1';

  const modeMatches = templates.filter((t) => t.mode === mode);
  if (modeMatches.length === 0) {
    throw new Error(`No templates for mode "${mode}"`);
  }

  const aspectMatches = modeMatches.filter((t) => t.aspect === aspect);
  const pool = aspectMatches.length > 0 ? aspectMatches : modeMatches;

  return pool[Math.floor(Math.random() * pool.length)];
}

export function deriveSubject(idea, caption) {
  let s = (idea || '').toLowerCase()
    .replace(/cozy bebe/gi, '')
    .replace(/mr fugglypizza/gi, '')
    .replace(/[\/,]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (s.length < 5) s = caption;
  return s;
}

export async function generateArt({
  brand,
  caption,
  platform,
  idea,
  mode,
  subjectDetail,
  numImages = 1,
}) {
  const templates = loadTemplates(brand);
  const resolvedMode = mode || inferMode(caption, idea || '');
  const template = pickTemplate(templates, { mode: resolvedMode, platform });
  const subject = subjectDetail || deriveSubject(idea || caption, caption);

  const prompt = template.prompt.replace(/\{SUBJECT\}/g, subject);
  const falSize = ASPECT_TO_FAL_SIZE[template.aspect] || 'square_hd';

  console.log(`[art] brand=${brand} mode=${resolvedMode} template=${template.id}`);
  console.log(`[art] prompt: ${prompt.slice(0, 120)}...`);

  try {
    const result = await fal.subscribe(template.model, {
      input: {
        prompt,
        negative_prompt: template.negative || undefined,
        image_size: falSize,
        num_images: numImages,
      },
      logs: false,
    });

    const urls = (result.images || []).map((img) => img.url);
    if (urls.length === 0) {
      throw new Error('fal.ai returned no images');
    }
    return {
      url: urls[0],
      urls,
      template_id: template.id,
      mode: resolvedMode,
      prompt_used: prompt,
      model: template.model,
    };
  } catch (err) {
    console.error(`[art] generation failed: ${err.message}`);
    throw err;
  }
}

// CLI: node src/art.js <brand> "idea" [platform] [mode]
const isCli = import.meta.url === `file://${process.argv[1]}`;
if (isCli) {
  const [brand, idea, platform = 'ig', mode] = process.argv.slice(2);
  if (!brand || !idea) {
    console.error('usage: node src/art.js <brand> "<idea>" [platform] [mode]');
    process.exit(1);
  }
  generateArt({ brand, idea, caption: idea, platform, mode })
    .then((result) => {
      console.log('\n--- result ---');
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error('FAILED:', err.message);
      process.exit(1);
    });
}
