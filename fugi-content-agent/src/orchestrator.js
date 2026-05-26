import 'dotenv/config';
import { draftCopy } from './copy.js';
import { formatCaption } from './formatter.js';
import { buildArtPrompt } from './art.js';
import { appendPost, csvPath } from './csv.js';

export async function generatePost({ brand, idea, platform, datetime = '' }) {
  if (!brand) throw new Error('generatePost: brand required (e.g. "fugi", "bs")');
  const raw = await draftCopy({ brand, idea, platform });
  const caption = formatCaption(raw, platform);

  let art_prompt = '';
  try {
    art_prompt = await buildArtPrompt({ brand, idea, platform });
  } catch (err) {
    console.error(`art: ${err.message} — leaving art_prompt empty`);
  }

  const row = { datetime, platform, caption, art_prompt, media_path: '' };
  appendPost(row, brand);
  return row;
}

// CLI: node src/orchestrator.js <brand> "idea text" [platform] [datetime]
const isCli = import.meta.url === `file://${process.argv[1]}`;
if (isCli) {
  const [brand, idea, platform = 'tiktok', datetime = ''] = process.argv.slice(2);
  if (!brand || !idea) {
    console.error('usage: node src/orchestrator.js <brand> "idea text" [platform] [datetime]');
    console.error('example: node src/orchestrator.js bs "deadpan product teaser" ig');
    process.exit(1);
  }
  generatePost({ brand, idea, platform, datetime })
    .then((row) => {
      console.log(`\nBrand:      ${brand}`);
      console.log(`Caption (${row.caption.length} chars):`);
      console.log(row.caption);
      console.log(`\nPlatform:   ${row.platform}`);
      console.log(`Datetime:   ${row.datetime || '(empty)'}`);
      console.log(`Art prompt: ${row.art_prompt || '(empty)'}`);
      console.log(`\nAppended to ${csvPath(brand)}`);
    })
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
}
