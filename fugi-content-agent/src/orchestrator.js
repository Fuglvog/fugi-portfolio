import 'dotenv/config';
import { parseArgs } from 'node:util';
import { draftCopy } from './copy.js';
import { formatCaption } from './formatter.js';
import { generateArt } from './art.js';
import { generateVideo } from './video.js';
import { appendPost, csvPath } from './csv.js';

// TODO: switch the media-kind decision from manual (--media flag) to
// automatic via video.js#pickMediaKind so YouTube/TikTok default to
// video, IG to image (or video with --reel), X to image (or video with
// --video). Current manual form is intentional while we shake out
// fal.ai cost behavior — change the format here when it's time.

export async function generatePost({
  brand,
  idea,
  platform,
  datetime = '',
  media,            // 'image' | 'video' | undefined
  mode,             // 'cozy' | 'cursed' | 'deep_fried' | undefined
  forceImage2Video = false,
}) {
  if (!brand) throw new Error('generatePost: brand required (e.g. "fugi", "bs")');

  const raw = await draftCopy({ brand, idea, platform });
  const caption = formatCaption(raw, platform);

  const row = {
    datetime,
    platform,
    caption,
    media_prompt: '',
    media_path: '',
    media_kind: '',
    media_mode: '',
    media_template_id: '',
    media_model: '',
    source_image_url: '',
  };

  if (media === 'image') {
    try {
      const result = await generateArt({ brand, caption, platform, idea, mode });
      row.media_path = result.url;
      row.media_prompt = result.prompt_used;
      row.media_kind = 'image';
      row.media_mode = result.mode;
      row.media_template_id = result.template_id;
      row.media_model = result.model;
    } catch (err) {
      console.error(`art: ${err.message} — leaving media columns empty`);
    }
  } else if (media === 'video') {
    try {
      const result = await generateVideo({
        brand, caption, platform, idea, mode, forceImage2Video,
      });
      row.media_path = result.url;
      row.media_prompt = result.prompt_used;
      row.media_kind = result.kind;
      row.media_mode = result.mode;
      row.media_template_id = result.template_id;
      row.media_model = result.model;
      row.source_image_url = result.source_image_url ?? '';
    } catch (err) {
      console.error(`video: ${err.message} — leaving media columns empty`);
    }
  }

  appendPost(row, brand);
  return row;
}

// CLI: node src/orchestrator.js <brand> "idea text" [platform] [datetime] [--media image|video] [--mode cozy|cursed|deep_fried] [--i2v]
const isCli = import.meta.url === `file://${process.argv[1]}`;
if (isCli) {
  let parsed;
  try {
    parsed = parseArgs({
      options: {
        media: { type: 'string' },
        mode:  { type: 'string' },
        i2v:   { type: 'boolean', default: false },
      },
      allowPositionals: true,
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
  const { values, positionals } = parsed;
  const [brand, idea, platform = 'tiktok', datetime = ''] = positionals;
  if (!brand || !idea) {
    console.error('usage: node src/orchestrator.js <brand> "<idea>" [platform] [datetime] [--media image|video] [--mode cozy|cursed|deep_fried] [--i2v]');
    console.error('example: node src/orchestrator.js bs "cozy bebe in bed" youtube "" --media video --i2v');
    process.exit(1);
  }
  if (values.media && !['image', 'video'].includes(values.media)) {
    console.error(`--media must be "image" or "video" (got "${values.media}")`);
    process.exit(1);
  }

  generatePost({
    brand,
    idea,
    platform,
    datetime,
    media: values.media,
    mode: values.mode,
    forceImage2Video: values.i2v,
  })
    .then((row) => {
      console.log(`\nBrand:      ${brand}`);
      console.log(`Caption (${row.caption.length} chars):`);
      console.log(row.caption);
      console.log(`\nPlatform:   ${row.platform}`);
      console.log(`Datetime:   ${row.datetime || '(empty)'}`);
      console.log(`Media kind: ${row.media_kind || '(none — no --media flag)'}`);
      if (row.media_path) {
        console.log(`Media URL:  ${row.media_path}`);
        console.log(`Mode:       ${row.media_mode}`);
        console.log(`Template:   ${row.media_template_id}`);
        console.log(`Model:      ${row.media_model}`);
        if (row.source_image_url) console.log(`Source img: ${row.source_image_url}`);
      }
      console.log(`\nAppended to ${csvPath(brand)}`);
    })
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
}
