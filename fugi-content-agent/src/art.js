// ART task: builds a fal.ai prompt string from the idea + brand visual files.
// Does NOT call fal.ai — operator generates the image separately and fills
// media_path in the CSV by hand.
//
// Stub. Fill brands/<brand>/visual_identity.md + brands/<brand>/fal_ai_templates.md,
// then implement. orchestrator.js catches the throw and leaves art_prompt empty
// in the CSV row, so the rest of the pipeline still works.
export async function buildArtPrompt(_args) {
  throw new Error(
    'art.js not yet implemented — fill brands/<brand>/visual_identity.md + brands/<brand>/fal_ai_templates.md, then implement',
  );
}
