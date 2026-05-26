import 'dotenv/config';
import { draftCopy } from './copy.js';
import { formatCaption } from './formatter.js';
import { buildArtPrompt } from './art.js';
import { appendPost } from './csv.js';

export async function generatePost({ idea, platform, datetime = '' }) {
  const raw = await draftCopy({ idea, platform });
  const caption = formatCaption(raw, platform);

  let art_prompt = '';
  try {
    art_prompt = await buildArtPrompt({ idea, platform });
  } catch (err) {
    console.error(`art: ${err.message} — leaving art_prompt empty`);
  }

  const row = { datetime, platform, caption, art_prompt, media_path: '' };
  appendPost(row);
  return row;
}

// CLI: node src/orchestrator.js "idea text" [platform] [datetime]
const isCli = import.meta.url === `file://${process.argv[1]}`;
if (isCli) {
  const [idea, platform = 'tiktok', datetime = ''] = process.argv.slice(2);
  if (!idea) {
    console.error('usage: node src/orchestrator.js "idea text" [platform] [datetime]');
    process.exit(1);
  }
  generatePost({ idea, platform, datetime })
    .then((row) => {
      console.log(`\nCaption (${row.caption.length} chars):`);
      console.log(row.caption);
      console.log(`\nPlatform:   ${row.platform}`);
      console.log(`Datetime:   ${row.datetime || '(empty)'}`);
      console.log(`Art prompt: ${row.art_prompt || '(empty)'}`);
      console.log(`\nAppended to out/posts.csv`);
    })
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
}
