import { getPlatform } from './platforms.js';

function truncate(s, max) {
  if (s.length <= max) return s;
  const limit = max - 1;
  const lastSpace = s.lastIndexOf(' ', limit);
  const cut = lastSpace > limit * 0.7 ? lastSpace : limit;
  return s.slice(0, cut).trimEnd() + '…';
}

export function formatCaption(caption, platformName) {
  if (typeof caption !== 'string') {
    throw new Error('formatCaption: caption (string) required');
  }
  const plat = getPlatform(platformName);
  let out = caption.trim();
  if (!plat.allowNewlines) {
    out = out.replace(/\s+/g, ' ');
  }
  if (out.length > plat.maxChars) {
    console.error(
      `formatter: ${platformName} caption was ${out.length} chars, truncated to ${plat.maxChars}`,
    );
    out = truncate(out, plat.maxChars);
  }
  return out;
}

// CLI: node src/formatter.js "caption text" [platform]
const isCli = import.meta.url === `file://${process.argv[1]}`;
if (isCli) {
  const [caption, platform = 'tiktok'] = process.argv.slice(2);
  if (!caption) {
    console.error('usage: node src/formatter.js "caption text" [platform]');
    process.exit(1);
  }
  console.log(formatCaption(caption, platform));
}
