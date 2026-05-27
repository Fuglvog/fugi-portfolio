// VIDEO task: fal.ai video generation.
//
// Two paths:
//   t2v — text-to-video, pure prompt → video
//   i2v — image-to-video, still from generateArt + motion prompt → animated
//
// ESM conversion of operator-provided video.js. Behavior unchanged.

import fal from '@fal-ai/serverless-client';
import {
  generateArt,
  loadTemplates,
  inferMode,
  deriveSubject,
} from './art.js';

fal.config({ credentials: process.env.FAL_KEY });

const PLATFORM_ASPECT = {
  youtube: '9:16',
  tiktok:  '9:16',
  ig:      '9:16',
  x:       '16:9',
};

const VIDEO_MODELS = {
  t2v: {
    cursed:     'fal-ai/veo3',
    deep_fried: 'fal-ai/kling-video/v2/master/text-to-video',
    cozy:       'fal-ai/kling-video/v2/master/text-to-video',
  },
  i2v: {
    cozy:       'fal-ai/kling-video/v2/master/image-to-video',
    cursed:     'fal-ai/kling-video/v2/master/image-to-video',
    deep_fried: 'fal-ai/kling-video/v2/master/image-to-video',
  },
};

export function loadVideoTemplates(brand) {
  const allTemplates = loadTemplates(brand);
  const videoTemplates = allTemplates.filter((t) => t.kind === 'video');
  if (videoTemplates.length > 0) return videoTemplates;

  return allTemplates.map((t) => ({
    ...t,
    kind: 'video',
    motion: defaultMotionForMode(t.mode),
  }));
}

function defaultMotionForMode(mode) {
  switch (mode) {
    case 'cozy':
      return 'slow gentle camera push in, subtle breathing motion, fairy lights twinkling, dust particles drifting in light beam';
    case 'cursed':
      return 'awkward jerky camera motion, subject stares directly at camera with dead eyes, slight zoom in, harsh lighting flickers';
    case 'deep_fried':
      return 'rapid zoom in and out, oversaturated color shifts, JPEG artifacts pulsing, chaotic micro-motions';
    default:
      return 'static camera, subtle motion';
  }
}

function pickVideoTemplate(templates, { mode, platform }) {
  const aspect = PLATFORM_ASPECT[platform] || '9:16';
  const modeMatches = templates.filter((t) => t.mode === mode);
  if (modeMatches.length === 0) {
    throw new Error(`No video templates for mode "${mode}"`);
  }
  const aspectMatches = modeMatches.filter((t) => t.aspect === aspect);
  const pool = aspectMatches.length > 0 ? aspectMatches : modeMatches;
  return pool[Math.floor(Math.random() * pool.length)];
}

function buildVideoPrompt(template, subject, useImage2Video) {
  const filledVisual = template.prompt.replace(/\{SUBJECT\}/g, subject);
  const motion = template.motion || defaultMotionForMode(template.mode);

  if (useImage2Video) {
    return `${motion}. ${subject}`;
  }
  return `${filledVisual}. Motion: ${motion}`;
}

export async function generateVideo({
  brand,
  caption,
  platform,
  idea,
  mode,
  subjectDetail,
  sourceImageUrl,
  duration = 5,
  forceImage2Video = false,
}) {
  const resolvedMode = mode || inferMode(caption, idea || '');
  const templates = loadVideoTemplates(brand);
  const useImage2Video = !!sourceImageUrl || forceImage2Video;
  const template = pickVideoTemplate(templates, { mode: resolvedMode, platform });
  const subject = subjectDetail || deriveSubject(idea, caption);

  let imageUrl = sourceImageUrl;
  if (forceImage2Video && !imageUrl) {
    console.log('[video] generating source still first (i2v mode)');
    const stillResult = await generateArt({
      brand, caption, platform, idea, mode: resolvedMode, subjectDetail,
    });
    imageUrl = stillResult.url;
    console.log(`[video] source still: ${imageUrl}`);
  }

  const prompt = buildVideoPrompt(template, subject, useImage2Video);
  const model = useImage2Video
    ? VIDEO_MODELS.i2v[resolvedMode] || VIDEO_MODELS.i2v.cozy
    : VIDEO_MODELS.t2v[resolvedMode] || VIDEO_MODELS.t2v.cozy;

  console.log(`[video] brand=${brand} mode=${resolvedMode} kind=${useImage2Video ? 'i2v' : 't2v'} model=${model}`);
  console.log(`[video] prompt: ${prompt.slice(0, 160)}...`);

  const input = {
    prompt,
    duration: String(duration),
    aspect_ratio: PLATFORM_ASPECT[platform] || '9:16',
  };
  if (useImage2Video) input.image_url = imageUrl;
  if (template.negative) input.negative_prompt = template.negative;

  try {
    const result = await fal.subscribe(model, { input, logs: false });
    const videoUrl = result.video?.url || result.url;
    if (!videoUrl) throw new Error('fal.ai returned no video URL');
    return {
      url: videoUrl,
      kind: useImage2Video ? 'i2v' : 't2v',
      source_image_url: imageUrl || null,
      template_id: template.id,
      mode: resolvedMode,
      prompt_used: prompt,
      model,
    };
  } catch (err) {
    console.error(`[video] generation failed: ${err.message}`);
    throw err;
  }
}

export function pickMediaKind(platform, opts = {}) {
  switch (platform) {
    case 'youtube':
    case 'tiktok':
      return 'video';
    case 'ig':
      return opts.reel ? 'video' : 'image';
    case 'x':
      return opts.video ? 'video' : 'image';
    default:
      return 'image';
  }
}

// CLI: node src/video.js <brand> "idea" [platform] [mode] [--i2v]
const isCli = import.meta.url === `file://${process.argv[1]}`;
if (isCli) {
  const argv = process.argv.slice(2);
  const flags = argv.filter((a) => a.startsWith('--'));
  const args = argv.filter((a) => !a.startsWith('--'));
  const [brand, idea, platform = 'youtube', mode] = args;
  const forceImage2Video = flags.includes('--i2v');
  if (!brand || !idea) {
    console.error('usage: node src/video.js <brand> "<idea>" [platform] [mode] [--i2v]');
    process.exit(1);
  }
  generateVideo({ brand, idea, caption: idea, platform, mode, forceImage2Video })
    .then((result) => {
      console.log('\n--- result ---');
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error('FAILED:', err.message);
      process.exit(1);
    });
}
