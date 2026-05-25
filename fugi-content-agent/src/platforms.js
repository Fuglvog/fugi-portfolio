export const PLATFORMS = {
  tiktok:  { maxChars: 2200, hashtagStyle: 'inline',   allowNewlines: true  },
  ig:      { maxChars: 2200, hashtagStyle: 'trailing', allowNewlines: true  },
  x:       { maxChars: 280,  hashtagStyle: 'inline',   allowNewlines: false },
  youtube: { maxChars: 5000, hashtagStyle: 'trailing', allowNewlines: true  },
};

export function getPlatform(name) {
  const key = String(name ?? '').toLowerCase();
  if (!PLATFORMS[key]) {
    throw new Error(`Unknown platform "${name}". Use: ${Object.keys(PLATFORMS).join(', ')}`);
  }
  return { name: key, ...PLATFORMS[key] };
}
