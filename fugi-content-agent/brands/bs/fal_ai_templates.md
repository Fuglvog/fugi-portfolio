# BebeWORLDWIDE — fal.ai prompt templates

Loaded by `src/art.js` (image gen) and `src/video.js` (video gen, via the
shared loader). The script picks a template based on `(mode, aspect)` —
random pick within the matching pool for variety. Each template is a
```yaml block with required keys: `id`, `mode`, `aspect`, `model`,
`prompt` (with `{SUBJECT}` slot). Optional: `negative`, `kind`, `motion`.

## How `mode` is chosen
`src/art.js#inferMode` scans the caption + idea for keywords:
- **cozy** — cozy, tucked, sleep, nap, warm, blanket, soft, sahur, bebe,
  bed, comfy, pillow, rest
- **cursed** — cartel, mexico, breaking, sock, fugglypizza, pizza, mafia,
  desert, meth, tralalero, tung
- **deep_fried** — short captions (< 20 chars) with no signal go here

You can override with an explicit `mode` arg.

## Aspect ratios per platform
- `9:16` — YouTube, TikTok
- `1:1` — IG, X

## Video templates
None yet. `src/video.js` falls back to using the image templates with
an auto-generated motion descriptor per mode. Add `kind: video` blocks
later if the defaults fall flat.

---

## COZY — image templates

```yaml
id: cozy_bedroom_portrait
mode: cozy
aspect: 9:16
model: fal-ai/flux/schnell
prompt: |
  warm dimly-lit bedroom at night, a small chubby cartoon character
  ("cozy bebe") tucked deep under a thick patchwork blanket in a tiny
  bed, soft fairy lights strung along the wall, a mug of cocoa on the
  nightstand, dust particles drifting in moonbeam, hand-drawn
  storybook illustration with soft edges, muted warm palette of
  amber, dusty rose, and deep brown, vertical 9:16 composition with
  the bed centered low in frame and ceiling above, tilt-shift
  miniature feel, content vibe. Scene specifics: {SUBJECT}
negative: harsh lighting, photorealistic, sharp edges, neon, glitch, gore, scary
```

```yaml
id: cozy_blanket_nest_square
mode: cozy
aspect: 1:1
model: fal-ai/flux/schnell
prompt: |
  square 1:1 flat-lay top-down view of a cozy nest of blankets and
  pillows, a small round cartoon character peeking up from the
  covers, soft natural daylight from an off-frame window, plush
  textures, hand-drawn storybook illustration style, warm palette
  of cream, soft pink, pale honey, slight grain. Subject in nest:
  {SUBJECT}
negative: photorealistic, harsh shadows, neon, gore, scary, sharp angular forms
```

---

## CURSED — image templates

```yaml
id: cursed_kitchen_portrait
mode: cursed
aspect: 9:16
model: fal-ai/flux/schnell
prompt: |
  vertical 9:16 still, slightly off-putting AI-generated cartoon, a
  small character standing in a fluorescent-lit suburban kitchen at
  3am, looking directly at camera with too-symmetrical eyes, mild
  uncanny valley energy, mundane setting with one thing visibly
  wrong (an extra finger, a wall outlet placed at floor height, a
  door that is slightly too small for the wall, etc), saturated
  but slightly off color grading, mall-photo-studio backdrop vibe.
  Subject: {SUBJECT}
negative: idyllic, beautiful, polished, professional photography, soft warm lighting
```

```yaml
id: cursed_portrait_square
mode: cursed
aspect: 1:1
model: fal-ai/flux/schnell
prompt: |
  square 1:1 weird AI portrait of a generic cartoon character facing
  camera dead-on, slightly wrong proportions (one eye larger, head
  too round, fingers if visible too many or too few), beige
  institutional background with a single overhead fluorescent strip
  light, faint motion blur on a static subject, jpeg compression
  visible around edges, low-effort shitpost energy, ironic AI-jank
  aesthetic. Subject: {SUBJECT}
negative: clean, crisp, artistic, professional, beautiful, sharp focus
```

---

## DEEP FRIED — image templates

```yaml
id: deep_fried_portrait
mode: deep_fried
aspect: 9:16
model: fal-ai/flux/schnell
prompt: |
  vertical 9:16 extreme deep-fried meme aesthetic, oversaturated red
  shadows and blown-out yellow highlights, JPEG compression artifacts
  everywhere, visible color banding and posterization, low-resolution
  cartoon subject centered and slightly too large for frame, layered
  lens flares, 2014 Reddit shitpost energy, deep fried meme filter
  applied six times. Subject: {SUBJECT}
negative: clean, HD, sharp, professional, balanced color, subtle
```

```yaml
id: deep_fried_square
mode: deep_fried
aspect: 1:1
model: fal-ai/flux/schnell
prompt: |
  square 1:1 deep fried meme, central subject blown out with bloom,
  oversaturated red and yellow, jpeg ringing on every edge,
  caption-meme proportions (subject takes ~70% of frame), ironic
  shitpost vibe, slight chromatic aberration. Subject: {SUBJECT}
negative: balanced, clean, professional, beautiful, HD, subtle
```
